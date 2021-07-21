// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

/**
 * Sets the Dashboard page data range
 * @param {String} start Start datetime to set
 * @param {String} end  End datetime to set
 */
Cypress.Commands.add('setDashboardDataRange', (start, end) => {
  cy.get('[data-test-subj="superDatePickerShowDatesButton"]').should('be.visible').click()

  cy.get('[data-test-subj="superDatePickerendDatePopoverButton"]').should('be.visible').click()
  cy.get('[data-test-subj="superDatePickerAbsoluteTab"]').should('be.visible').click()
  cy.get('[data-test-subj="superDatePickerAbsoluteDateInput"]').should('be.visible').type('{selectall}' + start)
  cy.get('[data-test-subj="superDatePickerendDatePopoverButton"]').should('be.visible').click()
  cy.get('[data-test-subj="superDatePickerAbsoluteTab"]').should('not.exist')

  cy.get('[data-test-subj="superDatePickerstartDatePopoverButton"]').should('be.visible').click()
  cy.get('[data-test-subj="superDatePickerAbsoluteTab"]').should('be.visible').click()
  cy.get('[data-test-subj="superDatePickerAbsoluteDateInput"]').should('be.visible').type('{selectall}' + end)
  cy.get('[data-test-subj="superDatePickerstartDatePopoverButton"]').should('be.visible').click()

  cy.get('[data-test-subj="querySubmitButton"]').should('be.visible').click()
})

/**
 * Add saved Dashboard panels
 * @param {String} keyword Search term for panels of interest
 * @param {String} type Panel type to search for
 * @param {Boolean} multiplePages Whether there are multiple pages to iterate through
 */
Cypress.Commands.add('addDashboardPanels', (keyword, type, multiplePages = true) => {
  const iteratePages = () => {
    cy.get('[data-test-subj="pagination-button-next"]').then(($nextBtn) => {
      cy.get('[data-test-subj="savedObjectFinderItemList"]').should('be.visible')
      if ($nextBtn.is(':enabled')) {
        cy.wrap($nextBtn).click()
        cy.get('[data-test-subj^="savedObjectTitle' + keyword.replace(/\s+/g, '-') + '"]').should('be.visible').click({ multiple: true })
        iteratePages()
      }
    })
  }
  cy.get('[data-test-subj="dashboardAddPanelButton"]').should('be.visible').click()
  cy.get('[data-test-subj="savedObjectFinderItemList"]').should('be.visible')

  cy.get('[data-test-subj="savedObjectFinderFilterButton"]').should('be.visible').click()
  cy.get('[data-test-subj="savedObjectFinderFilter-' + type + '"]').should('be.visible').click()
  cy.get('[data-test-subj="savedObjectFinderFilterButton"]').should('be.visible').click()

  cy.get('[data-test-subj="savedObjectFinderSearchInput"]').should('be.visible').type(keyword)

  cy.get('[data-test-subj^="savedObjectTitle' + keyword.replace(/\s+/g, '-') + '"]').should('be.visible').click({ multiple: true }).then(() => {
    if (multiplePages) {
      iteratePages()
    }
  })
  cy.get('[data-test-subj="euiFlyoutCloseButton"]').click()
})

/**
 * Add a specified filter a dashboard
 * @param {String} field Field value to select
 * @param {String} operator Operator value to select
 * @param {String} value Value field input
 */
Cypress.Commands.add('addDashboardFilter', (field, operator, value) => {
  cy.get('[data-test-subj="addFilter"]').click()

  cy.get('[data-test-subj="filterFieldSuggestionList"]').find('[data-test-subj="comboBoxInput"]').type(field)
  cy.get('[data-test-subj="comboBoxOptionsList filterFieldSuggestionList-optionsList"]').find('[title="' + field + '"]').click({ force: true })

  cy.get('[data-test-subj="filterOperatorList"]').find('[data-test-subj="comboBoxInput"]').type(operator)
  cy.get('[data-test-subj="comboBoxOptionsList filterOperatorList-optionsList"]').find('[title="' + operator + '"]').click({ force: true })

  cy.get('[data-test-subj="filterParams"]').find('input').type(value)
  cy.get('[data-test-subj="saveFilter"]').click()
})

/**
 * Save a dashboard visualization
 * @param {String} title Field value to select
 * @param {Boolean} saveAsNew Whether to save as new visualization
 * @param {Boolean} returnToDashboard Whether to return to the home dashboard
 */

Cypress.Commands.add('saveVisualization', (title, saveAsNew = false, returnToDashboard = false) => {
  cy.get('[data-test-subj="visualizeSaveButton"]').click()
  cy.get('[data-test-subj="savedObjectTitle"]').type('{selectall}' + title + '')
  cy.get('[data-test-subj="saveAsNewCheckbox"]').then(($checkbox) => {
    if (saveAsNew === false) {
      cy.get($checkbox).click()
    }
  })
  cy.get('[data-test-subj="returnToOriginModeSwitch"]').then(($checkbox) => {
    if (returnToDashboard === false) {
      cy.get($checkbox).click()
    }
  })
  cy.get('[data-test-subj="confirmSaveSavedObjectButton"]').click()
})
