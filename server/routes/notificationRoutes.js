const express = require('express');
const router = express.Router();
const { getAllNotifications, resendNotification } = require('../controllers/notificationController');

router.get('/', getAllNotifications);
router.post('/:id/resend', resendNotification);

module.exports = router;
