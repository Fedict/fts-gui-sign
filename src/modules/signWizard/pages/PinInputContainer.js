import React from 'react'

import { connect } from 'react-redux';
import { CardContainer } from '../../components/Card/CardContainer';
import { sign, resetWizard } from '../actions/WizardLogicActions'
import { navigateToStep } from '../../wizard/WizardActions';
import { WIZARD_STATE_SIGNING_PRESIGN_LOADING } from '../../wizard/WizardConstants';

export class PinInputContainer extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            pin: ""
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
        if (e.key === 'Enter') {
            if (pincode.length >= 4) {
                this.handleSubmit()
            }
        }
        else {
            if (e.key === 'Backspace') {

                pincode = pincode.substr(0, pincode.length - 1)
                this.setState({ pin: pincode })
            }
            if (e.key.length === 1) {
                if (pincode.length < 12) {
                    pincode = pincode + e.key
                    this.setState({ pin: pincode })
                }
            }
            else {
            }
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
        const { resetWizard, pinError } = this.props
        const { pin } = this.state
        const pinstring = "*".repeat(pin.length)
        return (

            <CardContainer
                title={"Enter pin code"}
                hasNextButton
                hasCancelButton
                cancelButtonText="Cancel"
                onClickCancel={() => { resetWizard() }}
                nextButtonText="Sign with eId"
                onClickNext={() => { this.handleSubmit() }}
                nextButtonIsDisabled={pin.length < 4}>

                <div className="form-group">
                    <p>Geef uw pincode in</p>
                    {(pinError && pinError.message)
                        ? (
                            <div className="text-center">
                                <div className="alert alert-danger">
                                    {pinError.message}
                                </div>
                            </div>)
                        : null}
                    <div className="row mb-2">
                        <div className="col-6">
                            <div
                                className=" form-control"
                                id="input_code"
                            >{pinstring}</div>
                        </div>

                    </div>
                </div>
            </CardContainer>
        )
    }
}

const mapStateToProps = (state) => {
    return (state) => ({
        pinError: state.pinError
    })
}

const mapDispatchToProps = ({
    sign,
    resetWizard,
    navigateToStep
})

export default connect(mapStateToProps, mapDispatchToProps)(PinInputContainer)
