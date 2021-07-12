# Monterey
Functional testing framework to automate OpenSearch Dashboards.

## Getting Started
Monterey uses [Cypress](https://www.cypress.io/), which you can install using the [installation guide](https://docs.cypress.io/guides/getting-started/installing-cypress).

## Running tests
Before running any tests, make sure that both [OpenSearch](https://github.com/opensearch-project/OpenSearch) and [OpenSearch Dashboards](https://github.com/opensearch-project/OpenSearch-Dashboards) are running. The demo test expects the OpenSearch Dashboards server base path to be stored as the `baseUrl` variable in the `cypress.json` file (more details [here](https://docs.cypress.io/guides/references/configuration#cypress-json)). By default, the `baseUrl` is set to `http://localhost:5601`.

By default, Cypress test files are located in `cypress/integration`. More details about the Cypress folder structure can be found [here](https://docs.cypress.io/guides/core-concepts/writing-and-organizing-tests#Configuring-Folder-Structure).

### Cypress Test Runner
To run tests through the Cypress Test Runner, open Cypress using one of the commands listed in the [installation guide](https://docs.cypress.io/guides/getting-started/installing-cypress#Opening-Cypress), such as `npx cypress open`. Once the Cypress Test Runner is open, all tests stored in `cypress/integration` should be visible and organized by directory. After you select the desired browser, click on the test you want to run and a new browser window will open running the test.

### CLI
Given that Cypress was installed as an `npm` module, you can also run Cypress in the command line, as is detailed [here](https://docs.cypress.io/guides/guides/command-line#Installation). To run a specific test, an example command you can use is `npx cypress run --spec "cypress/integration/path/to/test.js"`.
