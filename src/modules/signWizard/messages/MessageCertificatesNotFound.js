import { WIZARD_STATE_CERTIFICATES_LOADING } from "../../wizard/WizardConstants";

export const MessageCertificatesNotFound = {
    title: "No valid Certificates found",
    message: "There are no (valid) signing certificates found.",
    body: null,
    nextButton: {
        text: "Search again",
        isVisible: true,
        nextPage: WIZARD_STATE_CERTIFICATES_LOADING
    },
    hasCancleButton: true
}