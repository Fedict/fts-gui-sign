import React from 'react'
import { CardLoading } from '../../components/Card/CardLoading'
import { connect } from 'react-redux'
import { checkVersion } from "../actions/WizardLogicActions"

export class VersionCheckLoadingContainer extends React.Component {
    componentDidMount() {
        setTimeout(() => {
            this.props.checkVersion()
        }, 1000);

    }

    render() {


        return (
           
                <CardLoading title={"Loading"}
                >

                </CardLoading>
            
        )
    }
}

const mapDispatchToProps = ({
    checkVersion,
})

export default connect(null, mapDispatchToProps)(VersionCheckLoadingContainer)