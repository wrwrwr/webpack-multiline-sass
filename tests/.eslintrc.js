module.exports = {
    env: {
        mocha: true,
    },
    globals: {
        // False means a variable is "read-only".
        // Console sometimes needs to be replaced by a stub.
        console: false,
        // Chai's expect() for cases when undefinedness needs to be checked.
        expect: false,
        // Spies and stubs.
        sinon: false
    },
    rules: {
        // Console output sometimes needs to be tested.
        'no-console': 0,
        // Magic numbers are fine in tests.
        'no-magic-numbers': 0,
        // Fixture loading.
        'no-sync': 0,
        // Mocha's it(..., f) with `this` bound in f.
        'func-names': 0,
        // Mocha's undocumented this.skip().
        'no-invalid-this': 1,
    }
}
