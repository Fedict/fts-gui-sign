import React, {useState} from "react"
import { EIDLinkLinuxInstallDistributionListItem } from "./EIDLinkLinuxInstallDistributionListItem"
import { NumberdText } from '../NumberedText/NumberdText'
import {FormattedMessage, injectIntl} from "react-intl";
import {boldedText} from "../../utils/reactIntlUtils";
import Modal from "react-bootstrap/Modal";

/**
 * display to show the installation buttons for Linux
 * @param {object}  props
 * @param {[object]} props.linuxDistributions - list of linux distributions and url to the archives
 * @param {[string]} props.linuxDistributions[].distributions - list of linux distributions supported by the archive
 * @param {string} props.linuxDistributions[].url - url to the archive download
 */
export const EIDLinkLinuxInstall = (injectIntl(({ linuxDistributions, intl }) => {
    const [showLicense, setShowLicense] = useState(false);
    const list = linuxDistributions.map((val, index) => {
        return <EIDLinkLinuxInstallDistributionListItem {...val} index={index} key={index} />
    })

    return (
        <div>
            <div className="col">
                <h2><FormattedMessage id="beidconnect.linux.install" defaultMessage="Install BeIDConnect on Linux"/></h2>
                <ol className="invisibleOL">
                    <li><NumberdText number={"1"}>
                        <FormattedMessage
                            id="beidconnect.linux.step.1"
                            defaultMessage={'Install the \'beidconnect-archive\' package so the "beidconnect" package repository becomes available'}
                            values={{b : boldedText, newLine : <br />, licenseLink :
                                    <a href={"#"} onClick={setShowLicense.bind(undefined, true)}>
                                        <FormattedMessage id="beidconnect.linux.license.link" defaultMessage=""/>
                                    </a>}}

                        />
                    </NumberdText></li>
                    <li><NumberdText number={"2"}><FormattedMessage id="beidconnect.linux.step.2" defaultMessage={"Install the 'beidconnect' package in the usual way for your distribution. This may require you to first perform an update of the indexes (e.g. using \"apt-get update\")."}/> </NumberdText></li>
                </ol>
            </div>
            <div className="col">
                <h2><FormattedMessage id="beidconnect.linux.supported.title" defaultMessage="Supported distributions and versions"/></h2>
                <table className="table">
                    <tbody>
                        {list}
                    </tbody>
                </table>
            </div>
            <Modal show={showLicense} onHide={setShowLicense} size="lg" centered>
                <Modal.Body>
                    <iframe src={`/license/${intl.locale}/BeIDConnect-Licence.htm`} height={window.innerHeight - 100} width={"100%"}></iframe>
                </Modal.Body>
            </Modal>
        </div>
    )
}))
