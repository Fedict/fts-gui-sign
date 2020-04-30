import { messageTypes } from "../MessageConstants";

export const ErrorGeneral = {

    type: messageTypes.ERROR,
    title: "Something went wrong",
    message: "Something went wrong. Please reload the page and try again.",
    body: null,
    nextButton: {
        text: null,
        isVisible: false,
        nextPage: null
    },
    hasCancleButton: true
}