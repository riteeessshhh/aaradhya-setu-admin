import React from 'react'

const steps = [
  {
    num: '01',
    title: 'Advance the status',
    desc: 'Move the puja booking sequentially through its sacred lifecycle with one verified click.',
    icon: '📋',
  },
  {
    num: '02',
    title: 'Message auto-generated',
    desc: 'A personalized WhatsApp notification is created from devotional templates with devotee name and booking ID.',
    icon: '💬',
  },
  {
    num: '03',
    title: 'Devotee stays informed',
    desc: 'The notification is recorded to MongoDB history, devotee stays informed, and final video is delivered.',
    icon: '✅',
  },
];

/**
 * HowItWorks Component
 * Recreates the "Three simple steps to devotion" 3-card section
 * from www.aaradhyasetu.com.
 */
export default function HowItWorks() {
  return (
    <div className="mb-14">
      {/* Section Label */}
      <p className="flex items-center gap-2 text-[#C5532F] text-xs font-bold tracking-[0.25em] uppercase mb-2">
        <span className="w-7 h-[2px] bg-[#C5532F]"></span>
        HOW IT WORKS
      </p>
      <h2
        className="font-extrabold text-2xl sm:text-3xl text-[#3A1E22] tracking-tight mb-2"
        style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
      >
        Three simple steps to devotion
      </h2>
      <p className="text-[#6E5650] text-sm sm:text-base mb-8 max-w-2xl font-medium">
        Thoughtfully crafted devotional operations, performed with authenticity, precision, and care.
      </p>

      {/* 3 Step Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {steps.map((s) => (
          <div
            key={s.num}
            className="bg-white rounded-2xl p-6 sm:p-7 shadow-sm border border-[#E0CDB6] transition-all duration-200 hover:shadow-md hover:-translate-y-1 relative overflow-hidden"
          >
            <div
              className="text-3xl sm:text-4xl font-extrabold text-[#C5532F] mb-3"
              style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
            >
              {s.num}
            </div>
            <h3
              className="font-bold text-lg text-[#3A1E22] mb-2 flex items-center justify-between"
              style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
            >
              <span>{s.title}</span>
              <span className="text-xl opacity-70">{s.icon}</span>
            </h3>
            <p className="text-sm text-[#6E5650] leading-relaxed">
              {s.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
