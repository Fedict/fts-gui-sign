import React from 'react'

import { connect } from 'react-redux'

import { MessageContainer } from '../message/MessageContainer'
import { ErrorGeneral } from '../message/MessageConstants'
import { resetWizard } from "./actions/wizardLogicActions"


export const ValidateWizardContainer = ({ wizard, reader, resetWizard }) => {


    switch (wizard.state) {



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