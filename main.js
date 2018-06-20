import fs from 'fs'
import {getOptions} from 'loader-utils'
import path from 'path'
import peg from 'pegjs'
import validateOptions from 'schema-utils'

const schema = {
    type: 'object',
    properties: {
        comma: {type: 'boolean'},
        string: {type: 'boolean'},
        parens: {type: 'boolean'},
        bslash: {type: 'boolean'},
        unindent: {type: 'boolean'},
        space: {type: 'boolean'}
    },
    additionalProperties: false
}

const defaults = {
    comma: true,
    string: true,
    parens: true,
    bslash: true,
    unindent: true,
    space: true
}

// eslint-disable-next-line no-sync
const grammar = fs.readFileSync(path.join(__dirname, 'grammar.pegjs'), 'utf8')
const parser = peg.generate(grammar)

export default function(source) {
    // eslint-disable-next-line no-invalid-this
    const options = {...defaults, ...getOptions(this)}
    validateOptions(schema, options, "Multiline Sass Loader")
    const transforms = makeTransforms(options)
    return transformSource(transforms, source)
}

function makeTransforms(options) {
    const unindent = options.unindent
    const newlines = unindent ? /\r?\n\s*/g : /\r?\n/g
    // Spaces are not added just after the opening quote or paren or just
    // before the closing one.
    const initialNewline = unindent ? /^(['"([])\r?\n\s*/ : /^(['"([])\r?\n/
    const finalNewline = unindent ? /\r?\n\s*(['")\]])$/ : /\r?\n(\s*['")\]])$/
    const commaNewline = unindent ? /\r?\n\s*/ : /\r?\n/
    const bslashNewline = unindent ? /\\\r?\n\s*/ : /\\\r?\n/
    const lineComments = /\/\/[^\n]*\n/g
    const maybeSpace = options.space ? ' ' : ''

    /* eslint-disable indent */
    const transforms = {}
    if (options.string) {
        transforms.string = text => text.replace(initialNewline, '$1')
                                        .replace(finalNewline, '$1')
                                        .replace(newlines, maybeSpace)
    }
    if (options.parens) {
        // It is probably safer to remove line comments than to turn them into
        // block comments, as the latter are preserved in the sass output.
        transforms.parens = text => text.replace(lineComments, '')
                                        .replace(initialNewline, '$1')
                                        .replace(finalNewline, '$1')
                                        .replace(newlines, maybeSpace)
    }
    if (options.comma) {
        transforms.comma = text => text.replace(commaNewline, maybeSpace)
    }
    if (options.bslash) {
        // No space; it is common to add one before the backslash.
        transforms.bslash = text => text.replace(bslashNewline, '')
    }
    /* eslint-enable indent */
    return transforms
}

function transformSource(transforms, source) {
    let result = ''
    for (let {token, text} of parser.parse(source)) {
        const transform = transforms[token]
        if (transform) {
            text = transform(text)
        }
        result += text
    }
    return result
}
