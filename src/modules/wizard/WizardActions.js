import {sendLogInfoIgnoreResult} from "../communication/communication";
import {WIZARD_STATE_MESSAGE, WIZARD_STATE_PIN_INPUT, WIZARD_STATE_PINPAD_ERROR} from "./WizardConstants";

export const WIZARD_CHANGE_STATE = "WIZARD_CHANGE_STATE"
export const WIZARD_CHANGE_AUTO_DOWNLOAD_OPTION = "WIZARD_CHANGE_AUTO_DOWNLOAD_OPTION"
export const navigateToStep = (route) => {
    return [
        doSendLogMessageChangeState(route),
        { type: WIZARD_CHANGE_STATE, payload: route }
        ]
}


/**
 *
 * @param route the new screen to show
 */
export const doSendLogMessageChangeState = (route) => {
    function getExtra(object){
        if(object.id){
            return ` - ${object.id}`;
        }else{
            return ` - ${JSON.stringify(object)}`;
        }
    }

    return (dispatch, getState) => {
        const state = getState();
        if(state && state.tokenFile){
            //compute extra information when WIZARD_STATE_MESSAGE
            let extra = '';
            switch (route){
                case WIZARD_STATE_MESSAGE : {
                    if (state.message) {
                        if (state.message.message) {
                            extra = getExtra(state.message.message);
                        } else if (state.message.body) {
                            extra = getExtra(state.message.body);
                        }
                    }
                    break;
                }
                case WIZARD_STATE_PINPAD_ERROR :
                case WIZARD_STATE_PIN_INPUT: {
                    if(state.pinError && state.pinError.message) {
                        extra = getExtra(state.pinError.message);
                    }
                    break;
                }
            }
            sendLogInfoIgnoreResult('UI - CHANGE_SCREEN - ' + route + extra, state.tokenFile.token);
        }
    }
}

export const doSendLogMessageChangeOptionAutoDownloadDocument = (checked) => {
    return (dispatch, getState) => {
        const state = getState();
        if(state && state.tokenFile) {
            sendLogInfoIgnoreResult('UI - CHANGE_AUTO_DOWNLOAD_OPTION - ' + checked, state.tokenFile.token);
        }
    }
}

export const changeOptionAutoDownloadDocument = (checked) => {
    return [
        doSendLogMessageChangeOptionAutoDownloadDocument(checked),
        { type: WIZARD_CHANGE_AUTO_DOWNLOAD_OPTION, payload: checked }
    ]
}