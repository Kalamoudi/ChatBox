import React from 'react';
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route, Switch } from 'react-router-dom';
import reportWebVitals from './reportWebVitals';

import Product from './Product'
import FetchHorses from './FetchHorses';
import BlockBreaker from './block-breaker/BlockBreaker';
import ChatWindow from './chat-app/chat-window/ChatWindow'
import ChatSignIn from './chat-app/chat-window/ChatSignIn';
import ChatSignUp from './chat-app/chat-window/ChatSignUp';
import AudioRecorder from './chat-app/chat-recorder-test/AudioRecorder';

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
        <Route path="/dots" element={<Product />} />
        <Route path="/horses" element={<FetchHorses />} />
        <Route path="/game" element={<BlockBreaker />} />
        <Route path="/" element={<ChatWindow />} />
        <Route path="/chatapp/login" element={<ChatSignIn />} />
        <Route path="/chatapp/register" element={<ChatSignUp />} />
        <Route path="/chatapp/recorder" element={<AudioRecorder />} />
      </Routes>
    </Router>
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
