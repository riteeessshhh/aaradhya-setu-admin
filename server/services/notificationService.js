const Notification = require('../models/Notification');
const { templates, renderTemplate } = require('../utils/templates');

// TODO: Swap this mock with the WhatsApp Business API later.
async function sendNotification(booking, status, customOptions = {}) {
  const template = templates[status];
  if (!template) {
    throw new Error(`No notification template found for status: '${status}'`);
  }

  const message = renderTemplate(template, {
    devoteeName: booking.devoteeName,
    pujaName: booking.pujaName,
    bookingId: booking.bookingId,
  });

  const notification = await Notification.create({
    bookingId: booking.bookingId,
    devoteeName: booking.devoteeName,
    pujaName: booking.pujaName,
    status,
    channel: 'whatsapp-mock',
    message,
    sentAt: customOptions.sentAt || new Date(),
    deliveryStatus: 'sent',
  });

  console.log(`📱 [WhatsApp Mock] To: ${booking.phone} | Booking: ${booking.bookingId} | Status: ${status}`);
  console.log(message);
  console.log('--------------------------------------------------');

  return notification;
}

module.exports = { sendNotification };
