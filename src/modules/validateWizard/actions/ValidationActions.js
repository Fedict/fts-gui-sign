export const VALIDATION_SET_INDICATION = "VALIDATION_SET_INDICATION"
export const VALIDATION_SET_SUBINDICATION = "VALIDATION_SET_SUBINDICATION"


export const validationSetIndication = (indication) => {
    return { type: VALIDATION_SET_INDICATION, payload: indication }
}

export const validationSetSubIndication = (subIndication) => {
    return { type: VALIDATION_SET_SUBINDICATION, payload: subIndication }
}

