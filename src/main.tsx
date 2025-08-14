
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from "react-helmet-async"
import App from './App.tsx'
import './index.css'

console.log("main.tsx loading...");

try {
  console.log("About to render app...");
  const rootElement = document.getElementById("root");
  console.log("Root element found:", rootElement);
  
  createRoot(rootElement!).render(
    <HelmetProvider>
      <App />
    </HelmetProvider>
  );
  console.log("App rendered successfully");
} catch (error) {
  console.error("Error rendering app:", error);
  document.body.innerHTML = '<div style="padding: 20px; color: red;">Error loading app: ' + error + '</div>';
}
