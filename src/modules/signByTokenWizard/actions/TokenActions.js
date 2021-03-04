import {getDataToSignForTokenAPI, getDocumentMetadataForTokenAPI} from "../../communication/communication";
import {handleFlowIdError, INCORECT_FLOW_ID} from "../../controlIds/flowId/FlowIdHelpers";
import {setDigest} from "../../signWizard/actions/DigestActions";
import {showErrorMessage} from "../../message/actions/MessageActions";
import {ErrorGeneral} from "../../message/MessageConstants";
import {navigateToSign} from "../../signWizard/actions/WizardLogicActions";
import {errorMessages} from "../../i18n/translations";
import {navigateToStep} from "../../wizard/WizardActions";
import {WIZARD_STATE_PIN_INPUT, WIZARD_STATE_UPLOAD} from "../../wizard/WizardConstants";

export const TOKEN_RECEIVED = "TOKEN_RECEIVED"
export const SET_DOCUMENT_TOKEN_METADATA = "SET_DOCUMENT_TOKEN_METADATA"
/**
 * function (action) to get the digest by token
 */
export const getDigestForToken = () => (dispatch, getStore) => {
    const store = getStore()
    const { certificate } = store
    const { tokenFile } = store

    if (certificate
        && certificate.certificateSelected
        && certificate.certificateSelected.APIBody
        && tokenFile
        && tokenFile.token) {
        const flowId = getStore().controlId.flowId;
        getDataToSignForTokenAPI(certificate.certificateSelected.APIBody, tokenFile.token)
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
                dispatch(setDocumentMetadata(resp))
                dispatch(navigateToStep(WIZARD_STATE_UPLOAD))
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

export const doSetToken = (token, redirectUrl) => (dispatch) => {
    dispatch({
        type : TOKEN_RECEIVED,
        payload : {token, redirectUrl}
    })
}

export const setDocumentMetadata = (metadata) => ({
    type : SET_DOCUMENT_TOKEN_METADATA,
    payload : {
        fileName : metadata.filename,
        isPdf : metadata.mimetype && metadata.mimetype.indexOf('application/pdf') > -1
    }
})
