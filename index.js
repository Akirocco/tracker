// index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/App.css';
import './styles/Navbar.css';
import './styles/Dashboard.css';
import './styles/DailyView.css';
import './styles/WeeklyView.css';
import './styles/MonthlyView.css';
import './styles/GlobalView.css';
import './styles/Settings.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
