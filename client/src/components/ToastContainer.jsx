import React from 'react'

export default function ToastContainer({ toasts, removeToast }) {
  if (!toasts.length) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 space-y-3">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`animate-fade-in bg-white rounded-xl shadow-lg p-4 flex items-center gap-3 min-w-[300px] max-w-md border-l-4 ${
            toast.type === 'success' ? 'border-green-500' : 'border-red-500'
          }`}
        >
          <span className="text-lg flex-shrink-0">
            {toast.type === 'success' ? '✅' : '❌'}
          </span>
          <p className="text-sm text-dark-brown flex-1">{toast.message}</p>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-gray-400 hover:text-gray-600 ml-auto text-lg transition flex-shrink-0"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
