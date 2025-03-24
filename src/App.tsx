import React, { useState, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import ChatInterface from './components/ChatInterface';
import Header from './components/Header';
import SubscriberMessageModal from './components/SubscriberMessageModal';
import CreateAccountModal from './components/CreateAccountModal';
import ChangePasswordModal from './components/ChangePasswordModal';
import ProfileModal from './components/ProfileModal';

function App() {
  const [showSubscriberMessage, setShowSubscriberMessage] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showCreateAccountModal, setShowCreateAccountModal] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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

            // Check authentication status
    // checkAuthStatus();
  }, []);

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

  const handleCreateAccountClick = () => {
    setShowCreateAccountModal(true);
    setShowLoginModal(false);
  };

  const handleLogout = async () => {
    try {
      // await fetch('/api/v1/auth/logout', { method: 'POST' });
      setIsLoggedIn(false);
      setShowProfileModal(false);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="min-h-screen gradient-background">
      <Toaster position="top-center" />
      <Header 
        onLoginClick={handleLoginClick} 
        isLoginOpen={showLoginModal} 
        onLoginClose={() => setShowLoginModal(false)}
        onCreateAccountClick={handleCreateAccountClick}
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

const urlParams = new URLSearchParams(window.location.search);
const token = urlParams.get('token');
console.log("Token", token)
if (token) {
  localStorage.setItem('auth_token', token);
}

export default App;