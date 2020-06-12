import { generateIdFromArray, generateId } from "./ControlIdHelper"

const ORIGINAL_MATH = Math

describe('controlIdHelper', () => {

    describe("generateIdFromArray", () => {
        beforeEach(() => {
            Math.random = jest.fn()
        })
        test("generateIdFromArray generates a id not in the array", () => {
            const expectedResult = 55555
            const startIDs = [88888, 77777]

            Math.random = jest.fn()
            Math.random.mockReturnValueOnce(startIDs[0] / 99999)
                .mockReturnValueOnce(startIDs[1] / 99999)
                .mockReturnValueOnce(expectedResult / 99999)
            const result = generateIdFromArray(startIDs)

            expect(result).toEqual(expectedResult)
            expect(Math.random).toBeCalledTimes(3)


        })
        afterEach(() => {
            Math = ORIGINAL_MATH
        })
    })
    describe("generateId", () => {
        beforeEach(() => {
            Math.random = jest.fn()
        })


        test("generateId creates a other new unique id", () => {
            const expectedResult = 55555
            const startID = 88888
            Math.random = jest.fn()
            Math.random.mockReturnValueOnce(startID / 99999)
                .mockReturnValueOnce(expectedResult / 99999)

            const result = generateId(startID)
            expect(result).toEqual(expectedResult)
            expect(Math.random).toBeCalledTimes(2)
        })
        afterEach(() => {
            Math = ORIGINAL_MATH
        })


    })
})
