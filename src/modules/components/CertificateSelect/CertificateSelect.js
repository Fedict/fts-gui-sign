import React from 'react'

export class CertificateSelect extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            selectedIndex: null
        }
    }
    onSelect(index) {
        const { certificates, onChange } = this.props;

        this.setState({ selectedIndex: index })

        if (onChange && typeof onChange === "function") {
            const selectedCertificate = certificates[index]
            onChange(selectedCertificate)
        }
    }
    render() {
        const { certificates, id } = this.props
        const { selectedIndex } = this.state

        const selectCards = certificates.map((certificate, index) => {
            return (
                <div key={index}
                    id={"card_" + id + "_" + index}
                    className={" card mb-3 " + ((index === selectedIndex) ? " border border-primary" : "")}
                    onClick={() => { this.onSelect(index) }}>
                    <div className="row no-gutters form-check align-content-center">
                        <div className="col">
                            <div className="card-body">
                                <p>reader : {certificate.readerName}</p>
                                <p>naam :  {certificate.commonName}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )
        })

        return selectCards
    }
}