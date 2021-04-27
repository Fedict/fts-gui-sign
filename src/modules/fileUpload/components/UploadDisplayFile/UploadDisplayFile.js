import {connect} from "react-redux";
import {DisplayFile} from "../DisplayFile/DisplayFile";

const mapStateToProps = (state) => {
    return (state) => ({
        uploadFile: state.uploadFile
    })
}

export default connect(mapStateToProps)(DisplayFile)