import wizardReducer from "./WizardReducer"
import { WIZARD_STATE_START, WIZARD_STATE_DIGEST_LOADING } from "./WizardConstants"
import { WIZARD_CHANGE_STATE } from "./WizardActions"

describe("WizardReducer", () => {
    beforeEach(() => {
       
    })

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

        test("action with type STORE_RESET changes to initial value", () => { })
    })

    afterEach(() => {
    })
})