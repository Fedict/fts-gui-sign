import { ErrorGeneral } from "./ErrorGeneral";

//TODO create correct messages
export const Error_EID_http_status_0 = ErrorGeneral

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
export const Error_EID_no_reader_InSession = {
    ...createError("De eID lezer is verwijderd", "De eId lezer is verwijderd")
}

export const Error_EID_no_reader_NotInSession = {
    ...createError("Geen eID lezer gevonden", "Er is geen eID lezer gevonden.")
}

export const Error_EID_unsupported_reader = {
    ...createError("eID lezer is niet ondersteunt", "deze applicatie onderstuert deze reader niet")
}

export const Error_EID_no_card_InSession = {
    ...createError("De eID kaart is verwijderd", "De eId kaart is verwijderd")
}

export const Error_EID_no_card_NotInSession = {
    ...createError("Geen eID kaart gevonden", "Er is geen eID kaart gevonden.")
}

export const Error_EID_card_error = {
    ...createError("Er is iets fout gegaan", "Er is iets fout gegaan met de kaart")
}

export const Error_EID_card_blocked = {
    ...createError("Kaart is geblokeerd", "Kaart is geblokeerd")
}