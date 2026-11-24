require('dotenv').config();

const mongoose = require('mongoose');
const Booking = require('./models/Booking');
const Notification = require('./models/Notification');
const { sendNotification } = require('./services/notificationService');

const STATUS_FLOW = [
  'Booking Confirmed',
  'Puja Started',
  'Puja Completed',
  'Video Available',
];

// Helper to calculate future date
function futureDate(daysFromNow) {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  return d;
}

const seedBookings = [
  { bookingId: 'AS-1001', devoteeName: 'Aarav Sharma', phone: '+91 98765 43210', pujaName: 'Rudrabhishek', temple: 'Kashi Vishwanath, Varanasi', pujaDate: futureDate(4), amount: 5100, status: 'Puja Completed' },
  { bookingId: 'AS-1002', devoteeName: 'Priya Patel', phone: '+91 87654 32109', pujaName: 'Maha Mrityunjaya Jaap', temple: 'Mahakaleshwar, Ujjain', pujaDate: futureDate(8), amount: 7500, status: 'Booking Confirmed' },
  { bookingId: 'AS-1003', devoteeName: 'Rohan Mehta', phone: '+91 76543 21098', pujaName: 'Satyanarayan Katha', temple: 'Siddhivinayak, Mumbai', pujaDate: futureDate(12), amount: 3100, status: 'Video Available' },
  { bookingId: 'AS-1004', devoteeName: 'Ananya Iyer', phone: '+91 65432 10987', pujaName: 'Ganesh Abhishek', temple: 'Tirupati Balaji, Tirumala', pujaDate: futureDate(16), amount: 2100, status: 'Puja Started' },
  { bookingId: 'AS-1005', devoteeName: 'Vikram Singh', phone: '+91 54321 09876', pujaName: 'Navgraha Shanti Puja', temple: 'Trimbakeshwar, Nashik', pujaDate: futureDate(21), amount: 11000, status: 'Booking Confirmed' },
  { bookingId: 'AS-1006', devoteeName: 'Deepika Joshi', phone: '+91 43210 98765', pujaName: 'Kaal Sarp Dosh Nivaran', temple: 'Somnath, Gujarat', pujaDate: futureDate(28), amount: 9100, status: 'Puja Started' },
  { bookingId: 'AS-1007', devoteeName: 'Arjun Reddy', phone: '+91 32109 87654', pujaName: 'Lakshmi Puja', temple: 'Jagannath, Puri', pujaDate: futureDate(35), amount: 1100, status: 'Puja Completed' },
  { bookingId: 'AS-1008', devoteeName: 'Kavya Nair', phone: '+91 21098 76543', pujaName: 'Sunderkand Path', temple: 'Kedarnath, Uttarakhand', pujaDate: futureDate(42), amount: 4100, status: 'Puja Started' },
  { bookingId: 'AS-1009', devoteeName: 'Suresh Gupta', phone: '+91 10987 65432', pujaName: 'Hanuman Chalisa Path', temple: 'Meenakshi, Madurai', pujaDate: futureDate(49), amount: 2500, status: 'Video Available' },
  { bookingId: 'AS-1010', devoteeName: 'Meera Deshmukh', phone: '+91 98712 34567', pujaName: 'Baglamukhi Puja', temple: 'Dwarkadhish, Dwarka', pujaDate: futureDate(56), amount: 6100, status: 'Booking Confirmed' },
];

async function seedData() {
  // Clear existing records
  await Booking.deleteMany({});
  await Notification.deleteMany({});
  console.log('🗑️  Cleared existing bookings and notifications');

  const now = Date.now();

  for (let bIndex = 0; bIndex < seedBookings.length; bIndex++) {
    const data = seedBookings[bIndex];
    const booking = new Booking(data);
    await booking.save();

    // Generate notifications sequentially up to current status with realistic staggered timestamps
    const targetIndex = STATUS_FLOW.indexOf(data.status);
    for (let step = 0; step <= targetIndex; step++) {
      // Stagger timestamps: earlier steps happened hours/days ago
      const hoursAgo = (targetIndex - step) * 3 + (10 - bIndex);
      const staggeredTime = new Date(now - hoursAgo * 3600 * 1000);

      await sendNotification(booking, STATUS_FLOW[step], { sentAt: staggeredTime });
    }
  }

  console.log('🌱 Successfully seeded 10 bookings with WhatsApp notification history');
}

async function runSeedCli() {
  try {
    const connectDB = require('./config/db');
    await connectDB();
    await seedData();
    console.log('✅ Seed completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
}

// Run CLI if executed directly
if (require.main === module) {
  runSeedCli();
}

module.exports = { seedData, seedBookings, STATUS_FLOW };
