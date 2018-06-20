const webpack = typeof __webpack_require__ === 'function'

module.exports = {
    presets: [
        [require('@babel/preset-env'), {modules: !webpack && 'commonjs'}],
        [require('@babel/preset-stage-3')]
    ],
    plugins: [
        require('@babel/plugin-transform-regenerator'),
        [require('@babel/plugin-proposal-decorators'), {legacy: true}],
        [require('@babel/plugin-proposal-class-properties'), {loose: true}],
        require('@babel/plugin-proposal-export-default-from'),
        require('@babel/plugin-proposal-nullish-coalescing-operator'),
        require('@babel/plugin-proposal-optional-chaining')
    ]
}
