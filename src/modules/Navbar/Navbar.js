import React from 'react'
import {
    Link,
    withRouter
} from "react-router-dom";
import { connect } from 'react-redux';

import { navigateToStep } from "../wizard/WizardActions"
import { resetStore } from "../../store/storeActions"
import { WIZARD_STATE_VERSION_CHECK_LOADING } from '../wizard/WizardConstants';


export const Navbar = ({ location, resetStore }) => {

    console.log(location)
    const links = [
        {
            to: '/sign',
            label: 'Sign',
            onclick: () => { resetStore(); navigateToStep(WIZARD_STATE_VERSION_CHECK_LOADING) }
        }, {
            to: '/validate',
            label: 'Validate',
            onclick: () => { resetStore() }
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
                <a href="/#" className="navbar-brand">
                    <img src="/img/logo-bosa.png" alt="BOSA"
                        style={{ width: "188px", height: "54px" }} />
                </a>
                <div className="navbar-nav">
                    {links}
                </div>

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
})

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Navbar))
