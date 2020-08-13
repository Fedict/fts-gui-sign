import { PIN_ERROR_SET_ERROR } from "../actions/SignErrorHandleActions"
import PinErrorReducer, { initialState } from "./PinErrorReducer"
import { STORE_RESET } from "../../../store/storeActions"

describe("PinErrorReducer", () => {

    describe("reducer", () => {

        describe("PIN_ERROR_SET_ERROR", () => {

            test("action with type PIN_ERROR_SET_ERROR changes message object", () => {
                const startState = { ...initialState }
                const payload = "teststring"

                const action = { type: PIN_ERROR_SET_ERROR, payload: payload }
                const result = PinErrorReducer(startState, action)

                expect(result.message).toEqual(action.payload)
                expect(result).toEqual({ ...initialState, message: action.payload })
            })
        })

        describe("STORE_RESET", () => {

            test("action with type STORE_RESET resets store to initial value", () => {
                const startState = { message: "teststring" }

                const action = { type: STORE_RESET }
                const result = PinErrorReducer(startState, action)


                expect(result).toEqual({ ...initialState })
            })
        })
    })
})