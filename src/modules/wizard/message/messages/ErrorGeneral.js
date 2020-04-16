import { messageTypes } from "../MessageConstants";

export const ErrorGeneral = {

    type: messageTypes.ERROR,
    title: "Er is iets fout gegaan",
    message: "Er is iets fout gegaan. Herlaad de pagina en probeer opnieuw",
    body: null,
    nextButton: {
        text: null,
        isVisible: false,
        nextPage: null
    },
    hasCancleButton: true
}