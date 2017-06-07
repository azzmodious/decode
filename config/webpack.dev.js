(function () {
    "use strict";

    process.env.NODE_ENV = "development";
    process.env.ENV = process.env.NODE_ENV;

    // Helpers
    var helpers = require("./helpers"),
        webpackMerge = require("webpack-merge"),
        commonConfig = require("./webpack.common.js"),

    // Plugins
        DefinePlugin = require("webpack/lib/DefinePlugin"),
        NamedModulesPlugin = require("webpack/lib/NamedModulesPlugin"),

    // Environment
        ENV = process.env.ENV,
        HOST = process.env.HOST || "localhost",
        PORT = process.env.PORT || 8080,
        HMR = helpers.hasProcessFlag("hot"),
        METADATA = webpackMerge(commonConfig({env: ENV}).metadata, {
            host: HOST,
            port: PORT,
            ENV: ENV,
            HMR: HMR
        });

    module.exports = function () {
        return webpackMerge(commonConfig({env: ENV}), {
            metadata: METADATA,
            debug: true,
            devtool: "cheap-module-source-map",
            output: {
                path: helpers.root("dist"),
                filename: "[name].bundle.js",
                sourceMapFilename: "[name].map",
                chunkFilename: "[id].chunk.js",
                library: "ac_[name]",
                libraryTarget: "var"
            },
            plugins: [
                // NOTE: when adding more properties, make sure you include them in custom-typings.d.ts
                new DefinePlugin({
                    "ENV": JSON.stringify(METADATA.ENV),
                    "HMR": METADATA.HMR,
                    "process.env": {
                        "ENV": JSON.stringify(METADATA.ENV),
                        "NODE_ENV": JSON.stringify(METADATA.ENV),
                        "HMR": METADATA.HMR
                    }
                }),
                new NamedModulesPlugin()
            ],
            tslint: {
                emitErrors: false,
                failOnHint: false,
                resourcePath: "src"
            },
            devServer: {
                port: METADATA.port,
                host: METADATA.host,
                historyApiFallback: true,
                watchOptions: {
                    aggregateTimeout: 300,
                    poll: 1000
                },
                outputPath: helpers.root("dist")
            },
            node: {
                global: "window",
                crypto: "empty",
                process: true,
                module: false,
                clearImmediate: false,
                setImmediate: false
            }
        });
    };
}());
