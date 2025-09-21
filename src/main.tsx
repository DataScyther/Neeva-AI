import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./utils/debug-env"; // Debug environment variables

createRoot(document.getElementById("root")!).render(<App />);