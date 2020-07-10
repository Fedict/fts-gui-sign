import { errorStatuses, handleErrorEID, showPinError, PIN_ERROR_SET_ERROR } from "./SignErrorHandleActions"
import { showErrorMessage } from "../../message/actions/MessageActions"
import * as  MessageActions from "../../message/actions/MessageActions"
import { Error_EID_http_status_0, Error_EID_no_reader_InSession, Error_EID_no_reader_NotInSession, Error_EID_unsupported_reader, Error_EID_card_blocked, Error_EID_signature_failed, Error_EID_card_error, Error_EID_no_card_NotInSession, Error_EID_no_card_InSession } from "../messages/ErrorsEIDLink"
import { resetWizard, navigateToPinError } from "./WizardLogicActions"
import * as wizardLogicActions from "./WizardLogicActions"
import { ErrorGeneral } from "../../message/MessageConstants"
import { navigateToStep } from "../../wizard/WizardActions"


const ORIGINAL_ShowErroressage = showErrorMessage
const ORIGINAL_resetWizard = resetWizard
const ORIGINAL_navigateToPinError = navigateToPinError


describe("SignErrorHandleActions", () => {
    describe("handleErrorEID", () => {
        beforeEach(() => {

            MessageActions.showErrorMessage = jest.fn()
            wizardLogicActions.resetWizard = jest.fn()
        })
        afterEach(() => {
            MessageActions.showErrorMessage = ORIGINAL_ShowErroressage
            wizardLogicActions.resetWizard = ORIGINAL_resetWizard
        })
        test('handleErrorEID error.message errorStatuses.http_status_0 show error Error_EID_http_status_0 ', () => {
            const error = { message: errorStatuses.http_status_0 }
            const mockDispatch = jest.fn()
            handleErrorEID(error)(mockDispatch)

            expect(showErrorMessage).toBeCalledTimes(1)
            expect(showErrorMessage).toBeCalledWith(Error_EID_http_status_0)
        })
        test('handleErrorEID error.message errorStatuses.no_reader isInSession show error Error_EID_no_reader_InSession ', () => {
            const error = { message: errorStatuses.no_reader }
            const mockDispatch = jest.fn()
            handleErrorEID(error, true)(mockDispatch)

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

            expect(showErrorMessage).toBeCalledTimes(1)
            expect(showErrorMessage).toBeCalledWith(Error_EID_card_error)
        })
        test('handleErrorEID error.message errorStatuses.signature_failed show error Error_EID_signature_failed ', () => {
            const error = { message: errorStatuses.signature_failed }
            const mockDispatch = jest.fn()
            handleErrorEID(error)(mockDispatch)

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
            [errorStatuses.pin_3_attempts_left],
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

        test('handleErrorEID error.message unknown shows no message', () => {
            const error = { message: "unknown" }
            const mockDispatch = jest.fn()
            handleErrorEID(error)(mockDispatch)

            expect(showErrorMessage).toBeCalledTimes(0)
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
        test('handlePinErrorEID error.message errorStatuses.pin_1_attempt_left show pinerror pinErrorText.pin_1_attempt_left ', () => { })
        test('handlePinErrorEID error.message errorStatuses.pin_2_attempts_left show pinerror pinErrorText.pin_2_attempts_left ', () => { })
        test('handlePinErrorEID error.message errorStatuses.pin_3_attempts_left show pinerror pinErrorText.pin_3_attempts_left ', () => { })
        test('handlePinErrorEID error.message errorStatuses.pin_too_long show pinerror pinErrorText.pin_too_long ', () => { })
        test('handlePinErrorEID error.message errorStatuses.pin_length show pinerror pinErrorText.pin_length ', () => { })
        test('handlePinErrorEID error.message errorStatuses.pin_too_short show pinerror pinErrorText.pin_too_short ', () => { })
        test('handlePinErrorEID error.message errorStatuses.pin_incorrect show pinerror pinErrorText.pin_incorrect ', () => { })
        test('handlePinErrorEID error.message errorStatuses.pin_timeout show pinerror pinErrorText.pin_timeout ', () => { })

        describe("not pin specific errors", () => {
            test('handleErrorEID error.message errorStatuses.http_status_0 show error Error_EID_http_status_0 ', () => { })
            test('handleErrorEID error.message errorStatuses.no_reader isInSession show error Error_EID_no_reader_InSession ', () => { })
            test('handleErrorEID error.message errorStatuses.no_reader not isInSession show error Error_EID_no_reader_NotInSession ', () => { })
            test('handleErrorEID error.message errorStatuses.unsupported_reader show error Error_EID_unsupported_reader ', () => { })
            test('handleErrorEID error.message errorStatuses.no_card isInSession show error Error_EID_no_card_InSession ', () => { })
            test('handleErrorEID error.message errorStatuses.no_card not isInSession show error Error_EID_no_card_NotInSession ', () => { })
            test('handleErrorEID error.message errorStatuses.card_error show error Error_EID_card_error ', () => { })
            test('handleErrorEID error.message errorStatuses.signature_failed show error Error_EID_signature_failed ', () => { })
            test('handleErrorEID error.message errorStatuses.card_blocked show error Error_EID_card_blocked ', () => { })
            test('handleErrorEID error.message errorStatuses.cancel resets wizard', () => { })
            test('handleErrorEID error.message unknown shows no message', () => { })
        })
    })
})