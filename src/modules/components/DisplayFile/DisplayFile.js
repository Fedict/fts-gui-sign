import React from 'react'


export class DisplayFile extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            isPdf: false,
            isXml: false,
            url: "",
            name: ""
        }
    }
    componentDidMount() {

        const { file } = this.props

        if (file) {
            console.log("DIDMount", file.type)
            const type = file.type
            let data = {
                isPdf: false,
                isXml: false,
                name: file.name
            }
            switch (type) {
                case "application/pdf":
                    data.isPdf = true
                    data.url = URL.createObjectURL(file) 
                    console.log("url", data.url)
                    break;
                case "application/xml":
                case "text/xml":
                    data.isXml = true
                    break;

                default:
                    break
            }
            console.log("DIDMount", data)
            this.setState({ ...data })
        }

    }

    componentWillUnmount() {
        const url = this.state.url;
        URL.revokeObjectURL(url)
    }

    render() {
        const data = this.state
        console.log("data", data)
        if (data) {
            if (data.isPdf) {
                return (
                    <object width="900" height="500" type="application/pdf" data={data.urlusemap}>
                        <p>PDF cannot be shown</p>
                    </object>
                )
            }
            if (data.isXml) {
                return <p>xml</p>
            }
        }
        return null

    }
}
