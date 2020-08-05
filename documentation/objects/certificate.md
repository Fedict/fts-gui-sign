# certificate objects

## certificate object

+  readerName (string) - name of the connected reader 
+  readerType (string) - type of the connected reader
+  cardType (string) - type of the connected card
+  certificate (string) - certificate string
+  indication (string) - the indication after validation of the certificate 
+  keyUsageCheckOk (boolean) - boolean that represents the keyUsageStatus
+  commonName  (string)  - commonName of the certificate 
+  certificateChain (object) - certificateChain of the certificate
    + rootCA (string) - certificateString of the root certificate
    + subCA  (array[string]) - array of certificateString of the sub certificates

## eIDLink getCertificate response (operation : USERCERTS)

+ Readers (array[object]) - list of all the readers connected
  + ReaderName (string) - name of the reader
  + ReaderType (string) - type of the reader
  + cardType (string) - type of the card in the reader
  + certificates (array[string]) - list of the certificates in the reader
+ correlationId (string) - correlation id 
+ extensionVersion (string) - version of the extention
+ result (string) - resultstatus
+ src (string) - resultsrc

## eIDLink getCertificateChain response (operation : CERTCHAIN)
+ cardType (string) - type of the card
+ certificateChain (object) - certificateChain object
  + rootCA (string) - root certificate string
  + subCA (array[string]) - list of the certificate strings of the sub certificates
+ correlationId (string) - correlation id 
+ extensionVersion (string) - version of the extention
+ result (string) - resultstatus
+ src (string) - resultsrc

## validateCertificate API body
+ (array[object]) - list of certificates
  + certificate (object) - certificate object
    + encodedCertificate (string) - certificateString 
  + certificateChain (array[object]) - list of the certificate chain
    + encodedCertificate (string) - certificateString of the chainpart
  + expectedKeyUsage (string) - usage of the certificate string


## validateCertificate API response 
+ indications(array[object]) - list of indications of validated certificates
  + commonName (string) - common name of the certificate
  + indication (string) - indication of the certificate 
  + subIndication (string) - subIndication of the certificate,
  + keyUsageCheckOk (boolean) - represents if the keyUsage is ok

  
## certificate object in redux store
+ certificateList (array[object]) - list of certificates
+ certificateSelected (object) - selected certificate that is used for the process


