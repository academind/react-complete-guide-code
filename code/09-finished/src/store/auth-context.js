import React, { useState, useEffect, useCallback } from "react";

let logoutTimer;
let refreshTimer;

const AuthContext = React.createContext({
  user: {},
  token: "",
  isLoggedIn: false,
  login: (token) => {},
  logout: () => {},
});

const calculateRemainingTime = (expirationTime) => {
  const currentTime = new Date().getTime();
  const adjExpirationTime = new Date(expirationTime).getTime();

  const remainingDuration = adjExpirationTime - currentTime;

  return remainingDuration;
};

const retrieveStoredToken = () => {
  const storedToken = localStorage.getItem("token");
  const storedExpirationDate = localStorage.getItem("expirationTime");
  const storedRefreshToken = localStorage.getItem("refreshToken");

  const remainingTime = calculateRemainingTime(storedExpirationDate);

  if (remainingTime <= 3600) {
    localStorage.removeItem("token");
    localStorage.removeItem("expirationTime");
    return null;
  }

  return {
    refreshToken: storedRefreshToken,
    token: storedToken,
    duration: remainingTime,
  };
};

export const AuthContextProvider = (props) => {
  const tokenData = retrieveStoredToken();

  let initialToken;
  let initialRefreshToken;
  if (tokenData) {
    initialToken = tokenData.token;
    initialRefreshToken = tokenData.refreshToken;
  }

  const [token, setToken] = useState(initialToken);
  const [refreshToken, setRefreshToken] = useState(initialRefreshToken);
  const [user, setUser] = useState({});

  let userIsLoggedIn = !!token;

  const getNewToken = async (refreshToken, remainingTime) => {
    console.log('Firing getNewToken');
    const response = await fetch("http://localhost:3000/api/v1/users/refreshToken", {
      method: "POST",
      body: JSON.stringify({
        refreshToken,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const newToken = await response.json();
    //console.log('New token is',newToken);
    setToken(newToken.token);

    const expirationTime = new Date(
      new Date().getTime() + +newToken.expiresIn * 1000
    ).toISOString();

    localStorage.setItem("token",newToken.token);
    localStorage.setItem("expirationTime", expirationTime);
    refreshTimer = setTimeout(
      getNewToken,
      remainingTime - 30 * 1000,refreshToken, remainingTime
    );
  };

  const logoutHandler = useCallback(() => {
    setToken(null);
    setUser({});
    localStorage.removeItem("token");
    localStorage.removeItem("expirationTime");
    localStorage.removeItem("username");
    localStorage.removeItem("refreshToken");

    if (refreshTimer) {
      clearTimeout(refreshTimer);
    }
  }, []);

  const loginHandler = (user, token, refreshToken, expirationTime) => {
    setRefreshToken(refreshToken);
    setToken(token);
    setUser(user);
    localStorage.setItem("username", user.name);
    localStorage.setItem("token", token);
    localStorage.setItem("expirationTime", expirationTime);
    localStorage.setItem("refreshToken", refreshToken);

    const remainingTime = calculateRemainingTime(expirationTime);
    console.log('Remaining time is ',remainingTime);

    refreshTimer = setTimeout(
      getNewToken,
      remainingTime,refreshToken, remainingTime
    );
  };

  // useEffect(() => {
  //   if (tokenData) {
  //     console.log(tokenData.duration);
  //     logoutTimer = setTimeout(logoutHandler, tokenData.duration);
  //   }
  // }, [tokenData, logoutHandler]);

  const contextValue = {
    user: user,
    token: token,
    refreshToken,
    isLoggedIn: userIsLoggedIn,
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
