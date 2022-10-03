import React from 'react';
import ReactDOM from 'react-dom/client';
import Game from './GameReact';

const root = ReactDOM.createRoot(document.getElementById('canvasReact'))
root.render(
  <React.StrictMode>
    <Game />
  </React.StrictMode>
);