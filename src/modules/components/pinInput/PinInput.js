import React from "react"


export const PinInput = () => {
    return (<React.Fragment>

        <div className="row col">
            <div style={{ backgroundColor: "lightgreen" }} className='col col-10'>
                <p>geef uw pincode PinInput</p>
                <p>error</p>
                <div className="row mb-2">
                    <div className="col-auto">
                        <input type="password" id="input_code" className="form-control" id="pincode" />
                    </div>
                    <div className="col-auto">
                        <button type="submit" className="btn btn-primary">Submit</button>
                    </div>
                </div>
            </div>
        </div>

    </React.Fragment>)
}