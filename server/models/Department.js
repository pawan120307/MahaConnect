const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide department name'],
      unique: true,
      trim: true,
    },
    code: {
      type: String,
      required: [true, 'Please provide department code'],
      unique: true,
      uppercase: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    icon: {
      type: String,
      default: 'Building2',
    },
    apiEndpoint: {
      type: String,
      default: 'https://api.maharashtra.gov.in/dept',
    },
    contactEmail: {
      type: String,
      default: 'support@mahadepartment.gov.in',
    },
    contactPhone: {
      type: String,
      default: '1800-120-8040',
    },
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

module.exports = mongoose.model('Department', departmentSchema);
