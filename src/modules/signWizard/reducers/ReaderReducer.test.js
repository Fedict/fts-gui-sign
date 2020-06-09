import ReaderReducer, { initialState } from "./ReaderReducer"
import { READER_SET_CHECK, READER_SET_OK } from "../actions/ReaderActions"
import { STORE_RESET } from "../../../store/storeActions"

describe("ReaderReducer", () => {
    describe("reducer", () => {
        describe("READER_SET_CHECK", () => {
            test("action with type READER_SET_CHECK changes isChecked object", () => {
                const startState = { ...initialState }
                const payload = true

                const action = { type: READER_SET_CHECK, payload: payload }
                const result = ReaderReducer(startState, action)

                expect(result.isChecked).toEqual(action.payload)
                expect(result).toEqual({ ...initialState, isChecked: action.payload })
            })
        })
        describe("READER_SET_OK", () => {
            test("action with type READER_SET_OK changes isOk object", () => {
                const startState = { ...initialState }
                const payload = true

                const action = { type: READER_SET_OK, payload: payload }
                const result = ReaderReducer(startState, action)

                expect(result.isOk).toEqual(action.payload)
                expect(result).toEqual({ ...initialState, isOk: action.payload })
            })
        })

        describe("STORE_RESET", () => {
            test("action with type STORE_RESET resets store to initial value", () => {

                const startState = {
                    isChecked: true,
                    isOk: true,
                }

                const action = { type: STORE_RESET }
                const result = ReaderReducer(startState, action)


                expect(result).toEqual({ ...initialState })

            })
        })


    })
})