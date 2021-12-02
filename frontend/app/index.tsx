import React from 'react';
import ReactDOM from 'react-dom';

const a = (): any => {
  console.log('TURE');
};

const root = document.getElementById('app');

a();

ReactDOM.render(<h1>Hi</h1>, root);
