import { LogOut, User } from 'lucide-react';

interface HeaderProps {
  onLoginClick: () => void;
  onPricingClick: () => void;
  isLoggedIn: boolean;
  onLogout: () => void;
  onProfileClick: () => void;
}

export default function Header({ 
  onLoginClick, 
  onPricingClick,
  isLoggedIn,
  onLogout,
  onProfileClick
}: HeaderProps) {
  return (
    <>
      <header className="fixed w-full backdrop-blur-sm text-white p-4 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src="/images/logo.png"
              alt="Aunty Savitri Logo"
              className="hidden sm:block w-16 h-16 rounded-full border-2 border-white/20"
            />
          </div>
          <div className="flex gap-4">
            <button
              onClick={onPricingClick}
              className="px-4 py-2 bg-white/5 text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              Pricing
            </button>
            {isLoggedIn ? (
              <>
                <button
                  onClick={onProfileClick}
                  className="px-4 py-2 bg-white/5 text-white hover:bg-white/10 rounded-lg transition-colors flex items-center gap-2"
                >
                  <User className="w-5 h-5" />
                  Profile
                </button>
                <button
                  onClick={onLogout}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
                >
                  <LogOut className="w-5 h-5" />
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={onLoginClick}
                className="px-4 py-2 bg-nigerian-gold-500 text-white rounded-lg hover:bg-nigerian-gold-600 transition-colors"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </header>
    </>
  );
}