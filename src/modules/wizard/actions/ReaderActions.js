export const READER_SET_CHECK = "READER_SET_CHECK"
export const READER_SET_OK = "READER_SET_OK"

export const readerSetCheck = (state) => {
    return {
        type: READER_SET_CHECK,
        payload: state
    }
}
export const readerSetOk = (state) => {
    return {
        type: READER_SET_OK,
        payload: state
    }
}