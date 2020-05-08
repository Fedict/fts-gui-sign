import React from 'react'
import { CardLoading } from '../../components/Card/CardLoading'
import { connect } from 'react-redux'
import { getCertificates } from "../actions/WizardLogicActions"
import { resetWizard } from '../actions/WizardLogicActions'

export class CertificatesLoadingContainer extends React.Component {

    componentDidMount() {
        this.props.getCertificates()
    }

    render() {
        const { resetWizard } = this.props
        return (
           
                <CardLoading title={"Retrieving certificates"}
                    hasCancelButton
                    cancelButtonText="Cancel"
                    onClickCancel={() => { resetWizard() }}
                >

                </CardLoading>
            
        )
    }

}

const mapDispatchToProps = ({
    getCertificates,
     resetWizard
})

export default connect(null, mapDispatchToProps)(CertificatesLoadingContainer)