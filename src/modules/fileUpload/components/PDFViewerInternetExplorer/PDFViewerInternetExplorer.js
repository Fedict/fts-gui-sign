import React from 'react'
import { connect } from 'react-redux'

import pdfjs from './pdf'
import {defaults} from "../../../utils/helper";

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
        const { displayFile } = this.props
        this.backend.init(displayFile.displayUrl, element, pageCounter)
    }

    componentWillUnmount() {
        this.backend.remove()
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
                <div id="viewercontroles " className="row mx-auto justify-content-center mb-1">
                    <button className="btn btn-primary mr-1 " onClick={this.handleOnClickPrev}>prev</button>
                    <div id='pageCounter' ref={this.pageCounterRef} className="input-group col-3"></div>
                    <button className="btn btn-primary ml-1" onClick={this.handleOnClickNext}>next</button>
                </div>
                <div ref={this.viewerRef} className="row" id='viewer' style={{ width: '100%', height: '100%', backgroundColor: "gray", paddingTop: "5px", paddingBottom: "5px" }}></div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return (state) => ({
        //displayFile: state.uploadFile.displayFile
    })
}

export default connect(mapStateToProps)(PDFViewerInternetExplorer)