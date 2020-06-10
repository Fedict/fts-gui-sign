import { errorStatuses } from "./SignErrorHandleActions"

describe("SignErrorHandleActions", () => {
    describe("handleErrorEID", () => {
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

        test.each(errorMessagesTests)("handleErrorEID error.message %s shows ErrorGeneral", (message) => { })

        test('handleErrorEID error.message unknown shows no message', () => { })
    })

    describe("showPinError", () => {
        test("showPinError dispatches a action with type PIN_ERROR_SET_ERROR and payload message ", () => { })
        test("showPinError navigates to pinError ", () => { })
    })

    describe("handlePinErrorEID", ()=>{
        test('handlePinErrorEID error.message errorStatuses.pin_1_attempt_left show pinerror pinErrorText.pin_1_attempt_left ', () => { })
        test('handlePinErrorEID error.message errorStatuses.pin_2_attempts_left show pinerror pinErrorText.pin_2_attempts_left ', () => { })
        test('handlePinErrorEID error.message errorStatuses.pin_3_attempts_left show pinerror pinErrorText.pin_3_attempts_left ', () => { })
        test('handlePinErrorEID error.message errorStatuses.pin_too_long show pinerror pinErrorText.pin_too_long ', () => { })
        test('handlePinErrorEID error.message errorStatuses.pin_length show pinerror pinErrorText.pin_length ', () => { })
        test('handlePinErrorEID error.message errorStatuses.pin_too_short show pinerror pinErrorText.pin_too_short ', () => { })
        test('handlePinErrorEID error.message errorStatuses.pin_incorrect show pinerror pinErrorText.pin_incorrect ', () => { })
        test('handlePinErrorEID error.message errorStatuses.pin_timeout show pinerror pinErrorText.pin_timeout ', () => { })
       
        describe("not pin specific errors", ()=>{
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