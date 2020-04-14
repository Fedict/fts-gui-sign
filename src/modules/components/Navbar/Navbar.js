import React from 'react'

export const Navbar = () => {

    return (
        <header className="pt-2 pb-2">
            <div className="container d-flex justify-content-start align-items-center">
                <a href="/#" className="logo d-inline-block">

                    <img src="/img/logo-bosa.png" alt="BOSA"
                        style={{ width: "188px", height: "54px" }} className="d-inline-block" />
                </a>
                <nav className="nav menu margin-left-20">

                </nav>
                <nav className="nav ml-auto">
                    {/* todo implement i18n */}
                    <a className="nav-link" href="/#">FR</a>
                    <a className="nav-link" href="/#">NL</a>
                    <a className="nav-link" href="/#">DE</a>
                    <a className="nav-link" href="/#">EN</a>
                </nav>
            </div>
        </header>
    )
}