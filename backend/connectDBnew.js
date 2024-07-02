const mongoose = require('mongoose')
const dotenv = require('dotenv')
const { createClient } = require('redis')
dotenv.config()
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URL, {
        });
        console.log(`MongoDB Connected: ${conn.connections[0].host} ${conn.connections[0].port} ${conn.connections[0].name}`);
    } catch (error) {
        console.log(`Error: ${error.message}`);
        process.exit();
    }
};
async function connectRedis() {
    try {
        const client = createClient();
        client.on("error", (err) => console.log("Redis Client Connection Error"));
        await client.connect();
        console.log("Redis cache app database connected...");
        return client;
    } catch (error) {
        console.log('Redis app connection Error...', error);
    }
}
module.exports = {connectDB,connectRedis}