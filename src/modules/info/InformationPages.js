import React from 'react'
import { FormattedMessage } from 'react-intl';
import GTOU_nl from '../../translations/GTOUnl.txt';
import GTOU_fr from '../../translations/GTOUfr.txt';
import GTOU_en from '../../translations/GTOUen.txt';
import GTOU_de from '../../translations/GTOUde.txt';

export const GeneralTerms = () => {
    return (
        <div className="text-center">{GTOU_nl}</div>
    )
}

export const PrivacyStatement = () => {
    return (
        <div className="text-center"><FormattedMessage id="info.genPrivacy" defaultMessage="xxxxx" values={{b : 'boldedText'}}/></div>
    )
}
