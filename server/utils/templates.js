const templates = {
  'Booking Confirmed':
    "Namaste {devoteeName} 🙏\n\nYour *{pujaName}* booking has been confirmed!\n📋 Booking ID: {bookingId}\n\nWe are honored to serve you on this sacred journey. Our team will keep you updated at every step.\n\nOm Namah Shivaya 🙏\n— Aaradhya Setu",

  'Puja Started':
    "🔔 Jai Shree Ram, {devoteeName}!\n\nYour *{pujaName}* ({bookingId}) has now begun.\n\n🪔 The sacred rituals are being performed with utmost devotion by our experienced pandits. Keep faith and stay blessed.\n\nHar Har Mahadev 🙏\n— Aaradhya Setu",

  'Puja Completed':
    "✨ Shubh Samachar, {devoteeName}!\n\nYour *{pujaName}* ({bookingId}) has been completed successfully.\n\n🎊 May the divine blessings of this puja bring peace, prosperity, and happiness to you and your family.\n\nPrasad details will be shared shortly.\n\nOm Shanti 🙏\n— Aaradhya Setu",

  'Video Available':
    "🎥 Namaste {devoteeName}!\n\nGreat news! The video recording of your *{pujaName}* ({bookingId}) is now ready to watch.\n\n▶️ You can view the complete puja video in your dashboard.\n\nRelive the divine experience anytime. We hope it brings you joy and spiritual fulfillment.\n\nSarvam Shubham 🙏\n— Aaradhya Setu",
};

// Replace {placeholder} tokens with actual booking data
function renderTemplate(template, data) {
  return template
    .replace(/{devoteeName}/g, data.devoteeName)
    .replace(/{pujaName}/g, data.pujaName)
    .replace(/{bookingId}/g, data.bookingId);
}

module.exports = { templates, renderTemplate };
