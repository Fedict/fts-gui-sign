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
import {languages} from "../../const";
import {chooseLanguage} from "../i18n/actions/i18nActions";

const getChangeLanguageLink = (language) => {
    let url = new URL(window.location);
    url.searchParams.set('language', language);
    return url.pathname + '?' + url.searchParams.toString();
}

export const Navbar = ({ location, resetStore, navigateToStep, setNewFlowId, history, chooseLanguage }) => {

    const links = [
        {
            to: '/sign',
            label: 'Sign',
            onclick: () => { resetStore(); setNewFlowId(); navigateToStep(WIZARD_STATE_START) }
        }, {
            to: '/validate',
            label: 'Validate',
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
                <a href="/#" className="navbar-brand" onClick={() => {
                    resetStore();
                    setNewFlowId();
                    history.push("/")
                }}>
                    <img src="/img/logo.png" alt="BOSA"
                        style={{ width: "188px", height: "54px" }} />
                </a>
                {false && <div className="navbar-nav">
                    {links}
                </div>}
                <nav className="nav ml-auto">
                    {languages.map((language) => (
                        <a key={language} className="nav-link" href={'#'} onClick={() => {
                            history.push(getChangeLanguageLink(language))
                        }}>{language.toUpperCase()}</a>
                    ))}
                </nav>
            </nav>
        </header>
    )
}

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