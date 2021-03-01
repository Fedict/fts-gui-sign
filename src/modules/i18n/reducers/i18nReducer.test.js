import i18nReducer, {initialState} from "./i18nReducer";
import {createChooseLanguageAction} from "../actions/i18nActions";

describe("i18nReducer", () => {
    test("action with type CHANGE_LANGUAGE", () => {
        const newLanguage = 'yh';
        const result = i18nReducer(initialState, createChooseLanguageAction(newLanguage));
        expect(result.language).toEqual(newLanguage);
    });
})