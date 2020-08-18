import React from "react"
import { CardLoading } from "../../components/Card/CardLoading"
import { resetWizard } from "../actions/WizardLogicActions"
import { connect } from "react-redux"

export const SigningPreSignLoading = ({ certificate, resetWizard }) => {

    const isPinPadReader = (certificate
        && certificate.certificateSelected
        && certificate.certificateSelected.readerType
        && certificate.certificateSelected.readerType === "pinpad")

    const certificateName = (certificate
        && certificate.certificateSelected
        && certificate.certificateSelected.commonName)
        ? " for " + certificate.certificateSelected.commonName + " "
        : ""
    return (
        <CardLoading title={"Sign document"}
            hasCancelButton
            cancelButtonText="Cancel"
            onClickCancel={() => { resetWizard() }}
        >
            {(isPinPadReader)
                ? (
                    <div>
                        <div className="alert alert-info">
                            Please enter the PIN {certificateName} when prompted
                                </div>
                    </div>
                )
                : null}
        </CardLoading>
    )
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