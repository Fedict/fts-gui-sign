# GUI-sign

## Building the application itself

There are two separate commands for building the application. One builds the dev version and the other the production version. In order to succesfully build the project, the latest version of npm is required. So 6.14 at the minimum. In the dockerfile the production version is used. So in order to build the application for a production environment:

```BASH
npm run build
```
### Running build locally without install

```BASH
npx serve build -l 3000
```

## Running appication in developer mode

There is a command to run the application on a development server. This server runs on default localhost:3000. 
To test codechanges in live dev environment

```BASH
npm run start
```



## Unit Tests

It is possible to activate the unit tests using the following command

```BASH
npm run test
```
## Setting enviroment variables

the enviroment variables are set in a config.js. This config.js is build and hosted alongside the application.

### Contents of the js file 
```javascript
window.configData = {
    eIDLinkMinimumVersion: "1.0.0", //Minimum version of eIDLink
    BEurl: "https://validate.ta.fts.bosa.belgium.be/signandvalidation", // URL to the backend

    eIDLinkExtensionUrls: { //list of url of the instalation files for the eIDlink extension
        chrome: "https://chrome.google.com/webstore/detail/eidlink/pencgnkbgaekikmiahiaakjdgaibiipp",
        edge: "",
        firefox: "",
        safari: ""
    },

    eIDLinkUrls: {//list of url of the instalation files for eIDlink 
        windows: "",
        macOs: "",
        linux: ""
    },

     defaultSigningProfileId: "XADES_1",//default profile that is used for document of a minetype that is not in the list of signingProfileIds.
     
    signingProfileIds: { //list of signingprofiles based on MIME-TYPE of a document
        "application/pdf" : "PADES_1",
        "application/xml" : "XADES_1",
        "text/xml" : "XADES_1"
    },


    signerLocationCountry: "",
    signerLocationLocality: "",
    signerLocationPostalAddress: [""],
    signerLocationPostalCode: "",
    signerLocationStateOrProvince: "",
    signerLocationStreet: "",
}
```
### Location of config.js
Before the build, this file is located in public/config/. This file will be copied to build/config/ when the application is build.


## Docker

In order to run the application inside a docker container the following commands are required. Take note that the dockerfile will install the module serve on a global level. This might need to be adapted based on the security settings of the environment. The docker run command will list the IP's addresses on which the application is accessible.

### build

```BASH
docker build -t node-web .
```

### run

```BASH
docker run -it -p 3000:3001 node-web:latest
```

## Used npm packages
For the Latest versions of the npm dependencies, reference the package.json

### dependencies
    -"@testing-library/jest-dom": "4.2.4"
    -"@testing-library/react": "9.5.0"
    -"@testing-library/user-event": "7.2.1",
    -"bootstrap": "4.4.1",
    -"node-sass": "4.13.1",
    -"react": "16.13.0",
    -"react-dom": "16.13.0",
    -"react-intl": "3.12.1",
    -"react-redux": "7.2.0",
    -"react-scripts": "3.4.1",
    -"redux": "4.0.5",
    -"redux-thunk": "2.3.0",
    -"popper.js": "1.16.1",
    -"typescript": "^3.8.3",
    -"jquery": "3.4.0"

### dev dependencies
    -"@types/jest": "^25.1.4"

## pdf viewer in IE
 pdf viewer in IE is made by using pdf.js (https://github.com/mozilla/pdf.js).

## react dev tools disabled
there is a code block in public/index.html that deactivates the react devtools 

```HTML
 <script>
    //block react dev tools
    if (typeof window.__REACT_DEVTOOLS_GLOBAL_HOOK__ === 'object') {
      __REACT_DEVTOOLS_GLOBAL_HOOK__.inject = function () { };
    }
  </script>
```

## redux dev tools 
redux dev tools are enabled in dev and disabled in production. 
configuration of the devtools are found in /src/store/store.js
``` JS
 const composeEnhancers = (process.env.NODE_ENV !== "production") ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose : compose
```