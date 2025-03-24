import React, { useState, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import ChatInterface from './components/ChatInterface';
import Header from './components/Header';
import SubscriberMessageModal from './components/SubscriberMessageModal';
import CreateAccountModal from './components/CreateAccountModal';
import ChangePasswordModal from './components/ChangePasswordModal';
import ProfileModal from './components/ProfileModal';
import LoginModal from './components/LoginModal';
import PricingModal from './components/PricingModal';
import { saveToStorage, removeFromStorage } from './utils/Storage';

function App() {
  const [showSubscriberMessage, setShowSubscriberMessage] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showCreateAccountModal, setShowCreateAccountModal] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isPricingOpen, setIsPricingOpen] = useState(false);
  const [token, setToken] = useState<string>();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('subscriber-message')) {
      setShowSubscriberMessage(true);
      const newUrl = window.location.pathname + window.location.hash;
      window.history.replaceState({}, '', newUrl);
    }
    // Check if we're on the change password page
    if (window.location.pathname === '/change-password') {
      setShowChangePasswordModal(true);
      // Remove the path without refreshing
      window.history.replaceState({}, '', '/');
    }

    if (urlParams.has('token')) {
      const token = urlParams.get('token');
      console.log("Token", token)
      if (token) {
        saveToStorage('aunty_ola_token', token, false)
        setToken(token)
        setIsLoggedIn(true);
        window.history.replaceState({}, '', '/');
        return;
      }
    }

    if (token) {
      setIsLoggedIn(true);
    }

    // Check authentication status
    // checkAuthStatus();
  }, [token]);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('/api/v1/auth/status');
      setIsLoggedIn(response.status === 200);
    } catch (error) {
      setIsLoggedIn(false);
    }
  };

  const handleLoginClick = () => {
    setShowLoginModal(true);
    setShowCreateAccountModal(false);
  };

  const handlePricingClick = () => {
    setIsPricingOpen(true);
  };

  const handleCreateAccountClick = () => {
    setShowCreateAccountModal(true);
    setShowLoginModal(false);
  };

  const handleLogout = async () => {
    try {
      setIsLoggedIn(false);
      setShowProfileModal(false);
      setToken(undefined);
      removeFromStorage('aunty_ola_token', false)
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="min-h-screen gradient-background">
      <Toaster position="top-center" />
      <Header
        onLoginClick={handleLoginClick}
        // isLoginOpen={showLoginModal} 
        // onLoginClose={() => setShowLoginModal(false)}
        // onCreateAccountClick={handleCreateAccountClick}
        onPricingClick={handlePricingClick}
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
        onProfileClick={() => setShowProfileModal(true)}
      />
      <div className="flex items-center justify-center min-h-screen">
        <ChatInterface />
      </div>
      <SubscriberMessageModal
        isOpen={showSubscriberMessage}
        onClose={() => setShowSubscriberMessage(false)}
        onLoginClick={handleLoginClick}
      />
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onCreateAccountClick={handleCreateAccountClick}
        setToken={setToken}
      />
      <PricingModal isOpen={isPricingOpen} onClose={() => setIsPricingOpen(false)} />
      <CreateAccountModal
        isOpen={showCreateAccountModal}
        onClose={() => setShowCreateAccountModal(false)}
        onLoginClick={handleLoginClick}
      />
      <ChangePasswordModal
        isOpen={showChangePasswordModal}
        onClose={() => {
          setShowProfileModal(true);
          setShowChangePasswordModal(false);
        }}
      />
      <ProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        onChangePassword={() => {
          setShowProfileModal(false);
          setShowChangePasswordModal(true);
        }}
        onSetupSubscription={() => {
          setShowProfileModal(false);
          // Add your subscription setup logic here
        }}
        onCancelSubscription={async () => {
          try {
            await fetch('/api/v1/subscription/cancel', { method: 'POST' });
            toast.success('Subscription cancelled successfully');
          } catch (error) {
            toast.error('Failed to cancel subscription');
          }
        }}
      />
    </div>
  );
}

// const urlParams = new URLSearchParams(window.location.search);
// const token = urlParams.get('token');
// console.log("Token", token)
// if (token) {
//   localStorage.setItem('auth_token', token);
//   setToken(token)
// }

export default App;