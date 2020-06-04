import React from 'react'
import { CardLoading } from '../../components/Card/CardLoading'
import { connect } from 'react-redux'
import { validateCertificateChain, resetWizard } from "../actions/WizardLogicActions"

export class CertificateValidateChainContainer extends React.Component {
    componentDidMount() {
        this.props.validateCertificateChain()
    }

    render() {

        const { resetWizard } = this.props
        return (
           
                <CardLoading title={"Validating certificates"}
                    hasCancelButton
                    cancelButtonText="Cancel"
                    onClickCancel={() => { resetWizard() }}
                >

                </CardLoading>
          
        )
    }
}

const mapDispatchToProps = ({
    validateCertificateChain,
     resetWizard
})

export default connect(null, mapDispatchToProps)(CertificateValidateChainContainer)