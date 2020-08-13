import React from 'react'
import { connect } from 'react-redux'
import { CardContainer } from '../../components/Card/CardContainer'
import { CertificateSelect } from '../../components/CertificateSelect/CertificateSelect'
import { WIZARD_STATE_CERTIFICATES_VALIDATE_CHAIN } from '../../wizard/WizardConstants'
import { navigateToStep } from '../../wizard/WizardActions'
import { selectCertificate } from "../actions/CertificateActions"
import { resetWizard } from '../actions/WizardLogicActions'

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

        const { certificate, resetWizard } = this.props
        if (certificate) {
            return (
                <CardContainer
                    title="Select a certificate"
                    hasCancelButton
                    cancelButtonText="Cancel"
                    onClickCancel={() => { resetWizard() }}
                    hasNextButton
                    nextButtonText="Select"
                    onClickNext={() => { this.navigateToNextStep() }}
                    nextButtonIsDisabled={(certificate && !certificate.certificateSelected)}
                >
                    <p>Multiple valid certificates are found. Please select the certificate you want to use.</p>
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

export default connect(mapStateToProps, mapDispatchToProps)(CertificateChooseContainer)