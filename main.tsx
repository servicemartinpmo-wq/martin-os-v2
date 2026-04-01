import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);
import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

console.log("main.tsx: rendering App");
const root = document.getElementById('root');
console.log("main.tsx: root element", root);
createRoot(root!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
