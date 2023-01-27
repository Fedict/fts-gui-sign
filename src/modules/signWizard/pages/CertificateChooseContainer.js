import React from 'react'
import { connect } from 'react-redux'
import { CardContainer } from '../../components/Card/CardContainer'
import { CertificateSelect } from '../../components/CertificateSelect/CertificateSelect'
import { WIZARD_STATE_CERTIFICATES_VALIDATE_CHAIN } from '../../wizard/WizardConstants'
import { navigateToStep } from '../../wizard/WizardActions'
import { selectCertificate } from "../actions/CertificateActions"
import { resetWizard } from '../actions/WizardLogicActions'
import {defineMessages, FormattedMessage, injectIntl} from "react-intl";
import {definedMessages} from "../../i18n/translations";

const messages = defineMessages({
    title: {
        id: "certificate.choose.title",
        defaultMessage: "Select a certificate"
    }
})

export class CertificateChooseContainer extends React.Component {

    onChange(cert) {
        const { selectCertificate } = this.props
        if (selectCertificate) {
            selectCertificate(cert)
        }
    }

    navigateToNextStep() {
        const { navigateToStep } = this.props
        if (navigateToStep) { navigateToStep(WIZARD_STATE_CERTIFICATES_VALIDATE_CHAIN) }
    }

    render() {

        const { certificate, resetWizard, intl } = this.props
        if (certificate) {
            return (
                <CardContainer
                    title={intl.formatMessage(messages.title)}
                    hasCancelButton
                    cancelButtonText={intl.formatMessage(definedMessages.cancel)}
                    onClickCancel={() => { resetWizard() }}
                    hasNextButton
                    nextButtonText={intl.formatMessage(definedMessages.select)}
                    onClickNext={() => { this.navigateToNextStep() }}
                    nextButtonIsDisabled={(certificate && !certificate.certificateSelected)}
                >
                    <p><FormattedMessage id="certificate.choose.text.1" defaultMessage="Multiple valid certificates were found. Please select the certificate you want to use."/></p>
                    <CertificateSelect
                        id="certificate_select"
                        onChange={(cert) => { this.onChange(cert) }}
                        certificates={certificate.certificateList} />
                </CardContainer>
            )
        }
        else {
            return null
        }
    }
}
const mapStateToProps = (state) => {
    return (state) => ({
        certificate: state.certificate
    })
}
const mapDispatchToProps = ({
    navigateToStep,
    selectCertificate,
    resetWizard

})

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(CertificateChooseContainer))