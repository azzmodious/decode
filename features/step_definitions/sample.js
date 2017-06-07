(function () {
    'use strict';

    var fs = require("fs"),
        mkdirp = require("mkdirp"),
        path = require("path"),
        sanitize = require("sanitize-filename"),
        selenium = require("selenium-webdriver"),
        by = selenium.By,
        until = selenium.until,
        driver,
        screenshotPath = "local/screenshots";

    module.exports = function () {

        this.After(function (scenario) {
            if (scenario.isFailed()) {
                driver.takeScreenshot().then(function (data) {
                    var base64Data = data.replace(/^data:image\/png;base64,/, "");

                    mkdirp(screenshotPath);
                    fs.writeFile(path.join(screenshotPath, sanitize(scenario.getName() + ".png").replace(/ /g, "_")), base64Data, "base64", function (error) {
                        if (error) {
                            console.log(error);
                        }
                    });
                });
            }
            driver.manage().deleteAllCookies();
            return driver.quit();
        });


        this.Given(/^a Firefox browser session$/, function () {
            driver = this.getDriver("FIREFOX");
            // driver = this.getDriver("CHROME");
        });
        this.Given(/^a Chrome browser session$/, function () {
            //driver = this.getDriver("FIREFOX");
            driver = this.getDriver("CHROME");
        });


        this.When(/^I GET the content at the relative path, '([\w\W]*)'$/, function (relativePath) {
            driver.get(this.getUrl() + "/" + relativePath);
        });


        this.Then(/^the page should load$/, function () {
            return driver.wait(until.titleIs("CTSSP"), 5000);
        });

        this.Then(/^the CTSSP logo should be visible in the top-left corner$/, function () {
            return driver.findElement(by.css("span.title"), 5000);
        });

    };
}());
