import React from 'react';
import ChatInterface from './components/ChatInterface';
import Header from './components/Header';

function App() {
  return (
    <div className="min-h-screen gradient-background">
      <Header />
      <div className="flex items-center justify-center min-h-screen">
        <ChatInterface />
      </div>
    </div>
  );
}

export default App;