export const VALIDATION_SET_REPORT = "VALIDATION_SET_REPORT"
export const VALIDATION_SET_DIAGNOSTICDATA = "VALIDATION_SET_DIAGNOSTICDATA"

export const validationSetReport = (report) => {
    return { type: VALIDATION_SET_REPORT, payload: report }
}

export const validationSetDiagnosticData = (diagnosticData) => {
    return { type: VALIDATION_SET_DIAGNOSTICDATA, payload: diagnosticData }
}

