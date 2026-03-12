const mongoose = require('mongoose');

const connectDB = async () => {
    const maxRetries = 3;
    let retryCount = 0;

    const attemptConnection = async () => {
        try {
            console.log(`Attempting MongoDB connection (attempt ${retryCount + 1}/${maxRetries})...`);
            console.log(`Connecting to: ${process.env.MONGO_URI}`);
            
            const conn = await mongoose.connect(process.env.MONGO_URI, {
                serverSelectionTimeoutMS: 5000,
                socketTimeoutMS: 45000,
            });

            console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
            console.log(`Database: ${conn.connection.name}`);
            return true;
        } catch (error) {
            retryCount++;
            console.error(`❌ MongoDB Connection Error: ${error.message}`);
            
            if (retryCount < maxRetries) {
                console.log(`Retrying in 3 seconds...`);
                await new Promise(resolve => setTimeout(resolve, 3000));
                return attemptConnection();
            } else {
                console.error(`⚠️ Failed to connect to MongoDB after ${maxRetries} attempts`);
                console.error('Please check:');
                console.error('1. MongoDB cluster is running and accessible');
                console.error('2. MONGO_URI in .env is correct');
                console.error('3. IP address is whitelisted in MongoDB Atlas');
                console.error('4. Internet connection is available');
                // Don't exit - allow server to run with static data fallback
                return false;
            }
        }
    };

    await attemptConnection();
};

module.exports = connectDB;