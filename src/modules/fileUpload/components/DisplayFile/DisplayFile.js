import React from 'react'
import { connect } from 'react-redux'
import { getBrowser, browser } from '../../../browserDetection/BrowserDetection'
import PDFViewerInternetExplorer from '../PDFViewerInternetExplorer/PDFViewerInternetExplorer'
import {FormattedMessage} from "react-intl";

/**
 * Component to display a file
 * if no file is present a picture is shown
 * @param {object} props  
 * @param {object} props.uploadFile - upload file object from the redux store 
 * @param {object} props.uploadFile.displayFile - file that is shown 
 * @param {boolean} props.uploadFile.displayFile.isPdf - indicates if the file is a pdf
 * @param {string} props.uploadFile.displayFile.name - name of the file
 * @param {object} props.uploadFile.displayFile.url - dataURL for the file
 */
export const DisplayFile = ({ uploadFile }) => {

    if (uploadFile && uploadFile.displayFile) {
        const data = uploadFile.displayFile
        if (data && data.url) {
            if (data.isPdf) {
                if (getBrowser() === browser.IE) {
                    if (data.url) {
                        return (
                            <PDFViewerInternetExplorer key={data.url} />
                        )
                    }
                    return null
                }
                return (

                    <object style={{ height: "85vh", width: "100%" }} type="application/pdf" data={data.url} name={data.fileName}>
                        <p><FormattedMessage id="file.download.failed.pdf" defaultMessage="Failed to load pdf" /></p>
                    </object>

                )
            }else{
                return <div>
                    <p><FormattedMessage id="file.download.text.1" defaultMessage="The document to sign can't be previewed but you can download it by right-clicking on the link below and selecting the option 'save-link-as'."/></p>
                    <p><a href={data.url} download={data.fileName} title={data.fileName}><FormattedMessage id="file.download.link" defaultMessage="Download the file to sign"/></a></p>
                </div>
            }
        }
    }
    return (
        <div style={{
            height: "85vh",
            width: "100%",
            backgroundColor: "white",
            backgroundImage: "url('/img/img.jpg')",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover"
        }}>
        </div>
    )
}

const mapStateToProps = (state) => {
    return (state) => ({
        uploadFile: state.uploadFile
    })
}

export default connect(mapStateToProps)(DisplayFile)