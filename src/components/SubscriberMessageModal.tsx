import React from 'react';
import { MessageCircle } from 'lucide-react';

interface SubscriberMessageModalProps {
    isOpen: boolean;
    onClose: () => void;
    onLoginClick: () => void;
}

export default function SubscriberMessageModal({ isOpen, onClose, onLoginClick }: SubscriberMessageModalProps) {
    if (!isOpen) return null;

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={handleBackdropClick}
        >
            <div className="bg-white rounded-2xl p-8 w-[90%] sm:w-full max-w-md relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-nigerian-gold-500 to-nigerian-purple-600"></div>
                <div className="flex items-center gap-4 mb-6">
                    <div className="bg-gradient-to-br from-nigerian-gold-500 to-nigerian-purple-600 p-1 rounded-full">
                        <img
                            src="/images/logo.png"
                            alt="Aunty Ola Logo"
                            className="w-12 h-12 rounded-full border-2 border-white/20"
                        />
                    </div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-nigerian-gold-500 to-nigerian-purple-600 bg-clip-text text-transparent">
                    Welcome!</h2>
                </div>
                <p className="text-gray-600 mb-6">
                    You should shortly receive a temporary password in your email. Use this password to log into your account for the first time using the email address you subscribed with.
                </p>
                <button
                    onClick={() => {
                        onClose();
                        onLoginClick();
                    }}
                    className="w-full bg-gradient-to-r from-nigerian-gold-500 to-nigerian-purple-600 text-white py-3 rounded-xl hover:opacity-90 transition-opacity font-medium shadow-lg"
                >
                    Go to Login
                </button>
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