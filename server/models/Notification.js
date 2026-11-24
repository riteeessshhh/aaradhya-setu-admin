const mongoose = require('mongoose');

/**
 * Devotee Notification Audit Schema
 * Stores immutable history of all automated messages dispatched to devotees.
 * Designed as an independent collection for:
 * 1. Fast querying of full communication history per booking
 * 2. Complete audit trail that persists regardless of booking edits
 * 3. Easy scaling to multi-channel delivery (WhatsApp, SMS, Email)
 */
const notificationSchema = new mongoose.Schema({
  bookingId: {
    type: String,
    required: true,
    index: true,
  },
  devoteeName: {
    type: String,
    required: true,
  },
  pujaName: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  channel: {
    type: String,
    default: 'whatsapp-mock',
  },
  message: {
    type: String,
    required: true,
  },
  sentAt: {
    type: Date,
    default: Date.now,
  },
  deliveryStatus: {
    type: String,
    default: 'sent',
  },
});

module.exports = mongoose.model('Notification', notificationSchema);
