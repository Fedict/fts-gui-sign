import React from 'react'
import { CardLoading } from '../../components/CardLoading/CardLoading'
import { connect } from 'react-redux'
import { getDigest, resetWizard } from "../actions/WizardLogicActions"

export class DigestLoadingContainer extends React.Component {
    componentDidMount() {
        this.props.getDigest()
    }

    render() {

        const { resetWizard } = this.props
        return (
            
                <CardLoading
                    title={"Signing document"}
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
    getDigest,
    resetWizard
})

export default connect(mapStateToProps, mapDispatchToProps)(DigestLoadingContainer)