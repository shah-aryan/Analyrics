// src/pages/NotFound.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate('/');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-base-100 text-white text-center p-4">
      <p className="text-xl mb-2">"Is this the real life? Is this just fantasy?</p>
      <p className="text-xl mb-8">Caught in a 404, no escape from reality."</p>
      <button 
        onClick={handleGoBack} 
        className="bg-accent text-white py-2 px-4 rounded hover:bg-accent-dark">
        Take Me Back Home
      </button>
    </div>
  );
};

export default NotFound;
