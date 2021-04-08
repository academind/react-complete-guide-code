import React, { useContext } from 'react';

import Card from './UI/Card';
import { AuthContext } from '../context/auth-context';
import './Auth.css';

const Auth = props => {
  const authContext = useContext(AuthContext);

  const loginHandler = () => {
    authContext.login();
  };

  return (
    <div className="auth">
      <Card>
        <h2>You are not authenticated!</h2>
        <p>Please log in to continue.</p>
        <button onClick={loginHandler}>Log In</button>
      </Card>
    </div>
  );
};

export default Auth;
