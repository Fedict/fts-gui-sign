## app/modules/browserDetection
module to detect the used browser and the used OS

### BrowserDetection.js
+ browser
  + list of browsers
+ getBrowser
  + funtion to get the used browser
  + uses navigator.userAgent to check on the browser
  + returns value out of browser list
  + chromium opera will return browser.CHROME
+ browserIsAccepted
  + function to check if the browser is supported
  + returns a browser
  + will accept IE, chrome, edge, Firefox, opera (chromium)

### OSDetection.js 
+ OS
  + list of OS systems
+ getOS
  + function to get the used OS
  + based on navigator.appVersion
  + returns value out of OS

## communications 
module with all the requests to the API

+ validateCertificatesAPI (certificateBody)
  + POST /validation/validateCertificates
+ getDataToSignAPI (certificateBody, document)
  + POST /signing/getDataToSign
+ signDocumentAPI (ertificateBody, document, signature)
  + POST /signing/signDocument
+ validateSignatureAPI (document)
  + POST /validation/validateSignature

+ similar calls for the sign with token flow

## components
folder with react components 

+ card
  + CardContainer : basic card with title
  + CardError : card with a red panel for a error message
  + CardInfo : card with blue panel for a info message
  + CardLoading : card with a loading circle
+ certificateSelect
  + select component to choose a certificate
+ EIDLinkLinuxInstall
  + install page for Linux distributions
+ methodSelect
  + a card to select a signing methode
+ numberedText 
  + a text with a number before it

## controlIds
a module to control applications ids

+ flowId : a unique id for the every flow
+ requestId : a unique id for the every API request

## eidLink
module to connect to eidLink

## fileUpload
actions and components to upload a file

## footer
footer of the application

## message
module to show custom error messages

+ messageActions
  + showErrorMessage : shows a card with a red error message
  + showInfoMessage : shows a card with a blue info message
+ messageconstants
  + ErrorGeneral : a genaral error message
  + ErrorNotSupported : a browser not supported error message
  
## navbar
the navbar of the application

## signWizard
the sign functionality wizard

+ actions 
  + the redux actions used in the application
+ messages
  + error messages specific to the sign functionality
+ pages
  + containers of the pages of the wizard
+ reducers
  + redux reducers
+ WizardContainer.js
  + container of the wizard
  + all pages are linked here
  
## signByTokenWizard
the sign by token functionality wizard
+ actions 
  + the redux actions used in the application
+ components
  + Display file - to show a preview of the document to sign - reuses the DisplayFile of the sign flow
  + PDF Viewer for IE - reuses the one of the sign flow
+ pages
  + containers of the pages of the wizard
    + TokenWizardIntroContainer - first step in the flow
    + DigestForTokenLoadingContainer & MetadataLoadingContainer show please wait message
    + SuccesForTokenContainer - last screen of happy flow when signing by token
+ reducers
  + redux reducers
+ TokenWizardContainer orchestrates which page to show depending on the step 

## startpage
the startpage to select a signing methode

## validate wizard
the validate functionalety wizard

+ actions 
  + the redux actions used in the application
+ constants
  + constants used in the validation proces
+ pages
  + containers of the pages of the wizard
+ reducers
  + redux reducers
+ ValidateWizardContainer.js
  + container of the wizard
  + all pages are being linked here

## wizard
logic to make show th e correct wizard pages

+ actions 
  + navigateToStep : redux action to navigate to a specific step in the wizard
+ constants
  + list of the names of the wizard pages

## i18n
Module to handle the translation mechanism of the FE it is based on react-intl
  
## translations
Contains the json files for each supported languages. Currently FR,NL,EN & DE