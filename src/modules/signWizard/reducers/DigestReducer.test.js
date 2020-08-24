import DigestReducer, { initialState } from "./DigestReducer"
import { DIGEST_SET_DIGEST } from "../actions/DigestActions"
import { STORE_RESET } from "../../../store/storeActions"

describe("DigestReducer", () => {

    describe("reducer", () => {

        describe("DIGEST_SET_DIGEST", () => {

            test("action with type DIGEST_SET_DIGEST changes digest object", () => {
                const startState = { ...initialState }
                const payload = {
                    digest: "teststring",
                    digestAlgorithm: "SHA256"
                }
                const action = { type: DIGEST_SET_DIGEST, payload: payload }
                const result = DigestReducer(startState, action)

                expect(result.digest).toEqual(action.payload.digest)
                expect(result.digestAlgorithm).toEqual(action.payload.digestAlgorithm)
                expect(result).toEqual({ ...initialState, ...action.payload })
            })
        })

        describe("STORE_RESET", () => {

            test("action with type STORE_RESET resets store to initial value", () => {
                const startState = {
                    digest: "teststring",
                    digestAlgorithm: "SHA256"
                }
                const action = { type: STORE_RESET }

                const result = DigestReducer(startState, action)

                expect(result).toEqual(initialState)
             })
        })
    })
})