import React from 'react'
import { connect } from 'react-redux'
import { MessageContainer } from '../message/MessageContainer'
import { ErrorGeneral } from '../message/MessageConstants'
import { resetWizard } from "./actions/WizardLogicActions"
import { WIZARD_STATE_UPLOAD, WIZARD_STATE_START, WIZARD_STATE_VALIDATE_LOADING, WIZARD_STATE_RESULT, WIZARD_STATE_MESSAGE } from '../wizard/WizardConstants'
import UploadFileContainer from './pages/UploadFileContainer'
import ValidateLoadingContainer from './pages/ValidateLoadingContainer'
import ResultContainer from './pages/ResultContainer'
import DisplayFile from '../fileUpload/components/UploadDisplayFile/UploadDisplayFile'

export const ValidateWizardContainer = ({ wizard, reader, resetWizard }) => {
    let content = null;
    switch (wizard.state) {
        case WIZARD_STATE_START:
            content = <UploadFileContainer />
            break;
        case WIZARD_STATE_UPLOAD:
            content = <UploadFileContainer />
            break;
        case WIZARD_STATE_VALIDATE_LOADING:
            content = <ValidateLoadingContainer />
            break;
        case WIZARD_STATE_RESULT:
            content = <ResultContainer />
            break;
        case WIZARD_STATE_MESSAGE:
            content = <MessageContainer onCancel={() => { (resetWizard()) }} />
            break;
        default:
            content = <MessageContainer message={ErrorGeneral} onCancel={() => { resetWizard() }} />
            break;
    }
    return (
        <div >
            <div className={"row mx-5 mt-3"}>
                <div className={"col col-sm-7"} style={{ minWidth: '320px' }}>
                    <DisplayFile />
                </div>
                <div className={"col col-sm-5"}>
                    {content}
                </div>
            </div>
        </div >)
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