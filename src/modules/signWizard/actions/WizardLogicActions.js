import { navigateToStep } from "../../wizard/WizardActions"
import {
    WIZARD_STATE_VERSION_CHECK_UPDATE,
    WIZARD_STATE_VERSION_CHECK_INSTALL,
    WIZARD_STATE_CERTIFICATES_CHOOSE,
    WIZARD_STATE_PIN_INPUT,
    WIZARD_STATE_SUCCES,
    WIZARD_STATE_VALIDATE_LOADING,
    WIZARD_STATE_SIGNING_LOADING,
    WIZARD_STATE_DIGEST_LOADING,
    WIZARD_STATE_UPLOAD,
    WIZARD_STATE_SIGNING_PRESIGN_LOADING,
    WIZARD_STATE_PINPAD_ERROR,
    WIZARD_STATE_VERSION_CHECK_INSTALL_EXTENSION,
    WIZARD_STATE_CERTIFICATES_VALIDATE_CHAIN,
} from "../../wizard/WizardConstants"
import { controller } from "../../eIdLink/controller"
import { showErrorMessage } from "../../message/actions/MessageActions"
import { MessageCertificatesNotFound } from "../messages/MessageCertificatesNotFound"
import {
    saveCertificateList,
    selectCertificate
} from "./CertificateActions"
import {
    getDataToSignAPI,
    signDocumentAPI,
    validateCertificatesAPI
} from "../../communication/communication"
import { setDigest } from "./DigestActions"
import { handleErrorEID, handlePinErrorEID } from "./SignErrorHandleActions"
import { setSignature } from "./SignatureActions"
import { setDownloadFile } from "../../fileUpload/actions/UploadFileActions"
import {
    readerSetCheck,
    readerSetOk
} from "./ReaderActions"
import { resetStore } from "../../../store/storeActions"
import { ErrorGeneral } from "../../message/MessageConstants"
import { setNewFlowId } from "../../controlIds/flowId/FlowIdActions"
import {
    removeRequestId,
    createRequestId
} from "../../controlIds/requestId/RequestIdActions"
import { handleRequestIdError } from "../../controlIds/requestId/RequestIdHelpers"
import { handleFlowIdError } from "../../controlIds/flowId/FlowIdHelpers"
import { INCORECT_REQUEST_ID } from '../../controlIds/requestId/RequestIdHelpers'
import { INCORECT_FLOW_ID } from '../../controlIds/flowId/FlowIdHelpers'

//----------------------------------
// helpers                    
//----------------------------------

/**
 * function to create a API certificate object
 * - will stop eIDLink
 * - does a checkVersion request
 */
export const createCertificateObject = (certificate, certificateChain) => {

    let createdCertificateObject = {}

    if (certificate) {
        createdCertificateObject.certificate = { "encodedCertificate": certificate }
    }

    if (certificateChain) {
        let certificateChainStrings = []

        if (certificateChain.rootCA) {
            certificateChainStrings.push(certificateChain.rootCA);
        }

        if (certificateChain.subCA) {
            certificateChainStrings = [
                ...certificateChainStrings,
                ...certificateChain.subCA];
        }

        const certificateChainApi = certificateChainStrings.map((val) => {
            return ({
                "encodedCertificate": val
            })
        })
        createdCertificateObject.certificateChain = certificateChainApi;
    }

    return createdCertificateObject
}

/**
 * function to map the certificate response to a certificate object
 * @param {object} response - responce from eIDLink
 */
export const getCertificatesFromResponse = (response) => {

    let certificateList = []

    if (response && response.Readers && response.Readers.length >= 1) {
        for (const reader of response.Readers) {
            if (reader && reader.certificates && reader.certificates.length >= 1) {
                for (const certificate of reader.certificates) {
                    const certificateObject = {
                        readerName: reader.ReaderName,
                        readerType: reader.ReaderType,
                        cardType: reader.cardType,
                        certificate: certificate,
                        APIBody: createCertificateObject(certificate)
                    }
                    certificateList.push(certificateObject)
                }
            }
        }
    }

    return certificateList
}

