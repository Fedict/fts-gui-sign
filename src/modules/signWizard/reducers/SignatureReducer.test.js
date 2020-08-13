import { SIGNATURE_SET_SIGNATURE } from "../actions/SignatureActions"
import SignatureReducer, { initialState } from "./SignatureReducer"
import { STORE_RESET } from "../../../store/storeActions"

describe("SignatureReducer", () => {

    describe("reducer", () => {

        describe("READER_SET_CHECK", () => {

            test("action with type SIGNATURE_SET_SIGNATURE changes signature object", () => {
                const startState = { ...initialState }
                const payload = "teststring"

                const action = { type: SIGNATURE_SET_SIGNATURE, payload: payload }
                const result = SignatureReducer(startState, action)

                expect(result.signature).toEqual(action.payload)
                expect(result).toEqual({ ...initialState, signature: action.payload })
            })
        })

        describe("STORE_RESET", () => {

            test("action with type STORE_RESET resets store to initial value", () => {
                const startState = {
                    signature: "testString"
                }

                const action = { type: STORE_RESET }
                const result = SignatureReducer(startState, action)


                expect(result).toEqual({ ...initialState })
            })
        })
    })
})