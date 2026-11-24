import React from 'react'

/**
 * HeroSection Component
 * Recreates the sunlit golden sunrise header from www.aaradhyasetu.com.
 * Features:
 * - Animated floating petals and subtle radial temple glow
 * - Brand headline: "Every puja, every devotee, one clear workflow."
 * - Two quick-action cards to navigate to the queue or create a booking
 * - Signature deep maroon infinite marquee strip with saffron diamonds (◆)
 */
export default function HeroSection({ onNewBooking, onScrollToTable }) {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-[#FDF0DE] via-[#FDF6EC] to-[#FAF4EC] border-b border-[#E0CDB6]">
      {/* Decorative Sunlit Background Temple Glow */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-gradient-to-b from-[#FAD9A6]/60 via-[#FCE3BE]/30 to-transparent rounded-full blur-3xl"></div>
        {/* Floating Petal Accents */}
        <span className="absolute top-12 left-[15%] text-2xl animate-bounce duration-1000 select-none">🌸</span>
        <span className="absolute top-28 right-[18%] text-xl animate-pulse select-none">🌺</span>
        <span className="absolute top-44 left-[22%] text-lg select-none">🌼</span>
        <span className="absolute top-20 right-[30%] text-2xl select-none">🪷</span>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 pb-14 sm:pb-16 text-center">
        {/* Operations Badge */}
        <div className="flex items-center justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 border border-[#F0DDCF] shadow-xs text-xs font-semibold text-[#6E5650] uppercase tracking-wider">
            <span>🪔</span>
            <span>Aaradhya Setu • Admin Operations</span>
          </div>
        </div>

        {/* Temple Motif Icon */}
        <div className="flex justify-center mb-5 sm:mb-6">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-b from-[#FCE1C5] to-[#FCEFDA] flex items-center justify-center text-3xl sm:text-4xl shadow-inner border border-[#F3CBA7]">
            🛕
          </div>
        </div>

        {/* Hero Title (Bricolage Grotesque font) */}
        <h1
          className="font-extrabold text-3xl sm:text-5xl md:text-6xl text-[#3A1E22] tracking-tight leading-[1.15] max-w-4xl mx-auto mb-4 px-2"
          style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
        >
          Every puja, every devotee,<br />
          <span className="text-[#C5532F]">one clear workflow.</span>
        </h1>

        {/* Hero Subtitle */}
        <p className="text-sm sm:text-base md:text-lg text-[#6E5650] max-w-2xl mx-auto leading-relaxed mb-8 px-4 font-medium">
          Track bookings, advance each sacred puja stage, and keep devotees informed automatically via WhatsApp notifications.
        </p>

        {/* Two Floating Quick-Action Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 max-w-xl mx-auto px-4">
          {/* Card 1: View Table Queue */}
          <div
            onClick={onScrollToTable}
            className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md border border-[#E0CDB6] flex items-center justify-between cursor-pointer transition-all hover:-translate-y-0.5 group text-left"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-[#FFF6EE] border border-[#F5D8BE] flex items-center justify-center text-2xl">
                🪔
              </div>
              <div>
                <h3
                  className="font-bold text-[#3A1E22] text-sm sm:text-base group-hover:text-[#C5532F] transition-colors"
                  style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
                >
                  Manage Puja Queue
                </h3>
                <p className="text-xs text-[#6E5650]">10+ Devotee Bookings Active</p>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-[#C5532F] text-white flex items-center justify-center text-sm shadow-xs group-hover:scale-110 transition-transform">
              ➜
            </div>
          </div>

          {/* Card 2: Create New Booking */}
          <div
            onClick={onNewBooking}
            className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md border border-[#E0CDB6] flex items-center justify-between cursor-pointer transition-all hover:-translate-y-0.5 group text-left"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-[#FFF6EE] border border-[#F5D8BE] flex items-center justify-center text-2xl">
                ✦
              </div>
              <div>
                <h3
                  className="font-bold text-[#3A1E22] text-sm sm:text-base group-hover:text-[#C5532F] transition-colors"
                  style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
                >
                  Create New Booking
                </h3>
                <p className="text-xs text-[#6E5650]">Assign Pandit & Temple</p>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-[#C5532F] text-white flex items-center justify-center text-sm shadow-xs group-hover:scale-110 transition-transform">
              ➜
            </div>
          </div>
        </div>
      </div>

      {/* Signature Deep Maroon Ribbon Marquee Strip */}
      <div className="bg-[#3A1E22] border-y border-[#522933] overflow-hidden py-3">
        <div className="animate-marquee whitespace-nowrap text-xs sm:text-sm font-medium tracking-wide text-[#FFFAF2] flex items-center gap-8">
          <span>Chadhava Seva <span className="text-[#E28A2B] mx-2">◆</span> Daily Panchang <span className="text-[#E28A2B] mx-2">◆</span> Personalised Horoscope <span className="text-[#E28A2B] mx-2">◆</span> Prasad Delivery <span className="text-[#E28A2B] mx-2">◆</span> 120+ Temples <span className="text-[#E28A2B] mx-2">◆</span> VIP Puja <span className="text-[#E28A2B] mx-2">◆</span> Online Puja Booking <span className="text-[#E28A2B] mx-2">◆</span> Verified Temple Priests <span className="text-[#E28A2B] mx-2">◆</span> Chadhava Seva <span className="text-[#E28A2B] mx-2">◆</span> Daily Panchang <span className="text-[#E28A2B] mx-2">◆</span> Personalised Horoscope <span className="text-[#E28A2B] mx-2">◆</span> Prasad Delivery <span className="text-[#E28A2B] mx-2">◆</span> 120+ Temples</span>
          <span>Chadhava Seva <span className="text-[#E28A2B] mx-2">◆</span> Daily Panchang <span className="text-[#E28A2B] mx-2">◆</span> Personalised Horoscope <span className="text-[#E28A2B] mx-2">◆</span> Prasad Delivery <span className="text-[#E28A2B] mx-2">◆</span> 120+ Temples <span className="text-[#E28A2B] mx-2">◆</span> VIP Puja <span className="text-[#E28A2B] mx-2">◆</span> Online Puja Booking <span className="text-[#E28A2B] mx-2">◆</span> Verified Temple Priests <span className="text-[#E28A2B] mx-2">◆</span> Chadhava Seva <span className="text-[#E28A2B] mx-2">◆</span> Daily Panchang <span className="text-[#E28A2B] mx-2">◆</span> Personalised Horoscope <span className="text-[#E28A2B] mx-2">◆</span> Prasad Delivery <span className="text-[#E28A2B] mx-2">◆</span> 120+ Temples</span>
        </div>
      </div>
    </div>
  )
}
