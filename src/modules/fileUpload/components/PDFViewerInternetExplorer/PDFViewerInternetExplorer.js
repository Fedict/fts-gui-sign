import React from 'react'
import { connect } from 'react-redux'

import pdfjs from './pdf'

export class PDFViewerInternetExplorer extends React.Component {

    constructor(props) {
        super(props)
        this.viewerRef = React.createRef()
        this.pageCounterRef = React.createRef()
        this.backend = new pdfjs()
        this.state = {
            page: 1
        }
        this.handleOnClickNext = this.handleOnClickNext.bind(this)
        this.handleOnClickPrev = this.handleOnClickPrev.bind(this)
    }

    componentDidMount() {
        const element = this.viewerRef.current
        const pageCounter = this.pageCounterRef.current
        const { uploadFile } = this.props
        const data = uploadFile.displayFile

        this.backend.init(data.displayUrl, element, pageCounter)
        // pdfjsLib.getDocument(fileData).promise.then(pdf => {
        //     const pdfInstance = pdf;
        //     const totalPagesCount = pdf.numPages;
        //     console.log("pages", totalPagesCount)
        // });
    }

    handleOnClickNext() {
        this.backend.renderNextPage()
    }

    handleOnClickPrev() {
        this.backend.renderPrevPage()
    }

    render() {
        return (
            <div>
                <div id="viewercontroles " className="row mx-auto justify-content-center">
                    <button className="btn btn-primary mr-1 " onClick={this.handleOnClickPrev}>prev</button>
                    <div id='pageCounter' ref={this.pageCounterRef} className="input-group col-3"></div>
                    <button className="btn btn-primary ml-1" onClick={this.handleOnClickNext}>next</button>
                </div>
                <div ref={this.viewerRef} className="row" id='viewer' style={{ width: '100%', height: '100%', backgroundColor: "gray" }}></div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return (state) => ({
        uploadFile: state.uploadFile
    })
}

export default connect(mapStateToProps)(PDFViewerInternetExplorer)