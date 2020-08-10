# application start flow

1. html page is loaded
2. displays a card with a spinner 
3. load and execute config.js --> places configuration in window.configData
4. loads script.js --> replaces the title and the content of the cart with a unsupported browser message
5. load bundle --> replaces the full page with the content of the application
6. if IE loads a object tag to communicate with the extension
7. checks the browser (app.js)
   1. if browser is not supported --> shows a unsupported browser message --> application is blocked
8. wizard is shown on WIZARD_STATE_START state