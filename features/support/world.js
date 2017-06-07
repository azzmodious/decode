(function () {
    'use strict';

    var chrome = require('selenium-webdriver/chrome'),
        firefox = require('selenium-webdriver/firefox'),
        options;

    function buildChromeDriver() {
        require("chromedriver");
        options = new chrome.Options();
        return new chrome.Driver(options);
    }

    function buildFirefoxDriver() {
        options = new firefox.Options();
        options.useGeckoDriver(false);
        return new firefox.Driver(options);
    }

    function buildGeckoDriver() {
        require("geckodriver");
        options = new firefox.Options();
        return new firefox.Driver(options);
    }

    function World() {

        this.getDriver = function (platform) {
            var driver;

            switch (platform) {
            case "CHROME":
                driver = buildChromeDriver();
                break;
            case "FIREFOX":
                driver = buildFirefoxDriver();
                break;
            case "GECKO":
                driver = buildGeckoDriver();
                break;
            default:
                driver = buildChromeDriver();
            }
            return driver;
        };

        this.getUrl = function () {
            var i,
                stack;
            if (process.env.URL) {
                return process.env.URL;
            }
            try {
                stack = require("../../stack.json").Stacks[0];
                for (i = 0; i < stack.Outputs.length; i += 1) {
                    if (stack.Outputs[i].OutputKey === "Url") {
                        return stack.Outputs[i].OutputValue;
                    }
                }
            } catch (error) {
                console.log(error);
            }
        };

    }

    module.exports = function () {
        this.World = World;
    };
}());