export const SIGNATURE_SET_SIGNATURE = "SIGNATURE_SET_SIGNATURE"

export const setSignature = (signatureObject) => (dispatch, getStore) => {

    dispatch({ type: SIGNATURE_SET_SIGNATURE, payload: signatureObject.signature })
}