/**
 * function (action) that is called when a requests times out
 * - will stop eIDLink
 * - does a checkVersion request
 */
export const requestTimeoutFunction = (dispatch) => {
    let eIDLink = controller.getInstance()
    eIDLink.stop()
    dispatch(checkVersion(true))
}

/**
 * funtion(action) that is called when the eIDLink get version times out
 */
export const requestTimeOutFunctionChecVersion = () => {
    let eIDLink = controller.getInstance()
    eIDLink.stop()
    window.location.reload();
}

//----------------------------------
//logic
//----------------------------------

/**
 * function (action) to call the eIDLink get version function
 * - if version is correct --> navigate to startpage (WIZARD_STATE_START_PAGE)
 * - if version is outdated --> navigate to updatePage (WIZARD_STATE_VERSION_CHECK_UPDATE)
 * - if eIDLink extension is not installed --> navigate to extention install page (WIZARD_STATE_VERSION_CHECK_INSTALL_EXTENSION)
 * - if eIDLink local messaging app is not installed --> navigate to localApp install page (WIZARD_STATE_VERSION_CHECK_INSTALL)
 * @param {boolean} isErrorCheck - indicates if the function is called after a timeout
 */
export const checkVersion = (isErrorCheck) => (dispatch, getStore) => {

    let eIDLink = controller.getNewInstance()

    const requestId = dispatch(createRequestId(4000, requestTimeOutFunctionChecVersion))

    eIDLink.getVersion(window.configData.eIDLinkMinimumVersion,
        () => {
            dispatch(removeRequestId(requestId))
            dispatch(readerSetCheck(true))
            dispatch(readerSetOk(true))
            if (isErrorCheck) {
                dispatch(showErrorMessage(ErrorGeneral))
            }
            else {
                dispatch(navigateToStep(WIZARD_STATE_UPLOAD))
            }
        },
        () => {
            dispatch(removeRequestId(requestId))
            dispatch(readerSetCheck(true))
            dispatch(readerSetOk(false))
            dispatch(navigateToStep(WIZARD_STATE_VERSION_CHECK_INSTALL))
        },
        () => {
            dispatch(removeRequestId(requestId))
            dispatch(readerSetCheck(true))
            dispatch(readerSetOk(false))
            dispatch(navigateToStep(WIZARD_STATE_VERSION_CHECK_UPDATE))
        },
        () => {
            dispatch(removeRequestId(requestId))
            dispatch(readerSetCheck(true))
            dispatch(readerSetOk(false))
            dispatch(navigateToStep(WIZARD_STATE_VERSION_CHECK_INSTALL_EXTENSION))
        }
    )
}

/**
 * function (action) to call the eIDLink getCertificate function
 * - saves certificate list in redux store
 * - if no certificates are found --> shows MessageCertificatesNotFound error
 * - if certificates are found --> navigates to certificates validation loading page (WIZARD_STATE_VALIDATE_LOADING)
 */
export const getCertificates = () => (dispatch, getStore) => {

    let eIDLink = controller.getInstance()

    const requestId = dispatch(createRequestId(10000, requestTimeoutFunction))
    const flowId = getStore().controlId.flowId

    eIDLink.getCertificate()
        .then(handleFlowIdError(flowId, getStore))
        .then(handleRequestIdError(requestId, dispatch, getStore))
        .then((response) => {
            const certificateList = getCertificatesFromResponse(response)

            dispatch(saveCertificateList(certificateList))

            if (certificateList.length === 0) {
                dispatch(showErrorMessage(MessageCertificatesNotFound))
            }

            else {

                dispatch(navigateToStep(WIZARD_STATE_VALIDATE_LOADING))

            }
        })
        .catch((err) => {
            if (err !== INCORECT_REQUEST_ID && err !== INCORECT_FLOW_ID) {
                dispatch(removeRequestId(requestId))
                dispatch(handleErrorEID(err))
            }
        })
}

