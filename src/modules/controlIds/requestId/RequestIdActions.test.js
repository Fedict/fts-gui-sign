import { WIZARD_REQUEST_ID_ADD, addRequestId, removeRequestId, WIZARD_REQUEST_ID_REMOVE, createRequestId } from "./RequestIdActions"
import { getRequestIds } from "./RequestIdHelpers"
import * as RequestIdHelpers from "./RequestIdHelpers"

import { generateIdFromArray } from "../common/ControlIdHelper"
import * as ControlIdHelper from "../common/ControlIdHelper"

const ORIGINAL_getRequestIds = getRequestIds
const ORIGINAL_generateIdFromArray = generateIdFromArray

describe("RequestIdActions", () => {
    describe("addRequestId", () => {

        test("addRequestId returns a action with type WIZARD_REQUEST_ID_ADD and payload id", () => {
            const payload = 12356
            const result = addRequestId(payload)

            expect(result.type).toBe(WIZARD_REQUEST_ID_ADD)
            expect(result.payload).toEqual(payload)
        })
    })

    describe("removeRequestId", () => {

        test("removeRequestId returns a action with type WIZARD_REQUEST_ID_REMOVE and payload id", () => {
            const payload = 12356
            const result = removeRequestId(payload)

            expect(result.type).toBe(WIZARD_REQUEST_ID_REMOVE)
            expect(result.payload).toEqual(payload)
        })
    })

    describe("createRequestId", () => {

        beforeEach(() => {
            RequestIdHelpers.getRequestIds = jest.fn()
            ControlIdHelper.generateIdFromArray = jest.fn()
            jest.useFakeTimers();
        })

        test("createRequestId return a new request ID", () => {
            RequestIdHelpers.getRequestIds = jest.fn(() => { return [88888, 77777] })
            ControlIdHelper.generateIdFromArray = jest.fn(() => { return 55555 })
            const startTimeout = 5000
            const startTimeoutCallBackAction = { type: "actiontype", payload: 'test' }
            const dispatch = jest.fn()
            const getStore = jest.fn()
            createRequestId(startTimeout, startTimeoutCallBackAction)(dispatch, getStore)

            expect(dispatch).toBeCalledWith(addRequestId(55555))
        })

        test("createRequestId creates a setTimeout with correct interval", () => {
            RequestIdHelpers.getRequestIds = jest.fn(() => { return [88888, 77777] })
            ControlIdHelper.generateIdFromArray = jest.fn(() => { return 55555 })
            const startTimeout = 5000
            const startTimeoutCallBackAction = { type: "actiontype", payload: 'test' }
            const dispatch = jest.fn()
            const getStore = jest.fn()
            createRequestId(startTimeout, startTimeoutCallBackAction)(dispatch, getStore)

            expect(setTimeout).toHaveBeenCalledTimes(1)
            expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), startTimeout)
            expect(dispatch).toBeCalledWith(addRequestId(55555))
        })

        test("createRequestId timeOut triggers requestId in Store dispatch timeoutCallbackAction", () => {
            RequestIdHelpers.getRequestIds = jest.fn(() => { return [88888, 77777] })
            ControlIdHelper.generateIdFromArray = jest.fn(() => { return 55555 })
            const startTimeout = 5000
            const startTimeoutCallBackAction = { type: "actiontype", payload: 'test' }
            const dispatch = jest.fn()
            const getStore = jest.fn()
            createRequestId(startTimeout, startTimeoutCallBackAction)(dispatch, getStore)


            expect(setTimeout).toHaveBeenCalledTimes(1)
            expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), startTimeout)
            expect(dispatch).toBeCalledTimes(1)
            expect(dispatch).toBeCalledWith(addRequestId(55555))
        })
        
        test("createRequestId timeOut triggess requestId not in store does nothing ", () => {
            RequestIdHelpers.getRequestIds = jest.fn(() => { return [88888, 77777] })
            ControlIdHelper.generateIdFromArray = jest.fn(() => { return 55555 })
            const startTimeout = 5000
            const startTimeoutCallBackAction = { type: "actiontype", payload: 'test' }
            const dispatch = jest.fn()
            const getStore = jest.fn()
            createRequestId(startTimeout, startTimeoutCallBackAction)(dispatch, getStore)

            jest.runAllTimers();
            expect(setTimeout).toHaveBeenCalledTimes(1)
            expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), startTimeout)
            expect(dispatch).toBeCalledTimes(2)
            expect(dispatch).toBeCalledWith(addRequestId(55555))
            expect(dispatch).toBeCalledWith(removeRequestId(55555))
        })

        afterEach(() => {
            RequestIdHelpers.getRequestIds = ORIGINAL_getRequestIds
            ControlIdHelper.generateIdFromArray = ORIGINAL_generateIdFromArray
        })
        beforeEach(() => {
            jest.useFakeTimers('legacy');
            //jest.spyOn(global, 'setTimeout');
          });

    })
})