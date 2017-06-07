(function () {
    "use strict";

    module.exports = function (config) {
        var configuration = {

            basePath: "",

            browsers: ["Chrome"],

            customLaunchers: {
                ChromeTravisCi: {
                    base: "Chrome",
                    flags: ["--no-sandbox"]
                }
            },

            exclude: [],

            files: [{pattern: "./config/spec-bundle.js", watched: false}],

            frameworks: ["jasmine"],

            preprocessors: {"./config/spec-bundle.js": ["coverage", "webpack", "sourcemap"]},

            coverageReporter: {
                dir: "coverage/",
                reporters: [
                    {type: "text-summary"},
                    {type: "lcov"},
                    {type: "json"},
                    {type: "html"}
                ]
            },

            junitReporter: {
                outputDir: "coverage/results",
                outputFile: "unit.xml",
                suite: "unit"
            },

            reporters: ["coverage", "coveralls", "dots", "junit"],

            webpack: require("./webpack.test.js")({env: "test"}),

            webpackServer: {noInfo: true},

            autoWatch: false,
            colors: true,
            logLevel: config.LOG_INFO,
            port: 9876,
            singleRun: true
        };

        if (process.env.TRAVIS) {
            configuration.browsers = ["ChromeTravisCi"];
        }

        config.set(configuration);
    };
}());
