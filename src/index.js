import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
//import App from './App';
import registerServiceWorker from './registerServiceWorker';

import Container from "./Container";

// ReactDOM.render(<App />, document.getElementById('react'));
ReactDOM.render(<Container />, document.getElementById('react'));
registerServiceWorker();
