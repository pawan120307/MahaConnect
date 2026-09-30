const mongoose = require('mongoose');

const apiLogSchema = new mongoose.Schema(
  {
    source: {
      type: String,
      required: true,
      default: 'MahaConnect Gateway',
    },
    destination: {
      type: String,
      required: true,
    },
    endpoint: {
      type: String,
      required: true,
    },
    method: {
      type: String,
      required: true,
      enum: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    },
    statusCode: {
      type: Number,
      required: true,
    },
    responseTime: {
      type: Number, // in ms
      required: true,
    },
    status: {
      type: String,
      enum: ['SUCCESS', 'FAILED', 'WARNING'],
      default: 'SUCCESS',
    },
    requestPayload: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    responsePayload: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    applicationId: {
      type: String,
      default: null,
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('ApiLog', apiLogSchema);
