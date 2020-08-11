import { setNewFlowId, WIZARD_RESET_FLOW_ID } from "./FlowIdActions"

describe('FlowIdActions', () => {

    describe("setNewFlowId", () => {
        
        test('setNewFlowId returns a action with type WIZARD_RESET_FLOW_ID and no payload', () => {
            const result = setNewFlowId()
            expect(result.type).toBe(WIZARD_RESET_FLOW_ID)
        })
    })
})
