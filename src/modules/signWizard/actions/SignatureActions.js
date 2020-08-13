/**
 * action type to change the signature
 */
export const SIGNATURE_SET_SIGNATURE = "SIGNATURE_SET_SIGNATURE"

/**
 * function to change the signature
 * @param {object} signatureObject - signature object response from eIDlink
 * @param {string} signatureObject.signature - signature string
 */
export const setSignature = (signatureObject) => ({ type: SIGNATURE_SET_SIGNATURE, payload: signatureObject.signature })