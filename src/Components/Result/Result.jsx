import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Result.css';

const Result = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get the score passed via navigation state, fallback to 0
  const score = location.state?.score ?? 0;

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="result-container">
      <h1>Your Score: {score}</h1>
      <button onClick={handleGoHome}>Go Back to HomePage</button>
    </div>
  );
};

export default Result;
