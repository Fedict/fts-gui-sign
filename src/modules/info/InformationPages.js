import React, { useEffect } from 'react'
import { Link } from "react-router-dom";
import { useDispatch } from 'react-redux'
import { useIntl } from 'react-intl';

import { doSendLogInfo } from "../signWizard/actions/WizardLogicActions";

import GTOU_nl from '../../translations/GTOUnl';
import GTOU_fr from '../../translations/GTOUfr';
import GTOU_en from '../../translations/GTOUen';
import GTOU_de from '../../translations/GTOUde';
import PS_nl from '../../translations/PSnl';
import PS_fr from '../../translations/PSfr';
import PS_en from '../../translations/PSen';
import PS_de from '../../translations/PSde';
import CookiePolicies from '../../translations/CookiePolicies';

const GTOUs = {
    nl: GTOU_nl,
    fr: GTOU_fr,
    de: GTOU_de,
    en: GTOU_en
}

export const GeneralTerms = () => {

    const dispatch = useDispatch();
    useEffect(() => (dispatch(doSendLogInfo('UI - GENERAL_TERMS'))), [])

    const locale = useIntl().locale;
    const GTOU = GTOUs[locale];
    const psPos = GTOU.indexOf("<PS>");
    const psEndPos = GTOU.indexOf("</PS>");
    return (
        <div style={{whiteSpace: 'pre-line'}} >
            <div style={{ display: 'contents' }} dangerouslySetInnerHTML={ { __html: GTOU.substring(0, psPos) }}></div>
            <Link style={{ display: 'contents' }} to={'/ps?language=' + locale}>{GTOU.substring(psPos + 4, psEndPos)}</Link>
            <div style={{ display: 'contents' }} dangerouslySetInnerHTML={ { __html: GTOU.substring(psEndPos + 5) }}></div>
        </div>
    )
}

const PSs = {
    nl: PS_nl,
    fr: PS_fr,
    de: PS_de,
    en: PS_en
}

export const PrivacyStatement = () => {
    
    const dispatch = useDispatch();
    useEffect(() => (dispatch(doSendLogInfo('UI - PRIVACY_STATEMENT'))), [])
    return (
        <div style={{whiteSpace: 'pre-line'}} dangerouslySetInnerHTML={ { __html: PSs[useIntl().locale] }}></div>
    )
}

export const CookiePolicy = () => {
    
    const dispatch = useDispatch();
    useEffect(() => (dispatch(doSendLogInfo('UI - COOKIE POLICY'))), [])
    return (
        <div style={{whiteSpace: 'pre-line'}} dangerouslySetInnerHTML={ { __html: CookiePolicies[useIntl().locale] }}></div>
    )
}



