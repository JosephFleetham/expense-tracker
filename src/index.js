import React from 'react';
import ReactDOM from 'react-dom';
import { render } from 'react-dom';
import './index.css';
import App from './components/App.js';
import { Router, Route, IndexRoute, BrowserRouter} from 'react-router-dom'
import * as serviceWorker from './serviceWorker';
import NewItem from './components/NewItem.js';



render((
  <BrowserRouter>
    <App />
  </BrowserRouter>
), document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
