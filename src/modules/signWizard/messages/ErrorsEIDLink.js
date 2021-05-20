import { WIZARD_STATE_CERTIFICATES_LOADING } from "../../wizard/WizardConstants";
import { ErrorGeneral } from "../../message/MessageConstants";
import {defineMessages} from "react-intl";
import {definedMessages, errorMessages as globalErrorMessages} from "../../i18n/translations";

const errorMessages = defineMessages({
    "The eId reader was removed" : {
        id : "eid.link.error.reader.removed",
        defaultMessage : "The eId reader was removed"
    },
    "No eId reader found" : {
        id : "eid.link.error.reader.not_found.title",
        defaultMessage : "No eId reader found"
    },
    "Please attach your eID reader" : {
        id : "eid.link.error.reader.not_found.text",
        defaultMessage : "Please attach your eID reader"
    },
    "The eId reader is not supported" : {
        id : "eid.link.error.reader.not_supported.title",
        defaultMessage : "The eId reader is not supported"
    },
    "This application doesn't support this eID reader type" : {
        id : "eid.link.error.reader.not_supported.text",
        defaultMessage : "This application doesn't support this eID reader type"
    },
    "The eId card was removed" : {
        id : "eid.link.error.card.removed",
        defaultMessage : "The eId card was removed"
    },
    "No eId card found" : {
        id : "eid.link.error.card.not_found.title",
        defaultMessage : "No eId card found"
    },
    "Please insert your eID card" : {
        id : "eid.link.error.card.not_found.text",
        defaultMessage : "Please insert your eID card"
    },
    "Something went wrong" : {
        id : "eid.link.error.general.title",
        defaultMessage : "Something went wrong"
    }
})

const errorRefs = {
    BEID_CONNECT_ERROR : 'BEID_CONNECT_ERROR',
    NO_READER : 'NO_READER',
    UNSUPPORTED_READER: 'UNSUPPORTED_READER',
    SIGNATURE_FAILED: 'SIGNATURE_FAILED',
    CARD_BLOCKED : 'CARD_BLOCKED',
    CARD_ERROR : 'CARD_ERROR',
    USER_CANCELLED : 'USER_CANCELLED'
}

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
        hasCancelButton: true,
        err : errorRefs.BEID_CONNECT_ERROR
    }
}
export const Error_EID_http_status_0 = ErrorGeneral

export const Error_EID_no_reader_InSession = {
    ...createError(errorMessages["The eId reader was removed"], errorMessages["The eId reader was removed"]),
    err : errorRefs.NO_READER
}

export const Error_EID_no_reader_NotInSession = {
    ...createError(errorMessages["No eId reader found"], errorMessages["Please attach your eID reader"]),
    nextButton: {
        text: definedMessages.retry,
        isVisible: true,
        nextPage: WIZARD_STATE_CERTIFICATES_LOADING
    },
    err : errorRefs.NO_READER
}

export const Error_EID_unsupported_reader = {
    ...createError(errorMessages["The eId reader is not supported"], errorMessages["This application doesn't support this eID reader type"]),
    err : errorRefs.UNSUPPORTED_READER
}

export const Error_EID_no_card_InSession = {
    ...createError(errorMessages["The eId card was removed"], errorMessages["The eId card was removed"]),
    nextButton: {
        text: definedMessages.retry,
        isVisible: true,
        nextPage: WIZARD_STATE_CERTIFICATES_LOADING
    },
    err : errorRefs.USER_CANCELLED
}

export const Error_EID_no_card_NotInSession = {
    ...createError(errorMessages["No eId card found"], errorMessages["Please insert your eID card"]),
    nextButton: {
        text: definedMessages.retry,
        isVisible: true,
        nextPage: WIZARD_STATE_CERTIFICATES_LOADING
    },
    err : errorRefs.USER_CANCELLED
}

export const Error_EID_card_error = {
    ...createError(errorMessages["Something went wrong"], globalErrorMessages.BEID_CONNECT_ERROR),
    err : errorRefs.CARD_ERROR
}

export const Error_EID_card_blocked = {
    ...createError(errorMessages["The eId card is blocked"], globalErrorMessages.CARD_BLOCKED_ERROR),
    err : errorRefs.CARD_BLOCKED
}

export const Error_EID_signature_failed = {
    ...createError(errorMessages["Something went wrong"], globalErrorMessages.BEID_CONNECT_ERROR),
    err : errorRefs.SIGNATURE_FAILED
}