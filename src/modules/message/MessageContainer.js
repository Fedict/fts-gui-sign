import React from 'react'
import { connect } from 'react-redux'
import { navigateToStep } from "../wizard/WizardActions"
import { messageTypes, ErrorGeneral } from './MessageConstants'
import { CardError } from '../components/Card/CardError'
import { CardInfo } from '../components/Card/CardInfo'
import { resetWizard } from '../signWizard/actions/WizardLogicActions'

/**
 * a card that shows a message and has a cancel and next button
 * @param {object} props
 * @param {object} [props.message] - message object 
 * @param {node} [props.message.title] - title of the message card
 * @param {node} [props.message.message] - text in the highlighted part of the message
 * @param {node} [props.message.body] - text under the highlighted box
 * @param {object} [props.message.nextButton] - information about the nextbutton of the message card
 * @param {node} [props.message.nextButton.text] - text on the nexty button
 * @param {boolean} [props.message.nextButton.isVisible] - indicates if the button is visible
 * @param {string} [props.message.nextButton.nextPage] - Wizard id of the page where the nextbutton has to navigate to
 * @param {string} [props.message.hasCancleButton] - indicates if the cancel button is visible
 * @param {function} [props.navigateToStep] - action to navigate to a page
 * @param {function} [props.onCancel] - onCancel callback
 */
export const MessageContainer = ({ message, navigateToStep, onCancel }) => {

    const handleButtonNextClick = () => {
        if (message && message.nextButton && message.nextButton.nextPage) {
            navigateToStep(message.nextButton.nextPage)
        }

    }

    let shownMessage = {}
    if (message) {
        shownMessage = {
            ...message
        }
        if (message.nextButton) {
            shownMessage.nextButton = { ...message.nextButton }
        }
        else {
            shownMessage.nextButton = { isVisible: false }
        }
    }
    else {
        shownMessage = ErrorGeneral
    }

    let Container = CardError
    if (shownMessage.type === messageTypes.INFO) {
        Container = CardInfo
    }

    return (

        <Container
            title={shownMessage.title}
            hasCancelButton={shownMessage.hasCancleButton}
            cancelButtonText="Cancel"
            onClickCancel={() => {
                if (onCancel) {
                    onCancel()
                }
            }}
            hasNextButton={shownMessage.nextButton.isVisible}
            nextButtonText={shownMessage.nextButton.text}
            onClickNext={() => { handleButtonNextClick() }}

            text={shownMessage.message}
        >
            {shownMessage.body}
        </Container>

    )


}
const mapStateToProps = (state) => {
    return (state) => ({
        message: state.message
    })
}
const mapDispatchToProps = ({
    navigateToStep,
    resetWizard,
})

export default connect(mapStateToProps, mapDispatchToProps)(MessageContainer)