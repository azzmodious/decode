(function () {
    "use strict";

    process.env.NODE_ENV = "test";
    process.env.ENV = process.env.NODE_ENV;

    // Helpers
    var helpers = require("./helpers"),

    // Plugins
        DefinePlugin = require("webpack/lib/DefinePlugin"),

    // Environment
        ENV = process.env.ENV;

    module.exports = function () {
        return {
            devtool: "inline-source-map",
            resolve: {
                extensions: ["", ".ts", ".js"],
                root: helpers.root("src")
            },
            module: {
                preLoaders: [{
                    test: /\.ts$/,
                    loader: "tslint-loader",
                    exclude: [helpers.root("node_modules")]
                }, {
                    test: /\.js$/,
                    loader: "source-map-loader",
                    exclude: [
                        // these packages have problems with their sourcemaps
                        helpers.root("node_modules/rxjs"),
                        helpers.root("node_modules/@angular")
                    ]
                }],
                loaders: [{
                    test: /\.ts$/,
                    loader: "awesome-typescript-loader",
                    query: {
                        compilerOptions: {

                            // Remove TypeScript helpers to be injected below by DefinePlugin
                            removeComments: true

                        }
                    },
                    exclude: [/\.e2e\.ts$/]
                }, {
                    test: /\.json$/,
                    loader: "json-loader",
                    exclude: [helpers.root("src/index.html")]
                }, {
                    test: /\.html$/,
                    loader: "raw-loader",
                    exclude: [helpers.root("src/index.html")]
                }],
                postLoaders: [{
                    test: /\.(js|ts)$/,
                    loader: "istanbul-instrumenter-loader",
                    include: helpers.root("src"),
                    exclude: [
                        /\.(e2e|spec)\.ts$/,
                        /node_modules/
                    ]
                }]
            },
            plugins: [
                // NOTE: when adding more properties make sure you include them in custom-typings.d.ts
                new DefinePlugin({
                    "ENV": JSON.stringify(ENV),
                    "HMR": false,
                    "process.env": {
                        "ENV": JSON.stringify(ENV),
                        "NODE_ENV": JSON.stringify(ENV),
                        "HMR": false
                    }
                })
            ],
            tslint: {
                emitErrors: false,
                failOnHint: false,
                resourcePath: "src"
            },
            node: {
                global: "window",
                process: false,
                crypto: "empty",
                module: false,
                clearImmediate: false,
                setImmediate: false
            }
        };
    };
}());
