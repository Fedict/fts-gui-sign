import React from 'react'
import { injectIntl } from "react-intl";
import { CardLoading } from '../../components/Card/CardLoading'
import { connect } from 'react-redux'
import { getDigest, resetWizard } from "../actions/WizardLogicActions"

export class DigestLoadingContainer extends React.Component {
    componentDidMount() {
        this.props.getDigest(this.props.intl.locale)
    }

    render() {
        const { resetWizard } = this.props
        return (
                <CardLoading
                    title={"Signing document"}
                    hasCancelButton
                    cancelButtonText="Cancel"
                    onClickCancel={() => { resetWizard() }}
                />
        )
    }
}

const mapDispatchToProps = ({
    getDigest,
    resetWizard
})

export default connect(null, mapDispatchToProps)(injectIntl(DigestLoadingContainer))