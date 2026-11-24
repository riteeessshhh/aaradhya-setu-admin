const mongoose = require('mongoose');

/**
 * Devotee Puja Booking Schema
 * Core entity representing a devotee's puja booking in the Aaradhya Setu system.
 * Fields:
 * - bookingId: Unique human-readable identifier (e.g. AS-1001, AS-1002)
 * - devoteeName: Full name of devotee
 * - phone: WhatsApp phone number (+91 format)
 * - pujaName: Specific puja ritual selected
 * - temple: Sacred temple location
 * - pujaDate: Scheduled date of the ritual
 * - amount: Dakshina in Indian Rupees
 * - status: Enum strictly constrained to 4 lifecycle stages
 */
const bookingSchema = new mongoose.Schema({
  bookingId: {
    type: String,
    unique: true,
    index: true,
  },
  devoteeName: {
    type: String,
    required: true,
    trim: true,
  },
  phone: {
    type: String,
    required: true,
    trim: true,
  },
  pujaName: {
    type: String,
    required: true,
    trim: true,
  },
  temple: {
    type: String,
    required: true,
    trim: true,
  },
  pujaDate: {
    type: Date,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  status: {
    type: String,
    enum: ['Booking Confirmed', 'Puja Started', 'Puja Completed', 'Video Available'],
    default: 'Booking Confirmed',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

/**
 * Pre-save Mongoose hook to auto-generate sequential booking IDs (AS-1001, AS-1002...)
 * If bookingId is not provided, finds the highest existing bookingId and increments by 1.
 */
bookingSchema.pre('save', async function (next) {
  if (this.bookingId) return next();

  try {
    const lastBooking = await mongoose.model('Booking')
      .findOne({})
      .sort({ bookingId: -1 })
      .limit(1);

    let nextNumber = 1001;
    if (lastBooking && lastBooking.bookingId) {
      const lastNumber = parseInt(lastBooking.bookingId.split('-')[1], 10);
      if (!isNaN(lastNumber)) {
        nextNumber = lastNumber + 1;
      }
    }

    this.bookingId = `AS-${String(nextNumber).padStart(4, '0')}`;
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model('Booking', bookingSchema);
