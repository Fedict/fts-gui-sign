import { validationSet, VALIDATION_SET } from "./ValidationActions"

describe("ValidationActions", () => {

    test("validationSet returns a action with type VALIDATION_SET and payload report", () => {
        const payload = "first report"
        const result = validationSet(payload)

        expect(result.type).toBe(VALIDATION_SET)
        expect(result.payload).toEqual(payload)
    })
})