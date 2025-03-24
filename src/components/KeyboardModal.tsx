import React, { useState } from 'react';
interface KeyboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSend: (message: string) => void;
}

export default function KeyboardModal({ isOpen, onClose, onSend }: KeyboardModalProps) {
  const [input, setInput] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!input.trim()) {
      setError('Please enter a question');
      return;
    }

    onSend(input);
    setInput('');
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-2"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl p-4 w-[95%] sm:w-full max-w-md nigerian-pattern relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-nigerian-gold-500 to-nigerian-purple-600"></div>
        <div className="flex items-center gap-4 mb-8">
          <div className="p-2 rounded-full">
            <img
              src="/images/logo.png"
              alt="Aunty Ola Logo"
              className="w-14 h-14 rounded-full border-2 border-white/20"
            />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 bg-gradient-to-r from-nigerian-gold-500 to-nigerian-purple-600 bg-clip-text text-transparent">Ask Your Question</h2>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <textarea
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                setError('');
              }}
              placeholder="Type your question here..."
              className={`w-full min-h-[200px] p-4 text-gray-700 border rounded-xl focus:ring-2 focus:ring-nigerian-purple-500 focus:border-transparent resize-none bg-white/50 backdrop-blur-sm ${error ? 'border-red-500' : 'border-gray-200'
                }`}
              maxLength={300}
            />
            <div className="absolute bottom-3 right-3 text-sm text-gray-400">
              {input.length}/300
            </div>
            {error && (
              <p className="mt-2 text-sm text-red-500">{error}</p>
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-nigerian-gold-500 to-nigerian-purple-600 text-white py-3 rounded-xl hover:opacity-90 transition-opacity font-medium shadow-lg flex items-center justify-center gap-2"
          >
            Send Message
          </button>
        </form>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>
    </div>
  );
}