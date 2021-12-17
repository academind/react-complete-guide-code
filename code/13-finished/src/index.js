import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';
import App from './App';
import { AuthContextProvider } from './store/auth-context';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AuthContextProvider>
    <App />
  </AuthContextProvider>
);
