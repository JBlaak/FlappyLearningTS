var path = require('path');
var webpack = require('webpack');

module.exports = {
    devtool: "inline-source-map",
    debug: true,
    entry: './src/client',
    output: {
        path: path.join(__dirname, 'public/js'),
        filename: 'bundle.js'
    },
    plugins: [
        new webpack.NoErrorsPlugin()
    ],
    resolve: {
        extensions: ['', '.js', '.ts']
    },
    module: {
        loaders: [
            {
                test: /\.tsx?$/,
                loaders: ['babel-loader', 'ts-loader']
            }
        ]
    }
};