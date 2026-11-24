import React, { useState, useEffect, useRef } from 'react'
import { getBookingNotifications } from '../api'
import StatusBadge from './StatusBadge'

const STATUS_FLOW = ['Booking Confirmed', 'Puja Started', 'Puja Completed', 'Video Available'];
const STEP_SHORT_LABELS = ['Confirmed', 'Started', 'Completed', 'Video'];
const STEP_ICONS = ['📋', '🪔', '✅', '🎥'];

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

// Short format for chat bubbles & stepper: "24 Nov, 7:04 PM"
function formatShortDateTime(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  let hours = d.getHours();
  const minutes = d.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  return `${d.getDate()} ${months[d.getMonth()]}, ${hours}:${minutes} ${ampm}`;
}

// Full format for timeline & audit: "24 Nov 2026 at 7:04 PM"
function formatFullDateTime(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  let hours = d.getHours();
  const minutes = d.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()} at ${hours}:${minutes} ${ampm}`;
}

// Format WhatsApp text: *bold* -> <strong>bold</strong>
function renderWhatsAppText(text) {
  if (!text) return null;
  const parts = text.split(/(\*[^*]+\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith('*') && part.endsWith('*')) {
      return <strong key={index} className="font-bold text-gray-950">{part.slice(1, -1)}</strong>;
    }
    return part;
  });
}

/**
 * Slide-in Drawer: Devotee Details, Workflow Stepper, and Real-Time WhatsApp Mockup
 * Shows explicit dates and times for when the booking was confirmed, when puja started,
 * when puja completed, and when the video became available.
 */
export default function BookingDrawer({ booking, onClose, onResend, onAdvance }) {
  const [activeTab, setActiveTab] = useState('whatsapp'); // 'whatsapp' or 'details'
  const [notifications, setNotifications] = useState([]);
  const [loadingNotifs, setLoadingNotifs] = useState(true);
  const [advancing, setAdvancing] = useState(false);
  const [resendingId, setResendingId] = useState(null);
  const chatBottomRef = useRef(null);

  const fetchNotifs = () => {
    if (!booking) return;
    setLoadingNotifs(true);
    getBookingNotifications(booking.bookingId)
      .then((data) => {
        setNotifications(data);
      })
      .catch(() => setNotifications([]))
      .finally(() => setLoadingNotifs(false));
  };

  useEffect(() => {
    fetchNotifs();
  }, [booking?.bookingId, booking?.status]);

  // Smooth scroll to latest WhatsApp message when new notification arrives
  useEffect(() => {
    if (activeTab === 'whatsapp' && notifications.length > 0) {
      setTimeout(() => {
        chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [notifications.length, activeTab]);

  if (!booking) return null;

  // Map notifications by status to easily extract exact milestone timestamps
  const notifByStatus = {};
  notifications.forEach((n) => {
    notifByStatus[n.status] = n;
  });

  const currentIdx = STATUS_FLOW.indexOf(booking.status);
  const isFinalStatus = currentIdx === STATUS_FLOW.length - 1;
  const nextStatus = !isFinalStatus ? STATUS_FLOW[currentIdx + 1] : null;

  const handleAdvanceClick = async () => {
    if (!onAdvance || isFinalStatus || advancing) return;
    try {
      setAdvancing(true);
      await onAdvance(booking.bookingId);
      setActiveTab('whatsapp'); // Ensure WhatsApp tab is active to see new message
      fetchNotifs();
    } finally {
      setAdvancing(false);
    }
  };

  const handleResendClick = async (notifId) => {
    if (!onResend || resendingId) return;
    try {
      setResendingId(notifId);
      await onResend(notifId);
      fetchNotifs();
    } finally {
      setResendingId(null);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs z-40 transition-opacity"
        onClick={onClose}
      ></div>

      {/* Drawer Container */}
      <div className="fixed right-0 top-0 bottom-0 w-full sm:w-[500px] md:w-[540px] bg-[#FAF4EC] shadow-2xl z-50 overflow-y-auto animate-slide-in flex flex-col">
        {/* 1. Sticky Header */}
        <div className="bg-[#3D1B24] px-5 py-4 flex items-center justify-between sticky top-0 z-20 shadow-md">
          <div className="flex items-center gap-3 min-w-0">
            <span className="text-2xl">🪔</span>
            <div className="truncate">
              <div className="flex items-center gap-2">
                <h2 className="font-heading font-bold text-white text-base tracking-wide">
                  {booking.bookingId}
                </h2>
                <span className="text-white/40">•</span>
                <span className="text-amber-300 font-semibold text-sm truncate">
                  {booking.devoteeName}
                </span>
              </div>
              <p className="text-white/60 text-xs truncate mt-0.5">
                {booking.pujaName} @ {booking.temple}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white text-xl transition w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 flex-shrink-0 ml-2"
            aria-label="Close details"
          >
            ✕
          </button>
        </div>

        {/* 2. Mode Tabs: WhatsApp Preview vs Full Details */}
        <div className="bg-white border-b border-[#E8DCCF] px-4 flex items-center gap-2 sticky top-[68px] z-10 shadow-xs">
          <button
            onClick={() => setActiveTab('whatsapp')}
            className={`py-3 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === 'whatsapp'
                ? 'border-[#C0502A] text-[#C0502A]'
                : 'border-transparent text-[#3A1E22]/60 hover:text-[#3A1E22]'
            }`}
          >
            <span>📱</span>
            <span>WhatsApp Live Dispatch</span>
            {notifications.length > 0 && (
              <span className="bg-green-100 text-green-800 text-[10px] px-1.5 py-0.5 rounded-full font-bold ml-1">
                {notifications.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('details')}
            className={`py-3 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === 'details'
                ? 'border-[#C0502A] text-[#C0502A]'
                : 'border-transparent text-[#3A1E22]/60 hover:text-[#3A1E22]'
            }`}
          >
            <span>📋</span>
            <span>Ceremony & Timeline</span>
          </button>
        </div>

        {/* 3. Main Drawer Content Area */}
        <div className="p-4 sm:p-5 flex-1 space-y-4">
          {/* Top Quick Status & Stepper (Visible across both views) */}
          <div className="bg-white rounded-2xl p-4 shadow-xs border border-[#E8DCCF]">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#3A1E22]/60">
                Workflow Progress & Dates
              </span>
              <StatusBadge status={booking.status} />
            </div>

            {/* Compact Horizontal 4-Step Stepper with Explicit Milestone Timestamps */}
            <div className="grid grid-cols-4 gap-1 relative mb-4">
              {STATUS_FLOW.map((step, idx) => {
                const isCompleted = idx < currentIdx;
                const isCurrent = idx === currentIdx;
                const milestoneNotif = notifByStatus[step];

                return (
                  <div key={step} className="flex flex-col items-center text-center px-0.5">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                        isCompleted
                          ? 'bg-green-600 text-white shadow-xs'
                          : isCurrent
                          ? 'bg-[#C0502A] text-white ring-4 ring-[#C0502A]/20 scale-105 shadow-xs'
                          : 'bg-gray-100 text-gray-400 border border-gray-200'
                      }`}
                    >
                      {isCompleted ? '✓' : STEP_ICONS[idx]}
                    </div>
                    <span
                      className={`text-[10px] mt-1 font-semibold truncate max-w-full ${
                        isCurrent
                          ? 'text-[#C0502A] font-bold'
                          : isCompleted
                          ? 'text-[#3A1E22]'
                          : 'text-gray-400'
                      }`}
                    >
                      {STEP_SHORT_LABELS[idx]}
                    </span>
                    {/* Timestamp: exact date & time when this step happened */}
                    {milestoneNotif?.sentAt ? (
                      <span className="text-[8px] sm:text-[9px] text-[#C0502A] font-medium leading-tight mt-0.5">
                        {formatShortDateTime(milestoneNotif.sentAt)}
                      </span>
                    ) : (
                      <span className="text-[8px] text-gray-400 leading-tight mt-0.5">
                        {idx > currentIdx ? 'Pending' : 'In Progress'}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Advance Action Button - Prominent & Direct */}
            {!isFinalStatus ? (
              <button
                onClick={handleAdvanceClick}
                disabled={advancing}
                className="w-full bg-[#C0502A] hover:bg-[#A93E1A] text-white font-bold py-2.5 px-4 rounded-xl shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 disabled:opacity-60 active:scale-[0.98] text-xs sm:text-sm"
              >
                {advancing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Advancing & Dispatching WhatsApp...</span>
                  </>
                ) : (
                  <>
                    <span>Advance to <strong>"{nextStatus}"</strong></span>
                    <span className="text-base">➜</span>
                  </>
                )}
              </button>
            ) : (
              <div className="bg-green-50 border border-green-200 text-green-800 rounded-xl py-2 px-3 text-center text-xs font-bold flex items-center justify-center gap-1.5">
                <span>🎥</span>
                <span>Puja Completed • Video Link Available to Devotee</span>
              </div>
            )}
          </div>

          {/* TAB 1: Real-time WhatsApp Smartphone Preview */}
          {activeTab === 'whatsapp' && (
            <div className="bg-white rounded-2xl p-4 shadow-xs border border-[#E8DCCF] animate-fade-in">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                  <p className="text-xs font-bold text-[#C0502A] uppercase tracking-wider">
                    WhatsApp Message Preview
                  </p>
                </div>
                <span className="text-[10px] text-green-800 bg-green-50 px-2 py-0.5 rounded-full font-bold border border-green-200">
                  📱 Sent to {booking.phone}
                </span>
              </div>

              {loadingNotifs ? (
                <div className="flex flex-col items-center justify-center py-10">
                  <div className="w-8 h-8 border-3 border-cream border-t-[#C0502A] rounded-full animate-spin mb-2"></div>
                  <p className="text-xs text-gray-500">Retrieving WhatsApp dispatch history...</p>
                </div>
              ) : (
                /* Native WhatsApp Phone Mockup */
                <div className="max-w-[360px] mx-auto rounded-[28px] border-[5px] border-gray-900 overflow-hidden shadow-xl bg-gray-900">
                  {/* Phone Speaker Notch */}
                  <div className="bg-gray-900 h-4 flex items-center justify-center">
                    <div className="w-14 h-2.5 bg-gray-800 rounded-full"></div>
                  </div>

                  {/* WhatsApp App Header (Chat with Devotee) */}
                  <div className="bg-[#075E54] text-white px-3 py-2 flex items-center gap-2">
                    <span className="text-xs text-white/70">‹</span>
                    <div className="bg-[#128C7E] border border-white/20 rounded-full w-8 h-8 flex items-center justify-center text-white text-xs font-bold shadow-inner flex-shrink-0">
                      {booking.devoteeName ? booking.devoteeName.charAt(0).toUpperCase() : '👤'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="text-xs font-bold truncate leading-tight">{booking.devoteeName}</p>
                        <span className="text-[9px] bg-white/20 text-white/90 px-1 py-0.2 rounded font-normal">Devotee</span>
                      </div>
                      <p className="text-[9px] text-green-200 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block animate-ping"></span>
                        {booking.phone}
                      </p>
                    </div>
                    <div className="text-white/80 text-xs flex gap-2">
                      <span>📹</span>
                      <span>📞</span>
                    </div>
                  </div>

                  {/* WhatsApp Chat Wallpaper Area (Scrollable without ugly scrollbar) */}
                  <div
                    className="min-h-[240px] max-h-[340px] overflow-y-auto p-3 space-y-2.5 no-scrollbar"
                    style={{
                      backgroundColor: '#EFEAE2',
                      backgroundImage: 'radial-gradient(#d3cabb 1px, transparent 1px)',
                      backgroundSize: '16px 16px',
                    }}
                  >
                    <div className="text-center">
                      <span className="bg-amber-100/90 text-amber-950 text-[9px] font-medium px-2 py-0.5 rounded shadow-2xs">
                        🔒 End-to-end encrypted • Aaradhya Setu
                      </span>
                    </div>

                    {notifications.length === 0 ? (
                      <div className="flex items-center justify-center h-[180px]">
                        <p className="text-gray-500 text-xs bg-white/90 px-3 py-1.5 rounded-lg shadow-2xs">
                          No notifications dispatched yet
                        </p>
                      </div>
                    ) : (
                      notifications.map((notif, i) => {
                        const isLatest = i === notifications.length - 1;
                        return (
                          <div
                            key={notif._id}
                            className={`flex flex-col items-end ${
                              isLatest ? 'animate-fade-in' : ''
                            }`}
                          >
                            {/* Chat Bubble (Sent by Aaradhya Setu to Devotee) */}
                            <div className="bg-[#DCF8C6] rounded-lg rounded-tr-none max-w-[92%] px-3 py-2 shadow-2xs border border-green-200/50">
                              <p className="text-[11px] text-gray-900 whitespace-pre-line leading-relaxed font-normal">
                                {renderWhatsAppText(notif.message)}
                              </p>
                              {/* Sent Date and Time with double blue ticks */}
                              <div className="flex justify-end items-center gap-1.5 mt-1 text-[9px] text-gray-500">
                                <span className="font-medium text-gray-600">
                                  {formatShortDateTime(notif.sentAt)}
                                </span>
                                <span className="text-blue-500 font-bold">✓✓</span>
                              </div>
                            </div>

                            {/* Resend Action Pill */}
                            <button
                              onClick={() => handleResendClick(notif._id)}
                              disabled={resendingId === notif._id}
                              className="text-[9px] text-[#C0502A] hover:text-[#A93E1A] mt-0.5 mr-1 font-bold transition flex items-center gap-1 hover:underline disabled:opacity-50"
                              title="Simulate re-sending this notification"
                            >
                              {resendingId === notif._id ? (
                                <span>Resending...</span>
                              ) : (
                                <>
                                  <span>🔁</span>
                                  <span>Resend</span>
                                </>
                              )}
                            </button>
                          </div>
                        );
                      })
                    )}
                    <div ref={chatBottomRef} />
                  </div>

                  {/* WhatsApp Chat Footer Bar */}
                  <div className="bg-[#F0F2F5] px-2.5 py-2 flex gap-2 items-center border-t border-gray-200">
                    <span className="text-gray-500 text-xs">😊</span>
                    <div className="flex-1 bg-white rounded-full px-3 py-1 text-[10px] text-gray-500 truncate shadow-2xs">
                      Message delivered to devotee
                    </div>
                    <div className="w-6 h-6 bg-[#00A884] rounded-full flex items-center justify-center text-white text-[10px] shadow-2xs">
                      🎙
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Full Devotee & Ceremony Details with Milestone Dates */}
          {activeTab === 'details' && (
            <div className="space-y-4 animate-fade-in">
              {/* Detailed Booking Metadata Card */}
              <div className="bg-white rounded-2xl p-4 shadow-xs border border-[#E8DCCF]">
                <h3 className="font-heading font-bold text-base text-[#3A1E22] mb-3">
                  Devotee & Booking Details
                </h3>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-gray-400 font-semibold uppercase text-[10px]">Devotee Name</span>
                    <p className="font-bold text-[#3A1E22] text-sm mt-0.5">{booking.devoteeName}</p>
                  </div>
                  <div>
                    <span className="text-gray-400 font-semibold uppercase text-[10px]">Phone (WhatsApp)</span>
                    <p className="font-bold text-[#3A1E22] mt-0.5">{booking.phone}</p>
                  </div>
                  <div>
                    <span className="text-gray-400 font-semibold uppercase text-[10px]">Puja Ceremony</span>
                    <p className="font-medium text-[#3A1E22] mt-0.5">{booking.pujaName}</p>
                  </div>
                  <div>
                    <span className="text-gray-400 font-semibold uppercase text-[10px]">Sacred Temple</span>
                    <p className="font-medium text-[#3A1E22] mt-0.5">{booking.temple}</p>
                  </div>
                  <div>
                    <span className="text-gray-400 font-semibold uppercase text-[10px]">Scheduled Date</span>
                    <p className="font-medium text-[#3A1E22] mt-0.5">{formatDate(booking.pujaDate)}</p>
                  </div>
                  <div>
                    <span className="text-gray-400 font-semibold uppercase text-[10px]">Dakshina Amount</span>
                    <p className="font-bold text-[#C0502A] text-sm mt-0.5">{formatAmount(booking.amount)}</p>
                  </div>
                  <div>
                    <span className="text-gray-400 font-semibold uppercase text-[10px]">Puja Started At</span>
                    <p className="font-medium text-[#3A1E22] mt-0.5">
                      {notifByStatus['Puja Started'] ? formatFullDateTime(notifByStatus['Puja Started'].sentAt) : 'Pending'}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-400 font-semibold uppercase text-[10px]">Video Delivered At</span>
                    <p className="font-medium text-[#3A1E22] mt-0.5">
                      {notifByStatus['Video Available'] ? formatFullDateTime(notifByStatus['Video Available'].sentAt) : 'Pending'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Vertical Detailed Timeline with Explicit Dates */}
              <div className="bg-white rounded-2xl p-4 shadow-xs border border-[#E8DCCF]">
                <h3 className="font-heading font-bold text-base text-[#3A1E22] mb-3">
                  Puja Workflow Timeline Stages
                </h3>

                <div className="relative pl-2 space-y-4">
                  {STATUS_FLOW.map((step, idx) => {
                    const isCompleted = idx < currentIdx;
                    const isCurrent = idx === currentIdx;
                    const milestoneNotif = notifByStatus[step];

                    return (
                      <div key={step} className="flex gap-3 items-start">
                        <div className="flex flex-col items-center">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 ${
                              isCompleted
                                ? 'bg-green-600 border-green-600 text-white'
                                : isCurrent
                                ? 'bg-[#C0502A] border-[#C0502A] text-white shadow-xs'
                                : 'bg-gray-100 border-gray-300 text-gray-400'
                            }`}
                          >
                            {isCompleted ? '✓' : STEP_ICONS[idx]}
                          </div>
                          {idx < STATUS_FLOW.length - 1 && (
                            <div
                              className={`w-0.5 h-6 mt-1 ${
                                isCompleted ? 'bg-green-500' : 'bg-gray-200'
                              }`}
                            ></div>
                          )}
                        </div>

                        <div className="pt-1 flex-1">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <p
                                className={`text-xs font-bold ${
                                  isCurrent
                                    ? 'text-[#C0502A]'
                                    : isCompleted
                                    ? 'text-[#3A1E22]'
                                    : 'text-gray-400'
                                }`}
                              >
                                {step}
                              </p>
                              {isCurrent && (
                                <span className="bg-[#C0502A]/10 text-[#C0502A] text-[9px] font-bold px-1.5 py-0.2 rounded-full uppercase">
                                  Current
                                </span>
                              )}
                            </div>
                            {/* Explicit Milestone Timestamp */}
                            {milestoneNotif?.sentAt ? (
                              <span className="text-[10px] text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-semibold">
                                ✓ {formatFullDateTime(milestoneNotif.sentAt)}
                              </span>
                            ) : (
                              <span className="text-[10px] text-gray-400 bg-gray-50 border border-gray-200 px-2 py-0.5 rounded-full">
                                Pending
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-gray-500 mt-1">
                            {idx === 0 && 'Booking placed & verified with devotee.'}
                            {idx === 1 && 'Panditji began rituals and sankalp at the sacred altar.'}
                            {idx === 2 && 'Puja concluded with aarti, chants, and divine blessings.'}
                            {idx === 3 && 'Recording rendered & private video link delivered.'}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
