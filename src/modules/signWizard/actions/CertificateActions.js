
export const CERTIFICATE_SAVE_LIST = "CERTIFICATE_SAVE_LIST"

export const saveCertificateList = (certificateList) => (dispatch) => {
    dispatch({ type: CERTIFICATE_SAVE_LIST, payload: certificateList })
}

export const CERTIFICATE_SELECT_CERTIFICATE = "CERTIFICATE_SELECT_CERTIFICATE"

export const selectCertificate = (certificate) => ({ type: CERTIFICATE_SELECT_CERTIFICATE, payload: certificate })




