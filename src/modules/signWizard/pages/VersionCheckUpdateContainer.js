import React from 'react'
import { connect } from 'react-redux'
import { CardContainer } from '../../components/CardContainer/CardContainer'
import { navigateToStep } from "../../wizard/WizardActions"
import { WIZARD_STATE_VERSION_CHECK_LOADING } from '../../wizard/WizardConstants'
import { resetWizard } from '../actions/WizardLogicActions'
export class VersionCheckUpdateContainer extends React.Component {

    //TODO loop to check if correct version is installed
    handleButtonNextClick() {
        this.props.navigateToStep(WIZARD_STATE_VERSION_CHECK_LOADING)
    }

    render() {

        const { resetWizard } = this.props
        return (
            
                <CardContainer title={"Update eId link"}
                    hasCancelButton
                    cancelButtonText="Cancel"

                    onClickCancel={() => { resetWizard() }}
                    hasNextButton
                    nextButtonText="next"
                    onClickNext={() => { this.handleButtonNextClick() }}
                >
                    <p>The installed version of eId link is not up to date.</p>
                    <p>Please install the latest version of eIdlink to use this aplication </p>

                    <button className="btn btn-primary" id="button_install_eID">Download and install eId link</button>

                </CardContainer>
            
        )
    }
}
const mapStateToProps = (state) => {
    return (state) => ({

    })
}
const mapDispatchToProps = ({
    navigateToStep,
    resetWizard
})

export default connect(mapStateToProps, mapDispatchToProps)(VersionCheckUpdateContainer)