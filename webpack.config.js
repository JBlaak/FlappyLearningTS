var path = require('path');
var webpack = require('webpack');

module.exports = {
    devtool: "inline-source-map",
    debug: true,
    entry: [
        './build/client'
    ],
    output: {
        path: path.join(__dirname, 'public/js'),
        filename: 'bundle.js'
    },
    plugins: [
        new webpack.NoErrorsPlugin()
    ],
    resolve: {
        extensions: ['.js']
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                include: [
                    path.join(__dirname, 'client')
                ],
                loaders: ['babel-loader']
            }
        ]
    }
};