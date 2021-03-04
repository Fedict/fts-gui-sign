import React from 'react'
import { CardLoading } from '../../components/Card/CardLoading'
import { connect } from 'react-redux'
import {getDigestForToken} from "../actions/TokenActions";
import {defineMessages, injectIntl} from "react-intl";
import {definedMessages} from "../../i18n/translations";
import {resetWizard} from "../../signWizard/actions/WizardLogicActions";

const messages = defineMessages({
    "Signing document" : {
        id : "digestLoading.title",
        defaultMessage : "Signing document"
    }
})

export class DigestForTokenLoadingContainer extends React.Component {
    componentDidMount() {
        this.props.getDigestForToken()
    }

    render() {
        const { resetWizard, intl } = this.props
        return (
                <CardLoading
                    title={intl.formatMessage(messages["Signing document"])}
                    hasCancelButton
                    cancelButtonText={intl.formatMessage(definedMessages.cancel)}
                    onClickCancel={resetWizard}
                />
        )
    }
}

const mapDispatchToProps = ({
    getDigestForToken,
    resetWizard
})

export default connect(null, mapDispatchToProps)(injectIntl(DigestForTokenLoadingContainer))