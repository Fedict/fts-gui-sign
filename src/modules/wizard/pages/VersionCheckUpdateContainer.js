import React from 'react'
import { connect } from 'react-redux'
import { CardContainer } from '../../components/CardContainer/CardContainer'
import { navigateToStep } from "../actions/WizardActions"
import { WIZARD_STATE_VERSION_CHECK_LOADING } from '../wizard/WizardConstants'
import { resetWizard } from '../actions/WizardLogicActions'
export class VersionCheckUpdateContainer extends React.Component {

    //TODO loop to check if correct version is installed
    handleButtonNextClick() {
        this.props.navigateToStep(WIZARD_STATE_VERSION_CHECK_LOADING)
    }

    render() {

        const { resetWizard } = this.props
        return (
            <div className="row mt-3">
                <CardContainer title={"Update eID link"}
                    hasCancelButton
                    cancelButtonText="Cancel"

                    onClickCancel={() => { resetWizard() }}
                    hasNextButton
                    nextButtonText="ga verder"
                    onClickNext={() => { this.handleButtonNextClick() }}
                >
                    <p>De geïnstaleerde versie van eIDLink is niet up to date.</p>
                    <p>Gelieve een nieuwe versie van eIDLink te instaleren om gebruik te kunnen maken van deze applicatie</p>

                    <button className="btn btn-primary" id="button_install_eID">Download en installeer eIDLink</button>

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

export default connect(mapStateToProps, mapDispatchToProps)(VersionCheckUpdateContainer)