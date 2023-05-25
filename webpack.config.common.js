const path = require('path');
const webpack = require('webpack');
const CopyPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
//const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");

require('dotenv').config();

const isDevelopment = process.env.NODE_ENV === 'development'
console.log('@@@@@ AMBIENTE WEBPACK @@@@@@');
console.log(isDevelopment);

module.exports = {
    output: {
        path: path.join(__dirname, 'public/assets'),
        publicPath: '/', // must be defined any path, `auto` is not supported yet
        filename: "js/[name].js"
    },
    entry: {
        'main': './src/js/index.js', // load a Pug template in JS
        'manager': './src/js/manager.js',
        'network': './src/js/network.js',
        'channels': './src/js/channels.js',
        'performance': './src/js/performance.js',
        'chart': './src/js/chart.js',
        'contabilita': './src/js/contabilita.js',
        'tickets': './src/js/tickets.js',
        'allarmi': './src/js/allarmi.js',
        'erogazionemanuale': './src/js/erogazionemanuale.js'
    },
    experiments: {
        topLevelAwait: true
    },
    resolve: {
        extensions: ['.js', '.jsx', '.scss'],
        alias: {
            process: "process/browser",
            //util: path.resolve(__dirname, 'node_modules/util')
        },
        fallback: {
            util: false,
            fs: false,
            tls: false,
            net: false,
            path: false,
            zlib: false,
            http: false,
            https: false,
            stream: false
        }
    },
    module: {
        rules: [
            {
                test: /\.pug$/,
                loader: '@webdiscus/pug-loader',
            },
            // Rule for processing the Bootstrap icons
            {
                test: /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
                loader: 'file-loader',
            },
            {
                test: /\.(png|jpe?g|gif|jp2|webp)$/,
                loader: 'file-loader',
                options: {
                    name: 'img/[name].[ext]',
                }
            },
        
            {
                test: /\.(scss|css)$/,
                exclude: [/node_modules/],
                use: [
                    isDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader', options: {
                            sourceMap: !isDevelopment,
                            url: false,
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            sourceMap: !isDevelopment,
                            postcssOptions: {
                                plugins: [
                                    [ "postcss-preset-env", {} ],
                                ],
                            }
                        }
                    },
                    {
                        loader: 'sass-loader', options: {
                            sourceMap: !isDevelopment,
                            sassOptions: {
                                sourceMapContents: false,
                                includePaths: ["src/sass"],
                                //data: '@import "src/sass/partials/_variables.scss";',
                            }
                        }
                    }
                ],
            },
        ],
    },
    optimization: {
        minimizer: [
            new CssMinimizerPlugin(),
        ],
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                { from: "**/*", context: "src/assets" },
                { from: "**/*", to:"../fonts", context: "src/fonts" },
            ],
            options: {
                concurrency: 100
            },
        }),
        new MiniCssExtractPlugin({
            filename: 'css/[name].css',
            chunkFilename: '[id].css'
        }),
        new webpack.DefinePlugin({
            API_URL: JSON.stringify(process.env.API_URL),
            APP_URL: JSON.stringify(process.env.APP_DOMAIN),
            WM_CONFIG_RESTO: JSON.stringify(global.resto),
            WM_CONFIG_GENERALI: JSON.stringify(global.generali),
        }),
    ]
};
