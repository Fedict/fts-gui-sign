import React, {Fragment} from 'react'
import { connect } from 'react-redux';
import { CardContainer } from '../../components/Card/CardContainer';
import {defineMessages, FormattedMessage, injectIntl} from "react-intl";
import {sendLogInfo, sendLogInfoIgnoreResult} from "../../communication/communication";
import {doWithToken} from "../../utils/helper";
import {Ticker} from "../../components/Ticker/Ticker";
import {boldedText} from "../../utils/reactIntlUtils";
import {getBEUrl} from "../../utils/helper";
import {signState} from "../constants";

const messages = defineMessages({
    title : {
        id : "succes.title",
        defaultMessage : "Your document has been successfully signed!"
    },
    multiFileTitle : {
        id : "succes.multiFile.title",
        defaultMessage : "Your documents have been successfully signed!"
    },
    doneButton : {
        id : "succes.next",
        defaultMessage : "Close"
    },
    redirectMessage : {
        id : "succes.redirect",
        defaultMessage : "You'll be redirected in {timeLeft} seconds"
    },
    redirectToMessage : {
        id : "succes.redirect.to",
        defaultMessage : "You'll be redirected to {clientName} in {timeLeft} seconds"
    },
    noFilesToDownload : {
        id : "succes.signed.downloadIsEmpty",
        defaultMessage : "Nothing to download"
    }
})

export class SuccesContainerForToken extends React.Component {

    getFilesToDownload() {
        const { tokenFile } = this.props

        let filesToDownload;
        tokenFile.inputs.forEach((input, index) => { if (input.signState === signState.SIGNED) filesToDownload = (filesToDownload ?  filesToDownload + ',' : '') + index });

        return filesToDownload;
    }

    downloadFile() {
        const { tokenFile } = this.props

        const filesToDownload = this.getFilesToDownload();
        if (filesToDownload) {
            const downloadLink = document.createElement("a");
            downloadLink.href = getBEUrl() + '/signing/getFileForToken/' + tokenFile.token + "/OUT/" + filesToDownload + "?forceDownload"
            if(tokenFile.token){
                downloadLink.addEventListener("click", () => {
                    sendLogInfoIgnoreResult('UI - DOWNLOAD_BUTTON CLICKED', tokenFile.token);
                });
            }
    
            downloadLink.click();
    
        }
    }

    componentDidMount() {
        if(this.props.autoDownloadDocument) {
            this.downloadFile()
        }
    }

    render() {
        const { nextButtonClicked, redirectUrl, intl, tokenFile, multipleDocuments } = this.props

        let bodyTextId = this.props.autoDownloadDocument ? 
                        (multipleDocuments ?
                            "succes.multiFile.autodownload" :
                            "succes.autodownload"
                        ) : "succes.documentNotAutoDownloaded"

        let bodyText = this.props.autoDownloadDocument ? 
                        (multipleDocuments ? 
                            "The signed version of your documents will be automatically downloaded. If the download doesn't start, click <b>download document.</b>" :
                            "Your document will be automatically downloaded. If this is not the case, you can start the download manually."
                        ) : "You can download the document by clicking on <b>{succesButtonDownload}</b>."


        let clientName = tokenFile.clientNames['name_' + intl.locale];
        if (!clientName) clientName = tokenFile.clientNames.name;

        const noFilesToDownload = !this.getFilesToDownload();

        return (
            <CardContainer
                title={intl.formatMessage(noFilesToDownload ? messages.noFilesToDownload : (multipleDocuments ? messages.multiFileTitle : messages.title) )}
                hasCancelButton={noFilesToDownload}
                cancelButtonText={intl.formatMessage(messages.doneButton)}
                onClickCancel={() => nextButtonClicked(redirectUrl)}
            >
                <div className="form-group">
                    {noFilesToDownload ?
                        <FormattedMessage id="succes.signed.downloadIsEmptyTxt" defaultMessage="Because of an error no file was signed and can be downloaded" values={{b : boldedText}} />
                    :!tokenFile.noSignedDownloads &&
                        <Fragment>
                            <p><FormattedMessage id={bodyTextId} defaultMessage={bodyText}
                                            values={{b : boldedText, newLine : <br/>, succesButtonDownload : intl.formatMessage({id : "succes.button.download", defaultMessage : "Download document"})}}
                            /></p>

                            <p>
                                <button
                                    className="btn btn-primary text-uppercase"
                                    id="button_download_file"
                                    onClick={() => { this.downloadFile() }} >
                                    <FormattedMessage id="succes.button.download" defaultMessage="Download document"/>
                                </button>
                            </p>
                        </Fragment>
                    }
                    <p>
                        <Ticker autoClickNextTimeout={3} onTimeout={() => nextButtonClicked(redirectUrl)}
                                redirectMessageDescriptor={clientName ? messages.redirectToMessage : messages.redirectMessage} clientName={clientName}/>
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
        tokenFile : state.tokenFile,
        autoDownloadDocument : state.wizard.autoDownloadDocument !== false && !state.tokenFile.noSignedDownloads,
        multipleDocuments : state.tokenFile.inputs.length > 1
    })
}
const mapDispatchToProps = (dispatch) => {
    return {
        nextButtonClicked : (redirectUrl) => {
            dispatch(doWithToken(sendLogInfo.bind(undefined, 'UI - REDIRECT - ' + redirectUrl, () => {
                if(redirectUrl){
                    window.location = redirectUrl
                }else{
                    //console.log('redirectUrl not defined');
                }
            })))
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(SuccesContainerForToken))
