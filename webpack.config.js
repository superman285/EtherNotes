const path = require('path');
const webpack = require('webpack');

const TerserPlugin = require('terser-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CompressionPlugin = require("compression-webpack-plugin");


module.exports = {
    mode: 'production',
    entry: {
        bundle: path.join(__dirname, './src/js/app/index.js'),
        checkKey: path.join(__dirname, './src/js/utils/checkKey.js'),
        loginVerify: path.join(__dirname, './src/js/utils/loginVerify.js'),
        web3mod: path.join(__dirname,'./src/js/mod/web3.js'),
    },
    output: {
        path: path.resolve('dist'),
        filename: '[name].js',
        publicPath: '',
    },

    devtool: false,
    devServer: {
        compress: true
    },
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    output: {
                        beautify: false,
                        comments: false
                    },
                    compress: {
                        warnings: false,
                        drop_debugger: true,
                        drop_console: true
                    },
                }
            })
        ],
    },

    module: {
        rules: [
            {
                test: /\.sass$/,
                use: ["style-loader", "css-loader", "sass-loader"]
            },
            {
                test: /\.scss$/,
                use: ["style-loader", "css-loader", "sass-loader"]
            },
            {
                test: /\.less$/,
                use: ["style-loader", "css-loader", "less-loader"]
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"]
            },
            {
                test: /\.(ttf|svg|eot|woff|woff2)/,
                use: "url-loader"
            },
        ]
    },

    plugins: [
        new webpack.ProvidePlugin({
            $: "jquery",
            Web3: "web3",
        }),
        new CompressionPlugin(),
    ]
};