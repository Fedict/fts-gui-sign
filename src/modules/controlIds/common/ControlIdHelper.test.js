import { generateIdFromArray, generateId } from './ControlIdHelper';

describe('generateIdFromArray', () => {

    afterEach(() => {
        jest.spyOn(global.Math, 'random').mockRestore();
    });

    test('Random number', () => {
        jest.spyOn(global.Math, 'random').mockReturnValue(0.12345);

        // Math.floor(0.12345 * 99999) = 12344
        const id = generateIdFromArray([]);

        expect(id).toBe(12344);
        expect(typeof id).toBe('number');
    });

    test('Collision test -> looping', () => {
        const mockRandom = jest.spyOn(global.Math, 'random');

        // 1st call : 0.5 -> ID 49999
        // 2nd call: 0.1 -> ID 9999 free
        mockRandom
            .mockReturnValueOnce(0.5)
            .mockReturnValueOnce(0.1);

        const existingIds = [49999];
        const id = generateIdFromArray(existingIds);

        expect(id).toBe(9999);
        expect(mockRandom).toHaveBeenCalledTimes(2);
    });

    test('Random number with empty list', () => {
        const id = generateIdFromArray([]);
        expect(id).toBeGreaterThanOrEqual(0);
        expect(id).toBeLessThan(99999);
    });


    test('Single id', () => {
        const mockRandom = jest.spyOn(global.Math, 'random');
        mockRandom
            .mockReturnValueOnce(0.12346)
            .mockReturnValueOnce(0.4564);

        const id = generateId(12345);
        expect(id).toBe(45639);
        expect(mockRandom).toHaveBeenCalledTimes(2);
    });
});