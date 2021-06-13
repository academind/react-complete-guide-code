import React from "react";
/*[ContextAPI]Step#1*/
/* create a context [like a state] */

/*
  IMPORTANT NOTE: JUMP TO STEP#7 TO GET THE FINAL APPROACH
*/

const AuthContext = React.createContext({
  isLoggedIn: false,
});

export default AuthContext;
