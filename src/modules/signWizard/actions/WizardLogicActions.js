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
    WIZARD_STATE_VERSION_CHECK_LOADING,
    WIZARD_STATE_CERTIFICATES_VALIDATE_CHAIN

} from "../../wizard/WizardConstants"
import { controller } from "../../eIdLink/controller"
import { showErrorMessage } from "../../message/actions/MessageActions"
import { MessageCertificatesNotFound } from "../messages/MessageCertificatesNotFound"
import { saveCertificateList, selectCertificate } from "./CertificateActions"
import { getDataToSignAPI, signDocumentAPI, validateCertificatesAPI } from "../../communication/communication"
import { setDigest } from "./DigestActions"
import { handleErrorEID, handlePinErrorEID } from "./SignErrorHandleActions"
import { setSignature } from "./SignatureActions"
import { setDownloadFile } from "../../fileUpload/actions/UploadFileActions"
import { readerSetCheck, readerSetOk } from "./ReaderActions"
import { resetStore } from "../../../store/storeActions"
import { ErrorGeneral } from "../../message/MessageConstants"
import { setNewFlowId } from "../../controlIds/flowId/FlowIdActions"
import { removeRequestId, createRequestId } from "../../controlIds/requestId/RequestIdActions"
import { handleRequestIdError } from "../../controlIds/requestId/RequestIdHelpers"
import { handleFlowIdError } from "../../controlIds/flowId/FlowIdHelpers"
import { INCORECT_REQUEST_ID } from '../../controlIds/requestId/RequestIdHelpers'
import { INCORECT_FLOW_ID } from '../../controlIds/flowId/FlowIdHelpers'
//----------------------------------
// helpers                    
//----------------------------------

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


export const requestTimeoutFunction = (dispatch, getStore) => {
    let eIDLink = controller.getInstance()
    eIDLink.stop()
    dispatch(checkVersion(true))
}

export const requestTimeOutFunctionChecVersion = (dispatch, getStore) => {
    let eIDLink = controller.getInstance()
    eIDLink.stop()

    window.location.reload();
}











//----------------------------------
//logic
//----------------------------------

export const checkVersion = (isErrorCheck) => (dispatch, getStore) => {
    //TODO implement browserchecks

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
                    //TODO API ERROR handling
                    dispatch(showErrorMessage(MessageCertificatesNotFound))
                }

            })

    }
    else {
        dispatch(showErrorMessage(MessageCertificatesNotFound))
    }
}

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

export const validateCertificate = (certificateObject) => (dispatch, getStore) => {

    if (certificateObject.APIBody) {

        const APIBody = [{
            ...certificateObject.APIBody,
            "expectedKeyUsage": "NON_REPUDIATION"
        }
        ]

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
                    //TODO API ERROR handling
                    dispatch(showErrorMessage(MessageCertificatesNotFound))
                }

            })

    }
}

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
                //TODO API ERROR handling
                if (err !== INCORECT_FLOW_ID) {
                    dispatch(showErrorMessage(ErrorGeneral))
                }
            })

    }

}

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

export const sign = (pin) => (dispatch, getStore) => {
    //TODO navigate to spinner
    const { certificate, digest } = getStore()


    if (certificate
        && certificate.certificateSelected
        && certificate.certificateSelected.certificate
        && certificate.certificateSelected.readerType
        && digest
        && digest.digest
        && digest.digestAlgorithm) {

        let eIDLink = controller.getInstance()

        const lang = 'en' //TODO connect to store and translations
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
                    && resp
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

                //TODO API ERROR handling
                if (err !== INCORECT_FLOW_ID) {
                    dispatch(showErrorMessage(ErrorGeneral))
                }
            })

    }
    else {

        dispatch(showErrorMessage(ErrorGeneral))
    }
}



export const resetWizard = () => (dispatch, getStore) => {

    let eIDLink = controller.getInstance()
    eIDLink.stop()
    dispatch(resetStore())
    dispatch(setNewFlowId())
    const store = getStore()
    const { reader } = store

    if (reader) {
        if (reader.isChecked && reader.isOk) {
            dispatch(navigateToStep(WIZARD_STATE_UPLOAD))
        }
        else {
            dispatch(navigateToStep(WIZARD_STATE_VERSION_CHECK_LOADING))
        }
    }





}