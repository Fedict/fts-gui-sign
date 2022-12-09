import React from 'react'
import {
    Link,
    withRouter
} from "react-router-dom";
import { connect } from 'react-redux';
import { navigateToStep } from "../wizard/WizardActions"
import { resetStore } from "../../store/storeActions"
import { WIZARD_STATE_START } from '../wizard/WizardConstants';
import { setNewFlowId } from "../controlIds/flowId/FlowIdActions"
import {languages, languagesNames} from "../../const";
import {defineMessages, injectIntl, useIntl} from "react-intl";

const messages = defineMessages({
    language : {
        id : 'language',
        defaultMessage : 'en'
    },
    sign : {
        id : 'navigation.sign',
        defaultMessage : 'Sign'
    },
    validate : {
        id : 'navigation.validate',
        defaultMessage : 'Validate'
    }
})

const getChangeLanguageLink = (language) => {
    let url = new URL(window.location);
    url.searchParams.set('language', language);
    return url.pathname + '?' + url.searchParams.toString();
}

export const Navbar = injectIntl(({ location, resetStore, navigateToStep, setNewFlowId, history, chooseLanguage }) => {
    const intl = useIntl()
    //Todo: Research a better way to do this
    const language= intl.formatMessage(messages.language)
    const links = [
        {
            to: '/sign?language=' + language,
            label: intl.formatMessage(messages.sign),
            onclick: () => { resetStore(); setNewFlowId(); navigateToStep(WIZARD_STATE_START) }
        }, {
            to: '/validate?language=' + language,
            label: intl.formatMessage(messages.validate),
            onclick: () => { resetStore(); setNewFlowId(); navigateToStep(WIZARD_STATE_START) }
        },
    ].map((val, index) => {
        return (
            <Link key={index}
                to={val.to}
                onClick={() => {
                    if (val.onclick) {
                        val.onclick()
                    }
                }}
                className={"nav-item nav-link" + (location.pathname === val.to ? " active" : "")}>

                {val.label}
            </Link>
        )
    })
    return (
        <header className="">
            <nav className="navbar navbar-expand navbar-light sticky-top">
                <a href="#" className="navbar-brand" onClick={() => {
                    resetStore();
                    setNewFlowId();
                    history.push({pathname:'/', search: "?language=" + language })
                }}>
                    <img src="/img/logo.png" alt="BOSA"
                        style={{ width: "188px", height: "54px" }} />
                </a>
                {((location.pathname === "/sign") || (location.pathname === "/validate")|| (location.pathname === "/")) && <div className="navbar-nav">
                    {links}
                </div>}
                <nav className="nav ml-auto">
                    {languages.map((language, index) => (
                        <a key={language} className="nav-link" href={'#'} aria-label={ languagesNames[index]} onClick={() => {
                            history.push(getChangeLanguageLink(language))
                        }}>{language.toUpperCase()}</a>
                    ))}
                </nav>
            </nav>
        </header>
    )
})

const mapStateToProps = (state) => {
    return (state) => ({

    })
}

const mapDispatchToProps = ({
    navigateToStep,
    resetStore,
    setNewFlowId,
})

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Navbar))