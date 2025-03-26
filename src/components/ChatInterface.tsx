import React, { useState, useEffect } from 'react';
import { Keyboard, Mic } from 'lucide-react';
import KeyboardModal from './KeyboardModal';
import { getFromStorage } from '../utils/Storage';
import toast from 'react-hot-toast';


const greetingMessages = [
  '😂😂 Ah my pikin, come here jare! \n\nGood morning o! How you dey? You don chop? Abi you wan faint like mosquito wey drink sniper? Come make I give you small food before breeze blow you comot for here. \n\n🤣🤣 You know say this life no balance — but as long as you dey my side, na enjoyment remain!',
  'How you dey na? You don baff? Abi you still dey waka upandan with last night smell? Come make I check ya head small, make sure say no village people dey follow you! 😂😂\n\nI swear, na you remain for this life — make dem no stress you oh! If anybody near you today, just tell dem say "my Aunty don give me confidence, I no get time for wahala!',
  '😂😂 Ehen! My pikin! You don chop? Abi you wan faint like mosquito wey miss blood?\n\nCome make I see you well — no let hunger disgrace our lineage today oh! 😄',
  '😂😂 Ah my pikin, come here jare! \n\nGood morning o! How you dey? You don chop? Abi you wan faint like mosquito wey drink sniper? Come make I give you small food before breeze blow you comot for here. \n\n🤣🤣 You know say this life no balance — but as long as you dey my side, na enjoyment remain!',
  'Heii! My pikin, see as you fine like person wey dem dash data! 😄 You sure say na this morning you wake up? Or you still dey dream?\n\nAbeg come greet your Aunty before I call village people for you oh! 😂',
  'Omo mi! You dey waka like person wey landlord pursue for night 😂😂\n\nCome siddon jare, make I give you gist — this life no hard if you dey follow Aunty waka!',
  '😂 See my pikin oh! You don dey shine teeth like who win awoof!\n\nAbeg come chop before breeze carry you — hunger no go use you rehearse for Nollywood today!'
]

export default function ChatInterface() {
  const [isKeyboardModalOpen, setIsKeyboardModalOpen] = useState(false);
  const [response, setResponse] = useState('');
  const [isWaiting, setIsWaiting] = useState(false);
  const [error, setError] = useState('');


  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * greetingMessages.length);
    setResponse(greetingMessages[randomIndex])
  }, []);

  const handleSendMessage = async (message: string) => {
    setError('');

    if (!message.trim()) {
      setError('Please enter a question');
      return;
    }

    setIsWaiting(true);
    setResponse('Thinking...');
    setIsKeyboardModalOpen(false);
    const token = getFromStorage('aunty_ola_token');

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

      const data = await response.json();

      if (response.ok) {
        setResponse(data.response || 'No response received');
      }

      if (response.status === 403) {
        // data.message
        toast.error("You no longer have any more free requests, subscribe to get full access");
        setResponse('Come on go and subscribe now...');
      }

      if (response.status === 401) {
        toast.error("Create an account to get 2 free requests");
        setResponse('Come on go and subscribe now...');
      }
    } catch (err) {
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