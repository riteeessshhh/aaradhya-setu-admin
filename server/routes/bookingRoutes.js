const express = require('express');
const router = express.Router();
const {
  getBookings,
  createBooking,
  getBookingById,
  advanceBooking,
} = require('../controllers/bookingController');
const { getNotificationsByBooking } = require('../controllers/notificationController');

router.get('/', getBookings);
router.post('/', createBooking);
router.get('/:bookingId', getBookingById);
router.patch('/:bookingId/advance', advanceBooking);
router.get('/:bookingId/notifications', getNotificationsByBooking);

module.exports = router;
