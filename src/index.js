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
import { HelmetProvider } from "react-helmet-async";

const winloc = window.location;
const redirect = window.configData.redirectSigning;
if (redirect && !winloc.pathname.startsWith('/sign/')) {
    window.location.href = redirect + winloc.pathname + winloc.search;
} else {
    const store = configureStore();
    const app = (
        <HelmetProvider>
            <Provider store={store} >
                <App />
            </Provider>
        </HelmetProvider>
        );
    
    ReactDOM.render(app, document.getElementById('root'));
    
    // If you want your app to work offline and load faster, you can change
    // unregister() to register() below. Note this comes with some pitfalls.
    // Learn more about service workers: https://bit.ly/CRA-PWA
    serviceWorker.unregister();
}