/**
 * funtion (action) does a validateCertificatesAPI request with multiple certificates from redux store
 * - only checks the keyusage
 * - saves valid results in certificate list in redux store
 * - if no valid results --> shows MessageCertificatesNotFound error
 * - if 1 valid result  --> places the result in selected certificate in the redux store 
 *                      --> navigates to validate certificatechain loading page (WIZARD_STATE_CERTIFICATES_VALIDATE_CHAIN)
 * - if multiple valid results --> navigates to choose certificate page (WIZARD_STATE_CERTIFICATES_CHOOSE)
 */
export const validateCertificates = () => (dispatch, getStore) => {

    const store = getStore()
    const { certificate } = store

    if (certificate
        && certificate.certificateList) {

        const APIBody = certificate.certificateList.map((val) => {
            return {
                ...val.APIBody,
                "expectedKeyUsage": "NON_REPUDIATION"
            }
        })

        const flowId = getStore().controlId.flowId

        validateCertificatesAPI(APIBody)
            .then(handleFlowIdError(flowId, getStore))
            .then((val) => {
                const indications = val.indications
                const newList = certificate.certificateList.map((val, index) => {
                    const res = indications[index]
                    if (res.keyUsageCheckOk) {
                        val.indication = res.indication
                        val.keyUsageCheckOk = res.keyUsageCheckOk
                        val.commonName = res.commonName
                        return val
                    }
                    else {
                        return undefined
                    }
                }).filter(val => val)

                dispatch(saveCertificateList(newList))

                if (newList.length <= 0) {
                    dispatch(showErrorMessage(MessageCertificatesNotFound))
                }
                else {
                    if (newList.length === 1) {
                        dispatch(selectCertificate(newList[0]))
                        dispatch(navigateToStep(WIZARD_STATE_CERTIFICATES_VALIDATE_CHAIN))
                    }
                    else {
                        dispatch(navigateToStep(WIZARD_STATE_CERTIFICATES_CHOOSE))
                    }
                }
            })
            .catch((err) => {
                if (err !== INCORECT_FLOW_ID) {

                    dispatch(showErrorMessage(MessageCertificatesNotFound))
                }

            })

    }
    else {
        dispatch(showErrorMessage(MessageCertificatesNotFound))
    }
}

/**
 * function (action) that calls getCertificateChain from eIDLink
 * - calls validateCertificate a combination of the selected certificate from the redux store and the response.
 */
export const validateCertificateChain = () => (dispatch, getStore) => {
    let eIDLink = controller.getInstance()

    const store = getStore()
    const { certificate } = store

    if (certificate
        && certificate.certificateSelected
        && certificate.certificateSelected.certificate) {
        const usedCertificate = certificate.certificateSelected.certificate

        const requestId = dispatch(createRequestId(10000, requestTimeoutFunction))
        const flowId = getStore().controlId.flowId

        eIDLink.getCertificateChain(
            'en',
            "0123456789ABCDEF0123456789ABCDEF",
            usedCertificate)
            .then(handleFlowIdError(flowId, getStore))
            .then(handleRequestIdError(requestId, dispatch, getStore))
            .then((resp) => {
                console.log("validateCertificateChain", JSON.stringify(resp))
                const newCertificate = {
                    ...certificate.certificateSelected,
                    APIBody: createCertificateObject(usedCertificate, resp.certificateChain),
                }
                dispatch(validateCertificate(newCertificate))

            })
            .catch((error) => {
                if (error !== INCORECT_REQUEST_ID && error !== INCORECT_FLOW_ID) {
                    dispatch(removeRequestId(requestId))
                    dispatch(handleErrorEID(error))
                }
            })
    }
}

