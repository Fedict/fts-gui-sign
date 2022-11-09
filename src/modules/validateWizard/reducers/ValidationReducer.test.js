const { VALIDATION_SET_REPORT, VALIDATION_SET_DIAGNOSTICDATA } = require("../actions/ValidationActions")
const { default: ValidationReducer } = require("./ValidationReducer")

describe("ValidationReducer", () => {

    describe("VALIDATION_SET_DIAGNOSTICDATA", () => {

        test("action with type VALIDATION_SET_DIAGNOSTICDATA changes diagnosticData object", () => {
            const payload = 'diagnosticData'
            const startStore = {

            }
            const action =  {type: VALIDATION_SET_DIAGNOSTICDATA , payload :payload }
            
            const result = ValidationReducer(startStore, action)
            expect(result.diagnosticData).toBe(payload)
         })
     })

    describe("VALIDATION_SET_REPORT", () => { 
        
        test("action with type VALIDATION_SET_REPORT changes report object", () => {
            const payload = 'report'
            const startStore = {
                
            }
            const action =  {type: VALIDATION_SET_REPORT, payload: payload}

            const result = ValidationReducer(startStore, action)
            expect(result.report).toBe(payload)
         })
    })
})