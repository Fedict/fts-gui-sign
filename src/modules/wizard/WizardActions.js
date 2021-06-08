import {doWithToken} from "../utils/helper";
import {sendLogInfoIgnoreResult} from "../communication/communication";

export const WIZARD_CHANGE_STATE = "WIZARD_CHANGE_STATE"
export const navigateToStep = (route) => {
    return [
        doWithToken(sendLogInfoIgnoreResult.bind(undefined, 'UI - CHANGE_SCREEN - ' + route)),
        { type: WIZARD_CHANGE_STATE, payload: route }
        ]
}

