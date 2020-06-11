import { WIZARD_REQUEST_ID_ADD, addRequestId, removeRequestId, WIZARD_REQUEST_ID_REMOVE } from "./RequestIdActions"

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
        test("createRequestId return a new request ID", () => { })
        test("createRequestId creates a setTimeout with correct interval", () => { })
        test("createRequestId timeOut stops eIDLink and checks version when requestID is in Store and ", () => { })
        test("createRequestId timeOut does when requestID is not in Store and ", () => { })
    })
    describe("createGetVersionRequestId", () => {
        test('createGetVersionRequestId returns a new request ID', () => { })
        test('createGetVersionRequestId creates a setTimeout of 4000ms', () => { })
        test('createGetVersionRequestId setTimeout reloads page when requestId is in store', () => { })
        test('createGetVersionRequestId setTimeout does nothing when requestId in not in store', () => { })
    })
})