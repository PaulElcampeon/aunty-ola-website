import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { getFromStorage } from '../utils/Storage';

interface ChangePasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ChangePasswordModal({ isOpen, onClose }: ChangePasswordModalProps) {
    const [oldPassword, setOldPassword] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        const token = getFromStorage('aunty_savitri_token');

        try {
            const response = await fetch('/api/v1/users/change-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                     oldPassowrd: oldPassword,
                     newPassword: password
                    }),
            });

            if (response.status === 200) {
                toast.success('Password changed successfully');
                onClose();
            } else if (response.status === 400) {
                const data = await response.json();
                toast.error(data.message);
            } else {
                throw new Error('Failed to change password');
            }
        } catch (error) {
            toast.error('Failed to change password');
        }
    };

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
                            className="w-12 h-12 rounded-full border-2 border-white/20"
                        />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 bg-gradient-to-r from-nigerian-gold-500 to-nigerian-purple-600 bg-clip-text text-transparent">
                        Change Password
                    </h2>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                        <label htmlFor="oldPassword" className="block text-sm font-medium text-gray-700 mb-1">
                            Old Password
                        </label>
                        <div className="relative">
                            <input
                                type={showOldPassword ? "text" : "password"}
                                id="oldPassword"
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-nigerian-purple-500 focus:border-transparent pr-12"
                                placeholder="Enter old password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowOldPassword(!showOldPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            >
                                {showOldPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                            New Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="newPassword"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-nigerian-purple-500 focus:border-transparent pr-12"
                                placeholder="Enter new password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="confirmNewPassword" className="block text-sm font-medium text-gray-700 mb-1">
                            Confirm New Password
                        </label>
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                id="confirmNewPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-nigerian-purple-500 focus:border-transparent pr-12"
                                placeholder="Confirm new password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            >
                                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                        {error && (
                            <p className="mt-2 text-sm text-red-600">{error}</p>
                        )}
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-nigerian-gold-500 to-nigerian-purple-600 text-white py-3 rounded-xl hover:opacity-90 transition-opacity font-medium shadow-lg"
                    >
                        Change Password
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