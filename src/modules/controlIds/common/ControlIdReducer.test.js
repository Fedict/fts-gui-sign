import ControlIdReducer from './ControlIdReducer'
import { WIZARD_RESET_FLOW_ID } from '../flowId/FlowIdActions'
import { WIZARD_STATE_START } from '../../wizard/WizardConstants'
import { WIZARD_REQUEST_ID_ADD, WIZARD_REQUEST_ID_REMOVE } from '../requestId/RequestIdActions'
import { STORE_RESET } from '../../../store/storeActions'
import { generateId } from './ControlIdHelper'
import * as ControlIdHelper from './ControlIdHelper'

const ORIGINAL_generateId = generateId

describe('controlIdReducer', () => {

    describe("reducer", () => {

        describe("WIZARD_RESET_FLOW_ID", () => {

            beforeEach(() => {
                ControlIdHelper.generateId = jest.fn()
            })

            test("action with type WIZARD_RESET_FLOW_ID changes the flowId object", () => {
                const startState = {
                    flowId: 55555,
                    requestIds: [88888, 99995]
                }

                const action = { type: WIZARD_RESET_FLOW_ID }

                const expectedFlowId = 88884
                ControlIdHelper.generateId = jest.fn(() => { return expectedFlowId })
                const result = ControlIdReducer(startState, action)


                expect(result.requestIds).toEqual(startState.requestIds)
                expect(result.flowId).toEqual(expectedFlowId)
                expect(ControlIdHelper.generateId).toBeCalledTimes(1)
            })

            afterEach(() => {
                ControlIdHelper.generateId = ORIGINAL_generateId
            })
        })

        describe("WIZARD_REQUEST_ID_ADD", () => {

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
        })

        describe("WIZARD_REQUEST_ID_REMOVE", () => {

            test("action with type WIZARD_REQUEST_ID_REMOVE changes the requestIds object", () => {
                const actionNumber = 55545
                const startState = {
                    flowId: 55555,
                    requestIds: [88888, 99995, actionNumber]
                }

                const action = { type: WIZARD_REQUEST_ID_REMOVE, payload: actionNumber }
                const result = ControlIdReducer(startState, action)


                expect(result).not.toBe(startState)
                expect(result.requestIds).not.toContain(actionNumber)
            })
        })

        describe("STORE_RESET", () => {

            beforeEach(() => {
                ControlIdHelper.generateId = jest.fn()
            })

            test("action with type STORE_RESET changes to initial value", () => {
                const startState = {
                    flowId: 55555,
                    requestIds: [88888, 99995]
                }

                const action = { type: STORE_RESET }

                const expectedFlowId = 88884
                ControlIdHelper.generateId = jest.fn(() => { return expectedFlowId })
                const result = ControlIdReducer(startState, action)

                expect(result.requestIds).toEqual([])
                expect(result.flowId).toEqual(expectedFlowId)
                expect(ControlIdHelper.generateId).toBeCalledTimes(1)

            })

            afterEach(() => {
                ControlIdHelper.generateId = ORIGINAL_generateId
            })
        })       
    })
})

