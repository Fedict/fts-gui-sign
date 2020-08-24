const { VALIDATION_SET_INDICATION, VALIDATION_SET_SUBINDICATION } = require("../actions/ValidationActions")
const { default: ValidationReducer } = require("./ValidationReducer")

describe("ValidationReducer", () => {

    describe("VALIDATION_SET_INDICATION", () => {

        test("action with type VALIDATION_SET_INDICATION changes indication object", () => {
            const payload = 'indication'
            const startStore = {

            }
            const action =  {type: VALIDATION_SET_INDICATION , payload :payload }
            
            const result = ValidationReducer(startStore, action)
            expect(result.indication).toBe(payload)
         })
     })

    describe("VALIDATION_SET_SUBINDICATION", () => { 
        
        test("action with type VALIDATION_SET_SUBINDICATION changes subIndication object", () => {
            const payload = 'sub-indication'
            const startStore = {
                
            }
            const action =  {type: VALIDATION_SET_SUBINDICATION, payload: payload}

            const result = ValidationReducer(startStore, action)
            expect(result.subIndication).toBe(payload)
         })
    })
})