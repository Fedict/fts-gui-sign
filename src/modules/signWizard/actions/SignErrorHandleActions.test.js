import {
    errorStatuses,
    handleErrorEID,
    showPinError,
    PIN_ERROR_SET_ERROR,
    handlePinErrorEID,
    pinErrorText,
    doReportError
} from "./SignErrorHandleActions"
import { showErrorMessage } from "../../message/actions/MessageActions"
import * as  MessageActions from "../../message/actions/MessageActions"
import { Error_EID_http_status_0, Error_EID_no_reader_InSession, Error_EID_no_reader_NotInSession, Error_EID_unsupported_reader, Error_EID_card_blocked, Error_EID_signature_failed, Error_EID_card_error, Error_EID_no_card_NotInSession, Error_EID_no_card_InSession } from "../messages/ErrorsEIDLink"
import { resetWizard, navigateToPinError } from "./WizardLogicActions"
import * as wizardLogicActions from "./WizardLogicActions"
import { ErrorGeneral } from "../../message/MessageConstants"
import {sendBEIDLinkErrorToBE} from "../../communication/communication";
import * as communicationFn from "../../communication/communication";




const ORIGINAL_ShowErroressage = showErrorMessage
const ORIGINAL_resetWizard = resetWizard
const ORIGINAL_navigateToPinError = navigateToPinError
const ORIGINAL_sendBEIDLinkErrorToBE = sendBEIDLinkErrorToBE
const flushPromises = () => new Promise(setImmediate);

const replaceFunctions = () => {
    MessageActions.showErrorMessage = jest.fn()
    wizardLogicActions.resetWizard = jest.fn()
    communicationFn.sendBEIDLinkErrorToBE = jest.fn()
    communicationFn.sendBEIDLinkErrorToBE.mockReturnValue(new Promise((resolve) => {
        resolve({ref:'123'});
    }));
}

process.on('unhandledRejection', (reason, p) => {
    console.error('Unhandled Rejection at:', p, 'reason:', reason)
});

const resetFunctions = () => {
    MessageActions.showErrorMessage = ORIGINAL_ShowErroressage
    wizardLogicActions.resetWizard = ORIGINAL_resetWizard
    communicationFn.sendBEIDLinkErrorToBE = ORIGINAL_sendBEIDLinkErrorToBE
}


