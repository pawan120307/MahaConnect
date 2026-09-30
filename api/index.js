require('dotenv').config({ path: require('path').join(__dirname, '../server/.env') });
const mongoose = require('mongoose');
const app = require('../server/app');

let isConnected = false;

const connectDB = async () => {
  if (isConnected || mongoose.connection.readyState === 1) {
    return;
  }

  const mongoUri = process.env.MONGODB_URI;

  // On Vercel cloud serverless, do not attempt to connect to localhost loopback
  if (process.env.VERCEL && (!mongoUri || mongoUri.includes('127.0.0.1') || mongoUri.includes('localhost'))) {
    console.warn('[Vercel Serverless] Cloud MONGODB_URI not configured in Vercel Environment Variables. Set MONGODB_URI (e.g. MongoDB Atlas) in your Vercel Project Settings.');
    return;
  }

  try {
    const conn = await mongoose.connect(mongoUri || 'mongodb://127.0.0.1:27017/mahaconnect', {
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
