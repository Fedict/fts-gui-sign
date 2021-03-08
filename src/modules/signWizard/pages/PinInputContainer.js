import React from 'react'

import { connect } from 'react-redux';
import { CardContainer } from '../../components/Card/CardContainer';
import { sign, resetWizard } from '../actions/WizardLogicActions'
import { navigateToStep } from '../../wizard/WizardActions';
import { WIZARD_STATE_SIGNING_PRESIGN_LOADING } from '../../wizard/WizardConstants';
import {defineMessages, FormattedMessage, injectIntl} from "react-intl";
import {definedMessages} from "../../i18n/translations";

const messages = defineMessages({
    title: {
        id: "signing.pininput.title",
        defaultMessage: "Enter pin code"
    },
    next: {
        id: "signing.pininput.button.sign",
        defaultMessage: "Sign with eId"
    }
})

export class PinInputContainer extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            pin: "",
            indexCursor : 0
        }

        this.onKeyUp = this.onKeyUp.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    componentDidMount() {
        document.addEventListener("keyup", this.onKeyUp)
    }

    componentWillUnmount() {
        document.removeEventListener("keyup", this.onKeyUp)
    }

    onKeyUp(e) {
        let pincode = this.state.pin + ""
        let indexCursor = this.state.indexCursor;
        if (e.key === 'Enter') {
            if (pincode.length >= 4) {
                this.handleSubmit()
            }
        } else if (e.key === 'Backspace') {
            pincode = pincode.substr(0, pincode.length - 1)
            this.setState({ pin: pincode, indexCursor : indexCursor - 1 })
        }else if (e.key === 'Delete'){
            pincode = pincode.substr(0, indexCursor) + pincode.substr(indexCursor + 1)
            this.setState({ pin: pincode, indexCursor })
        }else if (e.key === 'ArrowLeft'){
            this.setState({indexCursor : Math.max(0, indexCursor - 1)})
        }else if (e.key === 'ArrowRight'){
            this.setState({indexCursor : Math.min(pincode.length, indexCursor + 1)})
        }else if (e.key.length === 1) {
            if (pincode.length < 12) {
                pincode = pincode + e.key
                this.setState({ pin: pincode, indexCursor : indexCursor + 1 })
            }
        } else {
        }

    }

    onchange(e) {
        const pin = e.target.value
        this.setState({ pin: pin })
    }

    handleSubmit() {
        const { navigateToStep, sign } = this.props
        navigateToStep(WIZARD_STATE_SIGNING_PRESIGN_LOADING)
        sign(this.state.pin)
    }

    render() {
        const { resetWizard, pinError, certificate, intl } = this.props
        const { pin, indexCursor } = this.state
        const pinstring = "*".repeat(pin.length)
        return (

            <CardContainer
                title={intl.formatMessage(messages.title)}
                hasNextButton
                hasCancelButton
                cancelButtonText={intl.formatMessage(definedMessages.cancel)}
                onClickCancel={() => { resetWizard() }}
                nextButtonText={intl.formatMessage(messages.next)}
                onClickNext={() => { this.handleSubmit() }}
                nextButtonIsDisabled={pin.length < 4}>

                <div className="form-group">
                    <p>
                        {(certificate && certificate.certificateSelected && certificate.certificateSelected.commonName)
                            ? <FormattedMessage id="signing.pininput.textCommonName" defaultMessage="Enter the PIN for {commonName}" values={{commonName : certificate.certificateSelected.commonName}}/>
                            : <FormattedMessage id="signing.pininput.text" defaultMessage="Enter the PIN" />
                        }
                    </p>
                    {(pinError && pinError.message)
                        ? (
                            <div className="text-center">
                                <div className="alert alert-danger">
                                    {pinError.message.id?intl.formatMessage(pinError.message):pinError.message}
                                </div>
                            </div>)
                        : null}
                    <div className="row mb-2">
                        <div className="col-6">
                            <div
                                className=" form-control"
                                id="input_code"
                                data-testid="input_code"
                            >{pinstring.substr(0, indexCursor)}<span className="blinking-cursor">|</span>{pinstring.substr(indexCursor)}</div>
                        </div>

                    </div>
                </div>
            </CardContainer>
        )
    }
}

const mapStateToProps = (state) => {
    return (state) => ({
        pinError: state.pinError,
        certificate: state.certificate
    })
}

const mapDispatchToProps = ({
    sign,
    resetWizard,
    navigateToStep
})

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(PinInputContainer))
