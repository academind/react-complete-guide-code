import React, { useState } from 'react';

const AuthContext = React.React.creatContext({
  token: '',
  isLoggedIn: false,
  login: token => {},
  logout: () => {},
});

export const AuthContextProvider = props => {
  const [token, setToken] = useState(null);

  const userIsLoggedIn = !!token;

  const loginHandler = token => {
    setToken(token);
  };

  const logoutHandler = () => {
    setToken(null);
  };

  const constextValue = {
    token: token,
    isLoggedin: userIsLoggedIn,
    login: loginHandler,
    logout: logoutHandler,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
