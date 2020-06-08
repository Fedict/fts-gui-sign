import { navigateToStep } from "../../wizard/WizardActions"
import { WIZARD_STATE_MESSAGE } from "../../wizard/WizardConstants"


export const MESSAGE_SET_ERROR = "MESSAGE_SET_ERROR"
export const MESSAGE_SET_INFO = "MESSAGE_SET_INFO"

/**
 * action to show a error message
 * - puts message information in the redux store
 * - navigates to the message page
 * @param {object} message - message information
 * @param {node} message.title - title of the message card
 * @param {node} message.message - text in the highlighted part of the message
 * @param {node} message.body - text under the highlighted box
 * @param {object} message.nextButton - information about the nextbutton of the message card
 * @param {node} message.nextButton.text - text on the nexty button
 * @param {boolean} message.nextButton.isVisible - indicates if the button is visible
 * @param {string} message.nextButton.nextPage - Wizard id of the page where the nextbutton has to navigate to
 * @param {string} message.hasCancleButton - indicates if the cancel button is visible
 */
export const showErrorMessage = (message) => (dispatch) => {
    dispatch({ type: MESSAGE_SET_ERROR, payload: message })
    dispatch(navigateToStep(WIZARD_STATE_MESSAGE))
}


/**
 * action to show a info message
 * - puts message information in the redux store
 * - navigates to the message page
 * @param {object} message - message information
 * @param {node} message.title - title of the message card
 * @param {node} message.message - text in the highlighted part of the message
 * @param {node} message.body - text under the highlighted box
 * @param {object} message.nextButton - information about the nextbutton of the message card
 * @param {node} message.nextButton.text - text on the nexty button
 * @param {boolean} message.nextButton.isVisible - indicates if the button is visible
 * @param {string} message.nextButton.nextPage - Wizard id of the page where the nextbutton has to navigate to
 * @param {string} message.hasCancleButton - indicates if the cancel button is visible
 */
export const showInfoMessage = (message) => (dispatch) => {
    dispatch({ type: MESSAGE_SET_INFO, payload: message })
    dispatch(navigateToStep(WIZARD_STATE_MESSAGE))
}
