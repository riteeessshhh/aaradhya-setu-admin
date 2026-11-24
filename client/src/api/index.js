/**
 * API Client Service
 * Centralizes all HTTP communication between the React frontend and the Express backend.
 * Uses Vite proxy (/api) in development, or VITE_API_URL if configured.
 */

const API = import.meta.env.VITE_API_URL || '/api';

/**
 * Generic fetch wrapper with JSON serialization & uniform error handling
 */
async function request(url, options = {}) {
  const res = await fetch(`${API}${url}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });

  const data = await res.json().catch(() => ({
    success: false,
    message: 'Network error or invalid server response',
  }));

  if (!data.success) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data.data;
}

/**
 * Fetch all bookings with optional search & status filter
 * @param {string} search - Devotee name, phone, puja, or booking ID
 * @param {string} status - Exact status filter (e.g. 'Puja Started')
 */
export const getBookings = (search, status) => {
  const params = new URLSearchParams();
  if (search) params.set('search', search);
  if (status) params.set('status', status);
  const qs = params.toString();
  return request(`/bookings${qs ? '?' + qs : ''}`);
};

/**
 * Create a new puja booking (auto-triggers initial "Booking Confirmed" notification)
 */
export const createBooking = (body) =>
  request('/bookings', { method: 'POST', body: JSON.stringify(body) });

/**
 * Fetch a single booking by its unique bookingId (e.g. 'AS-1001')
 */
export const getBooking = (bookingId) => request(`/bookings/${bookingId}`);

/**
 * Advance a booking to its next sequential status in the workflow
 */
export const advanceBooking = (bookingId) =>
  request(`/bookings/${bookingId}/advance`, { method: 'PATCH' });

/**
 * Fetch all notifications in the system (newest first)
 */
export const getNotifications = () => request('/notifications');

/**
 * Fetch all notifications for a specific booking (chronological order for chat preview)
 */
export const getBookingNotifications = (bookingId) =>
  request(`/bookings/${bookingId}/notifications`);

/**
 * Re-send an existing notification (P2 mock WhatsApp dispatch)
 */
export const resendNotification = (id) =>
  request(`/notifications/${id}/resend`, { method: 'POST' });
