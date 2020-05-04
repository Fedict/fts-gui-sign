import React from 'react'
import { connect } from 'react-redux'
import { CardContainer } from '../../components/CardContainer/CardContainer'
import { navigateToStep } from "../../wizard/WizardActions"
import { WIZARD_STATE_VERSION_CHECK_LOADING } from '../../wizard/WizardConstants'
import { resetWizard } from '../actions/WizardLogicActions'
export class VersionCheckInstallContainer extends React.Component {

    //TODO loop to check if correct version is installed
    handleButtonNextClick() {
        this.props.navigateToStep(WIZARD_STATE_VERSION_CHECK_LOADING)
    }

    handleOnClick() {
        if (window.configData && window.configData.eIDLinkUrl) {
            window.open(window.configData.eIDLinkUrl, "_blank")

        }


    }

    render() {
        const { resetWizard } = this.props

        return (
            <div className="row mt-3">
                <CardContainer title={"Install eId link"}
                    onClickCancel={() => { resetWizard() }}
                    hasNextButton
                    nextButtonText="Next"
                    onClickNext={() => { this.handleButtonNextClick() }}
                >
                    <p>No eId link is found</p>
                    <p>Please install eId link to use this application</p>

                    <button className="btn btn-primary" id="button_install_eID" onClick={() => { this.handleOnClick() }}>Download and install eId link</button>

                </CardContainer>
            </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(VersionCheckInstallContainer)