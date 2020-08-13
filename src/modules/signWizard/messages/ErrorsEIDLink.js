import { WIZARD_STATE_CERTIFICATES_LOADING } from "../../wizard/WizardConstants";
import { ErrorGeneral } from "../../message/MessageConstants";

const createError = (title, message) => {
    return {
        title: title,
        message: message,
        body: null,
        nextButton: {
            text: "",
            isVisible: false,
            nextPage: ""
        },
        hasCancleButton: true
    }
}
export const Error_EID_http_status_0 = ErrorGeneral

export const Error_EID_no_reader_InSession = {
    ...createError("The eId reader was removed", "The eId reader was removed")
}

export const Error_EID_no_reader_NotInSession = {
    ...createError("No eId reader found", "Please attach your eID reader"),
    nextButton: {
        text: "Try again",
        isVisible: true,
        nextPage: WIZARD_STATE_CERTIFICATES_LOADING
    },
}

export const Error_EID_unsupported_reader = {
    ...createError("The eId reader is not supported", "This application doesn't support this eID reader type")
}

export const Error_EID_no_card_InSession = {
    ...createError("The eId card was removed", "The eId card was removed")
}

export const Error_EID_no_card_NotInSession = {
    ...createError("No eId card found", "Please insert your eID card"),
    nextButton: {
        text: "Try again",
        isVisible: true,
        nextPage: WIZARD_STATE_CERTIFICATES_LOADING
    },
}

export const Error_EID_card_error = {
    ...createError("Something went wrong", "Something went wrong. Please reload the page and try again.")
}

export const Error_EID_card_blocked = {
    ...createError("The eId card is blocked", "The eId card is blocked")
}

export const Error_EID_signature_failed = {
    ...createError("Something went wrong", "Something went wrong. Please reload the page and try again.")
}