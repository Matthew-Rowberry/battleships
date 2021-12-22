import React from 'react';
import ReactDOM from 'react-dom';
import App from './app/';
import GlobalProvider from './context/globalProvider';

const root = document.getElementById('app');

ReactDOM.render(
  <GlobalProvider>
    <App />
  </GlobalProvider>,
  root
);
