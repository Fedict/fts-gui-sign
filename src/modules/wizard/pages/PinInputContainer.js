import React from 'react'

import { connect } from 'react-redux';
import { CardContainer } from '../../components/CardContainer/CardContainer';
import { sign, resetWizard } from '../actions/WizardLogicActions'
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

    }

    render() {
        const { resetWizard } = this.props
        return (
            <div className="row mt-3">
                <CardContainer
                    title={"Digitaal handtekenen"}
                    hasNextButton
                    hasCancelButton
                    cancelButtonText="Cancel"
                    onClickCancel={() => { resetWizard() }}
                    nextButtonText="hantekenen met eID"
                    onClickNext={() => { this.handleSubmit() }}
                    nextButtonIsDisabled={this.state.pin.length === 0}>

                    <div className="form-group">
                        <p>Geef uw pincode in</p>
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
    })
}
const mapDispatchToProps = ({
    sign,
    resetWizard


})

export default connect(mapStateToProps, mapDispatchToProps)(PinInputContainer)
