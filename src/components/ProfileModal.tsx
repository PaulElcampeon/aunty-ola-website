import { Key, CreditCard, XCircle } from 'lucide-react';

interface ProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    onChangePassword: () => void;
    onSetupSubscription: () => void;
    onCancelSubscription: () => void;
}

export default function ProfileModal({
    isOpen,
    onClose,
    onChangePassword,
    onSetupSubscription,
    onCancelSubscription
}: ProfileModalProps) {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 w-[90%] sm:w-full max-w-md relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-nigerian-gold-500 to-nigerian-purple-600"></div>
                <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 rounded-full">
                        <img
                            src="/images/logo.png"
                            alt="Aunty Savitri Logo"
                            className="w-14 h-14 rounded-full border-2 border-white/20"
                        />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 bg-gradient-to-r from-nigerian-gold-500 to-nigerian-purple-600 bg-clip-text text-transparent">
                        Profile Settings
                    </h2>
                </div>
                <div className="space-y-4">
                    <button
                        onClick={onChangePassword}
                        className="w-full flex items-center gap-3 px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-left"
                    >
                        <Key className="w-5 h-5 text-nigerian-purple-600" />
                        <span className="text-gray-700 font-medium">Change Password</span>
                    </button>
                    <button
                        onClick={onSetupSubscription}
                        className="w-full flex items-center gap-3 px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-left"
                    >
                        <CreditCard className="w-5 h-5 text-nigerian-purple-600" />
                        <span className="text-gray-700 font-medium">Setup Subscription</span>
                    </button>
                    <button
                        onClick={onCancelSubscription}
                        className="w-full flex items-center gap-3 px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-left"
                    >
                        <XCircle className="w-5 h-5 text-red-500" />
                        <span className="text-red-500 font-medium">Cancel Subscription</span>
                    </button>
                </div>
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