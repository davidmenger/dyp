# DYP: asserts for large objects

Fuzzy deep equal for asserting parts of objects

## One object is a subset of the another

```javascript
const dyp = require('dyp');

// ok
dyp({ foo: 1, bar: 2 }, { foo: 1 });

// throws exception
dyp({ foo: 1, bar: 2 }, { foo: 1, baz: 9 });
```

## Checks also nested objects

```javascript
// ok
dyp(
    { foo: { a: 1, b: 2 } },
    { foo: { a: 1 } }
);

// throws exception
dyp(
    { foo: { a: 1, b: 2 } },
    { foo: { x: 0 } }
);
```

## Arrays should keep the same order and size

```javascript
const dyp = require('dyp');

// ok
dyp({ foo: [1, { bar: 2, baz: 3 }] }, { foo: [1, { bar: 2 }] });

// throws exception
dyp({ foo: [1, { bar: 2, baz: 3 }] }, { foo: [{ bar: 2 }] });

// throws exception
dyp({ foo: [1, { bar: 2, baz: 3 }] }, { foo: [1, { baz: 9 }] });
```

## But you can just look for elements inside the array

```javascript
const dyp = require('dyp');

// ok
dyp({
    foo: [{ foo: 1 }, { bar: 2, sasa: 1 }, { baz: 3 }]
}, {
    foo: dyp.arrayIncludes({ bar: 2 })
});

// ok
dyp({
    foo: [{ foo: 1 }, { bar: 2, sasa: 1 }, { baz: 3 }]
}, {
    foo: dyp.arrayIncludesEvery([
        { baz: 3 }, { bar: 2 },
    ])
});

// throws exception
dyp({
    foo: [{ foo: 1 }, { bar: 2, sasa: 1 }, { baz: 3 }]
}, {
    foo: dyp.arrayIncludes({ sasalele: 2 })
});
```
## Or you can check only the size of the array

```javascript
const dyp = require('dyp');

// ok
dyp({ foo: [1, { bar: 2, baz: 3 }] }, { foo: dyp.arrayOfLength(2) });

// throws exception
dyp({ foo: [1, { bar: 2, baz: 3 }] }, { foo: dyp.arrayOfLength(3) });
```

## Full example

```javascript
const dyp = require('dyp');

const actual = {
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
        { baz: 3 }
    ],
    full: [
        { a: 1, x: 1 },
        { a: 2, x: 2 }
    ]
};

// ok
dyp(actual, {
    foo: 1,
    nested: {
        sasa: 3
    },
    list: dyp.arrayOfLength(3),
    data: dyp.arrayIncludesEvery([
        { bar: 2 },
        { baz: 3 }
    ]),
    full: [
        { a: 1 },
        { a: 2 }
    ]
});
```
## API

**the assertion function**
`dyp(actual, expected[, message]):void`

**utility for specifying an array of fixed length**
`dyp.arrayOfLength(length)`

**search for element in array**
`dyp.arrayIncludes(element)`

**array contains all provided elements**
`dyp.arrayIncludesEvery(elements)`

**utility for specifying an object with fixed number of properties**
`dyp.numberOfKeys(keys)`

