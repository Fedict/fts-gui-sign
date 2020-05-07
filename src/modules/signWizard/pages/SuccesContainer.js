import React from 'react'
import { connect } from 'react-redux';
import { CardContainer } from '../../components/Card/CardContainer';
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
         
                <CardContainer
                    title={"Your document has been successfully signed!"}
                    hasNextButton
                    nextButtonText="Sign next document"
                    onClickNext={() => { resetWizard() }}
                >
                    <div className="form-group">

                        <div className="alert alert-primary">
                            Your document will be automatically downloaded. If this is not the case, you can start the download manually
                        </div>

                        <button
                            className="btn btn-primary"
                            id="button_download_file"
                            onClick={() => { this.downloadFile() }} >
                            Download document
                        </button>

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

export default connect(mapStateToProps, mapDispatchToProps)(SuccesContainer)
