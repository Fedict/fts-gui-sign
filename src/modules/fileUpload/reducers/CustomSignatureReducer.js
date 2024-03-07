const SET_SIGNATURES_FIELDS = "SET_SIGNATURES_FIELDS"

export const setSignatureFields = (signatureFields => ({ type: SET_SIGNATURES_FIELDS, payload: signatureFields }))

const SET_SIGNATURE_AREA = "SET_SIGNATURE_AREA"

export const setSignatureArea = (signatureArea) => ({ type: SET_SIGNATURE_AREA, payload: signatureArea })

export const INVISIBLE_SIGNATURE = null
export const MANUAL_SIGNATURE = undefined

const SELECT_SIGNATURE = "SELECT_SIGNATURE"

export const selectSignature = (signatureSelected) => ({ type: SELECT_SIGNATURE, payload: signatureSelected })

const CUST_SIG_SET_SIG_ATTRS = "CUST_SIG_SET_SIG_ATTRS"

export const setSignAttributes = (attrs) => ({ type: CUST_SIG_SET_SIG_ATTRS, payload: attrs })

const INCLUDE_PHOTO = "INCLUDE_PHOTO"

export const includePhoto = (photoIncluded) => ({ type: INCLUDE_PHOTO, payload: photoIncluded })

const LOCK = "LOCK"

export const lock = (locked) => ({ type: LOCK, payload: { locked: locked } })

const CUST_SIG_STORE_RESET = "CUST_SIG_STORE_RESET"

export const reset = () => ({ type: CUST_SIG_STORE_RESET, payload: null })


export const initialState = {
    signatureFields: [],
    signatureArea: null,
    signatureSelected: INVISIBLE_SIGNATURE,
    photoIncluded: false,
    locked: false
}

const CustomSignatureReducer = (state = initialState, action) => {
    switch (action.type) {
        case CUST_SIG_SET_SIG_ATTRS:
            return  {
                ...state,
                ...action.payload
            }
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
        case INCLUDE_PHOTO:
            return {
                ...state,
                photoIncluded: action.payload
                }
                case LOCK:
            return {
                ...state,
                locked: action.payload.locked,
                }
        case CUST_SIG_STORE_RESET:
            return initialState
        default:
            return state
    }
}

export default CustomSignatureReducer
