import React from 'react'
import { CardLoading } from '../../components/Card/CardLoading'
import { connect } from 'react-redux'
import { validateDocument, resetWizard } from "../actions/WizardLogicActions"
import {defineMessages, injectIntl} from "react-intl";
import {definedMessages} from "../../i18n/translations";
const messages = defineMessages({
    title: {
        id: "validate.loading.title",
        defaultMessage: "Validate document"
    }
})

export class ValidateLoadingContainer extends React.Component {
    componentDidMount() {
        this.props.validateDocument()
    }

    render() {

        const { resetWizard, intl } = this.props
        return (
                <CardLoading title={intl.formatMessage(messages.title)}
                    hasCancelButton
                    cancelButtonText={intl.formatMessage(definedMessages.cancel)}
                    onClickCancel={() => { resetWizard() }}
               />
        )
    }
}

const mapDispatchToProps = ({
    validateDocument,
     resetWizard
})

export default connect(null, mapDispatchToProps)(injectIntl(ValidateLoadingContainer))