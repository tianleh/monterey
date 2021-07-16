/**
 * dashboard_filtering test suite description:
 * 1) Create a new dashboard, populate with visualizations
 * 2) Set a filter that excludes all data, and check the visualizations for proper updates
 * 3) Set the existing filter as pinned, re-check the visualizations
 * 4) Remove the filter, and check the visualizations for proper updates
 * 5) Create a new dashboard, and populate with a pie graph
 * 6) Edit the pie graph and filter based on a search query ("weightLbs:>50")
 * 7) ...
 * 8) ...
 * 9) ...
 */

describe('dashboard filtering', () => {
  before(() => {
    // Setup the indices
    // cy.request('POST', 'localhost:9200/_bulk', cy.fixture('dashboard/data.json.gz'))
    // cy.request('PUT', 'localhost:9200/', cy.fixture('dashboard/mappings.json'))
  })

  after(() => {
    // Delete the indices
    // cy.request('DELETE', 'localhost:9200')
  })

  describe('adding a filter that excludes all data', () => {
    before(() => {
      // Go to the Dashboards list page
      cy.visit('app/dashboards/list')

      // Click the "Create dashboard" button
      cy.get('[data-test-subj="newItemButton"]').should('be.visible').click()
      cy.get('[data-test-subj="emptyDashboardWidget"]').should('be.visible')
      // Change the time to be between Jan 1 2018 and Apr 13, 2018
      cy.get('[data-test-subj="superDatePickerShowDatesButton"]').should('be.visible').click()

      cy.get('[data-test-subj="superDatePickerendDatePopoverButton"]').should('be.visible').click()
      cy.get('[data-test-subj="superDatePickerAbsoluteTab"]').should('be.visible').click()
      cy.get('[data-test-subj="superDatePickerAbsoluteDateInput"]').should('be.visible').type('{selectall}Apr 13, 2018 @ 00:00:00.000')
      cy.get('[data-test-subj="superDatePickerendDatePopoverButton"]').should('be.visible').click()

      cy.get('[data-test-subj="superDatePickerstartDatePopoverButton"]').should('be.visible').click()
      cy.get('[data-test-subj="superDatePickerAbsoluteTab"]').should('be.visible').click()
      cy.get('[data-test-subj="superDatePickerAbsoluteDateInput"]').should('be.visible').type('{selectall}Jan 1, 2018 @ 00:00:00.000')
      cy.get('[data-test-subj="superDatePickerstartDatePopoverButton"]').should('be.visible').click()

      cy.get('[data-test-subj="querySubmitButton"]').should('be.visible').click()

      // Click the "Add" button
      cy.get('[data-test-subj="dashboardAddPanelButton"]').should('be.visible').click()

      // Select the visualization type
      cy.viewport(1900, 1080)
      cy.get('[data-test-subj="savedObjectFinderFilterButton"]').should('be.visible').click()
      cy.get('[data-test-subj="savedObjectFinderFilter-visualization"]').should('be.visible').click()
      cy.get('[data-test-subj="savedObjectFinderFilterButton"]').should('be.visible').click()

      cy.get('[data-test-subj="savedObjectFinderSearchInput"]').should('be.visible').type('Filter Bytes Test')
      cy.get('[data-test-subj^="savedObjectTitleFilter-Bytes-Test:"]').should('be.visible').click({ multiple: true})
      cy.get('[data-test-subj="pagination-button-1"]').should('be.visible').click()
      cy.get('[data-test-subj^="savedObjectTitleFilter-Bytes-Test:"]').should('be.visible').click({ multiple: true})
      cy.viewport(1000, 660)
      cy.get('[data-test-subj="euiFlyoutCloseButton"]').click()

      // Click the "Add" button and add all "Saved Searches"
      cy.get('[data-test-subj="dashboardAddPanelButton"]').should('be.visible').click()

      cy.get('[data-test-subj="savedObjectFinderFilterButton"]').should('be.visible').click()
      cy.get('[data-test-subj="savedObjectFinderFilter-search"]').should('be.visible').click()
      cy.get('[data-test-subj="savedObjectFinderFilterButton"]').should('be.visible').click()

      cy.get('[data-test-subj="savedObjectFinderSearchInput"]').should('be.visible').type('Filter Bytes Test')
      cy.get('[data-test-subj^="savedObjectTitleFilter-Bytes-Test:"]').should('be.visible').click({ multiple: true})

      cy.get('[data-test-subj="euiFlyoutCloseButton"]').click()

      // Add filter
      cy.get('[data-test-subj="addFilter"]').click()

      cy.get('[data-test-subj="filterFieldSuggestionList"]').find('[data-test-subj="comboBoxInput"]').type('bytes')
      cy.get('[data-test-subj="comboBoxOptionsList filterFieldSuggestionList-optionsList"]').find('[title="bytes"]').click()

      cy.get('[data-test-subj="filterOperatorList"]').find('[data-test-subj="comboBoxInput"]').type('is')
      cy.get('[data-test-subj="filterOperatorList"]').should('have.length', 1)
      cy.get('[data-test-subj="filterOperatorList"]').find('[data-test-subj="comboBoxInput"]').focus()
      cy.get('[data-test-subj="comboBoxOptionsList filterOperatorList-optionsList"]').find('[title="is"]').should('be.visible').click({force: true})
      cy.get('[data-test-subj="filterParams"]').find('input').type('12345678')
      cy.get('[data-test-subj="saveFilter"]').click()
    })

    it('filters on pie charts', () => {

    })

    it('area, bar and heatmap charts filtered', () => {

    })

    it('data tables are filtered', () => {

    })

    it('goal and guages are filtered', () => {

    })

    it('tsvb time series shows no data message', () => {

    })

    it('metric value shows no data', () => {

    })

    it('tag cloud values are filtered', () => {

    })

    it('tsvb metric is filtered', () => {

    })

    it('tsvb top n is filtered', () => {

    })

    it('saved search is filtered', () => {

    })

    // TODO: Uncomment once https://github.com/elastic/kibana/issues/22561 is fixed
    // it('timeline is filtered', async () => {
    //   await dashboardExpect.timelineLegendCount(0)
    // })

    it('vega is filtered', () => {

    })
  })

  describe('using a pinned filter that excludes all data', () => {
    before(() => {

    })
  })

  describe('disabling a filter unfilters the data on', () => {
    before(() => {

    })
  })

  describe('nested filtering', () => {
    before(() => {

    })
  })
})
