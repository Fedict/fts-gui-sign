import {parseErrorMessage} from "./helper";

describe("helper", () => {
    test("parse server errorMessage", () => {

        const result = parseErrorMessage('20210420170347596||SIGN_CERT_EXPIRED||2021.03.06 12:28:05')

        expect(result.ref).toEqual('20210420170347596');
        expect(result.type).toEqual('SIGN_CERT_EXPIRED');
        expect(result.details).toEqual('2021.03.06 12:28:05');
    })

    test("parse server errorMessage no details", () => {
        const result = parseErrorMessage('20210420170347596||SIGN_CERT_EXPIRED');
        expect(result.ref).toEqual('20210420170347596');
        expect(result.type).toEqual('SIGN_CERT_EXPIRED');
    })

    test("parse errorMessage", () => {
        const result = parseErrorMessage('Some error');
        expect(result).toEqual('Some error');
    })

    test("parse errorMessage", () => {
        const result = parseErrorMessage(undefined);
        expect(result).toBeUndefined();
    })
})