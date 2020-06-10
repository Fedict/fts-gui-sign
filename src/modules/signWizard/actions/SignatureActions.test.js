import { setSignature, SIGNATURE_SET_SIGNATURE } from "./SignatureActions"

describe('SignatureActions', () => {
    describe('setSignature', () => {
        test('setSignature returns action with type SIGNATURE_SET_SIGNATURE and payload signature', () => {
            const payload = { signature: "test" }
            const result = setSignature(payload)

            expect(result.type).toBe(SIGNATURE_SET_SIGNATURE)
            expect(result.payload).toEqual(payload.signature)
        })
    })
})