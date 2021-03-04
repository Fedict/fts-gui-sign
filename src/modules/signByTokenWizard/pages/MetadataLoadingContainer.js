import React, {useEffect} from 'react'
import { CardLoading } from '../../components/Card/CardLoading'
import { connect } from 'react-redux'
import {defineMessages, injectIntl} from "react-intl";
import {resetWizard} from "../../signWizard/actions/WizardLogicActions";
import {definedMessages} from "../../i18n/translations";
import {getDocumentMetadataForToken} from "../actions/TokenActions";

const messages = defineMessages({
    title : {
        id : 'metadataLoading.title',
        defaultMessage : 'Retrieving Metadata'
    }
})

export const MetadataLoadingContainer = (props) => {
    const { resetWizard, intl, getDocumentMetadataForToken, token } = props;
    useEffect(() => {
        if(token){
            getDocumentMetadataForToken()
        }
    }, [token])
    return (
            <CardLoading title={intl.formatMessage(messages.title)}
                hasCancelButton
                cancelButtonText={intl.formatMessage(definedMessages.cancel)}
                onClickCancel={() => { resetWizard() }}
            />
    )

}

const mapStateToProps = (state) => {
    return (state) => ({
        token : state.tokenFile.token
    })
}

const mapDispatchToProps = ({
    getDocumentMetadataForToken,
        resetWizard
})

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(MetadataLoadingContainer))