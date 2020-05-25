import React from 'react'
import { CardContainer } from '../../../components/Card/CardContainer'
import { connect } from 'react-redux'
import IMAGE from './img.jpg'


/**
 * Componnent to display a file
 * if no file is pressent a picture is shown
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
                return (
                    <CardContainer
                        title={'Selected document ' + data.name}>
                        <object width="100%" height="500" type="application/pdf" data={data.url}>
                            <p>PDF cannot be shown</p>
                        </object>
                    </CardContainer>

                )
            }
            // if (data.isXml) {
            //     return <p>xml</p>
            // }
        }
    }
    return <div className="mr-5"><img src={IMAGE} width="100%" alt="" /></div>

}

const mapStateToProps = (state) => {
    return (state) => ({
        uploadFile: state.uploadFile
    })
}

export default connect(mapStateToProps)(DisplayFile)