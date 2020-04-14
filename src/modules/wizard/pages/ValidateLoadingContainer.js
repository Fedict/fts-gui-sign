import React from 'react'
import { CardLoading } from '../../components/CardLoading/CardLoading'
import { connect } from 'react-redux'
import { validateCertificates, resetWizard } from "../actions/WizardLogicActions"

export class ValidateLoadingContainer extends React.Component {
    componentDidMount() {
        this.props.validateCertificates()
    }

    render() {

        const { resetWizard } = this.props
        return (
            <div className="row mt-3">
                <CardLoading title={"Valideren van certificaat"}
                    hasCancelButton
                    cancelButtonText="Cancel"
                    onClickCancel={() => { resetWizard() }}
                >

                </CardLoading>
            </div>
        )
    }
}
const mapStateToProps = (state) => {
    return (state) => ({

    })
}
const mapDispatchToProps = ({
    validateCertificates,
     resetWizard
})

export default connect(mapStateToProps, mapDispatchToProps)(ValidateLoadingContainer)