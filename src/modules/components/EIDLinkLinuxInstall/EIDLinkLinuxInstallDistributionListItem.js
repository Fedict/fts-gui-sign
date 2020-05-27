import React from 'react'


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
                <button className="btn btn-primary " onClick={() => { handelClick() }}>Download archive</button>
            </td>

        </tr>

    )
}