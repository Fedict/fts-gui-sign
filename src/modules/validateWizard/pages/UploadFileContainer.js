import React from 'react'
import { connect } from 'react-redux'
import { uploadFile } from '../../fileUpload/actions/UploadFileActions'
import { navigateToStep } from "../../wizard/WizardActions"
import { WIZARD_STATE_VALIDATE_LOADING } from '../../wizard/WizardConstants';
import { CardContainer } from '../../components/Card/CardContainer';
import { NumberdText } from '../../components/NumberedText/NumberdText';
import {defineMessages, FormattedMessage, injectIntl} from "react-intl";
import {boldedText} from "../../utils/reactIntlUtils";

const messages = defineMessages({
    title: {
        id: "validate.upload.title",
        defaultMessage: "Validate digital signatures"
    },
    next: {
        id: "validate.upload.validateButton",
        defaultMessage: "Validate"
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
    }

    handleSubmit() {
        this.props.uploadFile(this.state.file)
        this.props.navigateToStep(WIZARD_STATE_VALIDATE_LOADING)
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
                        <NumberdText number="1"><FormattedMessage id="validate.upload.text.step.1"
                                                      defaultMessage="Select the digitally signed document (pdf or xml) by clicking on the button 'Select a document'."
                                                      values={{b : boldedText, selectDocumentButton : intl.formatMessage({id : "signing.upload.selectDocument", defaultMessage : "Select a document"})}}
                                                      /></NumberdText>
                        <NumberdText number="2"><FormattedMessage id="validate.upload.text.step.2"
                                                      defaultMessage="Click on the button 'Validate' to start the validation."
                                                      values={{b : boldedText, validateButton : intl.formatMessage({id : "validate.upload.validateButton", defaultMessage : "Validate"})}}
                                                      /></NumberdText>

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
                                                style={{ display: "none" }}
                                                id="input_hidden_select_file"
                                                onChange={(e) => { this.onchange(e) }} />
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
    navigateToStep
})

export default connect(null, mapDispatchToProps)(injectIntl(UploadFileContainer))
