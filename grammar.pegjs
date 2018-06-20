sass = (comment / string / parens / comma / bslash / char)*

comment = ('//' [^\n]* '\n' / '/*' (!'*/' .)* '*/') {
    return {token: 'comment', text: text()}
}

string = ('\'' [^']* '\'' / '"' [^"]* '"') {
    return {token: 'string', text: text()}
}

parens = ('[' [^\]]* ']' / '(' [^\)]* ')') {
    return {token: 'parens', text: text()}
}

comma = (',' [ \t]* '\r'?'\n' [ \t]*) {
    return {token: 'comma', text: text()}
}

bslash = ('\\''\r'?'\n' [ \t]*) {
    return {token: 'bslash', text: text()}
}

char = . {
    return {token: 'char', text: text()}
}
