require('dotenv').config({ path: require('path').join(__dirname, '../server/.env') });
const mongoose = require('mongoose');

// Never buffer commands if disconnected; fails fast and falls back to in-memory store
mongoose.set('bufferCommands', false);

const app = require('../server/app');

let isConnected = false;

const connectDB = async () => {
  if (isConnected || mongoose.connection.readyState === 1) {
    return;
  }

  const mongoUri = process.env.MONGODB_URI;

  // On Vercel cloud serverless, do not attempt to connect to localhost loopback
  if (!mongoUri || mongoUri.includes('127.0.0.1') || mongoUri.includes('localhost')) {
    // Cloud MONGODB_URI not configured; will seamlessly use demoFallback in-memory store
    return;
  }

  try {
    const conn = await mongoose.connect(mongoUri, {
      bufferCommands: false,
      serverSelectionTimeoutMS: 3000,
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
