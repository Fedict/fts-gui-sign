import 'react-app-polyfill/ie9';
import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable'
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import configureStore from './store/store';
import { Provider } from 'react-redux';
import { getBrowser, browser } from './modules/browserDetection/BrowserDetection';
import 'bs-stepper/dist/css/bs-stepper.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const store = configureStore();
const browsertype = getBrowser()
const app = (
    <Provider store={store} >
        {
            (browsertype && browsertype === browser.IE) ?
                <object
                    id="DemoActiveX"
                    style={{ display: "none" }}
                    classID="clsid:B08A638E-66C3-4586-823A-5B89A0301920"
                    height="0"
                    width="0"
                    role='none'
                >
                    
                </object>

                : null
        }

        <App />
    </Provider>);

ReactDOM.render(app, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
