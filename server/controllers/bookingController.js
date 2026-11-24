const Booking = require('../models/Booking');
const { sendNotification } = require('../services/notificationService');

/**
 * STRICT SEQUENTIAL PUJA WORKFLOW STATE MACHINE
 * A booking must progress in this exact order:
 * 1. Booking Confirmed
 * 2. Puja Started
 * 3. Puja Completed
 * 4. Video Available (Final terminal state)
 *
 * No skipping stages, and no moving backward.
 */
const STATUS_FLOW = [
  'Booking Confirmed',
  'Puja Started',
  'Puja Completed',
  'Video Available',
];

/**
 * GET /api/bookings
 * Retrieves all bookings with optional search and status filter.
 * - ?search= checks devoteeName, bookingId, pujaName, temple, and phone (case-insensitive regex)
 * - ?status= exact match filter
 * - Results sorted descending by creation date (newest first)
 */
async function getBookings(req, res, next) {
  try {
    const { search, status } = req.query;
    const filter = {};

    if (search && search.trim()) {
      const term = search.trim();
      const regex = new RegExp(term, 'i');
      filter.$or = [
        { devoteeName: { $regex: regex } },
        { bookingId: { $regex: regex } },
        { pujaName: { $regex: regex } },
        { temple: { $regex: regex } },
        { phone: { $regex: regex } },
      ];
    }

    if (status && status.trim()) {
      filter.status = status.trim();
    }

    const bookings = await Booking.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, message: 'Bookings retrieved successfully', data: bookings });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/bookings
 * Creates a new devotee puja booking.
 * 1. Validates required input fields
 * 2. Saves booking to MongoDB (bookingId auto-increments via pre-save hook)
 * 3. Auto-triggers initial "Booking Confirmed" WhatsApp notification
 * 4. Returns 201 Created with the booking record
 */
async function createBooking(req, res, next) {
  try {
    const { devoteeName, phone, pujaName, temple, pujaDate, amount } = req.body;

    // Validate required fields
    const missing = [];
    if (!devoteeName) missing.push('devoteeName');
    if (!phone) missing.push('phone');
    if (!pujaName) missing.push('pujaName');
    if (!temple) missing.push('temple');
    if (!pujaDate) missing.push('pujaDate');
    if (amount === undefined || amount === null || isNaN(Number(amount))) missing.push('amount');

    if (missing.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing or invalid required fields: ${missing.join(', ')}`,
        data: null,
      });
    }

    const booking = new Booking({
      devoteeName: devoteeName.trim(),
      phone: phone.trim(),
      pujaName: pujaName.trim(),
      temple: temple.trim(),
      pujaDate: new Date(pujaDate),
      amount: Number(amount),
      status: 'Booking Confirmed',
    });

    await booking.save();

    // Auto-generate initial "Booking Confirmed" notification
    await sendNotification(booking, 'Booking Confirmed');

    res.status(201).json({
      success: true,
      message: 'Booking created successfully with Booking Confirmed notification',
      data: booking,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/bookings/:bookingId
 * Retrieves a single booking record by bookingId (e.g. 'AS-1001')
 */
async function getBookingById(req, res, next) {
  try {
    const { bookingId } = req.params;
    const booking = await Booking.findOne({ bookingId });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: `Booking '${bookingId}' not found`,
        data: null,
      });
    }

    res.json({ success: true, message: 'Booking found', data: booking });
  } catch (error) {
    next(error);
  }
}

/**
 * PATCH /api/bookings/:bookingId/advance
 * Advances a booking to the next sequential stage in the workflow.
 * Business Rules:
 * 1. Checks if booking exists (404)
 * 2. Finds current index in STATUS_FLOW
 * 3. Rejects if already at final status 'Video Available' (400)
 * 4. Rejects if client supplied a target status that skips stages or goes back (400)
 * 5. Updates status to nextStatus, saves to MongoDB
 * 6. Dispatches templated WhatsApp notification and returns updated booking + notification
 */
async function advanceBooking(req, res, next) {
  try {
    const { bookingId } = req.params;
    const booking = await Booking.findOne({ bookingId });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: `Booking '${bookingId}' not found`,
        data: null,
      });
    }

    const currentIndex = STATUS_FLOW.indexOf(booking.status);

    if (currentIndex === -1) {
      return res.status(400).json({
        success: false,
        message: `Invalid current booking status '${booking.status}'.`,
        data: null,
      });
    }

    // Guard: Prevent advancing past terminal status
    if (currentIndex === STATUS_FLOW.length - 1) {
      return res.status(400).json({
        success: false,
        message: `Booking is already at the final status '${booking.status}'. No further transitions allowed.`,
        data: null,
      });
    }

    const nextStatus = STATUS_FLOW[currentIndex + 1];

    // Guard: Enforce sequential integrity (no skipping stages)
    if (req.body && req.body.status && req.body.status !== nextStatus) {
      return res.status(400).json({
        success: false,
        message: `Invalid transition from '${booking.status}' to '${req.body.status}'. Workflow transitions are strictly sequential: ${STATUS_FLOW.join(' → ')}`,
        data: null,
      });
    }

    // Persist new status
    booking.status = nextStatus;
    await booking.save();

    // Auto-generate notification for the newly reached status
    const notification = await sendNotification(booking, nextStatus);

    res.json({
      success: true,
      message: `Status successfully advanced to '${nextStatus}'`,
      data: { booking, notification },
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  STATUS_FLOW,
  getBookings,
  createBooking,
  getBookingById,
  advanceBooking,
};
