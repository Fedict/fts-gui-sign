import React from 'react'

export const Footer = () => {

    return (
        <div className="fixed-bottom text-center bg-light text-muted ">
            <p className="m-1">version: {process.env.REACT_APP_VERSION}</p>
        </div>
    )
}