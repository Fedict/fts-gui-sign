import { validationSetIndication, VALIDATION_SET_INDICATION, validationSetSubIndication, VALIDATION_SET_SUBINDICATION } from "./ValidationActions"

describe("ValidationActions", () => {

    test("validationSetIndication returns a action with type VALIDATION_SET_INDICATION and payload indication", () => {
        const payload = "first indication"
        const result = validationSetIndication(payload)

        expect(result.type).toBe(VALIDATION_SET_INDICATION)
        expect(result.payload).toEqual(payload)
    })
    
    test("validationSetSubIndication returns a action with type VALIDATION_SET_SUBINDICATION and payload subIndication", () => {
        const payload = "sub indication"
        const result = validationSetSubIndication(payload)

        expect(result.type).toBe(VALIDATION_SET_SUBINDICATION)
        expect(result.payload).toEqual(payload)
    })
})