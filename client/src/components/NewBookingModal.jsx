import React, { useState } from 'react'
import { createBooking } from '../api'

const PUJAS = [
  'Rudrabhishek', 'Maha Mrityunjaya Jaap', 'Satyanarayan Katha',
  'Ganesh Abhishek', 'Navgraha Shanti Puja', 'Kaal Sarp Dosh Nivaran',
  'Lakshmi Puja', 'Sunderkand Path', 'Hanuman Chalisa Path', 'Baglamukhi Puja',
];

const TEMPLES = [
  'Kashi Vishwanath Varanasi', 'Mahakaleshwar Ujjain', 'Siddhivinayak Mumbai',
  'Tirupati Balaji Tirumala', 'Trimbakeshwar Nashik', 'Somnath Gujarat',
  'Jagannath Puri', 'Kedarnath Uttarakhand', 'Meenakshi Madurai', 'Dwarkadhish Dwarka',
];

export default function NewBookingModal({ onClose, onCreated }) {
  const [formData, setFormData] = useState({
    devoteeName: '', phone: '', pujaName: '', temple: '', pujaDate: '', amount: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { devoteeName, phone, pujaName, temple, pujaDate, amount } = formData;
    if (!devoteeName || !phone || !pujaName || !temple || !pujaDate || !amount) {
      setError('Please fill in all fields');
      return;
    }
    try {
      setLoading(true);
      await createBooking({ ...formData, amount: Number(amount) });
      onCreated();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputClass = 'w-full border border-cream rounded-xl px-4 py-2.5 bg-cream-light/50 text-sm text-dark-brown focus:outline-none focus:ring-2 focus:ring-rust/30 focus:border-rust transition';

  return (
    <div className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white rounded-card p-6 w-full max-w-lg shadow-2xl animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="font-heading font-bold text-xl text-dark-brown mb-5">Create New Booking 🙏</h2>

        {error && (
          <div className="bg-red-50 text-red-700 text-sm px-4 py-2.5 rounded-xl mb-4 border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-dark-brown/70 uppercase tracking-wide mb-1 block">Devotee Name</label>
            <input type="text" name="devoteeName" value={formData.devoteeName} onChange={handleChange} className={inputClass} placeholder="Enter devotee name" />
          </div>

          <div>
            <label className="text-xs font-semibold text-dark-brown/70 uppercase tracking-wide mb-1 block">Phone</label>
            <input type="text" name="phone" value={formData.phone} onChange={handleChange} className={inputClass} placeholder="+91 XXXXX XXXXX" />
          </div>

          <div>
            <label className="text-xs font-semibold text-dark-brown/70 uppercase tracking-wide mb-1 block">Puja Name</label>
            <select name="pujaName" value={formData.pujaName} onChange={handleChange} className={inputClass}>
              <option value="">Select Puja...</option>
              {PUJAS.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-dark-brown/70 uppercase tracking-wide mb-1 block">Temple</label>
            <select name="temple" value={formData.temple} onChange={handleChange} className={inputClass}>
              <option value="">Select Temple...</option>
              {TEMPLES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-dark-brown/70 uppercase tracking-wide mb-1 block">Puja Date</label>
              <input type="date" name="pujaDate" value={formData.pujaDate} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className="text-xs font-semibold text-dark-brown/70 uppercase tracking-wide mb-1 block">Amount (₹)</label>
              <input type="number" name="amount" value={formData.amount} onChange={handleChange} className={inputClass} placeholder="e.g. 5100" />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="text-dark-brown/60 hover:text-dark-brown text-sm font-medium transition">
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-rust hover:bg-rust/90 text-white rounded-full px-6 py-2.5 font-semibold text-sm transition disabled:opacity-60 disabled:cursor-not-allowed active:scale-95"
            >
              {loading ? 'Creating...' : 'Create Booking 🙏'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
