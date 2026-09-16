const { MongoClient } = require("mongodb");
require("dotenv").config();

const client = new MongoClient(process.env.MONGO_URI);

async function testConnection() {
    try {
        console.log("Connecting to MongoDB...");

        await client.connect();

        console.log("MongoDB connection SUCCESS!");

        const db = client.db("SnapCity");

        const collections = await db.listCollections().toArray();

        console.log("Collections:");

        collections.forEach(function (collection) {
            console.log("-", collection.name);
        });

    } catch (error) {
        console.error("MongoDB connection FAILED:");
        console.error(error);
    } finally {
        await client.close();
    }
}

testConnection();