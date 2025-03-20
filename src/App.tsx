import React, { useState, useEffect } from 'react';
import ChatInterface from './components/ChatInterface';
import Header from './components/Header';
import SubscriberMessageModal from './components/SubscriberMessageModal';

function App() {
  const [showSubscriberMessage, setShowSubscriberMessage] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('subscriber-message')) {
      setShowSubscriberMessage(true);
      const newUrl = window.location.pathname + window.location.hash;
      window.history.replaceState({}, '', newUrl);
    }
  }, []);

  const handleLoginClick = () => {
    setShowLoginModal(true);
  };

  return (
    <div className="min-h-screen gradient-background">
      <Header onLoginClick={handleLoginClick} isLoginOpen={showLoginModal} onLoginClose={() => setShowLoginModal(false)} />
      <div className="flex items-center justify-center min-h-screen">
        <ChatInterface />
      </div>
      <SubscriberMessageModal 
        isOpen={showSubscriberMessage}
        onClose={() => setShowSubscriberMessage(false)}
        onLoginClick={handleLoginClick}
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