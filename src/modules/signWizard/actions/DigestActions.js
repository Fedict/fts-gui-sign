/**
 * action type to change the digest
 */
export const DIGEST_SET_DIGEST = "DIGEST_SET_DIGEST"

/**
 * function to change the digest
 * @param {object} digest 
 * @param {string} digest.digest - string of the digest 
 * @param {string} digest.digestAlgorithm - digest algorithm
 */
export const setDigest = (digest) => (
    {
        type: DIGEST_SET_DIGEST, payload: {
            digest: digest.digest,
            digestAlgorithm: digest.digestAlgorithm
        }
    }
)