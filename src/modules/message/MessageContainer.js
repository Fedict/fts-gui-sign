import React from 'react'
import { connect } from 'react-redux'
import { navigateToStep } from "../wizard/WizardActions"
import { messageTypes, ErrorGeneral } from './MessageConstants'
import { CardError } from '../components/Card/CardError'
import { CardInfo } from '../components/Card/CardInfo'
import {doSendLogInfo, resetWizard} from '../signWizard/actions/WizardLogicActions'
import {injectIntl, useIntl} from "react-intl";
import {definedMessages} from "../i18n/translations";
import {faqURLs} from "../../const";

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
    const handleButtonClick = (buttonInfo, buttonType) => {
        if (buttonInfo) {
            if (buttonInfo.action) {
                buttonInfo.action(buttonInfo);
            }

            if (buttonInfo.nextPage) {
                doSendLogInfo('UI - ' + buttonType + "_BUTTON CLICKED");
                navigateToStep(buttonInfo.nextPage)
            }
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

    let Container = shownMessage.type === messageTypes.INFO ? CardInfo : CardError;

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
            onClickNext={() => { handleButtonClick(shownMessage.nextButton, 'RETRY') }}


            text={shownMessage.message}
            predButtonText = { shownMessage.predButton ? shownMessage.predButton.text : null }
            onClickPred = { () => { handleButtonClick(shownMessage.predButton, 'ACTUAL_RETRY') } }
        >
            {shownMessage.body && <p>{shownMessage.body.id ? intl.formatMessage(shownMessage.body) : shownMessage.body}</p>}

            {shownMessage.link && <a href={intl.formatMessage(faqURLs) + shownMessage.linkURL}>{intl.formatMessage(shownMessage.link)}</a>}
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