describe("SignErrorHandleActions", () => {
    describe("handleErrorEID", () => {

        beforeEach(replaceFunctions);

        afterEach(resetFunctions)

        test('handleErrorEID error.message errorStatuses.http_status_0 show error Error_EID_http_status_0 ', () => {
            const error = { message: errorStatuses.http_status_0, report : 'Sample report' }
            const mockDispatch = jest.fn()
            handleErrorEID(error)(mockDispatch)
            //once for showErrorMessage & once for doReportError
            expect(mockDispatch).toBeCalledTimes(2)
            expect(showErrorMessage).toBeCalledTimes(1)
            expect(showErrorMessage).toBeCalledWith(Error_EID_http_status_0)
        })

        test('handleErrorEID error.message errorStatuses.no_reader isInSession show error Error_EID_no_reader_InSession ', () => {
            const error = { message: errorStatuses.no_reader }
            const mockDispatch = jest.fn()
            handleErrorEID(error, true)(mockDispatch)
            //once for showErrorMessage
            expect(mockDispatch).toBeCalledTimes(1)
            expect(showErrorMessage).toBeCalledTimes(1)
            expect(showErrorMessage).toBeCalledWith(Error_EID_no_reader_InSession)
        })

        test('handleErrorEID error.message errorStatuses.no_reader not isInSession show error Error_EID_no_reader_NotInSession ', () => {
            const error = { message: errorStatuses.no_reader }
            const mockDispatch = jest.fn()
            handleErrorEID(error, false)(mockDispatch)

            expect(showErrorMessage).toBeCalledTimes(1)
            expect(showErrorMessage).toBeCalledWith(Error_EID_no_reader_NotInSession)
        })

        test('handleErrorEID error.message errorStatuses.unsupported_reader show error Error_EID_unsupported_reader ', () => {
            const error = { message: errorStatuses.unsupported_reader }
            const mockDispatch = jest.fn()
            handleErrorEID(error)(mockDispatch)

            //once for showErrorMessage & once for doReportError
            expect(mockDispatch).toBeCalledTimes(2)
            expect(showErrorMessage).toBeCalledTimes(1)
            expect(showErrorMessage).toBeCalledWith(Error_EID_unsupported_reader)
        })

        test('handleErrorEID error.message errorStatuses.no_card isInSession show error Error_EID_no_card_InSession ', () => {
            const error = { message: errorStatuses.no_card }
            const mockDispatch = jest.fn()
            handleErrorEID(error, true)(mockDispatch)

            expect(showErrorMessage).toBeCalledTimes(1)
            expect(showErrorMessage).toBeCalledWith(Error_EID_no_card_InSession)
        })

        test('handleErrorEID error.message errorStatuses.no_card not isInSession show error Error_EID_no_card_NotInSession ', () => {
            const error = { message: errorStatuses.no_card }
            const mockDispatch = jest.fn()
            handleErrorEID(error, false)(mockDispatch)

            expect(showErrorMessage).toBeCalledTimes(1)
            expect(showErrorMessage).toBeCalledWith(Error_EID_no_card_NotInSession)
        })

        test('handleErrorEID error.message errorStatuses.card_error show error Error_EID_card_error ', () => {
            const error = { message: errorStatuses.card_error }
            const mockDispatch = jest.fn()
            handleErrorEID(error)(mockDispatch)

            //once for showErrorMessage & once for doReportError
            expect(mockDispatch).toBeCalledTimes(2)
            expect(showErrorMessage).toBeCalledTimes(1)
            expect(showErrorMessage).toBeCalledWith(Error_EID_card_error)
        })

        test('handleErrorEID error.message errorStatuses.signature_failed show error Error_EID_signature_failed ', () => {
            const error = { message: errorStatuses.signature_failed }
            const mockDispatch = jest.fn()
            handleErrorEID(error)(mockDispatch)

            //once for showErrorMessage & once for doReportError
            expect(mockDispatch).toBeCalledTimes(2)
            expect(showErrorMessage).toBeCalledTimes(1)
            expect(showErrorMessage).toBeCalledWith(Error_EID_signature_failed)
        })

        test('handleErrorEID error.message errorStatuses.card_blocked show error Error_EID_card_blocked ', () => {
            const error = { message: errorStatuses.card_blocked }
            const mockDispatch = jest.fn()
            handleErrorEID(error)(mockDispatch)

            expect(showErrorMessage).toBeCalledTimes(1)
            expect(showErrorMessage).toBeCalledWith(Error_EID_card_blocked)
        })

        test('handleErrorEID error.message errorStatuses.cancel resets wizard', () => {
            const error = { message: errorStatuses.cancel }
            const mockDispatch = jest.fn()
            handleErrorEID(error)(mockDispatch)

            expect(wizardLogicActions.resetWizard).toBeCalledTimes(1)
        })

        const errorMessagesTests = [
            [errorStatuses.pin_1_attempt_left],
            [errorStatuses.pin_2_attempts_left],
            [errorStatuses.pin_too_long],
            [errorStatuses.pin_length],
            [errorStatuses.pin_too_short],
            [errorStatuses.pin_incorrect],
            [errorStatuses.pin_timeout]
        ]

        test.each(errorMessagesTests)("handleErrorEID error.message %s shows ErrorGeneral", (message) => {
            const error = { message: message }
            const mockDispatch = jest.fn()
            handleErrorEID(error)(mockDispatch)

            expect(showErrorMessage).toBeCalledTimes(1)
            expect(showErrorMessage).toBeCalledWith(ErrorGeneral)

        })

        test('handleErrorEID error.message general_error and raw error 0x8010001', () => {
            Object.defineProperty(window.navigator, "appVersion", ((value) => ({
                get() { return value; },
                set(v) { value = v; }
            }))(window.navigator["appVersion"]));

            window.navigator.appVersion = "Mac OS";

            const error = { message: "general_error", resultRaw: 0x80100016, resultType: "SCard", report : "some report" }
            const mockDispatch = jest.fn()
            handleErrorEID(error)(mockDispatch)

            expect(showErrorMessage).toBeCalledTimes(1)

            //once for showErrorMessage & once for doReportError
            expect(mockDispatch).toBeCalledTimes(2)
            expect(showErrorMessage).toBeCalledWith({
                ...ErrorGeneral,
                message: {
                    defaultMessage: "Your MacOS Driver is invalid",
                    id: "error.INVALID_MAC_SCARD_DRIVER"
                }
            })
        })
    })

    describe("showPinError", () => {

        beforeEach(() => {
            wizardLogicActions.navigateToPinError = jest.fn()
        })

        afterEach(() => {
            wizardLogicActions.navigateToPinError = ORIGINAL_navigateToPinError
        })

        test("showPinError dispatches a action with type PIN_ERROR_SET_ERROR and payload message ", () => {
            const mockDispatch = jest.fn()
            const message = 'message'
            showPinError(message)(mockDispatch)

            expect(mockDispatch).toBeCalledWith({ type: PIN_ERROR_SET_ERROR, payload: message })
        })

        test("showPinError navigates to pinError ", () => {
            const mockDispatch = jest.fn()
            const message = 'message'
            showPinError(message)(mockDispatch)

            expect(navigateToPinError).toBeCalledTimes(1)
        })
    })

    describe("handlePinErrorEID", () => {

        beforeEach(replaceFunctions)

        afterEach(resetFunctions)

        test('handlePinErrorEID error.message errorStatuses.pin_1_attempt_left show pinerror pinErrorText.pin_1_attempt_left ', () => {
            const mockDispatch2 = jest.fn()
            const mockDispatch1 = jest.fn(val => {
                val(mockDispatch2)
            })

            const errorMessage = { message: errorStatuses.pin_1_attempt_left }
            handlePinErrorEID(errorMessage)(mockDispatch1)

            expect(mockDispatch2).toBeCalledWith({ type: PIN_ERROR_SET_ERROR, payload: pinErrorText.pin_1_attempt_left })
        })

        test('handlePinErrorEID error.message errorStatuses.pin_2_attempts_left show pinerror pinErrorText.pin_2_attempts_left ', () => {
            const mockDispatch2 = jest.fn()
            const mockDispatch1 = jest.fn(val => { val(mockDispatch2) })

            const errorMessage = { message: errorStatuses.pin_2_attempts_left }
            handlePinErrorEID(errorMessage)(mockDispatch1)

            expect(mockDispatch2).toBeCalledWith({ type: PIN_ERROR_SET_ERROR, payload: pinErrorText.pin_2_attempts_left })
        })

        test('handlePinErrorEID error.message errorStatuses.pin_too_long show pinerror pinErrorText.pin_too_long ', () => {
            const mockDispatch2 = jest.fn()
            const mockDispatch1 = jest.fn(val => { val(mockDispatch2) })

            const errorMessage = { message: errorStatuses.pin_too_long }
            handlePinErrorEID(errorMessage)(mockDispatch1)

            expect(mockDispatch2).toBeCalledWith({ type: PIN_ERROR_SET_ERROR, payload: pinErrorText.pin_too_long })
        })

        test('handlePinErrorEID error.message errorStatuses.pin_length show pinerror pinErrorText.pin_length ', () => {
            const mockDispatch2 = jest.fn()
            const mockDispatch1 = jest.fn(val => { val(mockDispatch2) })

            const errorMessage = { message: errorStatuses.pin_length }
            handlePinErrorEID(errorMessage)(mockDispatch1)

            expect(mockDispatch2).toBeCalledWith({ type: PIN_ERROR_SET_ERROR, payload: pinErrorText.pin_length })
        })

        test('handlePinErrorEID error.message errorStatuses.pin_too_short show pinerror pinErrorText.pin_too_short ', () => {
            const mockDispatch2 = jest.fn()
            const mockDispatch1 = jest.fn(val => { val(mockDispatch2) })

            const errorMessage = { message: errorStatuses.pin_too_short }
            handlePinErrorEID(errorMessage)(mockDispatch1)

            expect(mockDispatch2).toBeCalledWith({ type: PIN_ERROR_SET_ERROR, payload: pinErrorText.pin_too_short })
        })

        test('handlePinErrorEID error.message errorStatuses.pin_incorrect show pinerror pinErrorText.pin_incorrect ', () => {
            const mockDispatch2 = jest.fn()
            const mockDispatch1 = jest.fn(val => { val(mockDispatch2) })

            const errorMessage = { message: errorStatuses.pin_incorrect }
            handlePinErrorEID(errorMessage)(mockDispatch1)

            expect(mockDispatch2).toBeCalledWith({ type: PIN_ERROR_SET_ERROR, payload: pinErrorText.pin_incorrect })
        })

        test('handlePinErrorEID error.message errorStatuses.pin_timeout show pinerror pinErrorText.pin_timeout ', () => {
            const mockDispatch2 = jest.fn()
            const mockDispatch1 = jest.fn(val => { val(mockDispatch2) })

            const errorMessage = { message: errorStatuses.pin_timeout }
            handlePinErrorEID(errorMessage)(mockDispatch1)

            expect(mockDispatch2).toBeCalledWith({ type: PIN_ERROR_SET_ERROR, payload: pinErrorText.pin_timeout })
        })

        describe("not pin specific errors", () => {

            beforeEach(replaceFunctions)

            afterEach(resetFunctions)

            test('handlePinErrorEID error.message errorStatuses.http_status_0 show error Error_EID_http_status_0 ', () => {
                const startError = { message: errorStatuses.http_status_0 }

                const mockDispatch2 = jest.fn()
                const mockDispatch1 = jest.fn((val) => { val(mockDispatch2) })
                handlePinErrorEID(startError)(mockDispatch1)

                expect(mockDispatch2).toBeCalled()
                expect(showErrorMessage).toBeCalledWith(Error_EID_http_status_0);

            })

            test('handlePinErrorEID error.message errorStatuses.no_reader isInSession show error Error_EID_no_reader_InSession ', () => {
                const startError = { message: errorStatuses.no_reader }

                const mockDispatch2 = jest.fn()
                const mockDispatch1 = jest.fn((val) => { val(mockDispatch2) })
                handlePinErrorEID(startError, true)(mockDispatch1)

                expect(mockDispatch2).toBeCalled()
                expect(showErrorMessage).toBeCalledWith(Error_EID_no_reader_InSession)
            })

            test('handlePinErrorEID error.message errorStatuses.no_reader not isInSession show error Error_EID_no_reader_NotInSession ', () => {
                const startError = { message: errorStatuses.no_reader }

                const mockDispatch2 = jest.fn()
                const mockDispatch1 = jest.fn((val) => { val(mockDispatch2) })
                handlePinErrorEID(startError)(mockDispatch1)

                expect(mockDispatch2).toBeCalled()
                expect(showErrorMessage).toBeCalledWith(Error_EID_no_reader_NotInSession)
            })

            test('handlePinErrorEID error.message errorStatuses.unsupported_reader show error Error_EID_unsupported_reader ', () => {
                const startError = { message: errorStatuses.unsupported_reader }

                const mockDispatch2 = jest.fn()
                const mockDispatch1 = jest.fn((val) => { val(mockDispatch2) })
                handlePinErrorEID(startError)(mockDispatch1)

                expect(mockDispatch2).toBeCalled()
                expect(showErrorMessage).toBeCalledWith(Error_EID_unsupported_reader);
            })

            test('handlePinErrorEID error.message errorStatuses.no_card isInSession show error Error_EID_no_card_InSession ', () => {
                const startError = { message: errorStatuses.no_card }

                const mockDispatch2 = jest.fn()
                const mockDispatch1 = jest.fn((val) => { val(mockDispatch2) })
                handlePinErrorEID(startError, true)(mockDispatch1)

                expect(mockDispatch2).toBeCalled()
                expect(showErrorMessage).toBeCalledWith(Error_EID_no_card_InSession)
            })

            test('handlePinErrorEID error.message errorStatuses.no_card not isInSession show error Error_EID_no_card_NotInSession ', () => {
                const startError = { message: errorStatuses.no_card }

                const mockDispatch2 = jest.fn()
                const mockDispatch1 = jest.fn((val) => { val(mockDispatch2) })
                handlePinErrorEID(startError)(mockDispatch1)

                expect(mockDispatch2).toBeCalled()
                expect(showErrorMessage).toBeCalledWith(Error_EID_no_card_NotInSession)
            })

            test('handlePinErrorEID error.message errorStatuses.card_error show error Error_EID_card_error ', () => {
                const startError = { message: errorStatuses.card_error }

                const mockDispatch2 = jest.fn()
                const mockDispatch1 = jest.fn((val) => { val(mockDispatch2) })
                handlePinErrorEID(startError)(mockDispatch1)

                expect(mockDispatch2).toBeCalled()
                expect(showErrorMessage).toBeCalledWith(Error_EID_card_error);

            })

            test('handlePinErrorEID error.message errorStatuses.signature_failed show error Error_EID_signature_failed ', () => {
                const startError = { message: errorStatuses.signature_failed }

                const mockDispatch2 = jest.fn()
                const mockDispatch1 = jest.fn((val) => { val(mockDispatch2) })
                handlePinErrorEID(startError)(mockDispatch1)

                expect(mockDispatch2).toBeCalled()
                expect(showErrorMessage).toBeCalledWith(Error_EID_signature_failed);
            })

            test('handlePinErrorEID error.message errorStatuses.card_blocked show error Error_EID_card_blocked ', () => {
                const startError = { message: errorStatuses.card_blocked }

                const mockDispatch2 = jest.fn()
                const mockDispatch1 = jest.fn((val) => { val(mockDispatch2) })
                handlePinErrorEID(startError)(mockDispatch1)

                expect(mockDispatch2).toBeCalled()
                expect(showErrorMessage).toBeCalledWith(Error_EID_card_blocked)
            })

            test('handlePinErrorEID error.message errorStatuses.cancel resets wizard', () => {

                const startError = { message: errorStatuses.cancel }

                const mockDispatch2 = jest.fn()
                const mockDispatch1 = jest.fn((val) => { val(mockDispatch2) })
                handlePinErrorEID(startError)(mockDispatch1)

                expect(mockDispatch2).toBeCalled()

                expect(wizardLogicActions.resetWizard).toBeCalledTimes(1)
            })
            
            test('handlePinErrorEID error.message general_error', () => {
                const startError = { message: "general_error" }

                const mockDispatch2 = jest.fn()
                const mockDispatch1 = jest.fn((val) => { val(mockDispatch2) })
                handlePinErrorEID(startError)(mockDispatch1)

                expect(mockDispatch2).toBeCalled()
                expect(showErrorMessage).toBeCalledWith({
                    ...ErrorGeneral,
                    body: startError.message,
                    link: {
                        defaultMessage: "More details about this type of error",
                        id: "eid.link.error.general"
                        },
                    linkURL: "#14",
                    message: {
                        defaultMessage: "Something went wrong. Please reload the page and try again.",
                        id: "eid.link.error.general.text"
                        }
                    });
            })

            
            test('handleErrorEID error.message general_error and raw error 0xAEC1wf', () => {
                const error = { message: "general_error", resultRaw: 0xAEC1, resultType: "Card", report : "some report" }
                const mockDispatch = jest.fn()
                handleErrorEID(error)(mockDispatch)
    
                expect(showErrorMessage).toBeCalledTimes(1)
    
                //once for showErrorMessage & once for doReportError
                expect(mockDispatch).toBeCalledTimes(2)
                expect(showErrorMessage).toBeCalledWith({
                    ...ErrorGeneral,
                    body: "general_error - Card - 0xaec1",
                    link: {
                        defaultMessage: "More details about this type of error",
                        id: "eid.link.error.general"
                        },
                  linkURL: "#14",
                    message: {
                        defaultMessage: "Something went wrong. Please reload the page and try again.",
                        id: "eid.link.error.general.text"
                    }
                })
            })
    
        })
    })
})