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

const subIndication =
{
    FORMAT_FAILURE : {},
    HASH_FAILURE : {},
    SIG_CRYPTO_FAILURE : {},
    REVOKED : {},
    SIG_CONSTRAINTS_FAILURE : {},
    CHAIN_CONSTRAINTS_FAILURE : {},
    CERTIFICATE_CHAIN_GENERAL_FAILURE : {},
    CRYPTO_CONSTRAINTS_FAILURE : {},
    EXPIRED : {},
    NOT_YET_VALID : {},
    POLICY_PROCESSING_ERROR : {},
    SIGNATURE_POLICY_NOT_AVAILABLE : {},
    TIMESTAMP_ORDER_FAILURE : {},
    NO_SIGNING_CERTIFICATE_FOUND : {},
    NO_CERTIFICATE_CHAIN_FOUND : {},
    REVOKED_NO_POE : {},
    REVOKED_CA_NO_POE : {},
    OUT_OF_BOUNDS_NO_POE : {},
    CRYPTO_CONSTRAINTS_FAILURE_NO_POE : {},
    NO_POE : {},
    TRY_LATER : {},
    SIGNED_DATA_NOT_FOUND : {}
}

