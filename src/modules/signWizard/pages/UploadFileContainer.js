import React from 'react'
import { navigateToStep } from "../../wizard/WizardActions"
import { uploadFile, displayFile } from "../../fileUpload/actions/UploadFileActions"
import { connect } from 'react-redux';
import { CardContainer } from '../../components/Card/CardContainer';
import { NumberdText } from '../../components/NumberedText/NumberdText';
import { WIZARD_STATE_CERTIFICATES_LOADING } from '../../wizard/WizardConstants';
import {defineMessages, FormattedMessage, injectIntl} from "react-intl";
import {boldedText} from "../../utils/reactIntlUtils";
import { sendLogInfo } from "../../communication/communication"

const messages = defineMessages({
    title: {
        id: "signing.upload.title",
        defaultMessage: "Sign document"
    },
    next: {
        id: "signing.pininput.button.sign",
        defaultMessage: "Sign with eId"
    }
})

export class UploadFileContainer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            file: {}
        }
    }
    
    onchange(e) {
        const file = e.target.files[0]
        this.setState({ file: file })
        this.props.displayFile(file)

    }

    handleSubmit() {
        this.props.uploadFile(this.state.file)
        this.props.navigateToStep(WIZARD_STATE_CERTIFICATES_LOADING)
    }

    render() {
        const { intl } = this.props
        return (
            <CardContainer
                title={intl.formatMessage(messages.title)}
                hasNextButton
                nextButtonText={intl.formatMessage(messages.next)}
                onClickNext={() => { this.handleSubmit() }}
                nextButtonIsDisabled={(this.state.file && this.state.file.name) ? false : true}>

                <div className="form-group">
                    <div className="container" >
                        <ol className="invisibleOL">
                            <li><NumberdText number="1"><FormattedMessage id="signing.upload.text.step.1"
                                                        defaultMessage="Select a document (pdf or xml) via the button 'Select a document'."
                                                        values={{b : boldedText, selectDocumentButton : intl.formatMessage({id : "signing.upload.selectDocument", defaultMessage : "Select a document"})}}
                                                        /></NumberdText></li>
                            <li><NumberdText number="2"><FormattedMessage id="signing.upload.text.step.2" defaultMessage="Connect your eID reader."/></NumberdText></li>
                            <li><NumberdText number="3"><FormattedMessage id="signing.upload.text.step.3" defaultMessage="Insert your eID card in the card reader."/></NumberdText></li>
                            <li><NumberdText number="4"><FormattedMessage id="signing.upload.text.step.4"
                                                        defaultMessage="Click on the button 'Sign with eID' and enter your pincode when asked."
                                                        values={{b : boldedText, signButton : intl.formatMessage({id : "signing.pininput.button.sign", defaultMessage : "Sign with eID"})}}
                                                        /></NumberdText></li>
                        </ol>
                        <div className="row">
                            <div className="card col col-12">
                                <div className="card-body ">
                                    <div className="row ">
                                        <div className="col col-auto align-self-center ">
                                            <button
                                                className='btn btn-primary'
                                                type="button"
                                                id="button_select_file"
                                                value=""
                                                onClick={() => {
                                                    document.getElementById('input_hidden_select_file').click()
                                                }}
                                            > <FormattedMessage id="signing.upload.selectDocument" defaultMessage="Select a document"/> </button>

                                            <input
                                                type="file"
                                                accept=".pdf,.xml"
                                                style={{ display: "none" }}
                                                id="input_hidden_select_file"
                                                onChange={(e) => { 
                                                    var ext = e.target.value.match(/.([^.]+)$/)[1];
                                                    switch (ext) {
                                                        case 'xml':
                                                        case 'pdf':
                                                            sendLogInfo('UI - Upload file to Sign');
                                                            this.onchange(e)
                                                          break;
                                                      }
                                                }} />
                                        </div>
                                        <div className="col col-auto align-self-center ">
                                            <p className="btn m-0" >
                                                <i>
                                            <FormattedMessage id="signing.upload.selectedDocument" defaultMessage="Selected document:"/>
                                                 <span id='name_select_file'> {(this.state.file && this.state.file.name) || <FormattedMessage id="signing.upload.noDocumentSelected" defaultMessage="no document selected yet"/>}</span>
                                                 </i>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </CardContainer>
        )
    }
}


const mapDispatchToProps = ({
    uploadFile,
    navigateToStep,
    displayFile
})

export default connect(null, mapDispatchToProps)(injectIntl(UploadFileContainer))
