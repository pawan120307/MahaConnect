const mongoose = require('mongoose');

const timelineEntrySchema = new mongoose.Schema(
  {
    status: {
      type: String,
      required: true,
    },
    action: {
      type: String,
      required: true,
    },
    department: {
      type: String,
      default: 'MahaConnect Gateway',
    },
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    performedByName: {
      type: String,
      default: 'System',
    },
    remarks: {
      type: String,
      default: '',
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: true }
);

const documentSchema = new mongoose.Schema(
  {
    documentType: {
      type: String,
      required: true,
    },
    originalName: {
      type: String,
      required: true,
    },
    fileUrl: {
      type: String,
      required: true,
    },
    fileKey: {
      type: String,
      default: '',
    },
    fileSize: {
      type: Number,
      default: 0,
    },
    mimeType: {
      type: String,
      default: 'application/pdf',
    },
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: true }
);

const applicationSchema = new mongoose.Schema(
  {
    applicationId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
      required: true,
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
      required: true,
    },
    formData: {
      personalInfo: {
        fullName: { type: String, default: '' },
        dob: { type: String, default: '' },
        gender: { type: String, default: '' },
        mobile: { type: String, default: '' },
        email: { type: String, default: '' },
        address: { type: String, default: '' },
        city: { type: String, default: '' },
        state: { type: String, default: 'Maharashtra' },
        pincode: { type: String, default: '' },
      },
      serviceDetails: {
        type: mongoose.Schema.Types.Mixed,
        default: {},
      },
    },
    documents: [documentSchema],
    status: {
      type: String,
      enum: [
        'Draft',
        'Submitted',
        'Under Review',
        'Additional Information Required',
        'Approved',
        'Rejected',
        'Completed',
      ],
      default: 'Submitted',
      index: true,
    },
    remarks: {
      type: String,
      default: '',
    },
    timeline: [timelineEntrySchema],
    interopReferenceId: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Application', applicationSchema);
