import React from "react"
import {navigateToSign, resetWizard} from "../actions/WizardLogicActions"
import { connect } from "react-redux"
import {definedMessages} from "../../i18n/translations";
import {defineMessages, FormattedMessage, injectIntl} from "react-intl";
import {getIsPinPadReader} from "../reducers/CertificateReducer";
import ChangeAutoDownloadOption from "../../components/ChangeAutoDownloadOption/ChangeAutoDownloadOption";
import {boldedText} from "../../utils/reactIntlUtils";
import {CardContainer} from "../../components/Card/CardContainer";
import {LoadingSpinner} from "../../components/LoadingSpinner/LoadingSpinner";


const messages = defineMessages({
    title: {
        id: "signing.presign.title",
        defaultMessage: "Sign document"
    }
})

export const SigningPreSignLoading = ({ certificate, resetWizard, intl, pinError, navigateToSign }) => {

    const isPinPadReader = getIsPinPadReader(certificate)

    const certificateName = (certificate
        && certificate.certificateSelected
        && certificate.certificateSelected.commonName)
        ? " for " + certificate.certificateSelected.commonName + " "
        : ""
    return (
        <CardContainer title={intl.formatMessage(messages.title)}
            hasCancelButton
            cancelButtonText={intl.formatMessage(definedMessages.cancel)}
            onClickCancel={() => { resetWizard() }}
            hasNextButton={pinError && pinError.message !== undefined}
            nextButtonText={intl.formatMessage(definedMessages.retry)}
            onClickNext={() => navigateToSign()}
        >
            {(isPinPadReader)
                ? (
                    <div style={{textAlign:'left'}}>
                        <p>
                            <FormattedMessage id="signing.presign.text" defaultMessage="Please enter the PIN {certificateName} when prompted" values={{certificateName, b : boldedText, newLine : <br/>}} />
                        </p>
                        <ChangeAutoDownloadOption />
                        {(pinError && pinError.message)
                            ? (
                                <div className="text-center">
                                    <div className="alert alert-danger">
                                        {pinError.message.id?intl.formatMessage(pinError.message):pinError.message}
                                    </div>
                                </div>)
                            : <div className="text-center"><LoadingSpinner /></div>}
                    </div>

                )
                : <div className="text-center"><LoadingSpinner /></div>}
        </CardContainer>
    )
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

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(SigningPreSignLoading))