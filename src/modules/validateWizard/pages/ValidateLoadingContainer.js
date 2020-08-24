import React from 'react'
import { CardLoading } from '../../components/Card/CardLoading'
import { connect } from 'react-redux'
import { validateDocument, resetWizard } from "../actions/WizardLogicActions"

export class ValidateLoadingContainer extends React.Component {
    componentDidMount() {
        this.props.validateDocument()
    }

    render() {

        const { resetWizard } = this.props
        return (
                <CardLoading title={"Validating document"}
                    hasCancelButton
                    cancelButtonText="Cancel"
                    onClickCancel={() => { resetWizard() }}
               />
        )
    }
}

const mapDispatchToProps = ({
    validateDocument,
     resetWizard
})

export default connect(null, mapDispatchToProps)(ValidateLoadingContainer)