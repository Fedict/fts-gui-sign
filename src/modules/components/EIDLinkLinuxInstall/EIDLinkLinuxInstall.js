import React from "react"
import { EIDLinkLinuxInstallDistributionListItem } from "./EIDLinkLinuxInstallDistributionListItem"
import { NumberdText } from '../NumberedText/NumberdText'

/**
 * display to show the installation buttons for Linux
 * @param {object}  props
 * @param {[object]} props.linuxDistributions - list of linux distributions and url to the archives
 * @param {[string]} props.linuxDistributions[].distributions - list of linux distributions supported by the archive
 * @param {string} props.linuxDistributions[].url - url to the archive download
 */
export const EIDLinkLinuxInstall = ({ linuxDistributions }) => {
    const list = linuxDistributions.map((val, index) => {
        return <EIDLinkLinuxInstallDistributionListItem {...val} index={index} key={index} />
    })
    return (
        <div>

            <div className="col">
                <h2>Install eIDLink on Linux</h2>
                <NumberdText number={"1"}>Install the 'eID-archive' so the "eID" pakket repository becomes available</NumberdText>
                <NumberdText number={"2"}>Install the 'eidlink' package in the usual way for your distribution. This may require you to first perform an update of the indexes (e.g. using "apt-get update"). </NumberdText>
            </div>
            <div className="col">
                <h2>Supported distributions and versions</h2>
                <table className="table">
                    <tbody>
                        {list}
                    </tbody>
                </table>
            </div>
        </div>
    )
}