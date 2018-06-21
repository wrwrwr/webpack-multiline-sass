webpack-multiline-sass
======================

A [webpack][] loader that collapses some lines in the [Sass][]'s indented
syntax. Please see [sass#216][] for a perspective.

[webpack]: https://webpack.github.io/
[sass]: https://sass-lang.com/
[sass#216]: https://github.com/sass/sass/issues/216

# Usage

Add the loader just after [sass-loader][] (in `webpack.config.js` under
`module → rules`):

```javascript
{
    test: /\.sass$/,
    use: [
        // ... (extract text, style, css, postcss etc.)
        {loader: 'sass-loader'},
        {loader: 'webpack-multiline-sass'},
        // After the multiline loader if resources also need collapsing:
        // {loader: 'sass-resources-loader', options: {resources: ...}}
    ]
}
```

[sass-loader]: https://github.com/webpack-contrib/sass-loader

# Options

You may disable any transformation through loader options, all are enabled by
default:

```javascript
options: {
    comma: true,
    string: true,
    parens: true,
    bslash: true,
    unindent: true,
    space: true
}
```

## comma

Removes newlines just after a comma:

```sass
selector1,
selector2
```

becomes:

```sass
selector1, selector2
```

## string

Collapses quoted multiline strings:

```sass
$filter: '
<svg>
    ...
</svg>
'
```

becomes:

```sass
$filter: '<svg> ... </svg>'
```

## parens

Collapses newlines within parentheses and brackets:

```sass
$map: (
    key1: value1,
    key2: value2
)
```

becomes:

```sass
$map: (key1: value1, key2: value2)
```

## bslash

For all other cases you may use a trailing backslash:

```sass
$sum: $a + \
      $b + \
      $c
```

becomes:

```sass
$sum: $a + $b + $c
```

## unindent

Setting this to `false` prevents the removal of leading spaces and tabs on
the line just after a collapsed newline.

## space

In some cases a space is inserted in place of a newline (after a comma and
in the middle of strings and parenthesized expressions).
This is needed for texts and lists without commas, but otherwise may be
switched off for slightly more condensed output.

# Installation

```bash
npm install webpack-multiline-sass
```

# Debugging

A straightforward way to see which lines are collapsed and which aren't is to
put `{loader: 'echo-loader?msg=dump'}` just before the loader.

# Testing

Execute tests with `npm run test` or with `mocha --opts tests/mocha.opts` to
skip linting.
Adding a new test amounts to creating a folder under `tests` and saving input
and expected output as `in.sass` and `out.sass` therein.
If you come across a sass fragment that is not processed correctly, please
submit it as a test.

# Caveats

* Tests only cover option defaults.
* Strings inside lists and maps are not handled properly.
* No attempt is made to preserve source line mapping.
