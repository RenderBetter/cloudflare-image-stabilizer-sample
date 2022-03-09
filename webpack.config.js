const path = require('path')

module.exports = {
    entry: './index.js',
    output: {
        filename: 'index.js',
        path: path.join(__dirname, 'dist'),
    },
    target: "webworker",
    devtool: 'cheap-module-source-map',
    mode: 'development',
    resolve: {
        extensions: ['.js'],
        fallback: {
            // The image-size library depends on these, so we need to polyfill them
            "buffer": require.resolve("buffer/"),
            "path": false,
            "fs": false,
        }
    },
    module: {
        rules: [],
    },
}