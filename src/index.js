import React from 'react';
import ReactDOM from 'react-dom';
import appReady from './App';
import './index.css';

appReady((App) => {
  ReactDOM.render(<App />, document.getElementById('root'));
});
