import { setDigest, DIGEST_SET_DIGEST } from "./DigestActions"

describe("DigestActions", () => {

    describe("setDigest", () => {
        
        test("setDigest returns object with type DIGEST_SET_DIGEST and payload a digest object", () => {
            const payload = { digest: "object", digestAlgorithm: 'test' }
            const result = setDigest(payload)

            expect(result.type).toBe(DIGEST_SET_DIGEST)
            expect(result.payload.digest).toEqual(payload.digest)
            expect(result.payload.digestAlgorithm).toEqual(payload.digestAlgorithm)
        })
    })
})