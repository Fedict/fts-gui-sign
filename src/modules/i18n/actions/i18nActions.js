import {fetchMessagesForLocale} from "../../communication/communication";

export const LANGUAGE_CHOSEN = 'LANGUAGE_CHOSEN';

export const createChooseLanguageAction = (language) => {
    return {type: LANGUAGE_CHOSEN, payload: language};
}

export const chooseLanguage = (language) => (dispatch) => {
    dispatch(createChooseLanguageAction(language))
}

export const loadMessagesForLocale = (locale, callback) => {
    return dispatch => {
        fetchMessagesForLocale(locale)
            .then((payload) => {
                if (typeof callback === 'function') {
                    let messagesInApp = require('../../../translations/' + locale + '.json');
                    callback(Object.assign(messagesInApp, payload));
                }
            })
    }
}