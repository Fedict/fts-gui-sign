import React from 'react'
import { CardLoading } from '../../components/CardLoading/CardLoading'
import { connect } from 'react-redux'
import { checkVersion, resetWizard } from "../actions/WizardLogicActions"

export class VersionCheckLoadingContainer extends React.Component {
    componentDidMount() {
        setTimeout(() => {
            this.props.checkVersion()
        }, 1000);

    }

    render() {

        const { resetWizard } = this.props
        return (
           
                <CardLoading title={"Searching for eId reader"}
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
    checkVersion,
    resetWizard
})

export default connect(mapStateToProps, mapDispatchToProps)(VersionCheckLoadingContainer)