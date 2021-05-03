# message objects 

## message object
+ type (string) - type of the message that is shown
+ title (node) - title of the message
+ message (node) - message show in the highlighted part of the message
+ body (node) - content shown under the highlighted part
+ nextButton (object) - information about the nextbutton of the message card
  + text (node) - text on the next button
  + isVisible (boolean) - indicates if the button is visible
  + nextPage (string) - WizardPageId of the page will navigate to
+ hasCancelButton (string) - indicates if the cancel button is visible

## messageObject in redux store
+ type (string) - type of the message that is shown
+ title (node) - title of the message
+ message (node) - message show in the highlighted part of the message
+ body (node) - content shown under the highlighted part
+ nextButton (object) - information about the nextbutton of the message card
  + text (node) - text on the next button
  + isVisible (boolean) - indicates if the button is visible
  + nextPage (string) - WizardPageId of the page will navigate to
+ hasCancelButton (string) - indicates if the cancel button is visible

## messageTypes 
+ ERROR: "ERROR" (string)
+ INFO: "INFO" (string)