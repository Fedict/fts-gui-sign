import { WIZARD_STATE_CERTIFICATES_LOADING } from "../../wizard/WizardConstants";

export const MessageCertificatesNotFound = {

    title: "Geen certificaten gevonden",
    message: "Er zijn geen certificaten gevonden. Probeer later opnieuw",
    body: null,
    nextButton: {
        text: "zoek opnieuw",
        isVisible: true,
        nextPage: WIZARD_STATE_CERTIFICATES_LOADING
    },
    hasCancleButton: true
}