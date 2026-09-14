import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import { SwipeNavigationProvider } from "./context/SwipeNavigationContext";

import App from "./app/App";

import "./index.css";

import "@fontsource/vazirmatn/300.css";
import "@fontsource/vazirmatn/400.css";
import "@fontsource/vazirmatn/500.css";
import "@fontsource/vazirmatn/600.css";
import "@fontsource/vazirmatn/700.css";
import "@fontsource/vazirmatn/800.css";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("المان ریشه با شناسه root پیدا نشد.");
}

createRoot(rootElement).render(
  <AuthProvider>
    <BrowserRouter>
      <SwipeNavigationProvider>
        <App />
      </SwipeNavigationProvider>
    </BrowserRouter>
  </AuthProvider>,
);