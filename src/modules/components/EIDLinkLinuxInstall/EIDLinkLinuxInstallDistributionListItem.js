import React from 'react'
import {FormattedMessage} from "react-intl";

/**
 * table row that displays a list of distributions and a buttom to download the archive
 * @param {object} props
 * @param {string} props.distributions - list of linux distributions supported by the archive
 * @param {string} props.url - url to the archive download
 */
export const EIDLinkLinuxInstallDistributionListItem = ({ url, distributions }) => {

    const handelClick = () => {
        if (url) {
            window.open(url + '?dt=' + new Date().getTime())
        }
    }

    const distributionDisplayList = distributions.map((val, index) => { return (<li key={index}>{val}</li>) })

    return (
        <tr className="row">
            <td className='col-8'>
                <ul>
                    {distributionDisplayList}
                </ul>
            </td>
            <td className='col-4'>
                <button className="btn btn-primary " onClick={() => { handelClick() }}><FormattedMessage id="beidconnect.linux.download" defaultMessage="Download archive"/></button>
            </td>
        </tr>
    )
}