/**
 * funtion (action) does a validateCertificatesAPI request with a signle certificate
 * - will check both keyUsage and certificateChain
 * - will save updated date in selected certificate
 * - if certificate is ok --> navigate to nonce loading page (WIZARD_STATE_NONCE_LOADING)
 * - if certificate not ok --> show MessageCertificatesNotFound message
 * 
 * @param {object} certificateObject - certificateObject
 * @param {string} readerName - name of the connected reader 
 * @param {string} readerType - type of the connected reader
 * @param {string} cardType - type of the connected card
 * @param {string} certificateObject.certificate - certificate string
 * @param {object} certificateObject.certificateChain - certificateChain of the certificate
 * @param {string} certificateObject.certificateChain.rootCA - certificateString of the root certificate
 * @param {array[string]} certificateObject.certificateChain.subCA - array of certificateString of the sub certificates
 */
export const validateCertificate = (certificateObject) => (dispatch, getStore) => {

    if (certificateObject.APIBody) {

        const APIBody = [{
            ...certificateObject.APIBody,
            "expectedKeyUsage": "NON_REPUDIATION"
        }]

        const flowId = getStore().controlId.flowId

        validateCertificatesAPI(APIBody)
            .then(handleFlowIdError(flowId, getStore))
            .then((val) => {
                const selectedObject = { ...certificateObject }
                const indications = val.indications
                const indication = indications[0]
                selectedObject.indication = indication.indication;
                selectedObject.keyUsageCheckOk = indication.keyUsageCheckOk;
                selectedObject.commonName = indication.commonName;

                if (indication.indication === "PASSED" && indication.keyUsageCheckOk) {
                    dispatch(selectCertificate(selectedObject))
                    dispatch(navigateToStep(WIZARD_STATE_DIGEST_LOADING))
                }
                else {
                    dispatch(showErrorMessage(MessageCertificatesNotFound))
                }
            })
            .catch((err) => {
                if (err !== INCORECT_FLOW_ID) {
                    dispatch(showErrorMessage(MessageCertificatesNotFound))
                }

            })
    }
}

/**
 * function (action) to get the digest
 */
export const getDigest = () => (dispatch, getStore) => {
    const store = getStore()
    const { certificate } = store
    const { uploadFile } = store

    if (certificate
        && certificate.certificateSelected
        && certificate.certificateSelected.APIBody) {
        const flowId = getStore().controlId.flowId
        getDataToSignAPI(certificate.certificateSelected.APIBody, uploadFile.file)
            .then(handleFlowIdError(flowId, getStore))
            .then((resp) => {
                dispatch(setDigest(resp))
                dispatch(navigateToSign())
            })
            .catch((err) => {
                if (err !== INCORECT_FLOW_ID) {
                    dispatch(showErrorMessage(ErrorGeneral))
                }
            })

    }

}

/**
 * function(action) to navigate to correct pin enter page
 * - certificate reader type == 'pinpad' --> call authNonce (null) and navigates to pinpad loading page (WIZARD_STATE_SIGNING_PRESIGN_LOADING)
 * - certificate reader type != 'pinpad' --> navigate to pin input page (WIZARD_STATE_PIN_INPUT)
 */
export const navigateToSign = () => (dispatch, getStore) => {
    const { certificate } = getStore()
    if (certificate
        && certificate.certificateSelected
        && certificate.certificateSelected.readerType) {

        if (certificate.certificateSelected.readerType === "pinpad") {
            dispatch(navigateToStep(WIZARD_STATE_SIGNING_PRESIGN_LOADING))
            dispatch(sign(null))
        }
        else {
            dispatch(navigateToStep(WIZARD_STATE_PIN_INPUT))
        }
    }
    else {
        dispatch(showErrorMessage(ErrorGeneral))
    }
}

/**
 * function (action) to navigate to correct pin error page bases on the readerType 
 * - certificate reader type == 'pinpad' --> navigates to pinpad error page (WIZARD_STATE_PINPAD_ERROR)
 * - certificate reader type != 'pinpad' --> navigate to pin input page (WIZARD_STATE_PIN_INPUT)
 */
