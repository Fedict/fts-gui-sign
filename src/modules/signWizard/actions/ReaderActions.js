/**
* action type to change the reader check status
*/
export const READER_SET_CHECK = "READER_SET_CHECK"

/**
 * function to change the reader check status
 * @param {boolean} state - boolean that represents if the reader is checked
 **/
export const readerSetCheck = (state) => ({ type: READER_SET_CHECK, payload: state })

/**
 * action type to change the reader ok status
 */
export const READER_SET_OK = "READER_SET_OK"

/**
 * function to change the reader ok status
 * @param {boolean} state - boolean that represents if the reader is ok
 **/
export const readerSetOk = (state) => ({ type: READER_SET_OK, payload: state })