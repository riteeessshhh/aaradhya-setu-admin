import React from 'react'
import StatusBadge from './StatusBadge'

function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${d.getDate().toString().padStart(2, '0')} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

function formatAmount(amount) {
  if (amount == null) return '—';
  return '₹' + Number(amount).toLocaleString('en-IN');
}

export default function BookingTable({
  bookings,
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
  onAdvance,
  onSelect,
  loading
}) {
  return (
    <div className="mb-14">
      {/* Section Label in the exact style of "— OUR OFFERINGS" from Image 2 */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <p className="flex items-center gap-2 text-[#C0502A] text-xs font-semibold tracking-[0.25em] uppercase mb-2">
            <span className="w-7 h-[2px] bg-[#C0502A]"></span>
            OUR OFFERINGS • PUJA WORKFLOW
          </p>
          <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#2E141A] tracking-tight">
            Active Puja Ceremonies & Devotee Queue
          </h2>
          <p className="text-[#6D534A] text-sm sm:text-base mt-1 font-normal">
            Thoughtfully crafted devotional operations, performed with authenticity, precision, and care.
          </p>
        </div>

        {/* Live counter pill */}
        <div className="self-start md:self-auto px-4 py-2 bg-white rounded-full border border-[#EFE5D8] text-xs font-semibold text-[#4A322C] shadow-xs flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          <span>{bookings.length} Bookings Recorded</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#EFE5D8] mb-6 flex flex-wrap gap-4 items-center justify-between">
        <div className="relative flex-1 min-w-[240px]">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by devotee name, phone, puja, or booking ID..."
            className="w-full pl-11 pr-4 py-2.5 rounded-full border border-[#E0D3C4] bg-[#FAF6F0]/60 text-sm text-[#2E141A] placeholder-[#8C766D] focus:outline-none focus:ring-2 focus:ring-[#C0502A]/30 focus:border-[#C0502A] transition"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          )}
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <label className="text-xs font-semibold text-[#6D534A] uppercase tracking-wider hidden sm:inline">
            Status:
          </label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-auto rounded-full border border-[#E0D3C4] bg-[#FAF6F0]/60 px-5 py-2.5 text-sm font-medium text-[#2E141A] focus:outline-none focus:ring-2 focus:ring-[#C0502A]/30 focus:border-[#C0502A] transition cursor-pointer"
          >
            <option value="">All Statuses ({bookings.length})</option>
            <option value="Booking Confirmed">Booking Confirmed</option>
            <option value="Puja Started">Puja Started</option>
            <option value="Puja Completed">Puja Completed</option>
            <option value="Video Available">Video Available</option>
          </select>
        </div>
      </div>

      {/* Loading Spinner */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-[#EFE5D8]">
          <div className="w-12 h-12 border-4 border-[#F5EBE0] border-t-[#C0502A] rounded-full animate-spin mb-4"></div>
          <p className="text-sm font-medium text-[#6D534A]">Retrieving sacred puja records...</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && bookings.length === 0 && (
        <div className="text-center py-16 bg-white rounded-3xl border border-[#EFE5D8] shadow-xs">
          <div className="w-16 h-16 rounded-full bg-[#FFF6EE] text-3xl flex items-center justify-center mx-auto mb-4 border border-[#F5D8BE]">
            🪔
          </div>
          <h3 className="font-heading font-bold text-[#2E141A] text-xl">No puja bookings found</h3>
          <p className="text-[#8C6D62] text-sm mt-1 max-w-sm mx-auto">
            {search || statusFilter
              ? 'Try modifying your search keywords or resetting the status filter.'
              : 'Create a new booking to start managing the puja ceremony workflow.'}
          </p>
          {(search || statusFilter) && (
            <button
              onClick={() => { setSearch(''); setStatusFilter(''); }}
              className="mt-4 px-5 py-2 bg-[#C0502A] text-white text-xs font-semibold rounded-full hover:bg-[#A93E1A] transition shadow-xs"
            >
              Reset Filters
            </button>
          )}
        </div>
      )}

      {/* Desktop Table */}
      {!loading && bookings.length > 0 && (
        <>
          <div className="hidden lg:block bg-white rounded-3xl overflow-hidden shadow-sm border border-[#EFE5D8]">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#3D1B24] text-white/95 border-b border-[#522933]">
                  <th className="font-heading text-xs font-bold uppercase tracking-wider px-6 py-4">Booking ID</th>
                  <th className="font-heading text-xs font-bold uppercase tracking-wider px-6 py-4">Devotee Details</th>
                  <th className="font-heading text-xs font-bold uppercase tracking-wider px-6 py-4">Puja Ceremony</th>
                  <th className="font-heading text-xs font-bold uppercase tracking-wider px-6 py-4">Temple</th>
                  <th className="font-heading text-xs font-bold uppercase tracking-wider px-6 py-4">Puja Date</th>
                  <th className="font-heading text-xs font-bold uppercase tracking-wider px-6 py-4 text-right">Dakshina</th>
                  <th className="font-heading text-xs font-bold uppercase tracking-wider px-6 py-4">Workflow Status</th>
                  <th className="font-heading text-xs font-bold uppercase tracking-wider px-6 py-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EFE5D8]">
                {bookings.map((b) => (
                  <tr
                    key={b._id || b.bookingId}
                    onClick={() => onSelect(b)}
                    className="hover:bg-[#FAF4EC] cursor-pointer transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <span className="font-heading font-extrabold text-[#C0502A] text-sm group-hover:underline">
                        {b.bookingId}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-[#2E141A] text-sm">{b.devoteeName}</div>
                      <div className="text-xs text-[#8C6D62] mt-0.5">{b.phone}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-medium text-[#2E141A] text-sm">{b.pujaName}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-[#5F463E]">
                      {b.temple}
                    </td>
                    <td className="px-6 py-4 text-sm text-[#5F463E] whitespace-nowrap">
                      {formatDate(b.pujaDate)}
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-[#C0502A] text-right whitespace-nowrap">
                      {formatAmount(b.amount)}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={b.status} />
                    </td>
                    <td className="px-6 py-4 text-center whitespace-nowrap">
                      {b.status !== 'Video Available' ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onAdvance(b.bookingId);
                          }}
                          className="bg-[#C0502A] hover:bg-[#A93E1A] text-white text-xs font-bold px-4 py-2 rounded-full transition-all shadow-xs hover:shadow-md active:scale-95 inline-flex items-center gap-1.5"
                        >
                          <span>Advance</span>
                          <span>➜</span>
                        </button>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-green-700 bg-green-50 border border-green-200 px-3.5 py-1.5 rounded-full">
                          <span>✓</span>
                          <span>Completed</span>
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile / Tablet Card View */}
          <div className="lg:hidden space-y-4">
            {bookings.map((b) => (
              <div
                key={b._id || b.bookingId}
                onClick={() => onSelect(b)}
                className="bg-white rounded-2xl shadow-sm border border-[#EFE5D8] p-5 cursor-pointer hover:shadow-md transition-all active:scale-[0.99]"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-heading font-extrabold text-[#C0502A] text-base">{b.bookingId}</span>
                    <span className="text-xs text-[#8C6D62]">• {formatDate(b.pujaDate)}</span>
                  </div>
                  <StatusBadge status={b.status} />
                </div>

                <h3 className="font-heading font-bold text-lg text-[#2E141A] mb-1">
                  {b.devoteeName}
                </h3>
                <p className="text-sm text-[#5F463E] mb-3">
                  {b.pujaName} at <span className="font-medium text-[#2E141A]">{b.temple}</span>
                </p>

                <div className="flex items-center justify-between pt-3 border-t border-[#EFE5D8]">
                  <div>
                    <span className="text-[10px] text-[#8C6D62] uppercase tracking-wider block font-semibold">Dakshina</span>
                    <span className="text-base font-extrabold text-[#C0502A]">{formatAmount(b.amount)}</span>
                  </div>

                  {b.status !== 'Video Available' ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onAdvance(b.bookingId);
                      }}
                      className="bg-[#C0502A] hover:bg-[#A93E1A] text-white text-xs font-bold px-4 py-2 rounded-full transition shadow-xs active:scale-95 inline-flex items-center gap-1"
                    >
                      <span>Advance</span>
                      <span>➜</span>
                    </button>
                  ) : (
                    <span className="text-xs font-bold text-green-700 bg-green-50 border border-green-200 px-3 py-1.5 rounded-full">
                      ✓ Completed
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
