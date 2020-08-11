import { getRequestIds, handleRequestIdError, INCORECT_REQUEST_ID } from "./RequestIdHelpers"
import { removeRequestId } from "./RequestIdActions"

describe("RequestIdHelpers", () => {

    describe("getRequestIds", () => {

        test("getRequestIds retuns corract value out of the store", () => {
            const expectedResult = [55555, 88888]
            const getStoreMockResult = { controlId: { requestIds: expectedResult } }
            const getStoreMock = jest.fn(() => { return getStoreMockResult })

            const result = getRequestIds(getStoreMock)

            expect(result).toEqual(expectedResult)

        })
    })

    describe("handleRequestIdError", () => {

        test("handleRequestIdError removes the id from the store", () => {
            const startId = 88888
            const getStoreMockResult = { controlId: { requestIds: [55555, startId] } }
            const getStoreMock = jest.fn(() => { return getStoreMockResult })
            const dispatchMock = jest.fn()
            const expectedResult = { test: "response" }
            handleRequestIdError(startId, dispatchMock, getStoreMock)(expectedResult)

            expect(dispatchMock).toHaveBeenCalledWith(removeRequestId(startId))
        })

        test("handleRequestIdError returns the response if the id is in the store", () => {
            const startId = 88888
            const getStoreMockResult = { controlId: { requestIds: [55555, startId] } }
            const getStoreMock = jest.fn(() => { return getStoreMockResult })
            const dispatchMock = jest.fn()
            const expectedResult = { test: "response" }
            const result = handleRequestIdError(startId, dispatchMock, getStoreMock)(expectedResult)

            expect(result).toEqual(expectedResult)

        })
        
        test("handleRequestIdError throws error if the id is not in the store", () => {
            const startId = 88888
            const getStoreMockResult = { controlId: { requestIds: [55555] } }
            const getStoreMock = jest.fn(() => { return getStoreMockResult })
            const dispatchMock = jest.fn()
            const expectedResult = { test: "response" }
            const resultFunction = () => { handleRequestIdError(startId, dispatchMock, getStoreMock)(expectedResult) }

            expect(resultFunction).toThrowError(INCORECT_REQUEST_ID)
        })
    })
})