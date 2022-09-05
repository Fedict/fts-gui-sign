import 'react-app-polyfill/ie9';
import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable'
import 'abortcontroller-polyfill/dist/polyfill-patch-fetch'
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import configureStore from './store/store';
import { Provider } from 'react-redux';
import 'bs-stepper/dist/css/bs-stepper.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const store = configureStore();
const app = (
    <Provider store={store} >
        <App />
    </Provider>);

ReactDOM.render(app, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
