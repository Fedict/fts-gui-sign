import { validationSetReport, VALIDATION_SET_REPORT, validationSetDiagnosticData, VALIDATION_SET_DIAGNOSTICDATA } from "./ValidationActions"

describe("ValidationActions", () => {

    test("validationSetReport returns a action with type VALIDATION_SET_REPORT and payload report", () => {
        const payload = "first report"
        const result = validationSetReport(payload)

        expect(result.type).toBe(VALIDATION_SET_REPORT)
        expect(result.payload).toEqual(payload)
    })
    
    test("validationSetDiagnosticData returns a action with type VALIDATION_SET_DIAGNOSTICDATA and payload Diagnostic data", () => {
        const payload = "Diagnostic data"
        const result = validationSetDiagnosticData(payload)

        expect(result.type).toBe(VALIDATION_SET_DIAGNOSTICDATA)
        expect(result.payload).toEqual(payload)
    })
})