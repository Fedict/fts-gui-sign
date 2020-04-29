import React from "react"
import { CardLoading } from "../../components/CardLoading/CardLoading"
import { resetWizard } from "../actions/WizardLogicActions"
import { connect } from "react-redux"

export class SigningPreSignLoading extends React.Component {

    render() {

        const { certificate, resetWizard, pinError } = this.props

        const isPinPadReader = (certificate
            && certificate.certificateSelected
            && certificate.certificateSelected.readerType
            && certificate.certificateSelected.readerType === "pinpad")

        return (
            <div className="row mt-3">
                <CardLoading title={"Sign document"}
                    hasCancelButton
                    cancelButtonText="Cancel"
                    onClickCancel={() => { resetWizard() }}
                >

                    {(isPinPadReader)
                        ? (
                            <div>
                                <div className="alert alert-info">
                                   Please enter your PIN when prompted
                                </div>
                            </div>
                        )
                        : null}
                    {(isPinPadReader
                        && pinError
                        && pinError.message)
                        ? (
                            <div>
                                <div className="alert alert-danger">
                                    {pinError.message}
                                </div>
                            </div>
                        )
                        : null}
                </CardLoading>
            </div>
        )

    }
}

const mapStateToProps = (state) => {
    return (state) => ({
        certificate: state.certificate,
        pinError: state.pinError
    })
}
const mapDispatchToProps = ({
    resetWizard
})

export default connect(mapStateToProps, mapDispatchToProps)(SigningPreSignLoading)