import generateIdFromArray from './ControlIdHelper'
import * as helper from './ControlIdHelper'
import ControlIdReducer from './ControlIdReducer'
import { WIZARD_RESET_FLOW_ID } from '../flowId/FlowIdActions'
import { WIZARD_STATE_START } from '../../wizard/WizardConstants'
import { WIZARD_REQUEST_ID_ADD, WIZARD_REQUEST_ID_REMOVE } from '../requestId/RequestIdActions'

const ORIGINAL_generateIdFromArray = generateIdFromArray

describe('controlIdReducer', () => {

    beforeEach(() => {

    })

    test("action with type WIZARD_RESET_FLOW_ID changes the flowId object", () => {

    })

    afterEach(() => {

    })
    describe("reducer", () => {
        test("action with type WIZARD_REQUEST_ID_ADD changes the requestIds object", () => {
            const startState = {
                state: WIZARD_STATE_START,
                flowId: 55555,
                requestIds: [88888, 99995]
            }

            const action = { type: WIZARD_REQUEST_ID_ADD, payload: 74747 }
            const result = ControlIdReducer(startState, action)


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
            const result = ControlIdReducer(startState, action)


            expect(result).not.toBe(startState)
            expect(result.requestIds).not.toContain(actionNumber)
        })
        test("action with type STORE_RESET changes to initial value", () => { })
    })
})

