window.global = window;
import { Buffer } from "buffer";
window.Buffer = Buffer;
import process from "process";
window.process = process;

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);