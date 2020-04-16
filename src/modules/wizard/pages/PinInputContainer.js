import React from 'react'

import { connect } from 'react-redux';
import { CardContainer } from '../../components/CardContainer/CardContainer';
import { sign, resetWizard } from '../actions/WizardLogicActions'
import { navigateToStep } from '../actions/WizardActions';
import { WIZARD_STATE_SIGNING_PRESIGN_LOADING } from '../wizard/WizardConstants';
export class PinInputContainer extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            pin: ""
        }
    }
    componentDidMount() {
        document.getElementById('input_code').focus()
    }
    onchange(e) {
        const pin = e.target.value
        this.setState({ pin: pin })
    }

    handleSubmit() {
        this.props.sign(this.state.pin)
        this.props.navigateToStep(WIZARD_STATE_SIGNING_PRESIGN_LOADING)

    }

    render() {
        const { resetWizard, pinError } = this.props
        return (
            <div className="row mt-3">
                <CardContainer
                    title={"Digitaal handtekenen"}
                    hasNextButton
                    hasCancelButton
                    cancelButtonText="Cancel"
                    onClickCancel={() => { resetWizard() }}
                    nextButtonText="handtekenen met eID"
                    onClickNext={() => { this.handleSubmit() }}
                    nextButtonIsDisabled={this.state.pin.length === 0}>

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
                            <div className="col-auto">
                                <input
                                    type="password"
                                    className="form-control"
                                    id="input_code"
                                    value={this.state.pin}
                                    onChange={(e) => { this.onchange(e) }} />
                            </div>

                        </div>
                    </div>
                </CardContainer>

            </div>
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