export const navigateToPinError = () => (dispatch, getStore) => {
    const { certificate } = getStore()
    if (certificate
        && certificate.certificateSelected
        && certificate.certificateSelected.readerType) {

        if (certificate.certificateSelected.readerType === "pinpad") {
            dispatch(navigateToStep(WIZARD_STATE_PINPAD_ERROR))
        }
        else {
            dispatch(navigateToStep(WIZARD_STATE_PIN_INPUT))
        }
    }
    else {
        dispatch(showErrorMessage(ErrorGeneral))
    }
}


/**
 * function (action) that calls the sign function of eIDLink
 * - saves signature in redux store
 * - calls signDocument if success
 * @param {string} pin - enterd pincode (should be null for pinpad reader)
 */
export const sign = (pin) => (dispatch, getStore) => {
    const { certificate, digest } = getStore()

    if (certificate
        && certificate.certificateSelected
        && certificate.certificateSelected.certificate
        && certificate.certificateSelected.readerType
        && digest
        && digest.digest
        && digest.digestAlgorithm) {

        let eIDLink = controller.getInstance()

        const lang = 'en'
        const mac = "0123456789ABCDEF0123456789ABCDEF"
        const u_cert = certificate.certificateSelected.certificate
        const u_digest = digest.digest
        const algo = digest.digestAlgorithm

        let timeoutTime = 10000
        if (certificate.certificateSelected.readerType === "pinpad") {
            timeoutTime = 30000
        }

        const requestId = dispatch(createRequestId(timeoutTime, requestTimeoutFunction))
        const flowId = getStore().controlId.flowId

        eIDLink.sign(lang, mac, u_cert, algo, u_digest, pin)
            .then(handleFlowIdError(flowId, getStore))
            .then(handleRequestIdError(requestId, dispatch, getStore))
            .then(
                (response) => {
                    dispatch(setSignature(response))
                    dispatch(signDocument())

                })
            .catch(
                (error) => {
                    if (error !== INCORECT_REQUEST_ID && error !== INCORECT_FLOW_ID) {
                        dispatch(removeRequestId(requestId))
                        dispatch(handlePinErrorEID(error, true))
                    }
                }
            )
    }
    else {
        dispatch(showErrorMessage(ErrorGeneral))
    }

}

/**
 * function (action) that calls signDocumentAPI 
 * - if success navigates to WIZARD_STATE_SUCCES
 */
export const signDocument = () => (dispatch, getStore) => {

    const { certificate, signature, uploadFile } = getStore()

    if (certificate
        && certificate.certificateSelected
        && certificate.certificateSelected.APIBody
        && signature
        && signature.signature
        && uploadFile
        && uploadFile.file) {

        dispatch(navigateToStep(WIZARD_STATE_SIGNING_LOADING))
        const flowId = getStore().controlId.flowId
        signDocumentAPI(
            certificate.certificateSelected.APIBody,
            uploadFile.file,
            signature.signature)
            .then(handleFlowIdError(flowId, getStore))
            .then((resp) => {

                if (resp
                    && resp.name
                    && resp.bytes) {
                    dispatch(setDownloadFile(resp))
                    dispatch(navigateToStep(WIZARD_STATE_SUCCES))
                }
                else {
                    dispatch(showErrorMessage(ErrorGeneral))
                }

            })
            .catch((err) => {
                if (err !== INCORECT_FLOW_ID) {
                    dispatch(showErrorMessage(ErrorGeneral))
                }
            })
    }
    else {
        dispatch(showErrorMessage(ErrorGeneral))
    }
}

/**
 * function (action) to reset the wizard
 * - clears the store
 * - creates a new flowId
 * - navigates to / 
 */
export const resetWizard = () => (dispatch, getStore) => {
    window.location.pathname = "/"
    let eIDLink = controller.getInstance()
    eIDLink.stop()
    dispatch(resetStore())
    dispatch(setNewFlowId())
}