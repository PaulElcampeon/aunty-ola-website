import React from 'react';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const plans = [
  {
    name: 'Monthly',
    price: '£5',
    period: 'month',
    features: ['Unlimited conversations', 'Priority support', 'Access to all features'],
    url:"https://buy.stripe.com/test_bIYeVk6kbb0FgiQcNu"
  },
  {
    name: '3 Months',
    price: '£13',
    period: '3 months',
    features: ['Save £1 per month', 'Unlimited conversations', 'Priority support', 'Access to all features'],
    recommended: true,
    url: "https://buy.stripe.com/test_28o4gGdMD7Ot2s000J"
  },
  {
    name: '6 Months',
    price: '£25',
    period: '6 months',
    features: ['Unlimited conversations', 'Priority support', 'Access to all features'],
    url: "https://buy.stripe.com/test_eVa5kKeQH5Gl7MkeVF"
  },
];

export default function PricingModal({ isOpen, onClose }: PricingModalProps) {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl p-4 sm:p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 text-center">Choose Your Plan</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative p-4 sm:p-6 rounded-xl border-2 ${
                plan.recommended
                  ? 'border-nigerian-purple-500 bg-nigerian-purple-50'
                  : 'border-gray-200'
              }`}
            >
              {plan.recommended && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-nigerian-purple-500 text-white px-3 py-1 rounded-full text-xs sm:text-sm">
                  Recommended
                </span>
              )}
              <h3 className="text-lg sm:text-xl font-semibold mb-2">{plan.name}</h3>
              <div className="mb-3 sm:mb-4">
                <span className="text-2xl sm:text-3xl font-bold">{plan.price}</span>
                <span className="text-gray-500 text-sm sm:text-base">/{plan.period}</span>
              </div>
              <ul className="space-y-2 mb-4 sm:mb-6 text-sm sm:text-base">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <span className="text-nigerian-purple-500 flex-shrink-0">✓</span>
                    <span className="break-words">{feature}</span>
                  </li>
                ))}
              </ul>
              <button className="w-full bg-nigerian-purple-600 text-white py-2 rounded-lg hover:bg-nigerian-purple-700 transition-colors text-sm sm:text-base"
              onClick={() => window.location.href = plan.url}>
                Select Plan
              </button>
            </div>
          ))}
        </div>
        <button
          onClick={onClose}
          className="absolute top-2 right-2 sm:top-4 sm:right-4 text-gray-500 hover:text-gray-700 p-2"
        >
          ✕
        </button>
      </div>
    </div>
  );
}