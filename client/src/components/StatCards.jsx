import React from 'react'

const statsConfig = [
  { key: 'total', label: 'Total Bookings', filterValue: '', icon: '📊' },
  { key: 'Booking Confirmed', label: 'Booking Confirmed', filterValue: 'Booking Confirmed', icon: '📋' },
  { key: 'Puja Started', label: 'Puja Started', filterValue: 'Puja Started', icon: '🪔' },
  { key: 'Puja Completed', label: 'Puja Completed', filterValue: 'Puja Completed', icon: '✅' },
  { key: 'Video Available', label: 'Video Available', filterValue: 'Video Available', icon: '🎥' },
];

export default function StatCards({ bookings, statusFilter, onSelectStatus }) {
  const counts = {
    total: bookings.length,
    'Booking Confirmed': bookings.filter(b => b.status === 'Booking Confirmed').length,
    'Puja Started': bookings.filter(b => b.status === 'Puja Started').length,
    'Puja Completed': bookings.filter(b => b.status === 'Puja Completed').length,
    'Video Available': bookings.filter(b => b.status === 'Video Available').length,
  };

  return (
    <div className="mb-14">
      {/* Signature Aaradhya Setu Dark Maroon Stat Container */}
      <div className="bg-[#3D1B24] rounded-3xl md:rounded-[32px] p-6 sm:p-8 md:p-10 shadow-xl border border-[#522933]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 pb-5 border-b border-[#522933]/70 gap-2">
          <div className="flex items-center gap-2 text-[#E28A2B] text-xs font-semibold tracking-[0.2em] uppercase">
            <span className="w-6 h-[2px] bg-[#E28A2B]"></span>
            LIVE PUJA WORKFLOW METRICS
          </div>
          {statusFilter && (
            <button
              onClick={() => onSelectStatus && onSelectStatus('')}
              className="text-xs text-[#E28A2B] hover:text-[#F3A54D] font-medium flex items-center gap-1.5 transition-colors self-start sm:self-auto"
            >
              <span>Showing: <strong>{statusFilter}</strong></span>
              <span className="underline ml-1">(Reset to All)</span>
            </button>
          )}
        </div>

        {/* 5-Column Stat Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-4 divide-y sm:divide-y-0 sm:divide-x divide-[#522933]/60">
          {statsConfig.map((stat, idx) => {
            const count = counts[stat.key];
            const isSelected = stat.key === 'total' ? statusFilter === '' : statusFilter === stat.key;

            return (
              <div
                key={stat.key}
                onClick={() => onSelectStatus && onSelectStatus(stat.filterValue)}
                className={`text-center cursor-pointer transition-all duration-200 group rounded-2xl p-3 ${
                  idx > 0 ? 'sm:pl-4 sm:pt-0 pt-4' : 'sm:pr-4'
                } ${
                  isSelected ? 'bg-white/10 ring-1 ring-[#E28A2B]/60 scale-[1.02]' : 'hover:bg-white/5'
                }`}
                title={`Filter bookings by ${stat.label}`}
              >
                <div className="font-heading font-extrabold text-3xl sm:text-4xl lg:text-5xl text-[#E28A2B] tracking-tight group-hover:scale-105 transition-transform">
                  {count}
                </div>
                <div className="text-white/90 text-xs sm:text-sm font-medium mt-2 flex items-center justify-center gap-1.5">
                  <span className="text-xs opacity-75">{stat.icon}</span>
                  <span>{stat.label}</span>
                </div>
                {isSelected && (
                  <span className="inline-block mt-2 text-[10px] uppercase font-bold text-[#E28A2B] tracking-widest bg-[#E28A2B]/20 px-2 py-0.5 rounded-full">
                    Filtered
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
