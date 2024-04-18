import React from 'react';
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route, Switch } from 'react-router-dom';
import reportWebVitals from './reportWebVitals';

import Product from './Product'
import FetchHorses from './FetchHorses';
import BlockBreaker from './block-breaker/BlockBreaker';
import Chatbox from './chat-app/chat-window/ChatBox'

import './style.css';


// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//   <React.StrictMode>
//     <Product title = "This is my title"/>
//   </React.StrictMode>
// );


createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Product />} />
        <Route path="/horses" element={<FetchHorses />} />
        <Route path="/game" element={<BlockBreaker />} />
        <Route path="/message" element={<Chatbox />} />
      </Routes>
    </Router>
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
