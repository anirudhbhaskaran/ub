const express = require('ultimate-express');
const PocketBase = require('pocketbase/cjs');
const ivm = require('isolated-vm');

const app = express();
const pb = new PocketBase('http://127.0.0.1:8090'); // adjust as needed

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Define reusable utility functions or packages
const utils = {
  now: () => new Date().toISOString(),
  greet: (name) => `Hello, ${name}!`,
};

app.all('/*', async (req, res) => {
  try {
    const parts = req.path.split('/').filter(Boolean);
    if (parts.length < 2) {
      return res.status(404).json({ error: 'Invalid route format. Use /{service}/{route}' });
    }

    const service = parts[0];
    const route = parts.slice(1).join('/');
    const method = req.method.toUpperCase();

    // Fetch route definition from PocketBase
    const record = await pb.collection('routes').getFirstListItem(
      `service="${service}" && route="${route}" && method="${method} && isActive=true"`,
    );

    if (!record || !record.definition) {
      return res.status(404).json({ error: 'Route not found' });
    }

    const isolate = new ivm.Isolate({ memoryLimit: 16 });
    const context = await isolate.createContext();
    const jail = context.global;

    const dependencies = (record.dependencies || '')
    .split(/\r?\n/)
    .map(dep => dep.trim().replace(";", ""))
    .filter(Boolean);

    const dynamicModules = {};
    for (const dep of dependencies) {
        try {
            dynamicModules[dep] = require(dep);
        } catch (err) {
            console.warn(`Failed to load dependency: ${dep}`);
        }
    }

    const modulesToInject = {
        ...dynamicModules,
    };

    // Send response function
    let responseSent = false;
    let responseData = null;
    let responseStatus = 200;

    await jail.set('send', function (data) {
      responseSent = true;
      responseData = data;
    }, { reference: true });

    await jail.set('sendStatus', function (code, data) {
      responseSent = true;
      responseStatus = code;
      responseData = data;
    }, { reference: true });

    // Sanitize & copy request info
    const options = {
      req: {
        method: req.method,
        headers: req.headers,
        query: req.query,
        body: req.body,
        path: req.path,
      },
      service,
      route,
      method,
    };

    await jail.set('options', new ivm.ExternalCopy(options).copyInto());

    // Inject shared modules
    for (const [key, value] of Object.entries(modulesToInject)) {
        await jail.set(key, new ivm.ExternalCopy(value).copyInto());
    }

    const script = await isolate.compileScript(`
      (async function(options) {
        const req = options.req;
        const res = {
          json: send,
          send: send,
          status: (code) => ({ json: (data) => sendStatus(code, data) })
        };

        try {
            const handler = async ({ req, res, ...params }) => {
                ${record.definition}
            };
            await handler({ req, res, ...options, ...globalThis });
        } catch (err) {
        sendStatus(400, { error: "Execution error", details: err.message });
        }

      })(options)
    `);

    await script.run(context, { timeout: 1000 });

    if (!res.headersSent) {
      if (responseSent) {
        res.status(responseStatus).json(responseData);
      } else {
        res.status(200).json({ status: 'OK' });
      }
    }
  } catch (err) {
    console.error('Internal error:', err);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Internal server error', details: err.message });
    }
  }
});

app.listen(8000, () => {
  console.log(`Isolated orchestrator running at http://localhost:8000`);
});
