import React from 'react'
import { connect } from 'react-redux'
import { CardError } from '../../components/Card/CardError'
import { resetWizard, navigateToSign } from "../actions/WizardLogicActions"
import {defineMessages} from "react-intl";
import {definedMessages} from "../../i18n/translations";
const messages = defineMessages({
    title: {
        id: "pinpad.error.title",
        defaultMessage: "Pin entry error"
    }
})

export class PinPadError extends React.Component {

    onClickCancel() {
        this.props.resetWizard()
    }

    onClickNext() {
        this.props.navigateToSign()
    }
    
    render() {
        const { pinError, intl } = this.props
        if (pinError && pinError.message) {
            return (
                <CardError
                    title={intl.formatMessage(messages.title)}
                    hasCancelButton={true}
                    cancelButtonText={intl.formatMessage(definedMessages.cancel)}
                    onClickCancel={() => { this.onClickCancel() }}
                    hasNextButton={true}
                    nextButtonText={intl.formatMessage(definedMessages.retry)}
                    onClickNext={() => { this.onClickNext() }}
                    text={pinError.message}
               />
            )
        }
        else {
            return null
        }

    }
}

const mapStateToProps = (state) => {
    return (state) => ({
        certificate: state.certificate,
        pinError: state.pinError
    })
}
const mapDispatchToProps = ({
    resetWizard,
    navigateToSign
})

export default connect(mapStateToProps, mapDispatchToProps)(PinPadError)