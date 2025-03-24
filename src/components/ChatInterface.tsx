import React, { useState } from 'react';
import { Keyboard, Mic } from 'lucide-react';
import KeyboardModal from './KeyboardModal';
import { getFromStorage } from '../utils/Storage';

export default function ChatInterface() {
  const [isKeyboardModalOpen, setIsKeyboardModalOpen] = useState(false);
  const [response, setResponse] = useState('');
  const [isWaiting, setIsWaiting] = useState(false);
  const [error, setError] = useState('');

  const handleSendMessage = async (message: string) => {
    setError('');

    if (!message.trim()) {
      setError('Please enter a question');
      return;
    }

    setIsWaiting(true);
    setResponse('Thinking...');
    setIsKeyboardModalOpen(false);
    const token = getFromStorage('aunty_ola_token'); // Or sessionStorage.getItem('jwt') if you stored it there

    try {
      const response = await fetch('/api/v1/bot/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          question: message.trim()
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      setResponse(data.response || 'No response received');
    } catch (err) {
      setResponse('Sorry, I encountered an error while processing your request.');
      console.error('Error:', err);
    } finally {
      setIsWaiting(false);
    }
  };

  return (
    <div className="w-full max-w-lg p-2">
      <div className="bg-white rounded-3xl px-4 pt-6 pb-2 floating-card relative overflow-hidden">
        <div className="flex items-center gap-4 mb-6">
          <div className="bg-gradient-to-br from-nigerian-gold-500 to-nigerian-purple-600 p-1 rounded-full">
            <img
              src="/images/logo.png"
              alt="Aunty Ola Logo"
              className="w-12 h-12 rounded-full border-2 border-white/20"
            />
          </div>
          <div className="flex flex-col">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-nigerian-gold-500 to-nigerian-purple-600 bg-clip-text text-transparent">
              Ask Aunty Ola
            </h2>
            <p className="text-sm text-gray-500">Ask Aunty Ola for advice on everyday life</p>
          </div>
        </div>

        <div className="relative">
          <textarea
            value={response}
            disabled
            placeholder="Your response will appear here..."
            className="w-full min-h-[250px] p-4 pr-12 text-gray-700 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-nigerian-purple-500 focus:border-transparent resize-none disabled:bg-gray-50 disabled:text-gray-700"
          />
        </div>

        <div className="mt-2 flex items-center gap-2">
          <button
            onClick={() => !isWaiting && setIsKeyboardModalOpen(true)}
            disabled={isWaiting}
            className="p-3 rounded-xl hover:bg-gradient-to-r hover:from-nigerian-gold-500 hover:to-nigerian-purple-600 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed group bg-white border border-gray-200"
          >
            <Keyboard className="w-6 h-6 group-hover:text-white text-gray-600" />
          </button>
          <button
            className="p-3 rounded-xl hover:bg-gradient-to-r hover:from-nigerian-gold-500 hover:to-nigerian-purple-600 hover:text-white transition-all group bg-white border border-gray-200"
          >
            <Mic className="w-6 h-6 group-hover:text-white text-gray-600" />
          </button>
        </div>
      </div>

      <KeyboardModal
        isOpen={isKeyboardModalOpen}
        onClose={() => setIsKeyboardModalOpen(false)}
        onSend={handleSendMessage}
      />
    </div>
  );
}