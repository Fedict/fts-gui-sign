import {defineMessages} from "react-intl";


export const definedMessages = defineMessages({
    cancel : {
        id : "button.cancel",
        defaultMessage : "Cancel"
    },
    retry : {
        id : "button.retry",
        defaultMessage : "Try again"
    },
    start : {
        id : "button.start",
        defaultMessage : "Start"
    }
})

export const errorMessages = defineMessages({
    failedToFetchMetadata : {
        id : 'error.METADATA_FETCH',
        defaultMessage : 'Failed to fetch the metadata of the document'
    },
    noToken : {
        id : 'error.NO_TOKEN',
        defaultMessage : 'Token not in redux state'
    },
    failedToSignWrongResultFromAPI : {
        id : 'error.WRONG_RESULT_SIGN_TOKEN',
        defaultMessage : 'Failed to sign the document'
    },
    failedToSign : {
        id : 'error.FAILED_TO_SIGN',
        defaultMessage : 'Failed to sign the document'
    }

})