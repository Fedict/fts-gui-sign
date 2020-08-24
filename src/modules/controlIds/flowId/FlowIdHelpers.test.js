import { handleFlowIdError, INCORECT_FLOW_ID } from "./FlowIdHelpers"

describe('FlowIdHelpers', () => {

    test('handleFlowIdError returns response when flowId is in store', () => {
        const startId = 11111
        const getStore = jest.fn(() => { return { controlId: { flowId: startId } } })
        const expectedResult = { test: "test" }
        const result = handleFlowIdError(startId, getStore)(expectedResult)

        expect(result).toEqual(expectedResult)
    })

    test('handleFlowIdError throws error when flowId is not in store', () => {
        const startId = 11111
        const getStore = jest.fn(() => { return { controlId: { flowId: 88888 } } })
        const expectedResult = { test: "test" }

        const responsFunction = () => { handleFlowIdError(startId, getStore)(expectedResult) }

        expect(responsFunction).toThrowError(INCORECT_FLOW_ID)
    })
})