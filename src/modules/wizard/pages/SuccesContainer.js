import React from 'react'
import { connect } from 'react-redux';
import { CardContainer } from '../../components/CardContainer/CardContainer';
import { resetWizard } from '../actions/WizardLogicActions';

export class SuccesContainer extends React.Component {

    downloadFile() {
        const { uploadFile } = this.props

        if (uploadFile
            && uploadFile.downloadFile
            && uploadFile.downloadFile.name
            && uploadFile.downloadFile.bytes) {

            let linkSource = `data:application/octet-stream;base64,{base64}`;
            linkSource = linkSource.replace("{base64}", uploadFile.downloadFile.bytes)
            const downloadLink = document.createElement("a");
            const fileName = uploadFile.downloadFile.name;

            downloadLink.href = linkSource;
            downloadLink.download = fileName;
            downloadLink.click();
        }
    }
    componentDidMount() {

        this.downloadFile()
    }

    render() {
        const { resetWizard } = this.props
        return (
            <div className="row mt-3">
                <CardContainer
                    title={"Jouw document werd succesvol digitaal ondertekend!"}
                    hasNextButton
                    nextButtonText="Volgend document handtekenen"
                    onClickNext={() => { resetWizard() }}
                >
                    <div className="form-group">

                        <div className="alert alert-primary">
                            Zo dadelijk zal de download van jouw document automatisch starten, indien dit niet het geval is dan kan je de download manueel starten
                            </div>

                        <button className="btn btn-primary" id="button_download_file" onClick={() => { this.downloadFile() }} >Download document</button>

                    </div>
                </CardContainer>

            </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(SuccesContainer)
