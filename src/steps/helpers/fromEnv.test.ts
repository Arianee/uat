import {interpolateFromStore} from "./fromEnv";

describe('from store',()=>{
    test('it should replace value by store value if it exist',()=>{
    const store={
        '##MyName##':'john'
    }
        const value='##MyName##';
        const expectedValue='john';
        expect(interpolateFromStore(value,store)).toBe(expectedValue);
    });

    test('it should replace value inside string by store value if it exists MyName is ##',()=>{
        const store={
            '##MyName##':'john'
        }
        const value='MyName is ##MyName##';
        const expectedValue='MyName is john';
        expect(interpolateFromStore(value,store)).toBe(expectedValue);
    });

    test('it should not replace value by store value if not exist',()=>{
        const store={
            '##MyName##':'john'
        }
        const value='MySurname';
        const expectedValue='MySurname';
        expect(interpolateFromStore(value,store)).toBe(expectedValue);
    })

    test('it should not replace value by store value if not exist 000',()=>{
        const store={ '##TOKENID##': 1877 }
        const value="jsonbuild-##TOKENID##";
        const expectedValue='jsonbuild-1877';
        expect(interpolateFromStore(value,store)).toBe(expectedValue);
    })
})


