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
    BEID_LINK_ERROR : {
        id : "eid.link.error.general.text",
        defaultMessage : "Something went wrong. Please reload the page and try again."
    },
    CARD_BLOCKED_ERROR : {
        id : "eid.link.error.card.blocked",
        defaultMessage : "The eId card is blocked"
    },
    failedToFetchMetadata: {
        id: 'error.METADATA_FETCH',
        defaultMessage: 'Failed to fetch the metadata of the document'
    },
    noToken: {
        id: 'error.NO_TOKEN_IN_STATE',
        defaultMessage: 'Token not in redux state'
    },
    failedToSignWrongResultFromAPI: {
        id: 'error.WRONG_RESULT_SIGN_TOKEN',
        defaultMessage: 'Failed to sign the document'
    },
    failedToSign: {
        id: 'error.FAILED_TO_SIGN',
        defaultMessage: 'Failed to sign the document'
    },
    failedToFetchDataToSign: {
        id: 'error.FAILED_TO_FETCH_DATA_TO_SIGN',
        defaultMessage: 'Failed to fetch data to sign'
    },
    SIGN_CERT_EXPIRED: {
        id: 'error.SIGN_CERT_EXPIRED',
        defaultMessage: 'The certificate is expired'
    },
    CERT_CHAIN_INCOMPLETE: {
        id: 'error.CERT_CHAIN_INCOMPLETE',
        defaultMessage: 'The certificate chain is incomplete'
    },
    NO_SIGN_CERT: {
        id: 'error.NO_SIGN_CERT',
        defaultMessage: 'No signing certificate provided'
    },
    INVALID_SIG_DATE: {
        id: 'error.INVALID_SIG_DATE',
        defaultMessage: 'Signing date out of bounds'
    },
    INVALID_S3_LOGIN: {
        id: 'error.INVALID_S3_LOGIN',
        defaultMessage: 'Invalid user name or password'
    },
    NO_CERT_TO_VALIDATE: {
        id: 'error.NO_CERT_TO_VALIDATE',
        defaultMessage: 'The certificate is missing'
    },
    NO_DOC_TO_VALIDATE: {
        id: 'error.NO_DOC_TO_VALIDATE',
        defaultMessage: 'A technical error happened, the document is not present'
    },
    NO_TOKEN: {
        id: 'error.NO_TOKEN',
        defaultMessage: 'Required parameter token not provided'
    },
    CERT_REVOKED: {
        id: 'error.CERT_REVOKED',
        defaultMessage: 'The certificate is revoked'
    },
    INTERNAL_ERR: {
        id: 'error.INTERNAL_ERR',
        defaultMessage: 'Unexpected error happened'
    },
    UNKNOWN_PROFILE: {
        id: 'error.UNKNOWN_PROFILE',
        defaultMessage: 'Unknown signature profile'
    },
    EMPTY_PARAM: {
        id: 'error.EMPTY_PARAM',
        defaultMessage: 'Empty (null) parameter in request'
    },
    INVALID_TOKEN : {
        id: 'error.INVALID_TOKEN',
        defaultMessage: 'Invalid token in request'
    },
    PARSE_ERROR : {
        id: 'error.PARSE_ERROR',
        defaultMessage: 'Coudln\'t parse request'
    }

})