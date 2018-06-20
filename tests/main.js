import fs from 'fs'
import MemoryFileSystem from 'memory-fs'
import path from 'path'
import webpack from 'webpack'
import 'regenerator-runtime/runtime'

function transform(entry) {
    const compiler = webpack({
        entry,
        mode: 'development',
        module: {
            rules: [
                {
                    test: /\.sass$/,
                    use: [
                        require.resolve('raw-loader'),
                        path.resolve(__dirname, '../main.js')
                    ]
                }
            ]
        }
    })

    compiler.outputFileSystem = new MemoryFileSystem()

    return new Promise((resolve, reject) => {
        compiler.run((error, stats) => {
            if (error) {
                reject(error)
            }
            if (stats.hasErrors()) {
                reject(stats.compilation.errors[0])
            }
            if (stats.hasWarnings()) {
                reject(stats.compilation.warnings[0])
            }
            // eslint-disable-next-line no-eval
            resolve(eval(stats.toJson().modules[0].source))
        })
    })
}

describe("Transformations", () => {
    const fixtures = fs.readdirSync(path.join(__dirname, 'fixtures'))
    for (let fixture of fixtures) {
        const input = path.join(__dirname, 'fixtures', fixture, 'in.sass')
        const output = path.join(__dirname, 'fixtures', fixture, 'out.sass')
        const expected = fs.readFileSync(output, 'utf8')
        it(fixture, async () => {
            expected.should.equal(await transform(input))
        })
    }
})
