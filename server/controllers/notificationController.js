const Notification = require('../models/Notification');

// GET /api/notifications — list all notifications, newest first
async function getAllNotifications(req, res, next) {
  try {
    const notifications = await Notification.find().sort({ sentAt: -1 });
    res.json({
      success: true,
      message: 'All notifications retrieved',
      data: notifications,
    });
  } catch (error) {
    next(error);
  }
}

// GET /api/bookings/:bookingId/notifications — notifications for a specific booking (chronological order for chat UI)
async function getNotificationsByBooking(req, res, next) {
  try {
    const { bookingId } = req.params;
    // Sort oldest first so messages display chronologically top-to-bottom like real WhatsApp chats
    const notifications = await Notification.find({ bookingId }).sort({ sentAt: 1 });
    res.json({
      success: true,
      message: `Notifications for booking ${bookingId} retrieved`,
      data: notifications,
    });
  } catch (error) {
    next(error);
  }
}

// POST /api/notifications/:id/resend — resend an existing notification (P2)
async function resendNotification(req, res, next) {
  try {
    const original = await Notification.findById(req.params.id);
    if (!original) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found',
        data: null,
      });
    }

    const resent = await Notification.create({
      bookingId: original.bookingId,
      devoteeName: original.devoteeName,
      pujaName: original.pujaName,
      status: original.status,
      channel: original.channel,
      message: original.message,
      sentAt: new Date(),
      deliveryStatus: 'sent',
    });

    console.log(`📱 [WhatsApp Mock — Resend] Booking: ${original.bookingId} | Status: ${original.status}`);
    console.log(original.message);
    console.log('--------------------------------------------------');

    res.json({
      success: true,
      message: `WhatsApp notification for '${original.status}' resent successfully`,
      data: resent,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAllNotifications,
  getNotificationsByBooking,
  resendNotification,
};
