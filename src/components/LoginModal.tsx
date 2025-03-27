import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { saveToStorage } from '../utils/Storage';
interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateAccountClick: () => void;
  setToken: (token: string) => void;
}

export default function LoginModal({ isOpen, onClose, onCreateAccountClick, setToken }: LoginModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  if (!isOpen) return null;

  const handleGoogleLogin = () => {
    window.location.href = '/oauth2/authorization/google';
  };

  const handleLogin = async () => {
    try {
      const response = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password
        })
      });

      if (!response.ok) {
        toast.error('Failed to login');
      } else {
        const data = await response.json();
        toast.success('Login success');
  
        saveToStorage('aunty_ola_token', data.token, false)
        setToken(data.token)
        onClose();
      }
    } catch (err) {

    } finally {
    
    }
  }

  const switchToCreateAccount = () => {
    onClose();
    onCreateAccountClick();
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 w-[90%] sm:w-full max-w-md relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-nigerian-gold-500 to-nigerian-purple-600"></div>
        <div className="flex items-center gap-4 mb-8">
          <div className="p-2 rounded-full">
            <img
              src="/images/logo.png"
              alt="Aunty Ola Logo"
              className="w-14 h-14 rounded-full border-2 border-white/20"
            />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 bg-gradient-to-r from-nigerian-gold-500 to-nigerian-purple-600 bg-clip-text text-transparent">
            Welcome Back
          </h2>
        </div>
        <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-nigerian-purple-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-nigerian-purple-500 focus:border-transparent pr-12"
                placeholder="Enter your password"
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
          <button
           onClick={handleLogin}
            type="submit"
            className="w-full bg-gradient-to-r from-nigerian-gold-500 to-nigerian-purple-600 text-white py-3 rounded-xl hover:opacity-90 transition-opacity font-medium shadow-lg"
          >
            Sign In
          </button>

          <div className="text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={switchToCreateAccount}
              className="text-nigerian-purple-600 hover:text-nigerian-purple-700 font-medium"
            >
              Create Account
            </button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <img
              src="https://www.google.com/favicon.ico"
              alt="Google"
              className="w-5 h-5"
            />
            <span className="text-gray-700 font-medium">Sign in with Google</span>
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