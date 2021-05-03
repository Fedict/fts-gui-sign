import { MESSAGE_SET_INFO, MESSAGE_SET_ERROR } from "../actions/MessageActions"
import { messageTypes } from "../MessageConstants"
import { STORE_RESET } from "../../../store/storeActions"

export const initialState = {
    type: "", //ERROR, INFO 
    title: "", //title of the card
    message: "", //message in a highlighted body
    body: "", //body under highlighted part
    nextButton: {
        text: "", //text on the button
        isVisible: "",//the button is visible
        nextPage: ""//the name of the page where the butons navigates to
    },
    ref : "",
    errorDetails : "",
    hasCancelButton: "" //the button is visible
}

/**
 * reducer for the messageHandling
 */
const MessageReducer = (state = initialState, action) => {
    switch (action.type) {
        case MESSAGE_SET_ERROR: {
            return {
                ...state,
                type: messageTypes.ERROR,
                ...action.payload
            }
        }
        case MESSAGE_SET_INFO: {
            return {
                ...state,
                type: messageTypes.INFO,
                ...action.payload
            }
        }
        case STORE_RESET:
            return initialState
        default:
            return state
    }
}

export default MessageReducer