/**
 * action type to change the certificate list
 */
export const CERTIFICATE_SAVE_LIST = "CERTIFICATE_SAVE_LIST"

/**
 * function that returns a action to change the certificateList
 * @param {[object]} [certificateList]  - list of certificates
 * @param {string} [certificateList[].readerName] - name of the connected reader
 * @param {string} [certificateList[].readerType] - type of the connected reader
 * @param {string} [certificateList[].cardType] - type of the connected card
 * @param {string} [certificateList[].certificate] - certificateString 
 * @param {string} [certificateList[].indication] - the indication after validation of the certificate 
 * @param {boolean} [certificateList[].keyUsageCheckOk] - boolean that represents the keyUsageStatus 
 * @param {string} [certificateList[].commonName] - commonName of the certificate 
 * @param {object} [certificateList[].certificateChain] - certificateChain of the certificate
 * @param {String} [certificateList[].certificateChain.rootCA] - certificateString of the root certificate
 * @param {[string]} [certificateList[].certificateChain.subCA] - array of certificateString of the sub certificates
 */
export const saveCertificateList = (certificateList) => ({ type: CERTIFICATE_SAVE_LIST, payload: certificateList })

/**
 * action type to save the change certificate
 */
export const CERTIFICATE_SELECT_CERTIFICATE = "CERTIFICATE_SELECT_CERTIFICATE"

/**
 * function that returns a action to change the selected certificate
 * @param {object} certificate 
 * @param {string} [certificate.readerName] - name of the connected reader
 * @param {string} [certificate.readerType] - type of the connected reader
 * @param {string} [certificate.cardType] - type of the connected card
 * @param {string} [certificate.certificate] - certificateString 
 * @param {string} [certificate.indication] - the indication after validation of the certificate 
 * @param {boolean} [certificate.keyUsageCheckOk] - boolean that represents the keyUsageStatus 
 * @param {string} [certificate.commonName] - commonName of the certificate 
 * @param {object} [certificate.certificateChain] - certificateChain of the certificate
 * @param {String} [certificate.certificateChain.rootCA] - certificateString of the root certificate
 * @param {[string]} [certificate.certificateChain.subCA] - array of certificateString of the sub certificates
 */
export const selectCertificate = (certificate) => ({ type: CERTIFICATE_SELECT_CERTIFICATE, payload: certificate })