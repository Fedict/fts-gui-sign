import React from 'react'
import { navigateToStep } from "../../wizard/WizardActions"
import { uploadFile, displayFile } from "../../fileUpload/actions/UploadFileActions"
import { connect } from 'react-redux';
import { CardContainer } from '../../components/Card/CardContainer';
import { NumberdText } from '../../components/NumberedText/NumberdText';
import { WIZARD_STATE_CERTIFICATES_LOADING, WIZARD_STATE_VALIDATE_LOADING } from '../../wizard/WizardConstants';
import {defineMessages, FormattedMessage, injectIntl} from "react-intl";
import {boldedText} from "../../utils/reactIntlUtils";
import { sendLogInfo } from "../../communication/communication"

const messagesSigning = defineMessages({
    title: {
        id: "signing.upload.title",
        defaultMessage: "Sign document"
    },
    next: {
        id: "signing.pininput.button.sign",
        defaultMessage: "Sign with eID"
    }
})

const messagesValidate = defineMessages({
    title: {
        id: "validate.upload.title",
        defaultMessage: "Validate digital signatures"
    },
    next: {
        id: "validate.upload.validateButton",
        defaultMessage: "Validate"
    }
})

  const styleDragGreen = {
    backgroundColor : "#00FF0011",
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: "0.25rem",
    top: "0px",
    right: "0px",
    bottom: "0px",
    left: "0px",
  };

  const styleDragRed = {
    backgroundColor : "#FF000011",
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: "0.25rem",
    top: "0px",
    right: "0px",
    bottom: "0px",
    left: "0px",
  };

export const UploadFileContainer = (props) => {
    const { intl, UploadFileContext } = props;
    const [file, setFile] = React.useState({});
    const [dragging, setDragging] = React.useState(false);
    const [draggingError, setDraggingError] = React.useState(false);
    const messages = UploadFileContext==="sign"?messagesSigning:messagesValidate;

    var handleDrop = function (e) {
        e.preventDefault();
        e.stopPropagation();
        setDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length === 1 && e.dataTransfer.files[0]) {
            var ext = e.dataTransfer.files[0].name.match(/.([^.]+)$/)[1];
            switch (ext) {
                case 'xml':
                case 'pdf':
                    setFile(e.dataTransfer.files[0]);
                    if (UploadFileContext==="sign"){
                        props.displayFile(e.dataTransfer.files[0])
                    }
                    return;
                default:
                    break;
            }
        }
        setDraggingError(true);
    };
    var handleDrag = function (e) {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragging(true);
            if (e.dataTransfer.items && e.dataTransfer.items.length === 1
                && e.dataTransfer.items[0].kind==="file"
                && (e.dataTransfer.items[0].type==="application/pdf" || e.dataTransfer.items[0].type==="application/xml" || e.dataTransfer.items[0].type==="text/xml")) {
                setDraggingError(false);
                return;
            }
            else{
                setDraggingError(true);
            }
          }
        else if (e.type === "dragleave") {
            setDragging(false);
            setDraggingError(false);
        }
    };

    const onchange = (e) => {
        const fileSelected = e.target.files[0]
        setFile(fileSelected);
        if (UploadFileContext==="sign"){
            props.displayFile(fileSelected)
        }
    }

    const handleSubmit = () => {
        props.uploadFile(file)
        if (UploadFileContext==="sign"){
            props.navigateToStep(WIZARD_STATE_CERTIFICATES_LOADING)
        }
        else {
            props.navigateToStep(WIZARD_STATE_VALIDATE_LOADING)
        }
    }

    console.log("file", file);
    console.log("dragging", dragging);

     return (
        <CardContainer
            title={intl.formatMessage(messages.title)}
            hasNextButton
            nextButtonText={intl.formatMessage(messages.next)}
            onClickNext={() => { handleSubmit() }}
            nextButtonIsDisabled={(file && file.name) ? false : true}>

            <div className="form-group">
                <div className="container" >
                    <ol className="invisibleOL">
                        {
                            UploadFileContext==="sign"
                            ?
                            <>
                                <li><NumberdText number="1"><FormattedMessage id="signing.upload.text.step.1"
                                                            defaultMessage="Select a document (pdf or xml) via the button <b>{selectDocumentButton}</b>."
                                                            values={{b : boldedText, selectDocumentButton : intl.formatMessage({id : "signing.upload.selectDocument", defaultMessage : "Select a document"})}}
                                                            /></NumberdText></li>
                                <li><NumberdText number="2"><FormattedMessage id="signing.upload.text.step.2" defaultMessage="Connect your eID reader."/></NumberdText></li>
                                <li><NumberdText number="3"><FormattedMessage id="signing.upload.text.step.3" defaultMessage="Insert your eID card in the card reader."/></NumberdText></li>
                                <li><NumberdText number="4"><FormattedMessage id="signing.upload.text.step.4"
                                                            defaultMessage="Click on the button <b>{signButton}</b> and enter your pincode when asked."
                                                            values={{b : boldedText, signButton : intl.formatMessage({id : "signing.pininput.button.sign", defaultMessage : "Sign with eID"})}}
                                                            /></NumberdText></li>
                            </>
                            :
                            <>
                                <li><NumberdText number="1"><FormattedMessage id="validate.upload.text.step.1"
                                defaultMessage="Select the digitally signed document (pdf or xml) by clicking on the button <b>{selectDocumentButton}</b>."
                                values={{b : boldedText, selectDocumentButton : intl.formatMessage({id : "signing.upload.selectDocument", defaultMessage : "Select a document"})}}
                                /></NumberdText></li>
                                <li><NumberdText number="2"><FormattedMessage id="validate.upload.text.step.2"
                                defaultMessage="Click on the button '<b>{validateButton}</b>' to start the validation."
                                values={{b : boldedText, validateButton : intl.formatMessage({id : "validate.upload.validateButton", defaultMessage : "Validate"})}}
                                /></NumberdText></li>
                            </>
                            }
                    </ol>
                    <div className="row" onDragEnter={handleDrag} onDrop={handleDrop}>
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
                                                        if (UploadFileContext==="sign"){
                                                            sendLogInfo('UI - Upload file to Sign');
                                                        }
                                                        else{
                                                            sendLogInfo('UI - Upload file to Validate');
                                                        }
                                                        onchange(e)
                                                        break;
                                                    default:
                                                        break;
                                                    }
                                            }} />
                                    </div>
                                    <div className="col col-auto align-self-center ">
                                        <p className="btn m-0" >
                                            <i>
                                        <FormattedMessage id="signing.upload.selectedDocument" defaultMessage="Selected document:"/>
                                                <span id='name_select_file'> {(file && file.name) || <FormattedMessage id="signing.upload.noDocumentSelected" defaultMessage="no document selected yet"/>}</span>
                                                </i>
                                        </p>
                                        {draggingError && 
                                        <p className="btn m-0" >
                                            <span>Warning: Only drop 1 file of type PDF or XML</span>
                                        </p>
                                        }
                                    </div>
                                    { dragging && <div onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop} style={draggingError?styleDragRed:styleDragGreen}></div> }
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </CardContainer>
        )
}


const mapDispatchToProps = ({
    uploadFile,
    navigateToStep,
    displayFile
})

export default connect(null, mapDispatchToProps)(injectIntl(UploadFileContainer))
