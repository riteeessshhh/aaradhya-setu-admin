import React, { useState, useEffect, useCallback } from 'react'
import { getBookings, advanceBooking, resendNotification } from './api'
import Header from './components/Header'
import HeroSection from './components/HeroSection'
import StatCards from './components/StatCards'
import HowItWorks from './components/HowItWorks'
import BookingTable from './components/BookingTable'
import BookingDrawer from './components/BookingDrawer'
import NewBookingModal from './components/NewBookingModal'
import ToastContainer from './components/ToastContainer'
import Footer from './components/Footer'

/**
 * Main Application Root
 * Orchestrates:
 * 1. Bookings data fetching with search and status filters
 * 2. Booking advancement state machine and real-time updates
 * 3. Modals (New Booking) and Drawers (Detail & WhatsApp preview)
 * 4. Toast notification system
 */
export default function App() {
  // Bookings state
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  // Selected booking for drawer detail & WhatsApp preview
  const [selectedBooking, setSelectedBooking] = useState(null)

  // Modal & Toast states
  const [showNewBookingModal, setShowNewBookingModal] = useState(false)
  const [toasts, setToasts] = useState([])

  // Toast notification helpers
  const addToast = useCallback((message, type = 'success') => {
    const id = Math.random().toString(36).substring(2, 9)
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 4500)
  }, [])

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  // Fetch bookings from backend API with debouncing for search
  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true)
      const data = await getBookings(search, statusFilter)
      setBookings(data)
    } catch (err) {
      addToast(err.message, 'error')
    } finally {
      setLoading(false)
    }
  }, [search, statusFilter, addToast])

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchBookings()
    }, search ? 300 : 0)
    return () => clearTimeout(timer)
  }, [fetchBookings, search, statusFilter])

  // Advance booking to the next status in the workflow
  const handleAdvance = async (bookingId) => {
    try {
      const result = await advanceBooking(bookingId)
      addToast(
        `Status advanced to "${result.booking.status}" & WhatsApp notification sent to ${result.booking.devoteeName}! 📱`,
        'success'
      )

      // Optimistic local update
      setBookings((prev) =>
        prev.map((b) => (b.bookingId === bookingId ? result.booking : b))
      )

      // Open / sync the drawer so the admin visually sees the WhatsApp phone mockup with the new message
      setSelectedBooking(result.booking)

      fetchBookings()
      return result
    } catch (err) {
      addToast(err.message, 'error')
      throw err
    }
  }

  // Handle successful creation of a new booking
  const handleBookingCreated = () => {
    fetchBookings()
    setShowNewBookingModal(false)
    addToast('Puja booking created & WhatsApp notification dispatched!', 'success')
  }

  // Handle mock resend of a WhatsApp notification (P2)
  const handleResend = async (id) => {
    try {
      await resendNotification(id)
      addToast('WhatsApp notification resent to devotee!', 'success')
    } catch (err) {
      addToast(err.message, 'error')
      throw err
    }
  }

  // Scroll helper to smoothly navigate to the bookings table
  const scrollToTable = () => {
    document.getElementById('bookings-section')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-[#FAF4EC] text-[#3A1E22] flex flex-col">
      {/* 1. Global Navigation Bar */}
      <Header onNewBooking={() => setShowNewBookingModal(true)} />

      {/* 2. Main Puja Operations Workflow Portal */}
      <div className="flex-1">
        {/* Sunlit Hero Banner & Marquee Ribbon Strip */}
        <HeroSection
          onNewBooking={() => setShowNewBookingModal(true)}
          onScrollToTable={scrollToTable}
        />

        {/* Workflow Admin Portal Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          {/* Live Metrics Card with 1-Click Status Filter */}
          <StatCards
            bookings={bookings}
            statusFilter={statusFilter}
            onSelectStatus={setStatusFilter}
          />

          {/* "Three simple steps to devotion" Process Guide */}
          <HowItWorks />

          {/* Active Bookings Management Table */}
          <div id="bookings-section">
            <BookingTable
              bookings={bookings}
              search={search}
              setSearch={setSearch}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              onAdvance={handleAdvance}
              onSelect={setSelectedBooking}
              loading={loading}
            />
          </div>
        </main>
      </div>

      {/* 3. Global Production Footer */}
      <Footer />

      {/* 4. Slide-in Drawer: Booking Details & WhatsApp Chat Preview */}
      {selectedBooking && (
        <BookingDrawer
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
          onResend={handleResend}
          onAdvance={handleAdvance}
        />
      )}

      {/* 5. Modal: Create New Booking */}
      {showNewBookingModal && (
        <NewBookingModal
          onClose={() => setShowNewBookingModal(false)}
          onCreated={handleBookingCreated}
        />
      )}

      {/* 6. Floating Toast Notifications */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  )
}
