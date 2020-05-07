import React from 'react'
import { CardContainer } from '../../../components/CardContainer/CardContainer'
import { connect } from 'react-redux'
import IMAGE from './img.jpg'


export class DisplayFile extends React.Component {

    constructor(props) {
        super(props)


    }

    render() {
        const { uploadFile } = this.props
        if (uploadFile && uploadFile.displayFile) {
            const data = uploadFile.displayFile
            console.log("data", data)
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
        return <div className="mr-5"><img src={IMAGE} width="100%" /></div>

    }
}


const mapStateToProps = (state) => {
    return (state) => ({
        uploadFile: state.uploadFile
    })
}
const mapDispatchToProps = ({



})

export default connect(mapStateToProps, mapDispatchToProps)(DisplayFile)