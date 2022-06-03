import { getRequestId } from "./WizardHelper"

describe("WizardHelper", () => {
    describe("getRequestId", () => {
        test('getRequestId returns a unique id', () => {
            let startList = Array.from(new Array(99999).keys())
            const expectedResult = 88852
            startList = startList.filter((v) => v !== expectedResult)
            const result = getRequestId(startList)
            expect(result).toEqual(expectedResult)
        })
    })
})