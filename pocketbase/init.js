const axios = require("axios");

const baseURL = "http://127.0.0.1:8090/api";

async function waitForServer() {
    const axios = require("axios");
  
    console.log("⏳ Waiting for PocketBase to be ready...");
  
    for (let i = 0; i < 20; i++) {
        try {
                const res = await axios.get(`${baseURL}/health`);
                if (res.status === 200) {
                    console.log("✅ PocketBase is ready");
                    return true;
                }
        } catch (err) {
                // Optionally print status for debugging
                console.log(`${err}: ⌛ PocketBase not ready yet (${i + 1}/20)`);
        }
  
      await new Promise((res) => setTimeout(res, 1500));
    }
  
    throw new Error("PocketBase server did not start in time");
}

async function createCollection(name, schema) {
    try {
        const token = await loginAsAdmin();
        await axios.post(`${baseURL}/collections`, {
            name: name,
            schema: schema,
            type: "base",
            listRule: "",
            viewRule: "",
            createRule: "",
            updateRule: "",
            deleteRule: "",
            indexes: []
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        console.log(`✅ Collection ${name} created`);
    } catch (err) {
        if (err.response?.data?.data?.name?.code === "validation_collection_name_exists") {
            console.log(`⚠️ Collection "${name}" already exists`);
        } else {
            console.error(`❌ Failed to create ${name}:`, err);
        }
    }
}

async function loginAsAdmin() {
    const res = await axios.post(`${baseURL}/admins/auth-with-password`, {
        identity: "test@example.com",
        password: "1234567890"
    });
    return res.data.token;
}

(async () => {
    try {
        await waitForServer();
        // await createAdmin();

        await createCollection("procedures", [
            { name: "name", type: "text", required: true, options: {} },
            { name: "dependencies", type: "editor", options: {} },
            { name: "definition", type: "editor", options: {} },
            { name: "isActive", type: "bool", options: {} }
        ]);

        await createCollection("routes", [
            { name: "service", type: "text", required: true, options: {} },
            { name: "name", type: "text", required: true, options: {} },
            { name: "route", type: "text", required: true, options: {} },
            { name: "method", type: "text", required: true, options: {} },
            { name: "definition", type: "editor", options: {} },
            { name: "dependencies", type: "editor", options: {} },
            { name: "isActive", type: "bool", options: {} }
        ]);

        await createCollection("services", [
            { name: "name", type: "text", required: true, options: {} },
            { name: "prefix", type: "text", required: true, options: {} },
            { name: "port", type: "text", required: true, options: {} },
            { name: "isActive", type: "bool", options: {} }
        ]);
    } catch (e) {
        console.error("Init failed:", e.message);
        process.exit(1);
    }
})();
