import {
    Error_EID_http_status_0,
    Error_EID_no_card_InSession,
    Error_EID_no_card_NotInSession,
    Error_EID_unsupported_reader,
    Error_EID_no_reader_InSession,
    Error_EID_no_reader_NotInSession,
    Error_EID_card_error,
    Error_EID_card_blocked,
    Error_EID_signature_failed
} from "../messages/ErrorsEIDLink";
import { navigateToPinError, resetWizard } from "./WizardLogicActions";
import { ErrorGeneral } from "../../message/MessageConstants";
import { showErrorMessage  } from "../../message/actions/MessageActions";
import {defineMessages} from "react-intl";
import {sendBEIDLinkErrorToBE} from "../../communication/communication";

/**
 * enum for the errorResponses from eIDLink
 */
export const errorStatuses = {
    http_status_0: "http_status_0",
    no_reader: "no_reader",
    unsupported_reader: "unsupported_reader",
    no_card: "no_card",
    card_error: "card_error",
    pin_incorrect: "pin_incorrect",
    pin_too_short: "pin_too_short",
    pin_length: "pin_length",
    pin_too_long: "pin_too_long",
    pin_3_attempts_left: "pin_3_attempts_left",
    pin_2_attempts_left: "pin_2_attempts_left",
    pin_1_attempt_left: "pin_1_attempt_left",
    card_blocked: "card_blocked",
    pin_timeout: "pin_timeout",
    cancel: "cancel",
    signature_failed: "signature_failed"
}

/**
 * function to handle the error response from eID reader
 * @param {object} error - errorObject from eID reader
 * @param {string} error.message - errorMessage from de eID reader
 * @param {boolean} isInSession - boolean that represents is the signing proces is in progress
 */
export const handleErrorEID = (error, isInSession, token) => (dispatch) => {
    let reportError = false;
    switch (error.message) {
        case errorStatuses.http_status_0:
            dispatch(showErrorMessage(Error_EID_http_status_0))
            reportError = true;
            break;
        case errorStatuses.no_reader:
            if (isInSession) {
                dispatch(showErrorMessage(Error_EID_no_reader_InSession))
            }
            else {
                dispatch(showErrorMessage(Error_EID_no_reader_NotInSession))
            }
            break;
        case errorStatuses.unsupported_reader:
            dispatch(showErrorMessage(Error_EID_unsupported_reader))
            reportError = true;
            break;
        case errorStatuses.no_card:
            if (isInSession) {
                dispatch(showErrorMessage(Error_EID_no_card_InSession))
            }
            else {
                dispatch(showErrorMessage(Error_EID_no_card_NotInSession))
            }
            break;
        case errorStatuses.card_error:
            dispatch(showErrorMessage(Error_EID_card_error));
            reportError = true;
            break;
        case errorStatuses.signature_failed:
            dispatch(showErrorMessage(Error_EID_signature_failed))
            reportError = true;
            break
        case errorStatuses.pin_1_attempt_left:
        case errorStatuses.pin_2_attempts_left:
        case errorStatuses.pin_3_attempts_left:
        case errorStatuses.pin_too_long:
        case errorStatuses.pin_length:
        case errorStatuses.pin_too_short:
        case errorStatuses.pin_incorrect:
        case errorStatuses.pin_timeout:
            dispatch(showErrorMessage(ErrorGeneral))
            break;
        case errorStatuses.card_blocked:
            dispatch(showErrorMessage(Error_EID_card_blocked))
            break;
        case errorStatuses.cancel:
            dispatch(resetWizard())
            break;
        default:
            dispatch(showErrorMessage(ErrorGeneral))
            reportError = true;
            break;
    }
    if(reportError){
        try{
            sendBEIDLinkErrorToBE(error.report, error.message, token).then((data) => {
                dispatch(showErrorMessage({ref:data.ref}))
            });
        }catch (e){
            console.log('Failed to log error')
        }
    }
}

/**
 * action type to change the pin error message
 */
export const PIN_ERROR_SET_ERROR = "PIN_ERROR_SET_ERROR"

/**
 * function to change the pin error message and navigate to the pis error page
 * @param {*} message 
 */
export const showPinError = (message) => (dispatch) => {
    dispatch({ type: PIN_ERROR_SET_ERROR, payload: message })
    dispatch(navigateToPinError())
}

/**
 * enum with pin error messages shown in the pin Error
 */
export const pinErrorText = defineMessages({
    pin_incorrect: {id : 'pin_incorrect', defaultMessage : "PIN is incorrect"},
    pin_too_short: {id : 'pin_too_short', defaultMessage : "PIN is to short"},
    pin_length: {id : 'pin_length', defaultMessage : "PIN doesn't have the correct length"},
    pin_too_long: {id : 'pin_too_long', defaultMessage : "PIN is too long"},
    pin_3_attempts_left: {id : 'pin_3_attempts_left', defaultMessage : "PIN is incorrect :  3 attempts remaining"},
    pin_2_attempts_left: {id : 'pin_2_attempts_left', defaultMessage : "PIN is incorrect : 2 attempts remaining"},
    pin_1_attempt_left: {id : 'pin_1_attempt_left', defaultMessage : "PIN is incorrect : 1 attempt remaining"},
    pin_timeout: {id : 'pin_timeout', defaultMessage : "entering the PIN took too long."}
})

/**
 * function to handle eID pin errors
 * If there is a specific pin error it will navigate to the pinError
 * @param {object} error - errorObject from eID reader
 * @param {string} error.message - errorMessage from de eID reader
 * @param {boolean} isInSession - boolean that represents is the signing proces is in progress
 */
export const handlePinErrorEID = (error, isInSession) => (dispatch) => {
    if(error.message && pinErrorText[error.message]){
        dispatch(showPinError(pinErrorText[error.message]))
    }else{
        dispatch(handleErrorEID(error, isInSession))
    }
}