import React from 'react'

export const NumberdText = ({ children, number }) => {
    return (
        <div className="row mb-4">
            <div className="col col-1">
                <span className="badge badge-primary p-1">{number}</span>
            </div>
            <div className="col col-11">
                {children}
            </div>
        </div>
    )
}