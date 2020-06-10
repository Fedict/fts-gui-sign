import { getRequestId } from "./WizardHelper"
import * as WizardHelper from "./WizardHelper"
import wizardReducer, { generateId } from "./WizardReducer"
import { WIZARD_STATE_START, WIZARD_STATE_DIGEST_LOADING } from "./WizardConstants"
import { WIZARD_CHANGE_STATE, WIZARD_REQUEST_ID_ADD, WIZARD_REQUEST_ID_REMOVE } from "./WizardActions"
import { WIZARD_RESET_FLOW_ID } from "../controlIds/flowId/FlowIdActions"

const ORIGINAL_getRequestId = getRequestId
describe("WizardReducer", () => {
    beforeEach(() => {
        WizardHelper.getRequestId = jest.fn()
    })
    describe("generateId", () => {


        test("generateId calls getRequestId", () => {

            const expectedValue = 88888
            const startId = 77777

            WizardHelper.getRequestId = jest.fn(() => { return expectedValue })

            const result = generateId(startId)

            expect(result).toEqual(expectedValue)
            expect(WizardHelper.getRequestId).toBeCalledTimes(1)
            expect(WizardHelper.getRequestId).toBeCalledWith([startId])

        })

    })

    describe("reducer", () => {
        test("action with type WIZARD_CHANGE_STATE changes the state object", () => {
            const startState = {
                state: WIZARD_STATE_START,
                flowId: 55555,
                requestIds: []
            }


            const action = { type: WIZARD_CHANGE_STATE, payload: WIZARD_STATE_DIGEST_LOADING }
            const result = wizardReducer(startState, action)


            expect(result).not.toBe(startState)
            expect(result.state).toEqual(action.payload)
        })
        test("action with type WIZARD_RESET_FLOW_ID changes the flowId object", () => {
            const startState = {
                state: WIZARD_STATE_START,
                flowId: 55555,
                requestIds: []
            }

            const expectedValue = 88888
            WizardHelper.getRequestId = jest.fn(() => { return expectedValue })

            const action = { type: WIZARD_RESET_FLOW_ID, payload: 77887 }
            const result = wizardReducer(startState, action)

            expect(result).not.toBe(startState)
            expect(result.flowId).toEqual(expectedValue)
        })
        test("action with type WIZARD_REQUEST_ID_ADD changes the requestIds object", () => {
            const startState = {
                state: WIZARD_STATE_START,
                flowId: 55555,
                requestIds: [88888, 99995]
            }

            const action = { type: WIZARD_REQUEST_ID_ADD, payload: 74747 }
            const result = wizardReducer(startState, action)


            expect(result).not.toBe(startState)
            expect(result.requestIds).toContain(action.payload)
        })
        test("action with type WIZARD_REQUEST_ID_REMOVE changes the requestIds object", () => { 
            const actionNumber = 55545
            const startState = {
                state: WIZARD_STATE_START,
                flowId: 55555,
                requestIds: [88888, 99995, actionNumber]
            }

            const action = { type: WIZARD_REQUEST_ID_REMOVE, payload: actionNumber }
            const result = wizardReducer(startState, action)


            expect(result).not.toBe(startState)
            expect(result.requestIds).not.toContain(actionNumber)
        })
        test("action with type STORE_RESET changes to initial value", () => { })
    })

    afterEach(() => {
        WizardHelper.getRequestId = ORIGINAL_getRequestId
    })
})