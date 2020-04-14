import { messageTypes } from "../MessageConstants";

export const ErrorGeneral = {

    type: messageTypes.ERROR,
    title: "Er is iets fout gegaan",
    message: "er is iets fout gegaan. herlaad de pagina en probeer opnieuw",
    body: null,
    nextButton: {
        text: null,
        isVisible: false,
        nextPage: null
    },
    hasCancleButton: true
}