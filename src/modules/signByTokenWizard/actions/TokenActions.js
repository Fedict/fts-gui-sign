import {getDataToSignForTokenAPI} from "../../communication/communication";
import {handleFlowIdError, INCORECT_FLOW_ID} from "../../controlIds/flowId/FlowIdHelpers";
import {setDigest} from "../../signWizard/actions/DigestActions";
import {showErrorMessage} from "../../message/actions/MessageActions";
import {ErrorGeneral} from "../../message/MessageConstants";
import {navigateToSign} from "../../signWizard/actions/WizardLogicActions";

export const TOKEN_RECEIVED = "TOKEN_RECEIVED"
/**
 * function (action) to get the digest by token
 */
export const getDigestForToken = () => (dispatch, getStore) => {
    const store = getStore()
    const { certificate } = store
    const { tokenFile } = store

    if (certificate
        && certificate.certificateSelected
        && certificate.certificateSelected.APIBody) {
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

export const doSetToken = (token, redirectUrl) => (dispatch) => {
    dispatch({
        type : TOKEN_RECEIVED,
            payload : {token, redirectUrl}
    })
}

