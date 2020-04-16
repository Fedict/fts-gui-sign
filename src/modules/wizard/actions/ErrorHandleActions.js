import { showErrorMessage } from "./MessageActions";
import { ErrorGeneral } from "../message/messages/ErrorGeneral";
import {
    Error_EID_http_status_0,
    Error_EID_no_card_InSession,
    Error_EID_no_card_NotInSession,
    Error_EID_unsupported_reader,
    Error_EID_no_reader_InSession,
    Error_EID_no_reader_NotInSession,
    Error_EID_card_error,
    Error_EID_card_blocked
} from "../message/messages/ErrorsEIDLink";
import { navigateToPinError } from "./WizardLogicActions";

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


export const handleErrorEID = (error, isInSession) => (dispatch, getStore) => {

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
            //TODO create error message
            break
        //TODO create pin error handeling

        case errorStatuses.pin_1_attempt_left:
        case errorStatuses.pin_2_attempts_left:
        case errorStatuses.pin_3_attempts_left:
        case errorStatuses.pin_too_long:
        case errorStatuses.pin_length:
        case errorStatuses.pin_too_short:
        case errorStatuses.pin_incorrect:
            dispatch(showErrorMessage(ErrorGeneral))
            break;

        case errorStatuses.card_blocked:
            dispatch(showErrorMessage(Error_EID_card_blocked))
            break;

        case errorStatuses.pin_timeout:
            dispatch(showErrorMessage(ErrorGeneral))
            break;
        case errorStatuses.cancel:

            break;

        default: break;
    }
}


export const PIN_ERROR_SET_ERROR = "PIN_ERROR_SET_ERROR"
export const showPinError = (message) => (dispatch, getStore) => {
    dispatch({ type: PIN_ERROR_SET_ERROR, payload: message })
    dispatch(navigateToPinError())
}

// export const pinErrors = {
//     pin_incorrect: "pin_incorrect",
//     pin_too_short: "pin_too_short",
//     pin_length: "pin_length",
//     pin_too_long: "pin_too_long",
//     pin_3_attempts_left: "pin_3_attempts_left",
//     pin_2_attempts_left: "pin_2_attempts_left",
//     pin_1_attempt_left: "pin_1_attempt_left",
// }

export const pinErrorText = {
    pin_incorrect: "Pincode is incorrect",
    pin_too_short: "Pincode is te kort",
    pin_length: "Pincode heeft niet de juiste lengte",
    pin_too_long: "Pincode is te lang",
    pin_3_attempts_left: "Pincode is incorrect : u heeft nog 3 pogingen",
    pin_2_attempts_left: "Pincode is incorrect : u heeft nog 2 pogingen",
    pin_1_attempt_left: "Pincode is incorrect : u heeft nog 1 poging",
}

export const handlePinErrorEID = (error, isInSession) => (dispatch, getStore) => {
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
        default:
            dispatch(handleErrorEID(error, isInSession))
    }
}