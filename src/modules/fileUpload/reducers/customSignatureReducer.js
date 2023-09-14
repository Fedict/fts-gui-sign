const SET_SIGNATURES_FIELDS = "SET_SIGNATURES_FIELDS"

export const setSignatureFields = (signatureFields => ({ type: SET_SIGNATURES_FIELDS, payload: signatureFields }))

const SET_SIGNATURE_AREA = "SET_SIGNATURE_AREA"

export const setSignatureArea = (signatureArea) => ({ type: SET_SIGNATURE_AREA, payload: signatureArea })

export const INVISIBLE_SIGNATURE = null
export const MANUAL_SIGNATURE = undefined

const SELECT_SIGNATURE = "SELECT_SIGNATURE"

export const selectSignature = (signatureSelected) => ({ type: SELECT_SIGNATURE, payload: signatureSelected })

const STORE_RESET = "STORE_RESET"

export const reset = () => ({ type: STORE_RESET, payload: null })


export const initialState = {
    signatureFields: [],
    signatureArea: null,
    signatureSelected: INVISIBLE_SIGNATURE
}

const CustomSignatureReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_SIGNATURES_FIELDS:
            return {
                ...state,
                signatureFields: action.payload
            }
            case SET_SIGNATURE_AREA:
                return {
                    ...state,
                    signatureArea: action.payload
                    }
            case SELECT_SIGNATURE:
                return {
                    ...state,
                    signatureSelected: action.payload
                    }
            case STORE_RESET:
                return initialState
        default:
            return state
    }
}

export default CustomSignatureReducer
