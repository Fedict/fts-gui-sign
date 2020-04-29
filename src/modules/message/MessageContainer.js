import React from 'react'
import { connect } from 'react-redux'
import { navigateToStep } from "../wizard/actions/WizardActions"
import { ErrorGeneral } from '../signWizard/messages/ErrorGeneral'
import { messageTypes } from './MessageConstants'
import { CardError } from '../components/CardError/CardError'
import { CardInfo } from '../components/CardInfo/CardInfo'
import { resetWizard } from '../signWizard/actions/WizardLogicActions'


export class MessageContainer extends React.Component {


    handleButtonNextClick() {
        const { message } = this.props
        if (message && message.nextButton && message.nextButton.nextPage) {
            this.props.navigateToStep(message.nextButton.nextPage)
        }

    }

    render() {
        const { message, resetWizard } = this.props

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
            <div className="row mt-3">
                <Container
                    title={shownMessage.title}
                    hasCancelButton={shownMessage.hasCancleButton}
                    cancelButtonText="Cancel"
                    onClickCancel={() => { resetWizard() }}
                    hasNextButton={shownMessage.nextButton.isVisible}
                    nextButtonText={shownMessage.nextButton.text}
                    onClickNext={() => { this.handleButtonNextClick() }}

                    text={shownMessage.message}
                >
                    {shownMessage.body}
                </Container>
            </div>
        )

    }
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