import { connect } from 'react-redux'
import {mapStateToProps} from "../DisplayFile/TokenDisplayFile";
import {PDFViewerInternetExplorer} from "../../../fileUpload/components/PDFViewerInternetExplorer/PDFViewerInternetExplorer";


export default connect(mapStateToProps)(PDFViewerInternetExplorer)