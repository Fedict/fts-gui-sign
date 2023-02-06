import React from 'react'
import { connect } from 'react-redux'
import { navigateToStep } from "../wizard/WizardActions"
import { messageTypes, ErrorGeneral } from './MessageConstants'
import { CardError } from '../components/Card/CardError'
import { CardInfo } from '../components/Card/CardInfo'
import {doSendLogInfo, resetWizard} from '../signWizard/actions/WizardLogicActions'
import {injectIntl, useIntl} from "react-intl";
import {definedMessages} from "../i18n/translations";

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
 * @param {string} [props.message.hasCancelButton] - indicates if the cancel button is visible
 * @param {function} [props.navigateToStep] - action to navigate to a page
 * @param {function} [props.onCancel] - onCancel callback
 */
const MessageContainer = ({ message, messageInStore, navigateToStep, onCancel,  doSendLogInfo }) => {
    const intl = useIntl();
    const handleButtonNextClick = () => {
        if (shownMessage && shownMessage.nextButton && shownMessage.nextButton.nextPage) {
            doSendLogInfo('UI - RETRY_BUTTON CLICKED');
            navigateToStep(shownMessage.nextButton.nextPage)
        }
    }

    let shownMessage = {}
    
    let actualMessage = message ? message : messageInStore;
    if (actualMessage) {
        shownMessage = {
            ...actualMessage
        }
        if (actualMessage.nextButton) {
            shownMessage.nextButton = { ...actualMessage.nextButton }
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
            hasCancelButton={shownMessage.hasCancelButton}
            cancelButtonText={intl.formatMessage(definedMessages.cancel)}
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
            {shownMessage.body? (
                shownMessage.body.id && intl.formatMessage(shownMessage.body)
            ):shownMessage.body}
        </Container>
    )
}

const mapStateToProps = (state) => {
    return (state) => ({
        messageInStore: state.message
    })
}

const mapDispatchToProps = ({
    navigateToStep,
    resetWizard,
    doSendLogInfo
})

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(MessageContainer))