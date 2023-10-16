import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import ThemeProvider from "./context/ThemeProvider.jsx";
import NotificationProvider from "./context/NotificationProvider.jsx";
import AuthProvider from "./context/AuthProvider.jsx";
import { BrowserRouter as Router } from "react-router-dom";
import SearchProvider from "./context/SearchProvider.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Router>
      <NotificationProvider>
        <SearchProvider>
          <AuthProvider>
            <ThemeProvider>
              <App />
            </ThemeProvider>
          </AuthProvider>
        </SearchProvider>
      </NotificationProvider>
    </Router>
  </React.StrictMode>,
);
