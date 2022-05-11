export const VALIDATION_SET_REPORT = "VALIDATION_SET_REPORT"
export const VALIDATION_SET_INDICATION = "VALIDATION_SET_INDICATION"
export const VALIDATION_SET_SUBINDICATION = "VALIDATION_SET_SUBINDICATION"
export const VALIDATION_SET_DIAGNOSTICDATA = "VALIDATION_SET_DIAGNOSTICDATA"

export const validationSetIndication = (indication) => {
    return { type: VALIDATION_SET_INDICATION, payload: indication }
}

export const validationSetSubIndication = (subIndication) => {
    return { type: VALIDATION_SET_SUBINDICATION, payload: subIndication }
}

export const validationSetReport = (report) => {
    return { type: VALIDATION_SET_REPORT, payload: report }
}

export const validationSetDiagnosticData = (diagnosticData) => {
    return { type: VALIDATION_SET_DIAGNOSTICDATA, payload: diagnosticData }
}

