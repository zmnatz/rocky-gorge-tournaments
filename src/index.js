import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

import { HashRouter } from 'react-router-dom'
import registerServiceWorker from './registerServiceWorker';

const appComponent = <HashRouter> 
  <App />
</HashRouter>

ReactDOM.render(appComponent, document.getElementById('root'));
registerServiceWorker();
