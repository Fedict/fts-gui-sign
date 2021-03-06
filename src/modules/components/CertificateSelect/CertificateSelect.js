import React from 'react'
import {FormattedMessage} from "react-intl";

/**
 * Select component for selecting a certificate
 * Props
 * - {[object]} certificates - array of certificates
 * - {object} certificates[].readerName - name of the eID card reader
 * - {object} certificates[].commonName - common name of the certificate
 * - {function} onChange - onChange function triggerd when a certificate is selected
 * - {string} id - a addon for the id of the element  (id={"card_" + id + "_" + index})
 */
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
                                <p><FormattedMessage id="certificate.choose.reader" defaultMessage="reader : {readerName}" values={{readerName : certificate.readerName}}/></p>
                                <p><FormattedMessage id="certificate.choose.name" defaultMessage="name : {commonName}" values={{commonName : certificate.commonName}}/></p>
                            </div>
                        </div>
                    </div>
                </div>
            )
        })

        return selectCards
    }
}