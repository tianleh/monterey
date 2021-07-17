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
    cy.viewport(1900, 1080)
    // Setup the indices
    // cy.request('PUT', 'localhost:9200/.kibana_1', cy.fixture('dashboard/mappings.json'))
    // cy.request('POST', 'localhost:9200/.kibana_1', cy.fixture('dashboard/data.json.gz'))
  })

  after(() => {
    cy.viewport(1000, 660)
    // Delete the indices
    // cy.request('DELETE', 'localhost:9200')
  })

  describe('adding a filter that excludes all data', () => {
    before(() => {
      // Go to the Dashboards list page
      cy.visit('app/dashboards/list')

      // Click the "Create dashboard" button
      cy.get('[data-test-subj="newItemButton"]', { timeout: 20000 }).should('be.visible').click()
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
      cy.get('[data-test-subj="savedObjectFinderFilterButton"]').should('be.visible').click()
      cy.get('[data-test-subj="savedObjectFinderFilter-visualization"]').should('be.visible').click()
      cy.get('[data-test-subj="savedObjectFinderFilterButton"]').should('be.visible').click()

      cy.get('[data-test-subj="savedObjectFinderSearchInput"]').should('be.visible').type('Filter Bytes Test')
      cy.get('[data-test-subj^="savedObjectTitleFilter-Bytes-Test:"]').should('be.visible').click({ multiple: true })
      cy.get('[data-test-subj="pagination-button-1"]').should('be.visible').click()
      cy.get('[data-test-subj^="savedObjectTitleFilter-Bytes-Test:"]').should('be.visible').click({ multiple: true })
      cy.get('[data-test-subj="euiFlyoutCloseButton"]').click()

      // Click the "Add" button and add all "Saved Searches"
      cy.get('[data-test-subj="dashboardAddPanelButton"]').should('be.visible').click()

      cy.get('[data-test-subj="savedObjectFinderFilterButton"]').should('be.visible').click()
      cy.get('[data-test-subj="savedObjectFinderFilter-search"]').should('be.visible').click()
      cy.get('[data-test-subj="savedObjectFinderFilterButton"]').should('be.visible').click()

      cy.get('[data-test-subj="savedObjectFinderSearchInput"]').should('be.visible').type('Filter Bytes Test')
      cy.get('[data-test-subj^="savedObjectTitleFilter-Bytes-Test:"]').should('be.visible').click({ multiple: true })

      cy.get('[data-test-subj="euiFlyoutCloseButton"]').click()

      // Add filter
      cy.get('[data-test-subj="addFilter"]').click()

      cy.get('[data-test-subj="filterFieldSuggestionList"]').find('[data-test-subj="comboBoxInput"]').type('bytes')
      cy.get('[data-test-subj="comboBoxOptionsList filterFieldSuggestionList-optionsList"]').find('[title="bytes"]').as('bytes').click()

      cy.get('[data-test-subj="filterOperatorList"]').find('[data-test-subj="comboBoxInput"]').type('is')
      cy.get('[data-test-subj="comboBoxOptionsList filterOperatorList-optionsList"]').find('[title="is"]').click({ force: true })

      cy.get('[data-test-subj="filterParams"]').find('input').type('12345678')
      cy.get('[data-test-subj="saveFilter"]').click()
      cy.get('[data-test-subj="filter filter-enabled filter-key-bytes filter-value-12,345,678 filter-unpinned "]').should('be.visible')
    })

    it('filters on pie charts', () => {
      // Check that none of the pie charts are occupied with data (show "No results found")
      cy.get('svg > g > g.arcs > path.slice').should('not.exist')
    })

    it('area, bar and heatmap charts filtered', () => {
      // Check that none of the charts are filled with data
      cy.get('svg > g > g.series').should('not.exist')
    })

    it('data tables are filtered', () => {
      // Check that none of the data tables are filled with data
      cy.get('[data-test-subj="paginated-table-body"] [data-cell-content]').should('not.exist')
    })

    it('goal and guages are filtered', () => {
      // Goal label should be 0, gauge label should be 0%
      cy.get('svg > g > g > text.chart-label').each(($el, index, $list) => {
        cy.get($el).contains(/^0%?$/)
      })
    })

    it('tsvb time series shows no data message', () => {
      // The no data message should be visible
      cy.get('[data-test-subj="noTSVBDataMessage"]').should('be.exist')
    })

    it('metric value shows no data', () => {
      // The metrics should show '-'
      cy.get('.mtrVis__value').each(($el, index, $list) => {
        cy.get($el).contains(/^ - $/)
      })
    })

    it('tag cloud values are filtered', () => {
      // cy.get('svg > g > g.series').should('not.exist')
    })

    it('tsvb metric is filtered', () => {
      // cy.get('svg > g > g.series').should('not.exist')
    })

    it('tsvb top n is filtered', () => {
      // cy.get('svg > g > g.series').should('not.exist')
    })

    it('saved search is filtered', () => {
      // cy.get('svg > g > g.series').should('not.exist')
    })

    // TODO: Uncomment once https://github.com/elastic/kibana/issues/22561 is fixed
    // it('timeline is filtered', async () => {
    //   await dashboardExpect.timelineLegendCount(0)
    // })

    it('vega is filtered', () => {
      // cy.get('svg > g > g.series').should('not.exist')
    })
  })

  describe('using a pinned filter that excludes all data', () => {
    before(() => {

    })
  })

  describe('disabling a filter unfilters the data on', () => {
    before(() => {

    })
    // cy.get('[data-test-subj="filter filter-enabled filter-key-bytes filter-value-12,345,678 filter-unpinned "]').click()
    // cy.get('[data-test-subj="deleteFilter"]').click()
    // cy.get('[data-test-subj="filter filter-enabled filter-key-bytes filter-value-12,345,678 filter-unpinned "]').should('not.exist')
    // cy.get('svg > g > g.series').should('exist')
  })

  describe('nested filtering', () => {
    before(() => {

    })
  })
})
