import React from 'react'
import { CardLoading } from '../../components/Card/CardLoading'
import { connect } from 'react-redux'
import { validateCertificates, resetWizard } from "../actions/WizardLogicActions"

export class ValidateLoadingContainer extends React.Component {
    componentDidMount() {
        this.props.validateCertificates()
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
    validateCertificates,
     resetWizard
})

export default connect(null, mapDispatchToProps)(ValidateLoadingContainer)