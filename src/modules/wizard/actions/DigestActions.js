

export const DIGEST_SET_DIGEST = "DIGEST_SET_DIGEST"

export const setDigest = (digest) => (dispatch) => {
    dispatch({
        type: DIGEST_SET_DIGEST, payload: {
            digest: digest.digest,
            digestAlgorithm: digest.digestAlgorithm
        }
    })
}