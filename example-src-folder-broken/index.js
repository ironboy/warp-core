// Basic React
import React from 'react';
import ReactDOM from 'react-dom';
import App from './app/app.js';
import registerServiceWorker from './registerServiceWorker';

// Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';

// Start up
ReactDOM.render(<App/>, document.getElementById('root'));
registerServiceWorker();
