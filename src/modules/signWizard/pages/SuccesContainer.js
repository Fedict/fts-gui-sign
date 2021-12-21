import React, {Fragment, useEffect, useState} from 'react'
import { connect } from 'react-redux';
import { CardContainer } from '../../components/Card/CardContainer';
import { resetWizard } from '../actions/WizardLogicActions';
import { getBlobFromBase64 } from '../../fileUpload/helpers/FileHelper';
import {defineMessages, FormattedMessage, injectIntl} from "react-intl";
import {definedMessages} from "../../i18n/translations";
import {boldedText} from "../../utils/reactIntlUtils";

const messages = defineMessages({
    title : {
        id : "succes.title",
        defaultMessage : "Your document has been successfully signed!"
    },
    doneButton : {
        id : "succes.signNext",
        defaultMessage : "Sign next document"
    }
})

export class SuccesContainer extends React.Component {

    downloadFile() {
        const { uploadFile } = this.props

        if (uploadFile
            && uploadFile.downloadFile
            && uploadFile.downloadFile.name
            && uploadFile.downloadFile.bytes) {

            if (window.navigator.msSaveBlob) {
                const blobData = getBlobFromBase64(uploadFile.downloadFile.bytes);
                window.navigator.msSaveOrOpenBlob(blobData,uploadFile.downloadFile.name);
            }
            else {
                let linkSource = `data:application/octet-stream;base64,{base64}`;
                linkSource = linkSource.replace("{base64}", uploadFile.downloadFile.bytes)
                const downloadLink = document.createElement("a");

                downloadLink.href = linkSource;
                downloadLink.download = uploadFile.downloadFile.name;
                downloadLink.click();
            }
        }
    }
    componentDidMount() {
        this.downloadFile()
    }

    render() {
        const { intl } = this.props
        const { resetWizard } = this.props
        return (

            <CardContainer
                title={intl.formatMessage(messages.title)}
                hasNextButton
                nextButtonText={intl.formatMessage(messages.doneButton)}
                onClickNext={() => { resetWizard() }}
            >
                <div className="form-group">
                    <Fragment>
                            
                    <div className="alert alert-primary">
                    <FormattedMessage id="succes.autodownload"
                                                      defaultMessage="Your document will be automatically downloaded. If this is not the case, you can start the download manually"
                                                      values={{b : boldedText, newLine : <br/>, succesButtonDownload : intl.formatMessage({id : "succes.button.download", defaultMessage : "Download document"})}}
                                    />
                                    
                        </div>

                    <button
                        className="btn btn-primary"
                        id="button_download_file"
                        onClick={() => { this.downloadFile() }} >
                        <FormattedMessage id="succes.button.download" defaultMessage="Download document"/>
                        </button>
                        </Fragment>
                </div>
               
            </CardContainer>
        )
    }
}

const mapStateToProps = (state) => {
    return (state) => ({
        uploadFile: state.uploadFile
    })
}
const mapDispatchToProps = ({
    resetWizard
})

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(SuccesContainer))
