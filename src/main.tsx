import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";

// Initialize theme from localStorage before render
const storedTheme = localStorage.getItem('bq-theme-store');
if (storedTheme) {
  try {
    const { state } = JSON.parse(storedTheme);
    if (state?.theme === 'dark') {
      document.documentElement.classList.add('dark');
    }
  } catch (e) {
    // Ignore parse errors
  }
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
