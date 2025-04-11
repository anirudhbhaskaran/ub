const express = require('express');
const amqp = require('amqplib');
const app = express();

app.use(express.json());

const RABBITMQ_URL = 'amqp://localhost';
const QUEUE_NAME = 'rpc_requests';

let channel;

(async () => {
  const connection = await amqp.connect(RABBITMQ_URL);
  channel = await connection.createChannel();
  await channel.assertQueue(QUEUE_NAME, { durable: true });
})();

app.post('/stream/:method', async (req, res) => {
  const method = req.params.method;
  const params = req.body;

  const message = {
    jsonrpc: '2.0',
    method,
    params,
  };

  try {
    await channel.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify(message)), { persistent: true });
    res.status(202).json({ status: 'queued' });
  } catch (err) {
    console.error('Failed to enqueue message:', err);
    res.status(500).json({ error: 'Failed to queue message' });
  }
});

app.listen(4000, () => {
  console.log('📨 RPC stream router listening on http://localhost:4000');
});
