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
import { showErrorMessage } from "../../message/actions/MessageActions";

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
    cancel: "Cancel",
    signature_failed: "signature_failed"
}


export const handleErrorEID = (error, isInSession) => (dispatch) => {

    switch (error.message) {
        case errorStatuses.http_status_0:
            dispatch(showErrorMessage(Error_EID_http_status_0))
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
            dispatch(showErrorMessage(Error_EID_card_error))
            break;

        case errorStatuses.signature_failed:
            dispatch(showErrorMessage(Error_EID_signature_failed))
            //TODO create error message
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

        default: break;
    }
}


export const PIN_ERROR_SET_ERROR = "PIN_ERROR_SET_ERROR"
export const showPinError = (message) => (dispatch, getStore) => {
    dispatch({ type: PIN_ERROR_SET_ERROR, payload: message })
    dispatch(navigateToPinError())
}

export const pinErrorText = {
    pin_incorrect: "PIN is incorrect",
    pin_too_short: "PIN is to short",
    pin_length: "PIN doesn't have the correct length",
    pin_too_long: "PIN is too long",
    pin_3_attempts_left: "PIN is incorrect :  3 attempts remaining",
    pin_2_attempts_left: "PIN is incorrect : 2 attempts remaining",
    pin_1_attempt_left: "PIN is incorrect : 1 attempt remaining",
    pin_timeout: "entering the PIN took too long."
}

export const handlePinErrorEID = (error, isInSession) => (dispatch) => {
    switch (error.message) {
        case errorStatuses.pin_1_attempt_left:
            dispatch(showPinError(pinErrorText.pin_1_attempt_left))
            break;
        case errorStatuses.pin_2_attempts_left:
            dispatch(showPinError(pinErrorText.pin_2_attempts_left))
            break;
        case errorStatuses.pin_3_attempts_left:
            dispatch(showPinError(pinErrorText.pin_3_attempts_left))
            break;
        case errorStatuses.pin_too_long:
            dispatch(showPinError(pinErrorText.pin_too_long))
            break;
        case errorStatuses.pin_length:
            dispatch(showPinError(pinErrorText.pin_length))
            break;
        case errorStatuses.pin_too_short:
            dispatch(showPinError(pinErrorText.pin_too_short))
            break;
        case errorStatuses.pin_incorrect:
            dispatch(showPinError(pinErrorText.pin_incorrect))
            break;
        case errorStatuses.pin_timeout:
            dispatch(showPinError(pinErrorText.pin_timeout))
            break;
        default:
            dispatch(handleErrorEID(error, isInSession))
    }
}