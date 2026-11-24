import React from 'react'

const statusThemes = {
  'Booking Confirmed': {
    badge: 'bg-[#FFF8E7] text-[#8C6200] border-[#F0D58C]',
    dot: 'bg-[#E28A2B]',
    icon: '📋',
  },
  'Puja Started': {
    badge: 'bg-[#FFF2EA] text-[#A63F14] border-[#F5C2A8]',
    dot: 'bg-[#C0502A]',
    icon: '🪔',
  },
  'Puja Completed': {
    badge: 'bg-[#EBF7EE] text-[#1E7333] border-[#B6E3C0]',
    dot: 'bg-[#2E9B48]',
    icon: '✅',
  },
  'Video Available': {
    badge: 'bg-[#F4EDF8] text-[#5A2274] border-[#D8BCDF]',
    dot: 'bg-[#7A2E9E]',
    icon: '🎥',
  },
};

export default function StatusBadge({ status }) {
  const theme = statusThemes[status] || {
    badge: 'bg-gray-100 text-gray-800 border-gray-200',
    dot: 'bg-gray-400',
    icon: '•',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border shadow-2xs whitespace-nowrap ${theme.badge}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${theme.dot}`}></span>
      <span>{status}</span>
    </span>
  );
}
