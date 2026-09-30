const mongoose = require('mongoose');

const dynamicFieldSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    label: { type: String, required: true },
    type: {
      type: String,
      enum: ['text', 'number', 'select', 'date', 'textarea'],
      default: 'text',
    },
    required: { type: Boolean, default: true },
    options: [{ type: String }],
    placeholder: { type: String, default: '' },
    helpText: { type: String, default: '' },
  },
  { _id: false }
);

const serviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide service name'],
      trim: true,
    },
    code: {
      type: String,
      required: [true, 'Please provide service code'],
      unique: true,
      uppercase: true,
      trim: true,
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
      required: [true, 'Service must belong to a department'],
    },
    description: {
      type: String,
      required: [true, 'Please provide service description'],
    },
    category: {
      type: String,
      default: 'General',
    },
    requiredDocuments: [
      {
        type: String,
      },
    ],
    processingTime: {
      type: String,
      default: '7 Working Days',
    },
    fee: {
      type: Number,
      default: 0,
    },
    dynamicFields: [dynamicFieldSchema],
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Service', serviceSchema);
