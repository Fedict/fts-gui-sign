export const indication = {

    TOTAL_PASSED: {
        key: "TOTAL_PASSED",
        className: "alert-success",
        message: "Signature passed the validation"
    },
    TOTAL_FAILED: {
        key: "TOTAL_FAILED",
        className: "alert-danger",
        message: "Signature failed the validation"
    },
    INDETERMINATE: {
        key: "INDETERMINATE",
        className: "alert-warning",
        message: "There was insufficient information to determine if the electronic signature is valid"
    },

    //    PASSED: {},
    //    FAILED: {},
    //    NO_SIGNATURE_FOUND: {}

}

export const indicationKeys = Object.keys(indication)

export const subIndication =
{
    FORMAT_FAILURE: {
        key: "FORMAT_FAILURE",
        className: "alert-danger",
        message: "The signature is not the right format. validation was unable to process it. "
    },
    HASH_FAILURE: {
        key: "HASH_FAILURE",
        className: "alert-danger",
        message: "At least one hash of the signed document does not match the corresponding hash value in the signature. "
    },
    SIG_CRYPTO_FAILURE: {
        key: "SIG_CRYPTO_FAILURE",
        className: "alert-danger",
        message: "The signature could not be verified using the signer's public key in the signing certificate."
    },
    REVOKED: {
        key: "REVOKED",
        className: "alert-danger",
        message: "The signing certificate has been revoked. The signature has been created after the revocation time. "
    },
    SIG_CONSTRAINTS_FAILURE: {
        key: "SIG_CONSTRAINTS_FAILURE",
        className: "alert-warning",
        message: "the signature does not match the validation constraints. "
    },
    CHAIN_CONSTRAINTS_FAILURE: {
        key: "CHAIN_CONSTRAINTS_FAILURE",
        className: "alert-warning",
        message: "The certificate chain used in the validation process does not match the validation constraints. "
    },
    CERTIFICATE_CHAIN_GENERAL_FAILURE: {
        key: "CERTIFICATE_CHAIN_GENERAL_FAILURE",
        className: "alert-warning",
        message: "The set of certificates available for chain validation produced an unspecified error."
    },
    CRYPTO_CONSTRAINTS_FAILURE: {
        key: "CRYPTO_CONSTRAINTS_FAILURE",
        className: "alert-warning",
        message: "A algorithm used in the signature, or the size of a key used with the algorithm, is below the required cryptographic security level."
    },
    EXPIRED: {
        key: "EXPIRED",
        className: "alert-warning",
        message: "The signature has been created after,the expiration date (notAfter) of the signing certificate."
    },
    NOT_YET_VALID: {
        key: "NOT_YET_VALID",
        className: "alert-warning",
        message: "The signing time lies before the issuance date (notBefore) of the signing certificate."
    },
    POLICY_PROCESSING_ERROR: {
        key: "POLICY_PROCESSING_ERROR",
        className: "alert-warning",
        message: "A given formal policy file could not be processed."
    },
    SIGNATURE_POLICY_NOT_AVAILABLE: {
        key: "SIGNATURE_POLICY_NOT_AVAILABLE",
        className: "alert-warning",
        message: "The electronic document containing the details of the policy is not available. "
    },
    TIMESTAMP_ORDER_FAILURE: {
        key: "TIMESTAMP_ORDER_FAILURE",
        className: "alert-warning",
        message: "A constraint on the order of signature time-stamps and/or signed data time-stamps is not respected. "
    },
    NO_SIGNING_CERTIFICATE_FOUND: {
        key: "NO_SIGNING_CERTIFICATE_FOUND",
        className: "alert-warning",
        message: "The signing certificate cannot be identified. "
    },
    NO_CERTIFICATE_CHAIN_FOUND: {
        key: "NO_CERTIFICATE_CHAIN_FOUND",
        className: "alert-warning",
        message: "No certificate chain found."
    },
    REVOKED_NO_POE: {
        key: "REVOKED_NO_POE",
        className: "alert-warning",
        message: "The signing certificate was revoked.  "
    },
    REVOKED_CA_NO_POE: {
        key: "REVOKED_CA_NO_POE",
        className: "alert-warning",
        message: "A certificate chain was found but an intermediate CA certificate is revoked."
    },
    OUT_OF_BOUNDS_NO_POE: {
        key: "OUT_OF_BOUNDS_NO_POE",
        className: "alert-warning",
        message: "The signing certificate is expired or not yet valid at the validation date/time."
    },
    CRYPTO_CONSTRAINTS_FAILURE_NO_POE: {
        key: "CRYPTO_CONSTRAINTS_FAILURE_NO_POE",
        className: "alert-warning",
        message: "A algorithms that has been used in the document, or the size of a key used with such an algorithm, is below the required "
            + "cryptographic security level."
    },
    NO_POE: {
        key: "NO_POE",
        className: "alert-warning",
        message: "A proof of existence is missing."
    },
    TRY_LATER: {
        key: "TRY_LATER",
        className: "alert-warning",
        message: "Not all constraints can be fulfilled using available information. "
    },
    SIGNED_DATA_NOT_FOUND: {
        key: "SIGNED_DATA_NOT_FOUND",
        className: "alert-warning",
        message: "Signed data cannot be obtained. "
    },
    GENERIC: {
        key: "GENERIC",
        className: "alert-warning",
        message: "Something went wrong."
    }
}

export const subIndicationKeys = Object.keys(subIndication)
