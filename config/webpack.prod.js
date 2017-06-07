(function () {
    "use strict";

    process.env.ENV = "production";
    process.env.NODE_ENV = process.env.ENV;

    // Helpers
    var helpers = require("./helpers"),
        webpackMerge = require("webpack-merge"),
        commonConfig = require("./webpack.common.js"),

    // Plugins
        DefinePlugin = require("webpack/lib/DefinePlugin"),
        NormalModuleReplacementPlugin = require("webpack/lib/NormalModuleReplacementPlugin"),
        UglifyJsPlugin = require("webpack/lib/optimize/UglifyJsPlugin"),
        WebpackMd5Hash = require("webpack-md5-hash"),

    // Environment
        ENV = process.env.NODE_ENV,
        HOST = process.env.HOST || "localhost",
        PORT = process.env.PORT || 80,
        METADATA = webpackMerge(commonConfig({env: ENV}).metadata, {
            host: HOST,
            port: PORT,
            ENV: ENV,
            HMR: false
        });

    module.exports = function () {
        return webpackMerge(commonConfig({env: ENV}), {
            debug: false,
            devtool: "source-map",
            output: {
                path: helpers.root("dist"),
                filename: "[name].[chunkhash].bundle.js",
                sourceMapFilename: "[name].[chunkhash].bundle.map",
                chunkFilename: "[id].[chunkhash].chunk.js"
            },
            plugins: [
                new WebpackMd5Hash(),
                // NOTE: when adding more properties make sure you include them in custom-typings.d.ts
                new DefinePlugin({
                    "ENV": JSON.stringify(METADATA.ENV),
                    "HMR": METADATA.HMR,
                    "process.env": {
                        "ENV": JSON.stringify(METADATA.ENV),
                        "NODE_ENV": JSON.stringify(METADATA.ENV),
                        "HMR": METADATA.HMR
                    }
                }),
                new UglifyJsPlugin({
                    beautify: false,
                    mangle: {screw_ie8: true, keep_fnames: true},
                    compress: {screw_ie8: true},
                    comments: false
                }),
                new NormalModuleReplacementPlugin(
                    /angular2-hmr/,
                    helpers.root("config/modules/angular2-hmr-prod.js")
                )
            ],
            tslint: {
                emitErrors: true,
                failOnHint: true,
                resourcePath: "src"
            },
            htmlLoader: {
                minimize: true,
                removeAttributeQuotes: false,
                caseSensitive: true,
                customAttrSurround: [
                    [/#/, /(?:)/],
                    [/\*/, /(?:)/],
                    [/\[?\(?/, /(?:)/]
                ],
                customAttrAssign: [/\)?\]?=/]
            },
            node: {
                global: "window",
                crypto: "empty",
                process: false,
                module: false,
                clearImmediate: false,
                setImmediate: false
            }
        });
    };
}());
