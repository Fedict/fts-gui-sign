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
    getDataToSignAPI, sendLogInfo, sendLogInfoIgnoreResult,
    signDocumentAPI, signDocumentForTokenAPI,
    validateCertificatesAPI, sendHookInfoAPI
} from "../../communication/communication"
import { setDigest } from "./DigestActions"
import {handleErrorEID, handlePinErrorEID, resetPinError} from "./SignErrorHandleActions"
import {setDateSigning, setSignature} from "./SignatureActions"
import { setDownloadFile } from "../../fileUpload/actions/UploadFileActions"
import {
    readerSetCheck,
    readerSetOk,
    readerSetBeidConnectVersion
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
import {errorMessages} from "../../i18n/translations";
import {redirectErrorCodes} from "../../../const";
import moment from 'moment'
import {defaults, parseErrorMessage} from "../../utils/helper";
import {ID_FLAGS} from "../../eIdLink/strategies/createEIDLinkExtensionStrategy";
import { SET_ALL_INPUTS, setInputsSignState } from "../../signByTokenWizard/actions/TokenActions"
import { signingType, signState } from "../../signByTokenWizard/constants"
import { globalToken } from "../../../store/globals"

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
 * function to map the certificate response to a certificate object
 * @param {object} response - responce from eIDLink
 */
export const getCertificatesFromIdResponse = (response) => {

    let certificateList = []

    if (response && response.Readers && response.Readers.length >= 1) {
        for (const reader of response.Readers) {
            if (reader && reader.signcert) {
                const certificateObject = {
                    readerName: reader.ReaderName,
                    readerType: reader.ReaderType,
                    cardType: reader.cardType,
                    certificate: reader.signcert,
                    APIBody: createCertificateObject(reader.signcert),
                    photo : reader.photo
                }
                certificateList.push(certificateObject)
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

    const requestId = dispatch(createRequestId(5000, requestTimeOutFunctionChecVersion))

    eIDLink.getVersion(window.configData.eIDLinkMinimumVersion,
        (installedVersion) => {
            dispatch(removeRequestId(requestId))
            dispatch(readerSetBeidConnectVersion(installedVersion))
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
            dispatch(readerSetBeidConnectVersion(undefined))
            dispatch(readerSetCheck(true))
            dispatch(readerSetOk(false))
            dispatch(navigateToStep(WIZARD_STATE_VERSION_CHECK_INSTALL))
        },
        (installedVersion) => {
            dispatch(removeRequestId(requestId))
            dispatch(readerSetBeidConnectVersion(installedVersion))
            dispatch(readerSetCheck(true))
            dispatch(readerSetOk(false))
            dispatch(navigateToStep(WIZARD_STATE_VERSION_CHECK_UPDATE))
        },
        () => {
            dispatch(removeRequestId(requestId))
            dispatch(readerSetBeidConnectVersion(undefined))
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

    const requestId = dispatch(createRequestId(30000, requestTimeoutFunction))
    const flowId = getStore().controlId.flowId
    const token = getStore().tokenFile && getStore().tokenFile.token

    eIDLink.getIdData(
        'en',
        "0123456789ABCDEF0123456789ABCDEF",
        ID_FLAGS.ID_FLAG_INCLUDE_SIGN_CERT |
            ID_FLAGS.ID_FLAG_INCLUDE_PHOTO |
            ID_FLAGS.ID_FLAG_INCLUDE_INTEGRITY |
            ID_FLAGS.ID_FLAG_INCLUDE_ID
    )
        .then(handleFlowIdError(flowId, getStore))
        .then(handleRequestIdError(requestId, dispatch, getStore))
        .then((response) => {
            const certificateList = getCertificatesFromIdResponse(response)

            dispatch(saveCertificateList(certificateList))

            if (certificateList.length === 0) {
                dispatch(showErrorMessage(MessageCertificatesNotFound))
            } else {
                dispatch(navigateToStep(WIZARD_STATE_VALIDATE_LOADING))
            }
        })
        .catch((err) => {
            if (err !== INCORECT_REQUEST_ID && err !== INCORECT_FLOW_ID) {
                dispatch(removeRequestId(requestId))
                dispatch(handleErrorEID(err, false, token))
            }
        })
    /*
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
                dispatch(handleErrorEID(err, false, token))
            }
        })
     */
}


/**
 * function (action) to call the eIDLink getCertificate function
 * - saves certificate list in redux store
 * - if no certificates are found --> shows MessageCertificatesNotFound error
 * - if certificates are found --> navigates to certificates validation loading page (WIZARD_STATE_VALIDATE_LOADING)
 */
export const getCertificatesWithCallback = (callback) => (dispatch, getStore) => {

    let eIDLink = controller.getInstance()

    const requestId = dispatch(createRequestId(30000, requestTimeoutFunction))
    const flowId = getStore().controlId.flowId
    const token = getStore().tokenFile && getStore().tokenFile.token

    eIDLink.getIdData(
        'en',
        "0123456789ABCDEF0123456789ABCDEF",
        ID_FLAGS.ID_FLAG_INCLUDE_SIGN_CERT |
        ID_FLAGS.ID_FLAG_INCLUDE_PHOTO |
        ID_FLAGS.ID_FLAG_INCLUDE_INTEGRITY |
        ID_FLAGS.ID_FLAG_INCLUDE_ID
    )
        .then(handleFlowIdError(flowId, getStore))
        .then(handleRequestIdError(requestId, dispatch, getStore))
        .then((response) => {
            const certificateList = getCertificatesFromIdResponse(response)

            dispatch(saveCertificateList(certificateList))

            if(typeof callback === 'function'){
                if (certificateList.length === 0) {
                    callback(MessageCertificatesNotFound)
                } else {
                    callback(true);
                }
            }
        })
        .catch((err) => {
            if (err !== INCORECT_REQUEST_ID && err !== INCORECT_FLOW_ID) {
                dispatch(removeRequestId(requestId))
                dispatch(handleErrorEID(err, false, token, callback))
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
                "expectedKeyUsage": "NON_REPUDIATION",
                token: globalToken
            }
        })

        if(certificate.certificateList.length === 1
            && window.configData
            && defaults(window.configData.skipCertificateChainValidate, true)){
            dispatch(saveCertificateList(certificate.certificateList))
            dispatch(selectCertificate(certificate.certificateList[0]))
            dispatch(navigateToStep(WIZARD_STATE_CERTIFICATES_VALIDATE_CHAIN))
            return;
        }

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
                    //console.log('MessageCertificatesNotFound', val)
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
                    //console.log('Failed to validate certificate', err)
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

    const token = getStore().tokenFile && getStore().tokenFile.token

    if (certificate
        && certificate.certificateSelected
        && certificate.certificateSelected.certificate) {
        const usedCertificate = certificate.certificateSelected.certificate

        const requestId = dispatch(createRequestId(20000, requestTimeoutFunction))
        const flowId = getStore().controlId.flowId

        eIDLink.getCertificateChain(
            'en',
            "0123456789ABCDEF0123456789ABCDEF",
            usedCertificate)
            .then(handleFlowIdError(flowId, getStore))
            .then(handleRequestIdError(requestId, dispatch, getStore))
            .then((resp) => {
                const newCertificate = {
                    ...certificate.certificateSelected,
                    // eIDlink 1.4 + returns readerType in response
                    readerType: resp.ReaderType || certificate.certificateSelected.readerType,
                    APIBody: createCertificateObject(usedCertificate, resp.certificateChain),
                }
                dispatch(validateCertificate(newCertificate))

            })
            .catch((error) => {
                if (error !== INCORECT_REQUEST_ID && error !== INCORECT_FLOW_ID) {
                    dispatch(removeRequestId(requestId))
                    dispatch(handleErrorEID(error, false, token))
                }
            })
    }
}

/**
 * function (action) does a validateCertificatesAPI request with a single certificate
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
        if(window.configData && defaults(window.configData.skipCertificateChainValidate, true)){
            //console.log('skip validateCertificate', certificateObject)
            dispatch(selectCertificate(certificateObject))
            dispatch(navigateToStep(WIZARD_STATE_DIGEST_LOADING))
            return;
        }
        //console.log('validateCertificate', certificateObject)
        const APIBody = [{
            ...certificateObject.APIBody,
            "expectedKeyUsage": "NON_REPUDIATION",
            token: globalToken
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
    const { customSignatures } = store
    const signingDate = moment().format();
    dispatch(setDateSigning(signingDate))
    if (certificate
        && certificate.certificateSelected
        && certificate.certificateSelected.APIBody) {
        const flowId = getStore().controlId.flowId
        getDataToSignAPI(certificate.certificateSelected.APIBody, uploadFile.file, signingDate, customSignatures, certificate.certificateSelected.photo)
            .then(handleFlowIdError(flowId, getStore))
            .then((resp) => {
                if(resp.digest && resp.digestAlgorithm && resp.signingDate) {
                    dispatch(setDigest(resp))
                    dispatch(navigateToSign())
                    dispatch(setDateSigning(resp.signingDate))
                }else{
                    const parsedError = parseErrorMessage(resp.message);
                    if(parsedError && errorMessages[parsedError.type]){
                        dispatch(showErrorMessage({
                            ...ErrorGeneral,
                            title : errorMessages.failedToFetchDataToSign,
                            message : errorMessages[parsedError.type],
                            ref : parsedError.ref,
                            errorDetails : parsedError.details
                        }));
                    }else{
                        dispatch(showErrorMessage({
                            ...ErrorGeneral,
                            message: errorMessages.failedToFetchDataToSign,
                            body: resp.message
                        }))
                    }
                }
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
            dispatch(resetPinError())
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

    dispatch(resetPinError());

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

        let timeoutTime = 20000
        if (certificate.certificateSelected.readerType === "pinpad") {
            timeoutTime = 60000
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

    const { certificate, signature, uploadFile, tokenFile, customSignatures } = getStore()

    if (certificate
        && certificate.certificateSelected
        && certificate.certificateSelected.APIBody
        && signature
        && signature.signature
        && ((uploadFile
        && uploadFile.file) || (tokenFile && tokenFile.token))) {

        dispatch(navigateToStep(WIZARD_STATE_SIGNING_LOADING))
        const flowId = getStore().controlId.flowId;
        if(tokenFile && tokenFile.token){
            let photo;
            if(tokenFile.readPhoto){
                photo = certificate.certificateSelected.photo;
            }
            var fileIdToSign = tokenFile.inputs.findIndex(input => input.signState === signState.TO_BE_SIGNED);
            var hookInfo = { id: 'FILE_SIGNED', fileId: fileIdToSign };
            signDocumentForTokenAPI(
                certificate.certificateSelected.APIBody,
                tokenFile.token,
                fileIdToSign,
                signature.signature,
                signature.signingDate,
                photo,
                true)
                .then(handleFlowIdError(flowId, getStore))
                .then((resp) => {
                    //console.log('signDocumentForTokenAPI response', resp)
                    hookInfo.ok = resp === true
                    sendHookInfoAPI(hookInfo, tokenFile);
                    if (resp === true) {
                        dispatch(setInputsSignState(tokenFile.signingType === signingType.XadesMultiFile ? SET_ALL_INPUTS : fileIdToSign, signState.SIGNED));
                        var moreToSign = getStore().tokenFile.inputs.find(input => input.signState === signState.TO_BE_SIGNED);
                        dispatch(navigateToStep(moreToSign ? WIZARD_STATE_DIGEST_LOADING: WIZARD_STATE_SUCCES))
                    } else {
                        var errorMessage;
                        const parsedError = parseErrorMessage(resp.message);
                        if(parsedError && errorMessages[parsedError.type]){
                            errorMessage = {
                                ...ErrorGeneral,
                                title : errorMessages.failedToSignWrongResultFromAPI,
                                message : errorMessages[parsedError.type],
                                ref : parsedError.ref,
                                errorDetails : parsedError.details,
                            }
                        } else {
                            errorMessage = {
                                ...ErrorGeneral,
                                message: errorMessages.failedToSignWrongResultFromAPI,
                                body: resp.message,
                            }
                        }

                        if (tokenFile.signingType !== signingType.XadesMultiFile) {
                            if (!getStore().tokenFile.noSkipErrors) {
                                dispatch(setInputsSignState(fileIdToSign, signState.ERROR_SIGN));
                                moreToSign =  getStore().tokenFile.inputs.find(input => input.signState === signState.TO_BE_SIGNED);
                                errorMessage.predButton = { text: { id: "signing.error.retryButton", defaultMessage: "Try again" }, action: () => {
                                    dispatch(setInputsSignState(fileIdToSign, signState.TO_BE_SIGNED)) },
                                    nextPage: WIZARD_STATE_DIGEST_LOADING }
                                errorMessage.nextButton = { isVisible: true, text: { id: "signing.error.skipButton", defaultMessage: "Skip file" }, action: () => {
                                    dispatch(setInputsSignState(fileIdToSign, signState.SKIPPED)) },
                                    nextPage: moreToSign ? WIZARD_STATE_DIGEST_LOADING : WIZARD_STATE_SUCCES }
                            }
                        }

                        dispatch(showErrorMessage(errorMessage));
                    }
                })
                .catch((err) => {
                    hookInfo.ok = false
                    sendHookInfoAPI(hookInfo, tokenFile);
                    if (err !== INCORECT_FLOW_ID) {
                        dispatch(showErrorMessage({...ErrorGeneral, message : errorMessages.FAILED_TO_SIGN}))
                    }
                })
        }else{
            signDocumentAPI(
                certificate.certificateSelected.APIBody,
                uploadFile.file,
                signature.signature,
                signature.signingDate,
                customSignatures,
                certificate.certificateSelected.photo)
                .then(handleFlowIdError(flowId, getStore))
                .then((resp) => {

                    if (resp
                        && resp.name
                        && resp.bytes) {
                        dispatch(setDownloadFile(resp))
                        dispatch(navigateToStep(WIZARD_STATE_SUCCES))
                    }
                    else {
                        if(errorMessages[resp.message]){
                            dispatch(showErrorMessage({...ErrorGeneral, title : errorMessages.failedToSignWrongResultFromAPI, message : errorMessages[resp.message]}));
                        }else{
                            dispatch(showErrorMessage({
                                ...ErrorGeneral,
                                message: errorMessages.failedToSignWrongResultFromAPI,
                                body: resp.message
                            }))
                        }
                    }

                })
                .catch((err) => {
                    if (err !== INCORECT_FLOW_ID) {
                        dispatch(showErrorMessage(ErrorGeneral))
                    }
                })
        }
    }
    else {
        dispatch(showErrorMessage(ErrorGeneral))
    }
}

let resetWizardClicked = false;
export const clearResetWizardClicked = () =>
{
    resetWizardClicked = false;
}
/**
 * function (action) to reset the wizard
 * - clears the store
 * - creates a new flowId
 * - navigates to / 
 */
export const resetWizard = () => (dispatch, getStore) => {
    if(resetWizardClicked){
        //this to prevent redirecting the browser twice for example with double click
        return;
    }
    resetWizardClicked = true;
    let eIDLink = controller.getInstance()
    eIDLink.stop()
    const {tokenFile, wizard, message, certificate} = getStore();

    let url;
    if(tokenFile && tokenFile.redirectUrl){
        url = new URL(tokenFile.redirectUrl);
    }else{
        url = new URL(window.location);
    }

    if(wizard && wizard.state){
        try{
            url.searchParams.delete('details');
            url.searchParams.delete('err');
            url.searchParams.delete('ref');
        }catch (e){
        }
        if(message && message.ref){
            url.searchParams.set('ref', message.ref);
        }
        if(message && message.errorDetails){
            url.searchParams.set('details', message.errorDetails);
        }
        if(wizard.state === 'WIZARD_STATE_MESSAGE' && message && message.message && message.message.id){
            const errorType = Object.keys(errorMessages).find((k) => errorMessages[k].id === message.message.id);
            url.searchParams.set('err', defaults(redirectErrorCodes[errorType], errorType, message.err, 'SERVER_ERROR'));
        }else{
            url.searchParams.set('err', certificate && !certificate.neverSaved && certificate.certificateList.length == 0 ?
                                redirectErrorCodes.USER_CANCELLED_NO_CERT : redirectErrorCodes.USER_CANCELLED);
            url.searchParams.set('details', wizard.state);
        }
    }
    sendLogInfo('UI - CANCEL_BUTTON CLICKED - ' + url.toString(), () => {
        dispatch(resetStore())
        dispatch(setNewFlowId());
        window.location.href = url.toString();
        resetWizardClicked = false;
    }, tokenFile?tokenFile.token:undefined);


}

export const doSendLogInfo = (message) => (dispatch, getStore) => {
    console.log('doSendLogInfo',message)
    const {tokenFile} = getStore();
    sendLogInfoIgnoreResult(message, tokenFile && tokenFile.token?tokenFile.token:undefined);
}
