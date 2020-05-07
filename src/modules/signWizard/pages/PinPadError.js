import React from 'react'
import { connect } from 'react-redux'
import { CardError } from '../../components/Card/CardError'
import { resetWizard, navigateToSign } from "../actions/WizardLogicActions"

export class PinPadError extends React.Component {

    onClickCancel() {
        this.props.resetWizard()
    }

    onClickNext() {
        this.props.navigateToSign()
    }
    render() {

        const { pinError } = this.props
        if (pinError && pinError.message) {
            return (
                <CardError
                    title={"The entered pincode is wrong"}
                    hasCancelButton={true}
                    cancelButtonText={'Cancel'}
                    onClickCancel={() => { this.onClickCancel() }}
                    hasNextButton={true}
                    nextButtonText={'Try again'}
                    onClickNext={() => { this.onClickNext() }}
                    text={pinError.message}
                >

                </CardError>
            )
        }
        else {
            //todo create general error
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