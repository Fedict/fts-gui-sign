import {WIZARD_CHANGE_AUTO_DOWNLOAD_OPTION, WIZARD_CHANGE_STATE} from "./WizardActions"
import { WIZARD_STATE_START } from "./WizardConstants"
import { STORE_RESET } from "../../store/storeActions"
import { getRequestId } from "./WizardHelper"

export const initialState = {
    state: WIZARD_STATE_START,
}

const wizardReducer = (state = initialState, action) => {
    switch (action.type) {
        case WIZARD_CHANGE_STATE: {
            return {
                ...state,
                "state": action.payload,
            }
        }
        case STORE_RESET: {
            return {
                ...state,
            }
        }
        case WIZARD_CHANGE_AUTO_DOWNLOAD_OPTION:{
            return {
                ...state,
                autoDownloadDocument : action.payload
            }
        }
        default:
            return state
    }
}

export default wizardReducer