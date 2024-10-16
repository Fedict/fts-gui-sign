import {getDataToSignForTokenAPI, getDocumentMetadataForTokenAPI} from "../../communication/communication";
import {handleFlowIdError, INCORECT_FLOW_ID} from "../../controlIds/flowId/FlowIdHelpers";
import {setDigest} from "../../signWizard/actions/DigestActions";
import {showErrorMessage} from "../../message/actions/MessageActions";
import {ErrorGeneral} from "../../message/MessageConstants";
import {navigateToSign} from "../../signWizard/actions/WizardLogicActions";
import {errorMessages} from "../../i18n/translations";
import {navigateToStep} from "../../wizard/WizardActions";
import {WIZARD_STATE_UPLOAD, WIZARD_STATE_DIGEST_LOADING, WIZARD_STATE_SUCCES} from "../../wizard/WizardConstants";
import moment from "moment";
import {setDateSigning} from "../../signWizard/actions/SignatureActions";
import {parseErrorMessage} from "../../utils/helper";
import {signState} from "../constants";

export const TOKEN_RECEIVED = "TOKEN_RECEIVED"
export const SET_TOKEN_PREVIEW = "SET_TOKEN_PREVIEW"
export const SET_INPUTS_SIGN_STATE = "SET_INPUTS_SIGN_STATE"
export const SET_PREVIEW_FILE_ID = "SET_PREVIEW_FILE_ID"
export const SET_INPUT_SELECTION = "SET_INPUT_SELECTION"
export const SET_CUSTOM_SIGNATURE = "SET_CUSTOM_SIGNATURE"
export const SET_DOCUMENT_TOKEN_METADATA = "SET_DOCUMENT_TOKEN_METADATA"

/**
 * function (action) to get the digest by token
 */
export const getDigestForToken = (locale) => (dispatch, getStore) => {
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
        var fileIdToSign = tokenFile.inputs.findIndex(input => input.signState === signState.TO_BE_SIGNED);
        dispatch(setPreviewFileId(tokenFile.signAll ? -1 : fileIdToSign));
        const curInput = tokenFile.inputs[fileIdToSign];
        const customSignature = curInput.customSignature;
        const photo = curInput.psfP || customSignature.photoIncluded ? certificate.certificateSelected.photo : null;
        const signLanguage = curInput.signLanguage ? curInput.signLanguage : locale;
        
        getDataToSignForTokenAPI(certificate.certificateSelected.APIBody, tokenFile.token, fileIdToSign, customSignature, signLanguage, signingDate, photo)
            .then(handleFlowIdError(flowId, getStore))
            .then((resp) => {
                if(resp.digest && resp.digestAlgorithm && resp.signingDate){
                    dispatch(setDigest(resp))
                    dispatch(navigateToSign())
                    dispatch(setDateSigning(resp.signingDate))
                }else{
                    var errorMessage;
                    const parsedError = parseErrorMessage(resp.message);
                    if(parsedError && errorMessages[parsedError.type]){
                        errorMessage = {
                            ...ErrorGeneral,
                            title : errorMessages.failedToFetchDataToSign,
                            message : errorMessages[parsedError.type],
                            ref : parsedError.ref,
                            errorDetails : parsedError.details,
                        }
                    } else {
                        errorMessage = {
                            ...ErrorGeneral,
                            message: errorMessages.failedToFetchDataToSign,
                            body: resp.message,
                        }
                    }

                    if (!tokenFile.signAll) {
                        if (!getStore().tokenFile.noSkipErrors) {
                            dispatch(setInputsSignState(fileIdToSign, signState.ERROR_DIGEST));
                            var moreToSign =  getStore().tokenFile.inputs.find(input => input.signState === signState.TO_BE_SIGNED);
                            errorMessage.predButton = { text: { id: "button.retry", defaultMessage: "Try again" },
                                action: () => { dispatch(setInputsSignState(fileIdToSign, signState.TO_BE_SIGNED)) },
                                nextPage: WIZARD_STATE_DIGEST_LOADING }
                            errorMessage.nextButton = { isVisible: true, text: { id: "signing.error.skipButton", defaultMessage: "Skip file" }, 
                                action: () => { dispatch(setInputsSignState(fileIdToSign, signState.SKIPPED)) },
                                nextPage: moreToSign ? WIZARD_STATE_DIGEST_LOADING : WIZARD_STATE_SUCCES }
                        }
                    }
                    dispatch(showErrorMessage(errorMessage));
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
                if(resp.inputs){
                    dispatch(setDocumentMetadata(resp))
                    dispatch(setPreviewFileId(resp.previewDocuments || resp.inputs.length === 1 ? 0 : -1))
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
                    //console.log('getDocumentMetadataForToken', err);
                    dispatch(showErrorMessage({...ErrorGeneral, message : errorMessages.failedToFetchMetadata}))
                }
            })
    }else{
        dispatch(showErrorMessage({...ErrorGeneral, message : errorMessages.noToken}))
    }
}

export const doSetToken = (token, redirectUrl, clientNames, hookURL) => (dispatch) => {
    dispatch({
        type : TOKEN_RECEIVED,
        payload : {token, redirectUrl, clientNames, hookURL}
    })
}

export const setDocumentMetadata = (metadata) => ({
    type : SET_DOCUMENT_TOKEN_METADATA,
    payload : metadata
})

export const setPreview = (previewDocuments) => (dispatch) => {
    dispatch({
        type : SET_TOKEN_PREVIEW,
        payload : { previewDocuments }
    })
}

export const setInputsSignState = (selector, newState) => (dispatch) => {
    dispatch({
        type : SET_INPUTS_SIGN_STATE,
        payload : { selector: selector, newState: newState }
    })
}
export const SET_ALL_INPUTS = 'all'

// FilePreview Action in the "TokenAction.js" !!!!!
export const setPreviewFileId = (index) => (dispatch) => {
    dispatch({
        type : SET_PREVIEW_FILE_ID,
        payload : {index}
    })
}

export const setCustomSignature = (fileId, customSignature) => (dispatch) => {
    dispatch({
        type : SET_CUSTOM_SIGNATURE,
        payload : {fileId, customSignature: {
            signatureArea: customSignature.signatureArea,
            signatureSelected: customSignature.signatureSelected,
            photoIncluded: customSignature.photoIncluded,
        }}
    })
}