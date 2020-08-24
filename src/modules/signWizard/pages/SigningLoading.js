import React from 'react'
import { CardLoading } from '../../components/Card/CardLoading'
import { connect } from 'react-redux'
import { resetWizard } from '../actions/WizardLogicActions'

export const SigningLoadingContainer = ({ resetWizard }) => {

    return (
        <CardLoading title={"Sign document"}
            hasCancelButton
            cancelButtonText="Cancel"
            onClickCancel={() => { resetWizard() }}
        />
    )
}


const mapDispatchToProps = ({
    resetWizard
})

export default connect(null, mapDispatchToProps)(SigningLoadingContainer)