const amqp = require('amqplib');
const PocketBase = require('pocketbase/cjs');
const ivm = require('isolated-vm');

const pb = new PocketBase('http://127.0.0.1:8090');
const RABBITMQ_URL = 'amqp://localhost';
const QUEUE_NAME = 'rpc_requests';

(async () => {
  const connection = await amqp.connect(RABBITMQ_URL);
  const channel = await connection.createChannel();
  await channel.assertQueue(QUEUE_NAME, { durable: true });

  console.log('🔁 RPC Dealer is consuming...');

  channel.consume(QUEUE_NAME, async (msg) => {
    if (!msg) return;

    try {
      const { method, params } = JSON.parse(msg.content.toString());

      // 🧠 Fetch procedure by method
      const record = await pb.collection('procedures').getFirstListItem(`name="${method}" && isActive=true`);

      if (!record || !record.definition) {
        console.warn(`No definition found for method "${method}"`);
        channel.ack(msg);
        return;
      }

      // 📦 Load dynamic dependencies
      const dependencies = (record.dependencies || '')
        .split(/\r?\n/)
        .map(dep => dep.trim())
        .filter(Boolean);

      const dynamicModules = {};
      for (const dep of dependencies) {
        try {
          dynamicModules[dep] = require(dep);
        } catch (err) {
          console.warn(`Failed to load dependency "${dep}"`);
        }
      }

      const isolate = new ivm.Isolate({ memoryLimit: 16 });
      const context = await isolate.createContext();
      const jail = context.global;

      // Inject standard variables
      await jail.set('params', new ivm.ExternalCopy(params).copyInto());

      // Inject dependencies
      for (const [key, value] of Object.entries(dynamicModules)) {
        await jail.set(key, new ivm.ExternalCopy(value).copyInto());
      }

      const script = await isolate.compileScript(`
        (async function(params) {
          try {
            const handler = async (params) => {
              ${record.definition}
            };
            await handler(params);
          } catch (err) {
            console.error('Sandbox error:', err);
          }
        })(params)
      `);

      await script.run(context, { timeout: 1000 });

    } catch (err) {
      console.error('Error in dealer:', err.message);
    } finally {
      channel.ack(msg);
    }
  });
})();
