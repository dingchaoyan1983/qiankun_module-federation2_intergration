const HtmlWebpackPlugin = require("html-webpack-plugin");
const { name } = require('./package.json');
const ModuleFederationPlugin = require("@module-federation/enhanced/webpack").ModuleFederationPlugin
const path = require('path');
const CleanWebpackPlugin = require("clean-webpack-plugin").CleanWebpackPlugin;


module.exports = {
    entry: {
        app: "./src/index"
    },
    mode: "development",
    resolve: {
        extensions: [".tsx", ".ts", ".jsx", ".js"],
    },
    devServer: {
        port: 3002,
        headers: {
            'Access-Control-Allow-Origin': '*',
        },
    },
    experiments: {
        topLevelAwait: true,
    },
    devtool: "eval-source-map",
    output: {
        filename: '[name].[contenthash].js',
        publicPath: 'http://localhost:3002/',
        library: `${name}-[name]`,
        libraryTarget: 'umd',
        chunkLoadingGlobal: `webpackJsonp_${name}`,
        globalObject: 'window',
        path: path.resolve(__dirname, "dist")
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                loader: "babel-loader",
                exclude: /node_modules/,
                options: {
                    presets: ["@babel/preset-react"],
                    plugins: ['@babel/plugin-syntax-top-level-await'],
                },
            },
            {
                test: /\.tsx|ts?$/,
                loader: "ts-loader",
                exclude: /node_modules/,
            },
        ],
    },
    plugins: [
        new CleanWebpackPlugin(),
        new ModuleFederationPlugin({
            name: "app2plus",
            library: { type: "umd", name: "app2plus" },
            filename: "remoteEntry.js?t=[contenthash]",
            exposes: {
                "./Button": "./src/Button",
            },
            shared: { react: { eager: true, singleton: true }, "react-dom": { eager: true, singleton: true } },
        }),
        new HtmlWebpackPlugin({
            template: "./public/index.html",
            chunks: ['app2plus','app'],
            chunksSortMode: "manual"
        }),
    ],
};