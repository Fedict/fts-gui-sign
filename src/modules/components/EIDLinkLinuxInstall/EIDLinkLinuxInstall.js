import React from "react"
import { EIDLinkLinuxInstallDistributionListItem } from "./EIDLinkLinuxInstallDistributionListItem"
import { NumberdText } from '../NumberedText/NumberdText'

export const EIDLinkLinuxInstall = ({ linuxDistributions }) => {
    const list = linuxDistributions.map((val, index) => {
        return <EIDLinkLinuxInstallDistributionListItem {...val} index={index} key={index} />
    })
    return (
        <div>

            <div className="col">
                <h2>Install eIDLink on linux</h2>
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