import { navigateToStep, setNewFlowId } from "../../wizard/WizardActions"
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
    WIZARD_STATE_VERSION_CHECK_INSTALL_EXTENTION,
    WIZARD_STATE_VERSION_CHECK_LOADING,
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

//----------------------------------
// helpers                    
//----------------------------------

const getCertificatesFromResponse = (response) => {

    let certificateList = []

    if (response && response.Readers && response.Readers.length >= 1) {
        for (const reader of response.Readers) {
            if (reader && reader.certificates && reader.certificates.length >= 1) {
                for (const certificate of reader.certificates) {
                    const certificateObject = {
                        readerName: reader.ReaderName,
                        readerType: reader.ReaderType,
                        cardType: reader.cardType,
                        certificate: certificate
                    }
                    certificateList.push(certificateObject)
                }
            }
        }
    }

    return certificateList
}

const createCertificateObject = (certificate, certificateChain) => {

    if (certificate && certificateChain) {

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

        return {
            certificate: { "encodedCertificate": certificate },
            certificateChain: certificateChainApi,

        }

    }
}


const INCORECT_FLOW_ID = "INCORECT_FLOW_ID"
const handleFlowIdError = (flowId, getStore) => (resp) => {
    const flowIdcurrent = getStore().wizard.flowId
    if (flowIdcurrent === flowId) {
        return resp
    }
    else {
        throw INCORECT_FLOW_ID
    }
}



//----------------------------------
//logic
//----------------------------------

export const checkVersion = () => (dispatch, getStore) => {
    //TODO implement browserchecks

    let eIDLink = controller.getNewInstance()

    eIDLink.getVersion(window.configData.eIDLinkMinimumVersion,
        () => {
            dispatch(readerSetCheck(true))
            dispatch(readerSetOk(true))
            dispatch(navigateToStep(WIZARD_STATE_UPLOAD))
        },
        () => {
            dispatch(readerSetCheck(true))
            dispatch(readerSetOk(false))
            dispatch(navigateToStep(WIZARD_STATE_VERSION_CHECK_INSTALL))
        },
        () => {
            dispatch(readerSetCheck(true))
            dispatch(readerSetOk(false))
            dispatch(navigateToStep(WIZARD_STATE_VERSION_CHECK_UPDATE))
        },
        () => {
            dispatch(readerSetCheck(true))
            dispatch(readerSetOk(false))
            dispatch(navigateToStep(WIZARD_STATE_VERSION_CHECK_INSTALL_EXTENTION))
        }
    )

}

export const getCertificates = () => (dispatch, getStore) => {

    let eIDLink = controller.getInstance()
    eIDLink.getCertificate()
        .then((response) => {
            const certificateList = getCertificatesFromResponse(response)

            dispatch(saveCertificateList(certificateList))

            if (certificateList.length === 0) {
                dispatch(showErrorMessage(MessageCertificatesNotFound))
            }

            else {
                getCertificateChainsFromReader(certificateList)
                    .then((newList) => {
                        dispatch(saveCertificateList(newList))
                        dispatch(navigateToStep(WIZARD_STATE_VALIDATE_LOADING))
                    })
                    .catch((error) => {
                        dispatch(handleErrorEID(error))
                    })
            }
        })
        .catch(
            (error) => {
                dispatch(handleErrorEID(error))
            }
        )

}



export const getCertificateChainsFromReader = (certificateList) => {
    return Promise.all(
        certificateList
            .map(async val => {
                val.certificateChain = await getCertificateChainFromReader(val.certificate)
                val.APIBody = createCertificateObject(val.certificate, val.certificateChain)
                return val
            }))
}

export const getCertificateChainFromReader = (certificate) => {
    let eIDLink = controller.getInstance()
    return new Promise((resolve, reject) => {
        eIDLink.getCertificateChain(
            'en',
            "0123456789ABCDEF0123456789ABCDEF",
            certificate)
            .then((resp) => {
                resolve(resp.certificateChain)
            })
            .catch((err) => reject(err))
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

        const flowId = getStore().wizard.flowId

        validateCertificatesAPI(APIBody)
            .then(handleFlowIdError(flowId, getStore))
            .then((val) => {
                const indications = val.indications
                const newList = certificate.certificateList.map((val, index) => {
                    const res = indications[index]
                    //TODO handle not passed certificates
                    if (res.indication === "PASSED" && res.keyUsageCheckOk) {
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
                        dispatch(navigateToStep(WIZARD_STATE_DIGEST_LOADING))
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
}


export const getDigest = () => (dispatch, getStore) => {
    const store = getStore()
    const { certificate } = store
    const { uploadFile } = store


    if (certificate
        && certificate.certificateSelected
        && certificate.certificateSelected.APIBody) {
        const flowId = getStore().wizard.flowId
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
        && digest
        && digest.digest
        && digest.digestAlgorithm) {
        let eIDLink = controller.getInstance()

        const lang = 'nl' //TODO connect to store and translations
        const mac = "0123456789ABCDEF0123456789ABCDEF"
        const u_cert = certificate.certificateSelected.certificate
        const u_digest = digest.digest
        const algo = digest.digestAlgorithm

        eIDLink.sign(lang, mac, u_cert, algo, u_digest, pin).then(
            (response) => {
                dispatch(setSignature(response))
                dispatch(signDocument())

            },
            (error) => { dispatch(handlePinErrorEID(error, true)) }
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
        const flowId = getStore().wizard.flowId
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