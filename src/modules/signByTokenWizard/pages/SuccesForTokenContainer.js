import React, {useEffect, useState} from 'react'
import { connect } from 'react-redux';
import { CardContainer } from '../../components/Card/CardContainer';
import { getBlobFromBase64 } from '../../fileUpload/helpers/FileHelper';
import {defineMessages, FormattedMessage, injectIntl} from "react-intl";
import {sendLogInfo, sendLogInfoIgnoreResult} from "../../communication/communication";
import {doWithToken} from "../../utils/helper";
import {Ticker} from "../../components/Ticker/Ticker";

const messages = defineMessages({
    title : {
        id : "succes.title",
        defaultMessage : "Your document has been successfully signed!"
    },
    doneButton : {
        id : "succes.next",
        defaultMessage : "Close"
    },
    redirectMessage : {
        id : "succes.redirect",
        defaultMessage : "You'll be redirected in {timeLeft} seconds"
    }
})

export class SuccesContainerForToken extends React.Component {

    downloadFile() {
        const { uploadFile, token } = this.props

        if (uploadFile
            && uploadFile.downloadFile
            && uploadFile.downloadFile.name
            && uploadFile.downloadFile.bytes) {

            if (window.navigator.msSaveBlob) {
                const blobData = getBlobFromBase64(uploadFile.downloadFile.bytes);
                window.navigator.msSaveOrOpenBlob(blobData,uploadFile.downloadFile.name);
            }
            else {
                let linkSource = `data:application/octet-stream;base64,${uploadFile.downloadFile.bytes}`;
                const downloadLink = document.createElement("a");

                downloadLink.href = linkSource;
                downloadLink.download = uploadFile.downloadFile.name;
                if(token){
                    downloadLink.addEventListener("click", () => {
                        sendLogInfoIgnoreResult('UI - DOWNLOAD_PRESSED', token);
                    });
                }
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
                hasCancelButton
                cancelButtonText={intl.formatMessage(messages.doneButton)}
                onClickCancel={() => nextButtonClicked(redirectUrl)}
            >
                <div className="form-group">

                    <p>
                        <FormattedMessage id="succes.text" defaultMessage="Your document will be automatically downloaded. If this is not the case, you can start the download manually" />
                    </p>
                    <p>
                        <button
                            className="btn btn-primary text-uppercase"
                            id="button_download_file"
                            onClick={() => { this.downloadFile() }} >
                            <FormattedMessage id="succes.button.download" defaultMessage="Download document"/>
                        </button>
                    </p>
                    <p>
                        <Ticker autoClickNextTimeout={10} onTimeout={() => nextButtonClicked(redirectUrl)} redirectMessageDescriptor={messages.redirectMessage}/>
                    </p>
                </div>
            </CardContainer>
        )
    }
}

const mapStateToProps = (state) => {
    return (state) => ({
        uploadFile: state.uploadFile,
        redirectUrl : state.tokenFile.redirectUrl,
        token : state.tokenFile.token
    })
}
const mapDispatchToProps = (dispatch) => {
    return {
        nextButtonClicked : (redirectUrl) => {
            dispatch(doWithToken(sendLogInfo.bind(undefined, 'UI - REDIRECT - ' + redirectUrl, () => {
                if(redirectUrl){
                    window.location = redirectUrl
                }else{
                    console.log('redirectUrl not defined');
                }
            })))
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(SuccesContainerForToken))
