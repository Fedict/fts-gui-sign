const { VALIDATION_SET } = require("../actions/ValidationActions")
const { default: ValidationReducer } = require("./ValidationReducer")

describe("ValidationReducer", () => {

    describe("VALIDATION_SET", () => { 
        
        test("action with type VALIDATION_SET changes report objects", () => {
            const payload = {
                report: "report",
                normalizedReport: "normalizedReport"
            }
            const startStore = {
                
            }
            const action =  {type: VALIDATION_SET, payload: payload}

            const result = ValidationReducer(startStore, action)
            expect(result.report).toBe(payload.report)
            expect(result.normalizedReport).toBe(payload.normalizedReport)
        })
    })
})