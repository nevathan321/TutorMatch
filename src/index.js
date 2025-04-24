/**
 * Group Members: Nevathan, Liyu, Adrian, Abishan
 * Date: April 20, 2025
 *
 * Description:
 * This is the main entry point for the React application. It sets up the root rendering
 * and wraps the entire app in the GoogleOAuthProvider to support Google Login
 * functionality across components. It also optionally supports performance monitoring
 * through reportWebVitals.
 */

import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="561033227060-d1tf4quo0eihp5mochgi1nnuanc1kik6.apps.googleusercontent.com">
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
