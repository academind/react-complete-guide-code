import React from "react";
import ReactDOM from "react-dom";

import "./index.css";
import App from "./App";
import { AuthContextProvider } from "./store/auth-context";

ReactDOM.render(
  /*[ContextAPI]Step#8*/
  /* Wrap the hole app with the custom component */
  <AuthContextProvider>
    <App />
  </AuthContextProvider>,
  document.getElementById("root")
);
