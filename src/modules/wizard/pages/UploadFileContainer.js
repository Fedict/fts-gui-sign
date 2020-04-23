import React from 'react'
import { navigateToVersionCheckLoading, navigateToStep } from "../actions/WizardActions"
import { uploadFile } from "../actions/UploadFileActions"
import { connect } from 'react-redux';
import { CardContainer } from '../../components/CardContainer/CardContainer';
import { NumberdText } from '../../components/NumberedText/NumberdText';
import { WIZARD_STATE_CERTIFICATES_LOADING } from '../wizard/WizardConstants';

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
        this.props.navigateToStep(WIZARD_STATE_CERTIFICATES_LOADING)
    }

    render() {
        return (
            <div className="row mt-3">
                <CardContainer
                    title={"Digitaal handtekenen"}
                    hasNextButton
                    nextButtonText="Handtekenen met eID"
                    onClickNext={() => { this.handleSubmit() }}
                    nextButtonIsDisabled={this.state.file.name ? false : true}>

                    <div className="form-group">
                        <div className="container" >
                            <NumberdText number="1"> Selecteer een document door op de knop "Selecteer bestand" te klikken.</NumberdText>
                            <NumberdText number="2"> Sluit jouw eID-kaartlezer aan op uw computer of gebruik de ingebouwde kaartlezer (indien aanwezig).</NumberdText>
                            <NumberdText number="3">  Steek jouw elektronische identiteitskaart (eID) in de kaartlezer.</NumberdText>
                            <NumberdText number="4">  Klik op “Handtekenen met eID” en geef jouw pincode van jouw identiteitskaart in wanneer daarom gevraagd wordt.</NumberdText>

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
                                                    onClick={() => { document.getElementById('input_hidden_select_file').click() }}
                                                > Selecteer bestand </button>

                                                <input
                                                    type="file"
                                                    style={{ display: "none" }}
                                                    id="input_hidden_select_file"
                                                    onChange={(e) => { this.onchange(e) }} />
                                            </div>
                                            <div className="col col-auto align-self-center ">
                                                <p className="btn m-0" >
                                                    geselecteerd bestand :
                                                 <span id='name_select_file'> {this.state.file.name || 'geen document geselecteerd'}</span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </CardContainer>

            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return (state) => ({
        wizard: state.wizard
    })
}
const mapDispatchToProps = ({
    navigateToVersionCheckLoading,
    uploadFile,
    navigateToStep


})

export default connect(mapStateToProps, mapDispatchToProps)(UploadFileContainer)
