import { WIZARD_STATE_CERTIFICATES_LOADING } from "../../wizard/WizardConstants";
import {defineMessages} from "react-intl";

const messages = defineMessages({
    title : {
        id : 'error.certificates.not_found.title',
        defaultMessage : "No valid Certificates found"
    },
    text : {
        id : 'error.certificates.not_found.text',
        defaultMessage : "There are no (valid) signing certificates found."
    },
    next : {
        id : 'error.certificates.not_found.next',
        defaultMessage : "Search again"
    }
})

export const MessageCertificatesNotFound = {
    title: messages.title,
    message: messages.text,
    body: null,
    nextButton: {
        text: messages.next,
        isVisible: true,
        nextPage: WIZARD_STATE_CERTIFICATES_LOADING
    },
    hasCancleButton: true
}