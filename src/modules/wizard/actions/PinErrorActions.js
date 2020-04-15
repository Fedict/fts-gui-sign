// import { navigateToStep } from "./WizardActions"
// import { WIZARD_STATE_PIN_INPUT } from "../wizard/WizardConstants"

// export const PIN_ERROR_SET_ERROR = "PIN_ERROR_SET_ERROR"
// export const showPinError = (message) => (dispatch, getStore) => {
//     dispatch({ type: PIN_ERROR_SET_ERROR, payload: message })
//     dispatch(navigateToStep(WIZARD_STATE_PIN_INPUT))
// }

// export const pinErrors = {
//     pin_incorrect: "pin_incorrect",
//     pin_too_short: "pin_too_short",
//     pin_length: "pin_length",
//     pin_too_long: "pin_too_long",
//     pin_3_attempts_left: "pin_3_attempts_left",
//     pin_2_attempts_left: "pin_2_attempts_left",
//     pin_1_attempt_left: "pin_1_attempt_left",
// }

// export const pinErrorText = {
//     pin_incorrect: "Pincode is incorrect",
//     pin_too_short: "Pincode is te kort",
//     pin_length: "Pincode heeft niet de juiste lengte",
//     pin_too_long: "Pincode is te lang",
//     pin_3_attempts_left: "u heeft nog 3 pogingen",
//     pin_2_attempts_left: "u heeft nog 2 pogingen",
//     pin_1_attempt_left: "u heeft nog 1 poging",
// }

// export const handlePinErrorEID = (error) => (dispatch, getStore) => {
//     switch (error.message) {
//         case pinErrors.pin_1_attempt_left:
//             dispatch(showPinError(pinErrorText.pin_1_attempt_left))
//             break;
//         case pinErrors.pin_2_attempts_left:
//             dispatch(showPinError(pinErrorText.pin_2_attempts_left))
//             break;
//         case pinErrors.pin_3_attempts_left:
//             dispatch(showPinError(pinErrorText.pin_3_attempts_left))
//             break;
//         case pinErrors.pin_too_long:
//             dispatch(showPinError(pinErrorText.pin_too_long))
//             break;
//         case pinErrors.pin_length:
//             dispatch(showPinError(pinErrorText.pin_length))
//             break;
//         case pinErrors.pin_too_short:
//             dispatch(showPinError(pinErrorText.pin_too_short))
//             break;
//         case pinErrors.pin_incorrect:
//             dispatch(showPinError(pinErrorText.pin_incorrect))
//             break;
//         default:
//             dispatch(handleErrorEID(error))
//     }
// }

