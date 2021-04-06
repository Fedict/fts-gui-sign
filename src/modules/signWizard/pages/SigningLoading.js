import React from 'react'
import { CardLoading } from '../../components/Card/CardLoading'
import { connect } from 'react-redux'
import { resetWizard } from '../actions/WizardLogicActions'
import {defineMessages, injectIntl} from "react-intl";
import {definedMessages} from "../../i18n/translations";
const messages = defineMessages({
    title: {
        id: "signing.loading.title",
        defaultMessage: "Sign document"
    }
})
export const SigningLoadingContainer = ({ resetWizard, intl }) => {

    return (
        <CardLoading title={intl.formatMessage(messages.title)}
            hasCancelButton
            cancelButtonText={intl.formatMessage(definedMessages.cancel)}
            onClickCancel={() => { resetWizard() }}
        />
    )
}


const mapDispatchToProps = ({
    resetWizard
})

export default connect(null, mapDispatchToProps)(injectIntl(SigningLoadingContainer))