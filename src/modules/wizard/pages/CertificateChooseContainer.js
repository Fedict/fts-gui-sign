import React from 'react'
import { connect } from 'react-redux'
import { CardContainer } from '../../components/CardContainer/CardContainer'
import { CertificateSelect } from '../../components/CertificateSelect/CertificateSelect'
import { WIZARD_STATE_DIGEST_LOADING } from '../wizard/WizardConstants'
import { navigateToStep } from '../actions/WizardActions'
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
        if (navigateToStep) { navigateToStep(WIZARD_STATE_DIGEST_LOADING) }
    }
    render() {

        const { certificate, resetWizard } = this.props
        if (certificate) {


            return (
                <div className="row mt-3">
                    <CardContainer
                        title="Selecteer een certificaat"
                        hasCancelButton
                        cancelButtonText="Cancel"
                        onClickCancel={() => { resetWizard() }}
                        hasNextButton
                        nextButtonText="Selecteer"
                        onClickNext={() => { this.navigateToNextStep() }}
                        nextButtonIsDisabled={(certificate && !certificate.certificateSelected)}
                    >
                        <p>Er zijn meerdere certificaten gevonden. Selecteer het certificaat dat u wilt gebruiken</p>
                        <CertificateSelect
                            id="certificate_select"
                            onChange={(cert) => { this.onChange(cert) }}
                            certificates={certificate.certificateList} />
                    </CardContainer>
                </div>
            )
        }
        else {
            //TODO return error message
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