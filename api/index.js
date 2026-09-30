require('dotenv').config({ path: require('path').join(__dirname, '../server/.env') });
const mongoose = require('mongoose');
const app = require('../server/app');

let isConnected = false;

const connectDB = async () => {
  if (isConnected || mongoose.connection.readyState === 1) {
    return;
  }

  const mongoUri =
    process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/mahaconnect';

  try {
    const conn = await mongoose.connect(mongoUri, {
      bufferCommands: false,
    });
    isConnected = true;
    console.log(`[Vercel Serverless] MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.error('[Vercel Serverless] MongoDB connection error:', err.message);
  }
};

module.exports = async (req, res) => {
  await connectDB();
  return app(req, res);
};
