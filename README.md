# 🪔 Aaradhya Setu Admin — Booking Workflow & Notifications

A full-stack prototype demonstrating a puja booking management workflow with automated WhatsApp-style notifications.

## Overview

Aaradhya Setu Admin manages puja bookings through a **4-step workflow**:

```
Booking Confirmed → Puja Started → Puja Completed → Video Available
```

Every status change auto-generates a WhatsApp-style notification using customizable templates with the devotee's name, puja name, and booking ID. All notifications are saved in MongoDB and displayed as chat-style history.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS |
| Backend | Node.js, Express |
| Database | MongoDB with Mongoose |

## Folder Structure

```
aaradhya-setu-admin/
├── client/                  # React frontend
│   ├── src/
│   │   ├── api/            # API client functions
│   │   ├── components/     # Modular UI components
│   │   │   ├── Header.jsx          # Official logo & brand navigation
│   │   │   ├── HeroSection.jsx     # Sunlit sunrise hero & marquee banner
│   │   │   ├── StatCards.jsx       # 1-click status filtering metrics
│   │   │   ├── HowItWorks.jsx      # 3-step devotion guide
│   │   │   ├── BookingTable.jsx    # Responsive table & mobile card view
│   │   │   ├── StatusBadge.jsx     # Uniform status badge indicator
│   │   │   ├── BookingDrawer.jsx   # Real-time WhatsApp preview & milestone dates
│   │   │   ├── NewBookingModal.jsx # Booking creation dialog
│   │   │   ├── ToastContainer.jsx  # Floating alerts
│   │   │   └── Footer.jsx          # 4-column production footer
│   │   ├── App.jsx         # Root orchestrator
│   │   ├── main.jsx        # Entry point
│   │   └── index.css       # Tailwind + subtle scrollbar styles
│   ├── index.html
│   ├── vite.config.js
│   └── tailwind.config.js
├── server/                  # Express backend
│   ├── config/
│   │   └── db.js           # MongoDB connection
│   ├── controllers/
│   │   ├── bookingController.js
│   │   └── notificationController.js
│   ├── middleware/
│   │   └── errorHandler.js
│   ├── models/
│   │   ├── Booking.js
│   │   └── Notification.js
│   ├── routes/
│   │   ├── bookingRoutes.js
│   │   └── notificationRoutes.js
│   ├── services/
│   │   └── notificationService.js
│   ├── utils/
│   │   └── templates.js
│   ├── server.js           # Express entry point
│   └── seed.js             # Database seed script
├── README.md
└── .gitignore
```

## Setup & Run

### Prerequisites
- Node.js 18+
- MongoDB running locally (or a MongoDB Atlas URI)

### Quick Start

```bash
# 1. Install & start the server
cd server
npm install
npm run start                # Starts on http://localhost:5000 (Connected to MongoDB Atlas)

# 2. Install & start the client (new terminal)
cd client
npm install
npm run dev                  # Starts on http://localhost:3000
```

> **Dual Database Mode**: The server connects directly to the live MongoDB Atlas cluster. If network access is restricted or running offline, it automatically boots an embedded in-memory MongoDB engine, guaranteeing zero downtime.

### Environment Variables

**Server (`server/.env`)**

| Variable | Default | Description |
|----------|---------|-------------|
| `MONGO_URI` | `mongodb://localhost:27017/aaradhya_setu` | MongoDB connection string |
| `PORT` | `5000` | Server port |

**Client (`client/.env`)**

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_URL` | `/api` (proxied to server) | Backend API base URL |

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/bookings` | List all bookings (`?search=` and `?status=` supported) |
| `POST` | `/api/bookings` | Create a new booking (auto-triggers "Booking Confirmed" notification) |
| `GET` | `/api/bookings/:bookingId` | Get a single booking by ID |
| `PATCH` | `/api/bookings/:bookingId/advance` | Advance booking to the next status |
| `GET` | `/api/bookings/:bookingId/notifications` | Get notification history for a booking |
| `GET` | `/api/notifications` | List all notifications (newest first) |
| `POST` | `/api/notifications/:id/resend` | Resend a notification |

**Response format:** All endpoints return `{ success: boolean, message: string, data: any }`

## Status Workflow

```
┌──────────────────┐    ┌──────────────┐    ┌────────────────┐    ┌─────────────────┐
│ Booking Confirmed│───▶│ Puja Started │───▶│ Puja Completed │───▶│ Video Available │
└──────────────────┘    └──────────────┘    └────────────────┘    └─────────────────┘
```

- Transitions are **strictly sequential** — no skipping steps, no going back
- Each transition auto-generates a templated WhatsApp-style notification
- Creating a booking triggers the first "Booking Confirmed" notification
- Invalid transitions return a `400` error with a clear message

## Technical Decisions

### Why sequential status transitions?
Puja ceremonies follow a natural lifecycle. Enforcing a strict order prevents data inconsistencies (e.g., marking a puja as complete before it has started). The backend validates every transition against a `STATUS_FLOW` array and returns a `400` error for invalid attempts.

### Why a separate Notifications collection?
Notifications are a distinct domain concept from bookings. Separating them allows:
- Independent querying and pagination of notification history
- Easy extension to multiple notification channels (WhatsApp, SMS, email)
- A persistent audit trail even if booking data changes
- Cleaner schema design without deeply nested arrays

### Why is the notification sender abstracted?
The `notificationService.js` module encapsulates all notification logic behind a clean `sendNotification(booking, status)` interface:
- Swapping the mock with a real WhatsApp Business API requires changing only one file
- Template rendering, persistence, and delivery are co-located
- Controllers stay focused on business logic, not messaging details
- Easy to add rate limiting, retries, or queue-based delivery later

### Why templates in a separate file?
Message templates are a content concern, not a code concern. Isolating them in `templates.js`:
- Lets non-developers edit notification copy without touching business logic
- Makes it easy to add new templates for future statuses or channels
- Keeps the notification service focused on delivery mechanics

## Seed Data

Run `npm run seed` from the `server/` directory to populate the database with 10 realistic bookings across all statuses, complete with notification history. Seed data includes Indian names, famous temples, and traditional pujas.

---

Built with 🙏 for the Aaradhya Setu team.
