import React from 'react'

/**
 * Footer Component
 * Production 4-column footer extracted directly from www.aaradhyasetu.com.
 * Columns:
 * 1. Brand logo, tagline ("Bridging spiritual pathways safely and securely") & Social Links
 * 2. Navigation links
 * 3. Products & Services links
 * 4. Legal & Support links
 * + Copyright bar
 */
export default function Footer() {
  return (
    <footer className="bg-white border-t border-[#E0CDB6] text-[#3A1E22] font-sans mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-14 sm:py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">
        {/* Column 1: Brand & Socials */}
        <div className="space-y-4">
          <a className="flex items-center gap-3 no-underline" href="/">
            <img
              src="https://s3.ap-south-1.amazonaws.com/internal.aaradhya-setu/logo/navbar.png"
              alt="Aaradhya Setu"
              className="w-10 h-10 bg-[#3A1E22] rounded-full object-contain p-0.5 shadow-xs"
            />
            <span className="flex flex-col">
              <span
                className="font-extrabold text-[18px] text-[#3A1E22] tracking-tight leading-tight"
                style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
              >
                Aaradhya Setu
              </span>
              <span className="text-[9px] tracking-widest uppercase text-[#6E5650] mt-0.5 font-semibold">
                आराध्य सेतु
              </span>
            </span>
          </a>
          <p className="text-sm text-[#6E5650] leading-relaxed font-medium pt-1">
            Bridging spiritual pathways safely and securely.
          </p>
          {/* Social Links */}
          <div className="flex items-center gap-3 pt-1">
            <a
              href="https://www.facebook.com/profile.php?id=61591004555964"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="w-9 h-9 flex items-center justify-center rounded-full border border-[#E0CDB6] text-[#3A1E22] hover:bg-[#C5532F] hover:border-[#C5532F] hover:text-white transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22 12.06C22 6.53 17.52 2.04 12 2.04S2 6.53 2 12.06c0 5 3.66 9.13 8.44 9.88v-6.99h-2.54v-2.89h2.54V9.84c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.44 2.89h-2.34v6.99C18.34 21.19 22 17.06 22 12.06z" />
              </svg>
            </a>
            <a
              href="https://instagram.com/aaradhyasetu"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="w-9 h-9 flex items-center justify-center rounded-full border border-[#E0CDB6] text-[#3A1E22] hover:bg-[#C5532F] hover:border-[#C5532F] hover:text-white transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37a4 4 0 1 1-7.914 1.174A4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </a>
            <a
              href="https://www.linkedin.com/company/aaradhya-setu"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="w-9 h-9 flex items-center justify-center rounded-full border border-[#E0CDB6] text-[#3A1E22] hover:bg-[#C5532F] hover:border-[#C5532F] hover:text-white transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.03-1.85-3.03-1.85 0-2.14 1.45-2.14 2.94v5.66H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Column 2: Navigation */}
        <div className="space-y-4">
          <h4 className="text-[13px] font-bold uppercase tracking-wider text-[#C5532F]">Navigation</h4>
          <ul className="space-y-3 text-[14px] font-semibold text-[#3A1E22]">
            <li><a className="hover:text-[#C5532F] transition-colors block" href="/">Home</a></li>
            <li><a className="hover:text-[#C5532F] transition-colors block" href="/login">Login</a></li>
            <li><a className="hover:text-[#C5532F] transition-colors block" href="/profile">Profile</a></li>
            <li><a className="hover:text-[#C5532F] transition-colors block" href="/about-us">About Us</a></li>
            <li><a className="hover:text-[#C5532F] transition-colors block" href="/contact">Contact Us</a></li>
          </ul>
        </div>

        {/* Column 3: Products & Services */}
        <div className="space-y-4">
          <h4 className="text-[13px] font-bold uppercase tracking-wider text-[#C5532F]">Products &amp; Services</h4>
          <ul className="space-y-3 text-[14px] font-semibold text-[#3A1E22]">
            <li><a className="hover:text-[#C5532F] transition-colors block" href="/puja/allgrouppuja">Pujas</a></li>
            <li><a className="hover:text-[#C5532F] transition-colors block" href="/puja/allchadhavapuja">Chadhava</a></li>
            <li><a className="hover:text-[#C5532F] transition-colors block" href="/puja/allvippuja">Vip Pujas</a></li>
            <li><a className="hover:text-[#C5532F] transition-colors block" href="/panchang">Panchang</a></li>
            <li><a className="hover:text-[#C5532F] transition-colors block" href="/horoscope">Horoscope</a></li>
          </ul>
        </div>

        {/* Column 4: Legal & Support */}
        <div className="space-y-4">
          <h4 className="text-[13px] font-bold uppercase tracking-wider text-[#C5532F]">Legal &amp; Support</h4>
          <ul className="space-y-3 text-[14px] font-semibold text-[#3A1E22]">
            <li><a className="hover:text-[#C5532F] transition-colors block" href="/privacy-policy">Privacy Policy</a></li>
            <li><a className="hover:text-[#C5532F] transition-colors block" href="/terms-and-conditions">Terms &amp; Conditions</a></li>
          </ul>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="border-t border-[#E0CDB6] bg-[#FFFAF2] px-6 py-5 text-center">
        <p className="text-xs font-semibold text-[#6E5650] tracking-wide">
          © 2026 Aaradhya Setu. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
