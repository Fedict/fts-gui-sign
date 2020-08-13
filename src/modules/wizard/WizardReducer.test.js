import wizardReducer, { initialState } from "./WizardReducer"
import { WIZARD_STATE_START, WIZARD_STATE_DIGEST_LOADING } from "./WizardConstants"
import { WIZARD_CHANGE_STATE } from "./WizardActions"
import { STORE_RESET } from "../../store/storeActions"

describe("WizardReducer", () => {
    
    describe("reducer", () => {

        test("action with type WIZARD_CHANGE_STATE changes the state object", () => {
            const startState = {
                state: WIZARD_STATE_START,
            }

            const action = { type: WIZARD_CHANGE_STATE, payload: WIZARD_STATE_DIGEST_LOADING }
            const result = wizardReducer(startState, action)

            expect(result).not.toBe(startState)
            expect(result.state).toEqual(action.payload)
        })

        test("action with type STORE_RESET doent chang state", () => {

            const startState = {
                state: WIZARD_STATE_DIGEST_LOADING
            }
            const action = { type: STORE_RESET }
            const result = wizardReducer(startState, action)

            expect(result).toEqual(startState)
        })
    })
})