import React from 'react'
import { useIntl } from 'react-intl';
import GTOU_nl from '../../translations/GTOUnl';
import GTOU_fr from '../../translations/GTOUfr';
import GTOU_en from '../../translations/GTOUen';
import GTOU_de from '../../translations/GTOUde';
import PS_nl from '../../translations/PSnl';
import PS_fr from '../../translations/PSfr';
import PS_en from '../../translations/PSen';
import PS_de from '../../translations/PSde';

const GTOU = {
    nl: GTOU_nl,
    fr: GTOU_fr,
    de: GTOU_de,
    en: GTOU_en
}

export const GeneralTerms = () => {
    return (
        <text margin-bottom='412' dangerouslySetInnerHTML={ { __html: GTOU[useIntl().locale].replaceAll("\n", "<br>") }}></text>
    )
}

const PS = {
    nl: PS_nl,
    fr: PS_fr,
    de: PS_de,
    en: PS_en
}

export const PrivacyStatement = () => {
    return (
        <text dangerouslySetInnerHTML={ { __html: PS[useIntl().locale].replaceAll("\n", "<br>") }}></text>
    )
}
