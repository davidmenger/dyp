/**
 * @author David Menger
 */
'use strict';

const assert = require('assert');
const dyp = require('./dyp');

describe('dyp', () => {

    let actual;

    beforeEach(() => {
        actual = {
            foo: 1,
            bar: 2,
            nested: {
                sasa: 3,
                lele: 4
            },
            list: [1, 2, 3],
            data: [
                { foo: 1 },
                { bar: 2 },
                { baz: 3 },
                5
            ],
            full: [
                { a: 1, x: 1 },
                { a: 2, x: 2 }
            ]
        };
    })

    it('should work', () => {
        // ok
        dyp(actual, {
            data: [
                { foo: 1 },
                { bar: 2 },
                { baz: 3 },
                5
            ],
        });
    });

    it('should work', () => {
        // ok
        dyp(actual, {
            foo: 1,
            nested: {
                sasa: 3
            },
            list: dyp.arrayOfLength(3),
            data: dyp.arrayIncludesEvery([
                { bar: 2 },
                { baz: 3 },
                5
            ]),
            full: [
                { a: 1 },
                { a: 2 }
            ]
        });
    });

    it('throws if element misses', () => assert.throws(() => {
        // ok
        dyp(actual, {
            full: [
                { a: 1, x: 1 }
            ]
        });
    }));

    it('throws if element misses', () => assert.throws(() => {
        // ok
        dyp(actual, {
            data: dyp.arrayIncludesEvery([
                { bar: 3 }
            ]),
        });
    }));

    it('throws if element misses', () => assert.throws(() => {
        // ok
        dyp(actual, {
            data: dyp.arrayIncludes({ bar: 3 }),
        });
    }));

});
