import { WIZARD_STATE_CERTIFICATES_LOADING } from '../wizard/WizardConstants'


export const MessageCertificatesNotFound = {

    title: "certificaat is niet geldig",
    message: "Het gekozen certificaat is niet geldig",
    body: null,
    nextButton: {
        text: "Selecteer nieuw certificaat",
        isVisible: true,
        nextPage: WIZARD_STATE_CERTIFICATES_LOADING
    },
    hasCancleButton: true
}
