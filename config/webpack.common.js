(function () {
    "use strict";

    // Helpers
    var webpack = require("webpack"),
        helpers = require("./helpers"),

    // Plugins
        CopyWebpackPlugin = require("copy-webpack-plugin"),
        HtmlWebpackPlugin = require("html-webpack-plugin"),
        ForkCheckerPlugin = require("awesome-typescript-loader").ForkCheckerPlugin,
        HtmlElementsPlugin = require("./html-elements-plugin"),
        AssetsPlugin = require("assets-webpack-plugin"),

    // Environment
        METADATA = {
            title: "CTSSP",
            baseUrl: "/",
            isDevServer: helpers.isWebpackDevServer()
        };

    module.exports = function (options) {
        var isProd = options.env === "production";

        return {
            metadata: METADATA,
            entry: {
                "polyfills": "./src/polyfills.browser.ts",
                "vendor": "./src/vendor.browser.ts",
                "main": "./src/main.browser.ts"
            },
            resolve: {
                extensions: ["", ".ts", ".js", ".json", ".less"],
                // Make sure root is src
                root: helpers.root("src"),
                // remove other default values
                modulesDirectories: ["node_modules"]
            },
            module: {
                preLoaders: [{
                    test: /\.ts$/,
                    loader: "string-replace-loader",
                    query: {
                        search: "(System|SystemJS)(.*[\\n\\r]\\s*\\.|\\.)import\\((.+)\\)",
                        replace: "$1.import($3).then(mod => (mod.__esModule && mod.default) ? mod.default : mod)",
                        flags: "g"
                    },
                    include: [helpers.root("src")]
                }],
                loaders: [{
                    test: /\.ts$/,
                    loaders: [
                        "@angularclass/hmr-loader?pretty=" + !isProd + "&prod=" + isProd,
                        "awesome-typescript-loader",
                        "angular2-template-loader"
                    ],
                    exclude: [/\.(spec|e2e)\.ts$/]
                }, {
                    test: /\.json$/,
                    loader: "json-loader"
                }, {
                    test: /\.less$/,
                    loader: ["raw-loader", "less-loader"]
                }, {
                    test: /\.html$/,
                    loader: "raw-loader",
                    exclude: [helpers.root("src/index.html")]
                }, {
                    test: /\.(jpg|png|gif)$/,
                    loader: "file"
                }],
                postLoaders: [{
                    test: /\.js$/,
                    loader: "string-replace-loader",
                    query: {
                        search: "var sourceMappingUrl = extractSourceMappingUrl\\(cssText\\);",
                        replace: "var sourceMappingUrl = \"\";",
                        flags: "g"
                    }
                }]
            },
            plugins: [
                new AssetsPlugin({
                    path: helpers.root("dist"),
                    filename: "webpack-assets.json",
                    prettyPrint: true
                }),
                new ForkCheckerPlugin(),
                new webpack.optimize.CommonsChunkPlugin({
                    name: ["vendor", "polyfills"]
                }),
                new CopyWebpackPlugin([{
                    from: "src/assets",
                    to: "assets"
                }]),
                new HtmlWebpackPlugin({
                    template: "src/index.html",
                    chunksSortMode: "dependency"
                }),
                new HtmlElementsPlugin({
                    headTags: require("./head-config.common")
                })
            ],
            node: {
                global: "window",
                crypto: "empty",
                process: true,
                module: false,
                clearImmediate: false,
                setImmediate: false
            }
        };
    };
}());
