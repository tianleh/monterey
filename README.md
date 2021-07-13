# Monterey
Functional testing framework to automate OpenSearch Dashboards.

## Getting Started
Monterey uses [Cypress](https://www.cypress.io/), which you can install using the [installation guide](https://docs.cypress.io/guides/getting-started/installing-cypress). 

Monterey also uses [ESLint](https://eslint.org/), which you can install using the [installation guide](https://eslint.org/docs/user-guide/getting-started). This project requires you to install the [Cypress ESLint Plugin](https://github.com/cypress-io/eslint-plugin-cypress) for Cypress-specific rules.

## Running tests
Before running any tests, make sure that both [OpenSearch](https://github.com/opensearch-project/OpenSearch) and [OpenSearch Dashboards](https://github.com/opensearch-project/OpenSearch-Dashboards) are running. The demo test expects the OpenSearch Dashboards server base path to be stored as the `baseUrl` variable in the `cypress.json` file (more details [here](https://docs.cypress.io/guides/references/configuration#cypress-json)). By default, the `baseUrl` is set to `http://localhost:5601`.

By default, Cypress test files are located in `cypress/integration`. More details about the Cypress folder structure can be found [here](https://docs.cypress.io/guides/core-concepts/writing-and-organizing-tests#Configuring-Folder-Structure).

### Cypress Test Runner
To run tests through the Cypress Test Runner, open Cypress using one of the commands listed in the [installation guide](https://docs.cypress.io/guides/getting-started/installing-cypress#Opening-Cypress), such as `npx cypress open`. Once the Cypress Test Runner is open, all tests stored in `cypress/integration` should be visible and organized by directory. After you select the desired browser, click on the test you want to run and a new browser window will open running the test.

### CLI
Given that Cypress was installed as an `npm` module, you can also run Cypress in the command line, as is detailed [here](https://docs.cypress.io/guides/guides/command-line#Installation). To run a specific test, an example command you can use is `npx cypress run --spec "cypress/integration/path/to/test.js"`.

## ESLint
To run ESLint on the entire project, you can use either `npx eslint .` or `yarn run eslint .`. There are currently two configuration files you can add or modify rules in: `.eslintrc.js` in the root directory for global rules, and `.eslintrc.json` in the `cypress` directory for Cypress-specific rules.

To have ESLint fix issues that it detects and can resolve, you can add the `--fix` flag to the end of the run commands (more details [here](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems)).
