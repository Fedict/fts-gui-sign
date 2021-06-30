import {getDataToSignForTokenAPI, getDocumentMetadataForTokenAPI} from "../../communication/communication";
import {handleFlowIdError, INCORECT_FLOW_ID} from "../../controlIds/flowId/FlowIdHelpers";
import {setDigest} from "../../signWizard/actions/DigestActions";
import {showErrorMessage} from "../../message/actions/MessageActions";
import {ErrorGeneral} from "../../message/MessageConstants";
import {navigateToSign} from "../../signWizard/actions/WizardLogicActions";
import {errorMessages} from "../../i18n/translations";
import {navigateToStep} from "../../wizard/WizardActions";
import {WIZARD_STATE_PIN_INPUT, WIZARD_STATE_UPLOAD} from "../../wizard/WizardConstants";
import moment from "moment";
import {setDateSigning} from "../../signWizard/actions/SignatureActions";
import {getBEUrl, parseErrorMessage} from "../../utils/helper";

export const TOKEN_RECEIVED = "TOKEN_RECEIVED"
export const SET_DOCUMENT_TOKEN_METADATA = "SET_DOCUMENT_TOKEN_METADATA"
/**
 * function (action) to get the digest by token
 */
export const getDigestForToken = () => (dispatch, getStore) => {
    const store = getStore()
    const { certificate } = store
    const { tokenFile } = store
    const signingDate = moment().format();
    dispatch(setDateSigning(signingDate))

    if (certificate
        && certificate.certificateSelected
        && certificate.certificateSelected.APIBody
        && tokenFile
        && tokenFile.token) {
        const flowId = getStore().controlId.flowId;
        let photo;
        if(tokenFile.readPhoto){
            photo = certificate.certificateSelected.photo;
        }
        getDataToSignForTokenAPI(certificate.certificateSelected.APIBody, tokenFile.token, signingDate, photo)
            .then(handleFlowIdError(flowId, getStore))
            .then((resp) => {
                if(resp.digest && resp.digestAlgorithm){
                    dispatch(setDigest(resp))
                    dispatch(navigateToSign())
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
                    dispatch(showErrorMessage({...ErrorGeneral, message : errorMessages.failedToFetchDataToSign}))
                }
            })

    }else{

    }

}

/**
 * function (action) to get the digest by token
 */
export const getDocumentMetadataForToken = () => (dispatch, getStore) => {
    const store = getStore()
    const token = store.tokenFile?store.tokenFile.token:undefined;
    if(token){
        const flowId = getStore().controlId.flowId;
        getDocumentMetadataForTokenAPI(token)
            .then(handleFlowIdError(flowId, getStore))
            .then((resp) => {
                //console.log('getDocumentMetadataForTokenAPI', resp)
                if(resp.mimetype && resp.filename){
                    dispatch(setDocumentMetadata(resp))
                    dispatch(navigateToStep(WIZARD_STATE_UPLOAD))
                }else{
                    const parsedError = parseErrorMessage(resp.message);
                    if(parsedError && errorMessages[parsedError.type]){
                        dispatch(showErrorMessage({
                            ...ErrorGeneral,
                            title : errorMessages.failedToFetchMetadata,
                            message : errorMessages[parsedError.type],
                            ref : parsedError.ref,
                            errorDetails : parsedError.details
                        }));
                    }else{
                        dispatch(showErrorMessage({
                            ...ErrorGeneral,
                            message: errorMessages.failedToFetchMetadata,
                            body: resp.message
                        }))
                    }
                }
            }).catch((err) => {
                if (err !== INCORECT_FLOW_ID) {
                    console.log('getDocumentMetadataForToken', err);
                    dispatch(showErrorMessage({...ErrorGeneral, message : errorMessages.failedToFetchMetadata}))
                }
            })
    }else{
        dispatch(showErrorMessage({...ErrorGeneral, message : errorMessages.noToken}))
    }
}

export const doSetToken = (token, redirectUrl, xsltUrl) => (dispatch) => {
    dispatch({
        type : TOKEN_RECEIVED,
        payload : {token, redirectUrl, xsltUrl}
    })
}

const replaceBEURL = (url) => {
    return url && url.replace('${BEurl}', getBEUrl());
}

export const setDocumentMetadata = (metadata) => ({
    type : SET_DOCUMENT_TOKEN_METADATA,
    payload : {
        fileName : metadata.filename,
        isPdf : metadata.mimetype && metadata.mimetype.indexOf('application/pdf') > -1,
        isXml : metadata.mimetype && (metadata.mimetype.indexOf('application/xml') > -1 || metadata.mimetype.indexOf('text/xml') > -1),
        xsltUrl: replaceBEURL(metadata.xsltUrl),
        readPhoto : metadata.readPhoto
    }
})
