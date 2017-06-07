Feature: Sample (Chrome)
    In order to provide an example of a functional test
    As a developer
    I want to make sure index.html loads

    Scenario: Successful page load
        Given a Chrome browser session
        When I GET the content at the relative path, 'index.html'
        Then the page should load
        And the CTSSP logo should be visible in the top-left corner