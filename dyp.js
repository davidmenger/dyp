/*
 * @author David Menger
 */
'use strict';

const assert = require('assert');

const LENGTH_ASSERT = Symbol('this is the length assertion');
const NUMBER_OF_KEYS = Symbol('this is keys length assertion');
const ARRAY_INCLUDES = Symbol('this is array include');

function niceObject (obj) {
    const r = JSON.stringify(obj)
        .replace(/"([^\s]+)":/ig,'$1:');

    if (r.length < 50) {
        return r;
    }
    return `${r.substr(0, 50)}...${r[0] === '[' ? ']' : '}'}`;
}
function deepSubsetOf (actual, expected, message = 'Object is not a subset', key = '') {
    try {
        if (typeof actual !== typeof expected) {
            assert.fail(`${message}: expected type ${typeof expected}, given ${typeof actual} @${key}`);
        }
        if (typeof actual === 'object' && actual && expected === null) {
            assert.fail(`${message}: expected null, given ${typeof actual} @${key}`);
        }
        if (typeof expected === 'object' && expected && actual === null) {
            assert.fail(`${message}: expected type ${typeof expected}, given null @${key}`);
        }
        if (Array.isArray(expected) && !Array.isArray(actual)) {
            assert.fail(`${message}: expected array, given ${typeof actual} @${key}`);
        }
        if (Array.isArray(expected)) {
            assert.strictEqual(actual.length, expected.length, `${message}: lengths of arrays does not match (expected: ${expected.length}, actual: ${actual.length}) @${key}`);
            expected.forEach((ex, i) => {
                deepSubsetOf(actual[i], ex, message, `${key}[${i}]`);
            });
        } else if (expected && typeof expected === 'object' && typeof expected[LENGTH_ASSERT] !== 'undefined') {
            if (!Array.isArray(actual)) {
                assert.fail(`${message}: expected array length comparison, given ${typeof actual} @${key}`);
            }
            assert.strictEqual(actual.length, expected[LENGTH_ASSERT], `${message}: lengths of arrays does not match (expected: ${expected[LENGTH_ASSERT]}, actual: ${actual.length}) @${key}`);
        } else if (expected && typeof expected === 'object' && typeof expected[NUMBER_OF_KEYS] !== 'undefined') {
            assert.strictEqual(Object.keys(actual).length, expected[NUMBER_OF_KEYS], `${message}: number of object keys does not match (expected: ${expected[NUMBER_OF_KEYS]}, actual: ${Object.keys(actual).length}) @${key}`);
        } else if (expected && typeof expected === 'object' && typeof expected[ARRAY_INCLUDES] !== 'undefined') {
            assert.ok(Array.isArray(actual), `${message}: expected array, given ${typeof actual} @${key}`);

            expected[ARRAY_INCLUDES]
                .forEach((elem) => {
                    const ok = actual.some((act, k) => {
                        try {
                            deepSubsetOf(act, elem, message, `${key}[${k}]`);
                            return true;
                        } catch (e) {
                            return false;
                        }
                    });

                    assert.ok(ok, `${message}: no matching element found for ${niceObject(elem)} @${key}`);
                });
        } else if (expected && typeof expected === 'object') {
            Object.keys(expected)
                .forEach((k) => {
                    const nextKey = Array.isArray(actual) ? `${key}[${k}]` : `${key}.${k}`;
                    deepSubsetOf(actual[k], expected[k], message, nextKey);
                });
        } else {
            assert.deepStrictEqual(actual, expected, `${message} @${key}`);
        }
    } catch (e) {
        // change the call stack
        if (!key) {
            const er = new Error();
            e.stack = er.stack;
            throw e;
        } else {
            throw e;
        }
    }
}

deepSubsetOf.arrayOfLength = len => ({ [LENGTH_ASSERT]: len });
deepSubsetOf.numberOfKeys = len => ({ [NUMBER_OF_KEYS]: len });
deepSubsetOf.arrayIncludes = elem => ({ [ARRAY_INCLUDES]: [elem] });
deepSubsetOf.arrayIncludesEvery = elems => ({ [ARRAY_INCLUDES]: Array.from(elems || []) });

module.exports = deepSubsetOf;

