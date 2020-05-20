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
        message: "At least one hash of a signed document does not match the corresponding hash value in the signature "
    },
    SIG_CRYPTO_FAILURE: {
        key: "HASH_FAILURE",
        className: "alert-danger",
        message: "The signature value in the signature could not be verified using the signer's public key in the signing certificate."
    },
    REVOKED: {
        key: "HASH_FAILURE",
        className: "alert-danger",
        message: "the signing certificate has been revoked; and there is PoE available that the signature has been created after the revocation time. "
    },
    SIG_CONSTRAINTS_FAILURE: {
        key: "HASH_FAILURE",
        className: "alert-warning",
        message: "One or more attributes of the signature do not match the validation constraints"
    },
    CHAIN_CONSTRAINTS_FAILURE: {
        key: "HASH_FAILURE",
        className: "alert-warning",
        message: "The certificate chain used in the validation process does not match the validation constraints related to the certificate. "
    },
    CERTIFICATE_CHAIN_GENERAL_FAILURE: {
        key: "HASH_FAILURE",
        className: "alert-danger",
        message: "The set of certificates available for chain validation produced an error for an unspecified reason."
    },
    CRYPTO_CONSTRAINTS_FAILURE: {
        key: "HASH_FAILURE",
        className: "alert-danger",
        message: "at least one of the algorithms that have been used in the signature involved in validating the signature, or the size of a key used with such an algorithm, is below the required cryptographic security level"
    },
    EXPIRED: {
        key: "HASH_FAILURE",
        className: "alert-danger",
        message: "There is proof that the signature has been created after,the expiration date (notAfter) of the signing certificate.  "
    },
    NOT_YET_VALID: {
        key: "HASH_FAILURE",
        className: "alert-danger",
        message: "because the signing time lies before the issuance date (notBefore) of the signing certificate."
    },
    POLICY_PROCESSING_ERROR: {
        key: "HASH_FAILURE",
        className: "alert-danger",
        message: "A given formal policy file could not be processed for any reason."
    },
    SIGNATURE_POLICY_NOT_AVAILABLE: {
        key: "HASH_FAILURE",
        className: "alert-danger",
        message: "The electronic document containing the details of the policy is not available. "
    },
    TIMESTAMP_ORDER_FAILURE: {
        key: "HASH_FAILURE",
        className: "alert-danger",
        message: "because some constraints on the order of signature time-stamps and/or signed data object(s) time-stamps are not respected "
    },
    NO_SIGNING_CERTIFICATE_FOUND: {
        key: "HASH_FAILURE",
        className: "alert-danger",
        message: " the signing certificate cannot be identified "
    },
    NO_CERTIFICATE_CHAIN_FOUND: {
        key: "HASH_FAILURE",
        className: "alert-danger",
        message: "No certificate chain has been found for the identified signing certificate.  "
    },
    REVOKED_NO_POE: {
        key: "HASH_FAILURE",
        className: "alert-danger",
        message: "because the signing certificate was revoked at the validation date/time.  "
    },
    REVOKED_CA_NO_POE: {
        key: "HASH_FAILURE",
        className: "alert-danger",
        message: "at least one certificate chain was found but an intermediate CA certificate is revoked.  "
    },
    OUT_OF_BOUNDS_NO_POE: {
        key: "HASH_FAILURE",
        className: "alert-danger",
        message: " the signing certificate is expired or not yet valid at the validation date/time and the Signature Validation Algorithm cannot ascertain that the signing time lies within the validity interval of the signing certificate.  "
    },
    CRYPTO_CONSTRAINTS_FAILURE_NO_POE: {
        key: "HASH_FAILURE",
        className: "alert-danger",
        message: " at least one of the algorithms that have been used in objects (e.g. the signature value, a certificate, etc.) involved in"
            + "validating the signature, or the size of a key used with such an algorithm, is below the required"
            + "cryptographic security level, and there is no proof that this material was produced before the time up"
            + "to which this algorithm/key was considered secure.  "
    },
    NO_POE: {
        key: "HASH_FAILURE",
        className: "alert-danger",
        message: "a proof of existence is missing to ascertain that a signed object has been produced before some compromising event  "
    },
    TRY_LATER: {
        key: "HASH_FAILURE",
        className: "alert-danger",
        message: "not all constraints can be fulfilled using available information. "
    },
    SIGNED_DATA_NOT_FOUND: {
        key: "HASH_FAILURE",
        className: "alert-danger",
        message: "because signed data cannot be obtained. "
    },
    GENERIC: {
        key: "HASH_FAILURE",
        className: "alert-danger",
        message: "Something went wrong"
    }
}

