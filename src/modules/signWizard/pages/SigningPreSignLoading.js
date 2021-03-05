import React from "react"
import { CardLoading } from "../../components/Card/CardLoading"
import { resetWizard } from "../actions/WizardLogicActions"
import { connect } from "react-redux"
import {definedMessages} from "../../i18n/translations";
import {defineMessages, FormattedMessage, injectIntl} from "react-intl";
import {getIsPinPadReader} from "../reducers/CertificateReducer";


const messages = defineMessages({
    title: {
        id: "signing.presign.title",
        defaultMessage: "Sign document"
    }
})

export const SigningPreSignLoading = ({ certificate, resetWizard, intl }) => {

    const isPinPadReader = getIsPinPadReader(certificate)

    const certificateName = (certificate
        && certificate.certificateSelected
        && certificate.certificateSelected.commonName)
        ? " for " + certificate.certificateSelected.commonName + " "
        : ""
    return (
        <CardLoading title={intl.formatMessage(messages.title)}
            hasCancelButton
            cancelButtonText={intl.formatMessage(definedMessages.cancel)}
            onClickCancel={() => { resetWizard() }}
        >
            {(isPinPadReader)
                ? (
                    <div>
                        <div className="alert alert-info">
                            <FormattedMessage id="signing.presign.text" defaultMessage="Please enter the PIN {certificateName} when prompted" values={{certificateName}} />
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

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(SigningPreSignLoading))