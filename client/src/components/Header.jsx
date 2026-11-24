import React, { useState } from 'react'

/**
 * Global Navigation Bar
 * Authentic reproduction of the official navbar from www.aaradhyasetu.com.
 * Features:
 * - Official brand logo from S3 CDN
 * - Brand title in Bricolage Grotesque font
 * - Navigation links (Home, Pujas, Chadhava, Horoscope)
 * - Operations portal indicator pill
 * - "+ New Booking" CTA button
 */
export default function Header({ onNewBooking }) {
  const [imgError, setImgError] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-[#E0CDB6] shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo & Name directly matching www.aaradhyasetu.com */}
        <a href="/" className="flex items-center gap-3 no-underline">
          {!imgError ? (
            <img
              src="https://s3.ap-south-1.amazonaws.com/internal.aaradhya-setu/logo/navbar.png"
              alt="Aaradhya Setu"
              className="w-10 h-10 bg-[#3A1E22] rounded-full object-contain p-0.5 shadow-xs"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-[#3A1E22] flex items-center justify-center text-white text-lg font-bold shadow-xs">
              🪔
            </div>
          )}
          <div className="flex flex-col">
            <span
              className="font-extrabold text-[19px] text-[#3A1E22] tracking-tight leading-tight"
              style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
            >
              Aaradhya Setu
            </span>
            <span className="text-[9px] tracking-widest uppercase text-[#6E5650] mt-0.5 font-semibold">
              आराध्य सेतु
            </span>
          </div>
        </a>

        {/* Navigation Links from live website */}
        <nav className="hidden md:flex items-center gap-7 text-[14px] font-semibold text-[#3A1E22]">
          <a href="/" className="text-[#C5532F] transition-colors">Home</a>
          <a href="#pujas" className="hover:text-[#C5532F] transition-colors">Pujas</a>
          <a href="#chadhava" className="hover:text-[#C5532F] transition-colors">Chadhava</a>
          <a href="#horoscope" className="hover:text-[#C5532F] transition-colors">Horoscope</a>

          {/* Internal Portal Pill */}
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#C5532F] text-white border border-[#C5532F] shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
            <span>Puja Operations Workflow</span>
          </div>
        </nav>

        {/* CTA Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={onNewBooking}
            className="bg-[#C5532F] hover:bg-[#A93E1A] text-white text-xs sm:text-sm font-semibold rounded-full px-4 sm:px-5 py-2 sm:py-2.5 transition-all shadow-sm hover:shadow-md active:scale-95 flex items-center gap-1.5 cursor-pointer"
          >
            <span>✦</span>
            <span>New Booking</span>
          </button>
        </div>
      </div>
    </header>
  )
}
