import { readerSetCheck, READER_SET_CHECK, readerSetOk, READER_SET_OK } from "./ReaderActions"

describe("ReaderActions", () => {
    describe("readerSetCheck", () => {
        test("readerSetCheck returns a action with type READER_SET_CHECK and payload state ", () => { 
            const payload = true
            const result = readerSetCheck(payload)

            expect(result.type).toBe(READER_SET_CHECK)
            expect(result.payload).toEqual(payload)
      
        })
    })

    describe("readerSetOk", () => {
        test("readerSetOk returns a action with type READER_SET_CHECK and payload state ", () => {
            const payload = true
            const result = readerSetOk(payload)

            expect(result.type).toBe(READER_SET_OK)
            expect(result.payload).toEqual(payload)
         })
    })
})