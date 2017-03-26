const webpack = require('webpack');
const path = require('path');
const fs = require('fs');

const nodeModules = {};
fs.readdirSync('node_modules')
    .filter(function(x) {
        return ['.bin'].indexOf(x) === -1;
    })
    .forEach(function(mod) {
        nodeModules[mod] = 'commonjs ' + mod;
    });

module.exports = {
    entry: [
        'webpack-dev-server/client?http://localhost:5000',
        'webpack/hot/dev-server',
        './src/index',
    ],
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'index.js'
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        // new CopyWebpackPlugin([
        //     {from: 'src./file.txt', to: 'build/config.json'}
        // ])
    ],
    watch: true,
    externals: nodeModules,
    module: {
        loaders: [{
            test: /\.js$/,
            loaders: ['babel'],
            exclude: /node_modules/,
        }]
    },
    devServer: {
        contentBase: './build',
        hot: true
    }
};