import React, { useState } from 'react';
import Login from './Login';
import Register from './Register';

const LoginRegister = () => {
  const [isRegister, setIsRegister] = useState(false);

  const switchToRegister = () => setIsRegister(true);
  const switchToLogin = () => setIsRegister(false);

  return (
    <div className={`wrapper${isRegister ? ' active' : ''}`}>
      {isRegister ? (
        <Register switchToLogin={switchToLogin} />
      ) : (
        <Login switchToRegister={switchToRegister} />
      )}
    </div>
  );
};

export default LoginRegister;
