import React from 'react'


export const MethodeSelectCard = ({ index, id, name, onClick, url, imgSrc }) => {
    return (
        <div key={index}
            id={"card_" + id + "_" + index}
            className={"card mb-3 container selectCard"}
            onClick={() => {
                if (onClick && typeof onClick === "function") {
                    onClick()
                }
                if (url) {
                    window.location.href = url
                }
            }}>
            <div className="row mb-2 mt-2">
                <div className={"col-3 align-self-center text-center"}>
                    <img src={imgSrc} height={50} width={50} alt={"icon for " + name} />
                </div>

                <div className={"col px-0"} >
                    <h5 className="">sign</h5>
                    <p className="mb-0 btn-link">with {name}</p>
                </div>
            </div>
        </div>
    )
}


