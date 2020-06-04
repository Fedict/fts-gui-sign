import React from 'react'

/**
 * A component for showing a number before text
 * @param {object} props 
 * @param {node} [props.number] - number that should be shown
 * @param {node} [props.children] - text next to the number
 */
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