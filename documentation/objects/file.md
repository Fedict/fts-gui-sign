# file objects 

## toSignDocument API file body object (toSignDocument)
+ bytes (string) - base64 string of the file
+ name (string) - name of the file

## signDocument API response
+ bytes (string) - base64 string of the file
+ name (string) - name of the file

## file object in store 
+ file (File) - uploaded file
+ downloadFile (object) - the signed file returned from the API
+ displayFile (object) - file to display on the screen
  + isPdf (boolean) - boolean to see if file is a pdf
  + isXml (boolean) - boolean to see if file is a xml
  + url (string) - object url to the file
  + name (string) - name of the file