import React from 'react'
import { connect } from 'react-redux'
import { getBrowser, browser } from '../../../browserDetection/BrowserDetection'
import PDFViewerInternetExplorer from '../PDFViewerInternetExplorer/PDFViewerInternetExplorer'

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
        if (data) {
            if (data.isPdf) {
                if (getBrowser() === browser.IE) {
                    if (data.displayUrl) {
                        return (
                            <PDFViewerInternetExplorer key={data.displayUrl} />
                        )
                    }
                    return null
                }
                return (

                    <object style={{ height: "85vh", width: "100%" }} type="application/pdf" data={data.url}>
                        <p>PDF cannot be shown</p>
                    </object>

                )
            }
        }
    }
    return (
        <div style={{
            height: "85vh",
            width: "100%",
            backgroundColor: "white",
            backgroundImage: "url('./img/img.jpg')",
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