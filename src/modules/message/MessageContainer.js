import React from 'react'
import { connect } from 'react-redux'
import { navigateToStep } from "../wizard/WizardActions"
import { messageTypes, ErrorGeneral } from './MessageConstants'
import { CardError } from '../components/Card/CardError'
import { CardInfo } from '../components/Card/CardInfo'
import { resetWizard } from '../signWizard/actions/WizardLogicActions'


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