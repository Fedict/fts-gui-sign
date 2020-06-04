import React from 'react'
import { navigateToStep } from "../../wizard/WizardActions"
import { uploadFile, displayFile } from "../../fileUpload/actions/UploadFileActions"
import { connect } from 'react-redux';
import { CardContainer } from '../../components/Card/CardContainer';
import { NumberdText } from '../../components/NumberedText/NumberdText';
import { WIZARD_STATE_CERTIFICATES_LOADING } from '../../wizard/WizardConstants';

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
        return (

            <CardContainer
                title={"Digital sign a document"}
                hasNextButton
                nextButtonText="sign with eId"
                onClickNext={() => { this.handleSubmit() }}
                nextButtonIsDisabled={(this.state.file && this.state.file.name) ? false : true}>

                <div className="form-group">
                    <div className="container" >
                        <NumberdText number="1">Select a document by clicking on the button "Select document".</NumberdText>
                        <NumberdText number="2">Connect your eId reader to your pc.</NumberdText>
                        <NumberdText number="3">Insert your eId card in the eId card reader.</NumberdText>
                        <NumberdText number="4">Click on the button "sign with eId" and enter your PIN when prompted.</NumberdText>

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
                                            > Select document </button>

                                            <input
                                                type="file"
                                                style={{ display: "none" }}
                                                id="input_hidden_select_file"
                                                onChange={(e) => { this.onchange(e) }} />
                                        </div>
                                        <div className="col col-auto align-self-center ">
                                            <p className="btn m-0" >
                                                Selected document:
                                                 <span id='name_select_file'> {(this.state.file && this.state.file.name) || 'no document selected'}</span>
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

const mapStateToProps = (state) => {
    return (state) => ({
        wizard: state.wizard
    })
}
const mapDispatchToProps = ({
    uploadFile,
    navigateToStep,
    displayFile
})

export default connect(mapStateToProps, mapDispatchToProps)(UploadFileContainer)
