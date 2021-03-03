import React from 'react'
import { connect } from 'react-redux';
import { CardContainer } from '../../components/Card/CardContainer';
import { getBlobFromBase64 } from '../../fileUpload/helpers/FileHelper';
import {defineMessages, FormattedMessage, injectIntl} from "react-intl";

const messages = defineMessages({
    title : {
        id : "succes.title",
        defaultMessage : "Your document has been successfully signed!"
    },
    doneButton : {
        id : "succes.next",
        defaultMessage : "Close"
    }
})

export class SuccesContainerForToken extends React.Component {

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
        const { nextButtonClicked, redirectUrl, intl } = this.props
        return (

            <CardContainer
                title={intl.formatMessage(messages.title)}
                hasNextButton
                nextButtonText={intl.formatMessage(messages.doneButton)}
                onClickNext={() => nextButtonClicked(redirectUrl)}
            >
                <div className="form-group">

                    <div className="alert alert-primary">
                        <FormattedMessage id="succes.text" defaultMessage="Your document will be automatically downloaded. If this is not the case, you can start the download manually" />
                    </div>

                    <button
                        className="btn btn-primary"
                        id="button_download_file"
                        onClick={() => { this.downloadFile() }} >
                        <FormattedMessage id="succes.button.download" defaultMessage="Download document"/>
                    </button>

                </div>
            </CardContainer>
        )
    }
}

const mapStateToProps = (state) => {
    return (state) => ({
        uploadFile: state.uploadFile,
        redirectUrl : state.tokenFile.redirectUrl
    })
}
const mapDispatchToProps = (dispatch) => {
    return {
        nextButtonClicked : (redirectUrl) => {
            if(redirectUrl){
                window.location = redirectUrl
            }else{
                console.log('redirectUrl not defined');
            }
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(SuccesContainerForToken))
