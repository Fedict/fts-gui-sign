import React from 'react'

import { connect } from 'react-redux'

import { MessageContainer } from '../message/MessageContainer'
import { ErrorGeneral } from '../message/MessageConstants'
import { resetWizard } from "./actions/WizardLogicActions"
import { WIZARD_STATE_UPLOAD, WIZARD_STATE_START, WIZARD_STATE_VALIDATE_LOADING, WIZARD_STATE_RESULT, WIZARD_STATE_MESSAGE } from '../wizard/WizardConstants'
import UploadFileContainer from './pages/UploadFileContainer'
import ValidateLoadingContainer from './pages/ValidateLoadingContainer'
import ResultContainer from './pages/ResultContainer'
import MessageContainerWithStore from '../message/MessageContainer'

export const ValidateWizardContainer = ({ wizard, reader, resetWizard }) => {


    switch (wizard.state) {


        case WIZARD_STATE_START:
        case WIZARD_STATE_UPLOAD:
            return <UploadFileContainer />

        case WIZARD_STATE_VALIDATE_LOADING:
            return <ValidateLoadingContainer />

        case WIZARD_STATE_RESULT:
            return <ResultContainer />

        case WIZARD_STATE_MESSAGE:
            return <MessageContainerWithStore onCancel={() => { (resetWizard()) }} />
        default:
            return <MessageContainer message={ErrorGeneral} onCancel={() => { resetWizard() }} />
    }


}


const mapStateToProps = (state) => {
    return (state) => ({
        wizard: state.wizard,

    })
}
const mapDispatchToProps = ({
    resetWizard
})

export default connect(mapStateToProps, mapDispatchToProps)(ValidateWizardContainer)