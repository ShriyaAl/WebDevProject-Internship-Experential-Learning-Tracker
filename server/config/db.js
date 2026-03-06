require('dotenv').config();

const connectDB = async () => {
    try {
        // Example: mongoose.connect(process.env.MONGO_URI, { ... })
        console.log('Database connection logic goes here...');
    } catch (error) {
        console.error('Database connection failed:', error.message);
        process.exit(1);
    }
};

module.exports = connectDB;
