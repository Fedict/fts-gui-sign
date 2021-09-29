import React from 'react'
import {connect} from "react-redux";

export const Footer = (props) => {
    return (
        <div className="fixed-bottom  bg-light text-muted ">
            <p className="m-1 ml-3">version: {process.env.REACT_APP_VERSION} - {props.token}</p>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        token : (state.tokenFile && state.tokenFile.token?state.tokenFile.token.substr(state.tokenFile.token.length - 16):undefined),
    }
}

export default connect(mapStateToProps)(Footer);