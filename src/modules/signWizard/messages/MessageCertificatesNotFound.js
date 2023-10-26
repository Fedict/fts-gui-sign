import { WIZARD_STATE_CERTIFICATES_LOADING } from "../../wizard/WizardConstants";
import {defineMessages} from "react-intl";

const messages = defineMessages({
    title : {
        id : 'error.certificates.not_found.title',
        defaultMessage : "No valid certificates found."
    },
    text : {
        id : 'error.certificates.not_found.text',
        defaultMessage : "There are no (valid) signing certificates found.",
    },
    link : {
        id : 'error.certificates.not_found.link',
        defaultMessage : "Please check our FAQ",
    },
    next : {
        id : 'error.certificates.not_found.next',
        defaultMessage : "Search again"
    }
})

export const MessageCertificatesNotFound = {
    title: messages.title,
    message: messages.text,
    link: messages.link,
    linkURL: "TODO FILL ME!",
    body: null,
    nextButton: {
        text: messages.next,
        isVisible: true,
        nextPage: WIZARD_STATE_CERTIFICATES_LOADING
    },
    hasCancelButton: true
}