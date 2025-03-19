import React, { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import LoginModal from './LoginModal';
import PricingModal from './PricingModal';

export default function Header() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isPricingOpen, setIsPricingOpen] = useState(false);

  return (
    <>
      <header className="fixed w-full backdrop-blur-sm text-white p-4 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
          <img 
              src="/images/logo.png" 
              alt="Aunty Ola Logo" 
              className="w-16 h-16 rounded-full border-2 border-white/20"
            />
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => setIsPricingOpen(true)}
              className="px-4 py-2 bg-white/5 text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              Pricing
            </button>
            <button
              onClick={() => setIsLoginOpen(true)}
              className="px-4 py-2 bg-nigerian-gold-500 text-white rounded-lg hover:bg-nigerian-gold-600 transition-colors"
            >
              Login
            </button>
          </div>
        </div>
      </header>

      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
      <PricingModal isOpen={isPricingOpen} onClose={() => setIsPricingOpen(false)} />
    </>
  );
}