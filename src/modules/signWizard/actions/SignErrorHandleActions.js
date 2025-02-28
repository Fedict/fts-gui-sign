import {
    Error_EID_http_status_0,
    Error_EID_no_card_InSession,
    Error_EID_no_card_NotInSession,
    Error_EID_unsupported_reader,
    Error_EID_no_reader_InSession,
    Error_EID_no_reader_NotInSession,
    Error_EID_card_error,
    Error_EID_card_blocked,
    Error_EID_signature_failed,
    Error_EID_card_busy
} from "../messages/ErrorsEIDLink";
import { navigateToPinError, resetWizard } from "./WizardLogicActions";
import { ErrorGeneral } from "../../message/MessageConstants";
import { showErrorMessage  } from "../../message/actions/MessageActions";
import {defineMessages} from "react-intl";
import {sendBEIDLinkErrorToBE} from "../../communication/communication";
import { errorMessages } from "../../i18n/translations";
import { getOS, OS } from "../../../modules/browserDetection/OSDetection";

/**
 * enum for the errorResponses from eIDLink
 */
export const errorStatuses = {
    http_status_0: "http_status_0",
    no_reader: "no_reader",
    unsupported_reader: "unsupported_reader",
    no_card: "no_card",
    busy: "busy",
    card_error: "card_error",
    pin_incorrect: "pin_incorrect",
    pin_too_short: "pin_too_short",
    pin_length: "pin_length",
    pin_too_long: "pin_too_long",
    pin_2_attempts_left: "pin_2_attempts_left",
    pin_1_attempt_left: "pin_1_attempt_left",
    card_blocked: "card_blocked",
    pin_timeout: "pin_timeout",
    cancel: "cancel",
    signature_failed: "signature_failed"
}

const bEIDErrorFaqLink = {
    id : "eid.link.error.general",
    defaultMessage : "More details about this type of error"
};

/**
 * Function that will call the backend to report the error and store the resulting ref in the store.
 * @param report
 * @param message
 * @param token
 * @returns {function(*): void}
 */
export let doReportError = (report, message, token) => (dispatch) => {
    sendBEIDLinkErrorToBE(report, message, token).then((data) => {
        if (data && data.ref) {
            //store the resulting ref in the redux store.
            dispatch(showErrorMessage({ref: data.ref}))
        }
    }).catch((err) => {
        console.log('Failed to send error to BE', err)
    });
}



/**
 * function to handle the error response from eID reader
 * @param {object} error - errorObject from eID reader
 * @param {string} error.message - errorMessage from de eID reader
 * @param {boolean} isInSession - boolean that represents is the signing proces is in progress
 */
export const handleErrorEID = (error, isInSession, token, callback) => (dispatch) => {
    if(!callback){
        callback = function(e){
            dispatch(showErrorMessage(e))
        }
    }

    let reportError = false;
    let message;
    switch (error.message) {
        case errorStatuses.http_status_0:
            message = Error_EID_http_status_0;
            reportError = true;
            break;
        case errorStatuses.no_reader:
            if (isInSession) {
                message = (Error_EID_no_reader_InSession)
            }
            else {
                message = (Error_EID_no_reader_NotInSession)
            }
            break;
        case errorStatuses.unsupported_reader:
            message = (Error_EID_unsupported_reader)
            reportError = true;
            break;
        case errorStatuses.no_card:
            if (isInSession) {
                message = (Error_EID_no_card_InSession)
            }
            else {
                message = (Error_EID_no_card_NotInSession);
            }
            break;
        case errorStatuses.card_error:
            message = (Error_EID_card_error);
            reportError = true;
            break;
        case errorStatuses.busy:
            message = (Error_EID_card_busy);
            break;
        case errorStatuses.signature_failed:
            message = (Error_EID_signature_failed);
            reportError = true;
            break
        case errorStatuses.pin_1_attempt_left:
        case errorStatuses.pin_2_attempts_left:
        case errorStatuses.pin_too_long:
        case errorStatuses.pin_length:
        case errorStatuses.pin_too_short:
        case errorStatuses.pin_incorrect:
        case errorStatuses.pin_timeout:
            message = (ErrorGeneral)
            break;
        case errorStatuses.card_blocked:
            message = (Error_EID_card_blocked)
            break;
        case errorStatuses.cancel:
            dispatch(resetWizard()) //TODO
            break;
        default:
            var body = error.message;
            if (error.resultRaw) body += " - " + error.resultType + " - 0x" + error.resultRaw.toString(16);
            message = { ...ErrorGeneral, message: errorMessages.BEID_CONNECT_ERROR }
            if (error.resultType === "SCard" && error.resultRaw === 0x80100016 && getOS() === OS.MACOS) {
                message.message = errorMessages.INVALID_MAC_SCARD_DRIVER;
            }
            else {
                message.body = body;
                message.linkURL = "#14";
                message.link = bEIDErrorFaqLink;
            }
            error.message = body;
            reportError = true;
            break;
    }
    if(reportError && (error.report || error.message)){
        //console.log('calling doReportError', error)
        dispatch(doReportError(error.report, error.message, token));
    }
    if(message){
        callback(message);
    }
}

export const STORE_RESET_PIN_ERROR = "STORE_RESET_PIN_ERROR"

export const resetPinError = () => (dispatch) => {
    dispatch({ type: STORE_RESET_PIN_ERROR })
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
    pin_incorrect: {id : 'pin_incorrect', defaultMessage : "PIN is incorrect."},
    pin_too_short: {id : 'pin_too_short', defaultMessage : "PIN is to short."},
    pin_length: {id : 'pin_length', defaultMessage : "PIN doesn't have the correct length."},
    pin_too_long: {id : 'pin_too_long', defaultMessage : "PIN is too long."},
    pin_2_attempts_left: {id : 'pin_2_attempts_left', defaultMessage : "PIN is incorrect : 2 attempts remaining."},
    pin_1_attempt_left: {id : 'pin_1_attempt_left', defaultMessage : "PIN is incorrect : 1 attempt remaining."},
    pin_timeout: {id : 'pin_timeout', defaultMessage : "Entering the PIN took too long."}
})

/**
 * function to handle eID pin errors
 * If there is a specific pin error it will navigate to the pinError
 * @param {object} error - errorObject from eID reader
 * @param {string} error.message - errorMessage from de eID reader
 * @param {boolean} isInSession - boolean that represents is the signing proces is in progress
 */
export const handlePinErrorEID = (error, isInSession) => (dispatch) => {
    if(error && error.message && pinErrorText[error.message]){
        dispatch(showPinError(pinErrorText[error.message]))
    }else{
        dispatch(handleErrorEID(error, isInSession))
    }
}