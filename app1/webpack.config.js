const HtmlWebpackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin = require("@module-federation/enhanced/webpack").ModuleFederationPlugin
const CleanWebpackPlugin = require("clean-webpack-plugin").CleanWebpackPlugin;
const path = require('path');
const { name } = require('./package.json');

module.exports = {
    entry: {
        app: "./src/index"
    },
    resolve: {
        extensions: [".tsx", ".ts", ".jsx", ".js"],
    },
    devtool: "eval-source-map",
    mode: "development",
    devServer: {
        port: 3001,
        headers: {
            'Access-Control-Allow-Origin': '*',
        },
    },
    output: {
        publicPath: 'http://localhost:3001/',
        library: `${name}-[name]`,
        filename: '[name].js',
        libraryTarget: 'umd',
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
    experiments: {
        topLevelAwait: true,
    },
    plugins: [
        new CleanWebpackPlugin(),
        new ModuleFederationPlugin({
            name: "app1",
            remotes: {
                'app2plus': "app2plus@http://localhost:3002/remoteEntry.js",
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