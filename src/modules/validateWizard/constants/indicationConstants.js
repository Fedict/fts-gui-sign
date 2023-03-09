export const indication = {

    TOTAL_PASSED: {
        key: "TOTAL_PASSED",
        className: "alert-success",
        message: "The signature in the document passed the validation.",
        id: "validate.result.messages.passed"
    },
    TOTAL_FAILED: {
        key: "TOTAL_FAILED",
        className: "alert-danger",
        message: "The signature cannot be validated.",
        id: "validate.result.messages.totalFailed"
    },
    INDETERMINATE: {
        key: "INDETERMINATE",
        className: "alert-warning",
        message: "There was insufficient information to determine if the digital signature is valid.",
        id: "validate.result.messages.indeterminate"
    },
}

export const indicationKeys = Object.keys(indication)

export const subIndication =
{
    FORMAT_FAILURE: {
        key: "FORMAT_FAILURE",
        className: "alert-danger",
        message: "The signature in this document doesn't have the right format. The validation tool was unable to process the signature.",
        id: "validate.result.messages.formatFailure"
    },
    HASH_FAILURE: {
        key: "HASH_FAILURE",
        className: "alert-danger",
        message: "At least one hash of the signed document (algorithm) does not match the corresponding hash value (algorithm) in the signature.",
        id: "validate.result.messages.hashFailure"
    },
    SIG_CRYPTO_FAILURE: {
        key: "SIG_CRYPTO_FAILURE",
        className: "alert-danger",
        message: "A valid signature uses a private key (e.g. eID PIN code) and a public key (provided by the signing software). It appears to be impossible to verify the public key used to sign this document. Therefore signature cannot be verified.",
        id: "validate.result.messages.signatureCryptoFailure"
    },
    REVOKED: {
        key: "REVOKED",
        className: "alert-danger",
        message: "The signing certificate (certificate on eID) used to sign this document was already revoked when signing the document.",
        id: "validate.result.messages.rekoved"
    },
    SIG_CONSTRAINTS_FAILURE: {
        key: "SIG_CONSTRAINTS_FAILURE",
        className: "alert-warning",
        message: "The signature does not match the validation constraints.",
        id: "validate.result.messages.signatureConstraintsFailure"
    },
    CHAIN_CONSTRAINTS_FAILURE: {
        key: "CHAIN_CONSTRAINTS_FAILURE",
        className: "alert-warning",
        message: "The signing certificate chain (certificate on eID) used to sign this document does not meet the validation constraints.",
        id: "validate.result.messages.chainConstraintsFailure"
    },
    CERTIFICATE_CHAIN_GENERAL_FAILURE: {
        key: "CERTIFICATE_CHAIN_GENERAL_FAILURE",
        className: "alert-warning",
        message: "One or more of the signing certificates (certificate on eID) found in the certificate chain used to sign this document produce an unspecified error.",
        id: "validate.result.messages.chainGeneralFailure"
    },
    CRYPTO_CONSTRAINTS_FAILURE: {
        key: "CRYPTO_CONSTRAINTS_FAILURE",
        className: "alert-warning",
        message: "The signature algorithm or the keys used in the algoritm are below the required cryptographic security level.",
        id: "validate.result.messages.cryptoConstraintsFailure"
    },
    EXPIRED: {
        key: "EXPIRED",
        className: "alert-warning",
        message: "The signature seems to be created after the expiration date of the used signing certificate (certificate on eID).",
        id: "validate.result.messages.expired"
    },
    NOT_YET_VALID: {
        key: "NOT_YET_VALID",
        className: "alert-warning",
        message: "The time of signature of the document is before the date of issue of the used signing certificate (certificate on eID).",
        id: "validate.result.messages.notYetValid"
    },
    POLICY_PROCESSING_ERROR: {
        key: "POLICY_PROCESSING_ERROR",
        className: "alert-warning",
        message: "The formal file with details about the used signature policy cannot be processed during the validation process.",
        id: "validate.result.messages.policyProcessingError"
    },
    SIGNATURE_POLICY_NOT_AVAILABLE: {
        key: "SIGNATURE_POLICY_NOT_AVAILABLE",
        className: "alert-warning",
        message: "The electronic file with details about the signature policy is not available for the validation process.",
        id: "validate.result.messages.signaturePolicyNotAvailable"
    },
    TIMESTAMP_ORDER_FAILURE: {
        key: "TIMESTAMP_ORDER_FAILURE",
        className: "alert-warning",
        message: "When signing a document one or more time stamps are added to register the official time and/or form of the signature. In this document the constraint on the order of the time stamps does not appear to be respected. ",
        id: "validate.result.messages.timestampOrderFailure"
    },
    NO_SIGNING_CERTIFICATE_FOUND: {
        key: "NO_SIGNING_CERTIFICATE_FOUND",
        className: "alert-warning",
        message: "The signing certificate (certificate on eID) used to sign this document cannot be identified.",
        id: "validate.result.messages.noSigningCertificateFound"
    },
    NO_CERTIFICATE_CHAIN_FOUND: {
        key: "NO_CERTIFICATE_CHAIN_FOUND",
        className: "alert-warning",
        message: "The signing certificate (certificate on eID) used to sign this document cannot be found.",
        id: "validate.result.messages.noChainFound"
    },
    REVOKED_NO_POE: {
        key: "REVOKED_NO_POE",
        className: "alert-warning",
        message: "The signing certificate (certificate on eID) used to sign this document has been revoked.",
        id: "validate.result.messages.rekovedNoPOE"
    },
    REVOKED_CA_NO_POE: {
        key: "REVOKED_CA_NO_POE",
        className: "alert-warning",
        message: "One of the signing certificates (intermediate CA certificate), found in the certificate chain used to sign this document has been revoked.",
        id: "validate.result.messages.rekovedCANoPOE"
    },
    OUT_OF_BOUNDS_NO_POE: {
        key: "OUT_OF_BOUNDS_NO_POE",
        className: "alert-warning",
        message: "The signing certificate (certificate on eID) used to sign this document has expired or is not yet valid.",
        id: "validate.result.messages.outOfBoundsNoPOE"
    },
    CRYPTO_CONSTRAINTS_FAILURE_NO_POE: {
        key: "CRYPTO_CONSTRAINTS_FAILURE_NO_POE",
        className: "alert-warning",
        message: "The signature algorithm or the keys used in the algoritm appear to be below the required cryptographic security level.",
        id: "validate.result.messages.cryptoConstraintsFailureNoPOE"
    },
    NO_POE: {
        key: "NO_POE",
        className: "alert-warning",
        message: "The necessary proof of the existence of the signature(s), needed for validation, is missing. Please reload the page and try again. Contact servicedesk.DTO@bosa.fgov.be if this error continues to appear. Please include the error message 'proof of existence' in your report.",
        id: "validate.result.messages.noPOE"
    },
    TRY_LATER: {
        key: "TRY_LATER",
        className: "alert-warning",
        message: "Not enough signature information is available to check all constraints.",
        id: "validate.result.messages.tryLater"
    },
    SIGNED_DATA_NOT_FOUND: {
        key: "SIGNED_DATA_NOT_FOUND",
        className: "alert-warning",
        message: "No signature information can be retrieved.",
        id: "validate.result.messages.dataNotFound"
    },
    GENERIC: {
        key: "GENERIC",
        className: "alert-warning",
        message: "An error occurred during validation. Please reload the signed document and try again.",
        id: "validate.result.messages.generic"
    }
}

export const subIndicationKeys = Object.keys(subIndication)
