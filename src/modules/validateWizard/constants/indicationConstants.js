export const indication = {

    TOTAL_PASSED: {
        key: "TOTAL_PASSED",
        className: "alert-success",
        message: "The signature in the document passed the validate.",
        id: "validate.result.messages.passed"
    },
    TOTAL_FAILED: {
        key: "TOTAL_FAILED",
        className: "alert-danger",
        message: "Signature failed the validation",
        id: "validate.result.messages.totalFailed"
    },
    INDETERMINATE: {
        key: "INDETERMINATE",
        className: "alert-warning",
        message: "There was insufficient information to determine if the electronic signature is valid",
        id: "validate.result.messages.indeterminate"
    },
}

export const indicationKeys = Object.keys(indication)

export const subIndication =
{
    FORMAT_FAILURE: {
        key: "FORMAT_FAILURE",
        className: "alert-danger",
        message: "The signature is not the right format. validation was unable to process it.",
        id: "validate.result.messages.formatFailure"
    },
    HASH_FAILURE: {
        key: "HASH_FAILURE",
        className: "alert-danger",
        message: "At least one hash of the signed document does not match the corresponding hash value in the signature.",
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
        message: "The signing certificate has been revoked. The signature has been created after the revocation time.",
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
        message: "The certificate chain used in the validation process does not match the validation constraints.",
        id: "validate.result.messages.chainConstraintsFailure"
    },
    CERTIFICATE_CHAIN_GENERAL_FAILURE: {
        key: "CERTIFICATE_CHAIN_GENERAL_FAILURE",
        className: "alert-warning",
        message: "The set of certificates available for chain validation produced an unspecified error.",
        id: "validate.result.messages.chainGeneralFailure"
    },
    CRYPTO_CONSTRAINTS_FAILURE: {
        key: "CRYPTO_CONSTRAINTS_FAILURE",
        className: "alert-warning",
        message: "A algorithm used in the signature, or the size of a key used with the algorithm, is below the required cryptographic security level.",
        id: "validate.result.messages.cryptoConstraintsFailure"
    },
    EXPIRED: {
        key: "EXPIRED",
        className: "alert-warning",
        message: "The signature has been created after the expiration date of the signing certificate.",
        id: "validate.result.messages.expired"
    },
    NOT_YET_VALID: {
        key: "NOT_YET_VALID",
        className: "alert-warning",
        message: "The signing time lies before the issuance date (notBefore) of the signing certificate.",
        id: "validate.result.messages.notYetValid"
    },
    POLICY_PROCESSING_ERROR: {
        key: "POLICY_PROCESSING_ERROR",
        className: "alert-warning",
        message: "A given formal policy file could not be processed.",
        id: "validate.result.messages.policyProcessingError"
    },
    SIGNATURE_POLICY_NOT_AVAILABLE: {
        key: "SIGNATURE_POLICY_NOT_AVAILABLE",
        className: "alert-warning",
        message: "The electronic document containing the details of the policy is not available.",
        id: "validate.result.messages.signaturePolicyNotAvailable"
    },
    TIMESTAMP_ORDER_FAILURE: {
        key: "TIMESTAMP_ORDER_FAILURE",
        className: "alert-warning",
        message: "A constraint on the order of signature time-stamps and/or signed data time-stamps is not respected.",
        id: "validate.result.messages.timestampOrderFailure"
    },
    NO_SIGNING_CERTIFICATE_FOUND: {
        key: "NO_SIGNING_CERTIFICATE_FOUND",
        className: "alert-warning",
        message: "The signing certificate cannot be identified.",
        id: "validate.result.messages.noSigningCertificateFound"
    },
    NO_CERTIFICATE_CHAIN_FOUND: {
        key: "NO_CERTIFICATE_CHAIN_FOUND",
        className: "alert-warning",
        message: "No certificate chain found.",
        id: "validate.result.messages.noChainFound"
    },
    REVOKED_NO_POE: {
        key: "REVOKED_NO_POE",
        className: "alert-warning",
        message: "The signing certificate was revoked.",
        id: "validate.result.messages.rekovedNoPOE"
    },
    REVOKED_CA_NO_POE: {
        key: "REVOKED_CA_NO_POE",
        className: "alert-warning",
        message: "A certificate chain was found but an intermediate CA certificate is revoked.",
        id: "validate.result.messages.rekovedCANoPOE"
    },
    OUT_OF_BOUNDS_NO_POE: {
        key: "OUT_OF_BOUNDS_NO_POE",
        className: "alert-warning",
        message: "The signing certificate is expired or not yet valid at the validation date/time.",
        id: "validate.result.messages.outOfBoundsNoPOE"
    },
    CRYPTO_CONSTRAINTS_FAILURE_NO_POE: {
        key: "CRYPTO_CONSTRAINTS_FAILURE_NO_POE",
        className: "alert-warning",
        message: "An algorithm that has been used in the document, or the size of a key used with such an algorithm, is below the required cryptographic security level.",
            id: "validate.result.messages.cryptoConstraintsFailureNoPOE"
    },
    NO_POE: {
        key: "NO_POE",
        className: "alert-warning",
        message: "A proof of existence is missing.",
        id: "validate.result.messages.noPOE"
    },
    TRY_LATER: {
        key: "TRY_LATER",
        className: "alert-warning",
        message: "Not all constraints can be fulfilled using available information.",
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
        message: "Something went wrong.",
        id: "validate.result.messages.generic"
    }
}

export const subIndicationKeys = Object.keys(subIndication)
