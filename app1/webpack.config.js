const HtmlWebpackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin = require("@module-federation/enhanced/webpack").ModuleFederationPlugin
const CleanWebpackPlugin = require("clean-webpack-plugin").CleanWebpackPlugin;
const path = require('path');
const { name } = require('./package.json');

// 动态获取 remoteEntry.js 的 URL，解决缓存问题
const getRemoteEntry = (remoteName, publicPath) => {
    return `promise new Promise(resolve => {
                const now = new Date().getTime();
                const remoteUrl =  "${publicPath}remoteEntry.js?t=" + now; // 比如从全局变量中获取
                const scriptId = "remote-${remoteName}"
                let script = document.getElementById(scriptId);
                if (!script) {
                    script = document.createElement('script');
                    script.setAttribute('id', scriptId);
                }
                script.src = remoteUrl;
                script.onload = () => {
                    resolve({
                        get: (request) => window.${remoteName}.get(request),
                        init: (arg) => {
                            try {
                                return window.${remoteName}.init(arg);
                            } catch (e) {
                                console.log('remote container already initialized');
                            }
                        }
                    });
                };
                script.onerror = () => {
                    reject(new Error('Failed to load ${remoteName} module'));
                };
                document.head.appendChild(script);
            })`;
}

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
                // 'app2plus': "app2plus@http://localhost:3002/remoteEntry.js",
                app2plus: getRemoteEntry("app2plus", "http://localhost:3002/")
            },
            shared: { react: { eager: true, singleton: true }, "react-dom": { eager: true, singleton: true } },
        }),
        new HtmlWebpackPlugin({
            template: "./public/index.html",
            chunks: ['app2plus', 'app'],
            chunksSortMode: "manual"
        }),
    ],
};