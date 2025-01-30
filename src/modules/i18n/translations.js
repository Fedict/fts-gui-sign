import {defineMessages} from "react-intl";


export const definedMessages = defineMessages({
    cancel: {
        id: "button.cancel",
        defaultMessage: "Cancel"
    },
    retry: {
        id: "button.retry",
        defaultMessage: "Try again"
    },
    start: {
        id: "button.start",
        defaultMessage: "Start"
    },
    next: {
        id: "button.next",
        defaultMessage: "Next"
    },
    select: {
        id: "button.select",
        defaultMessage: "Select"
    }
})

export const errorMessages = defineMessages({
    BEID_CONNECT_ERROR : {
        id : "eid.link.error.general.text",
        defaultMessage : "Something went wrong. Please reload the page and try again."
    },
    CARD_BLOCKED_ERROR : {
        id : "eid.link.error.card.blocked",
        defaultMessage : "PIN is incorrect: no attempts left. The eID card is blocked.",
        link: "#2",
        linkDefaultMessage: "My PIN code was blocked"
    },
    CARD_BUSY : {
        id : "eid.link.error.card.busy",
        defaultMessage : "eID card temporarily unavailable"
    },
    CARD_BUSY2 : {
        id : "eid.link.error.card.busy2",
        defaultMessage : "Our service can’t reach your eID card because it is being used by another service on your computer. Please close the service or end the process and try again."
    },
    failedToFetchMetadata: {
        id: "error.METADATA_FETCH",
        defaultMessage: "Failed to fetch the metadata of the document."
    },
    noToken: {
        id: "error.NO_TOKEN_IN_STATE",
        defaultMessage: "Token not found or invalid.",
        link: "#10"
    },
    failedToSignWrongResultFromAPI: {
        id: "error.WRONG_RESULT_SIGN_TOKEN",
        defaultMessage: "Failed to sign the document.",
        link: "#11"
    },
    FAILED_TO_SIGN: {
        id: "error.FAILED_TO_SIGN",
        defaultMessage: "Failed to sign the document.",
        link: "#11"
    },
    failedToFetchDataToSign: {
        id: "error.FAILED_TO_FETCH_DATA_TO_SIGN",
        defaultMessage: "Failed to fetch data to sign.",
        link: "#6"
    },
    SIGNATURE_OUT_OF_BOUNDS: {
        id: "error.SIGNATURE_OUT_OF_BOUNDS",
        defaultMessage: "The position of the new signature field is outside of the page dimensions."
    },
    SIGN_CERT_EXPIRED: {
        id: "error.SIGN_CERT_EXPIRED",
        defaultMessage: "The certificate is expired."
    },
    CERT_CHAIN_INCOMPLETE: {
        id: "error.CERT_CHAIN_INCOMPLETE",
        defaultMessage: "The certificate chain is incomplete.",
        link: "#5"
        },
    NO_SIGN_CERT: {
        id: "error.NO_SIGN_CERT",
        defaultMessage: "No signing certificate provided.",
        link: "#9"
    },
    INVALID_SIG_DATE: {
        id: "error.INVALID_SIG_DATE",
        defaultMessage: "Signing date out of bounds.",
        link: "#7"
    },
    INVALID_S3_LOGIN: {
        id: "error.INVALID_S3_LOGIN",
        defaultMessage: "Invalid user name or password."
    },
    NO_CERT_TO_VALIDATE: {
        id: "error.NO_CERT_TO_VALIDATE",
        defaultMessage: "The certificate is missing."
    },
    NO_DOC_TO_VALIDATE: {
        id: "error.NO_DOC_TO_VALIDATE",
        defaultMessage: "A technical error happened, the document is not present.",
        link: "#8"
    },
    NO_TOKEN: {
        id: "error.NO_TOKEN",
        defaultMessage: "Required parameter token not provided.",
        link: "#10"
    },
    CERT_REVOKED: {
        id: "error.CERT_REVOKED",
        defaultMessage: "The certificate is revoked.",
        link: "#13"
    },
    DOC_CERT_REVOKED: {
        id: "error.DOC_CERT_REVOKED",
        defaultMessage: "This document can not be processed any further because it contains an invalid signature. Contact the document owner to resolve the problem."
    },
    INTERNAL_ERR: {
        id: "error.INTERNAL_ERR",
        defaultMessage: "Unexpected error happened."
    },
    UNKNOWN_PROFILE: {
        id: "error.UNKNOWN_PROFILE",
        defaultMessage: "Unknown signature profile."
    },
    EMPTY_PARAM: {
        id: "error.EMPTY_PARAM",
        defaultMessage: "Empty (null) parameter in request."
    },
    INVALID_TOKEN : {
        id: "error.INVALID_TOKEN",
        defaultMessage: "Invalid token in request.",
        link: "#10"
    },
    PARSE_ERROR : {
        id: "error.PARSE_ERROR",
        defaultMessage: "Couldn't parse request."
    },
    NOT_ALLOWED_TO_SIGN : {
        id: "error.NOT_ALLOWED_TO_SIGN",
        defaultMessage: "You do not have permission to sign this specific document. Please contact the owner of the document for more information."
    },
    SIGN_PERIOD_EXPIRED : {
        id: "error.SIGN_PERIOD_EXPIRED",
        defaultMessage: "Entering the PIN took too long."
    },
    INVALID_MAC_SCARD_DRIVER : {
        id: "error.INVALID_MAC_SCARD_DRIVER",
        defaultMessage: "Your MacOS Driver is invalid"
    }

})