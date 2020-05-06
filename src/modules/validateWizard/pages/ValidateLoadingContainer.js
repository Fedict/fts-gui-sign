import React from 'react'
import { CardLoading } from '../../components/CardLoading/CardLoading'
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
                >

                </CardLoading>
        
        )
    }
}
const mapStateToProps = (state) => {
    return (state) => ({

    })
}
const mapDispatchToProps = ({
    validateDocument,
     resetWizard
})

export default connect(mapStateToProps, mapDispatchToProps)(ValidateLoadingContainer)