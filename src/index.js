import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// CRITICAL: FORCE AUTHENTICATION CHECK AT ROOT LEVEL
const ForceAuthenticationCheck = () => {
  // Check if we have ANY authentication tokens or session
  const hasAuthToken = localStorage.getItem('invoiceApp_isAuthenticated');
  const hasUserData = localStorage.getItem('invoiceApp_user');
  
  console.log('🚨 ROOT LEVEL AUTH CHECK:', {
    hasAuthToken,
    hasUserData,
    location: window.location.href
  });
  
  // FORCE LOGIN PAGE ALWAYS - PERIOD
  console.log('🚨 FORCING LOGIN PAGE - NO EXCEPTIONS');
  
  return <App />;
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ForceAuthenticationCheck />
  </React.StrictMode>
); 