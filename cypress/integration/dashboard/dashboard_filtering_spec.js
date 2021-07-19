/**
 * Current runtime - 76.46 seconds
 * New runtime - 114.31 seconds
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
      cy.setDashboardDataRange('Apr 13, 2018 @ 00:00:00.000', 'Jan 1, 2018 @ 00:00:00.000')

      // Add all "Filter Bytes Test" visualizations
      cy.addDashboardPanels('Filter Bytes Test', 'visualization', true)

      // Click the "Add" button and add all "Saved Searches"
      cy.addDashboardPanels('Filter Bytes Test', 'search', false)

      // Add filter
      cy.addDashboardFilter('bytes', 'is', '12345678')

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
      cy.get('svg > g > g > text.chart-label').should('be.length', 2).each(($el, index, $list) => {
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
      cy.get('[data-test-subj="tagCloudVisualization"]').each(($el, index, $list) => {
        cy.get($el).find('svg > g > text').should('not.exist')
      })
    })

    it('tsvb metric is filtered', () => {
      cy.get('[data-test-subj="tsvbMetricValue"]').each(($el, index, $list) => {
        cy.get($el).contains(/^0 custom template$/)
      })
    })

    it('tsvb top n is filtered', () => {
      cy.get('[data-test-subj="tsvbTopNValue"]').should('be.length', 2).each(($el, index, $list) => {
        cy.get($el).contains(/^0$/)
      })
    })

    it('saved search is filtered', () => {
      cy.get('[data-test-subj="docTableExpandToggleColumn"]').should('not.exist')
    })

    // TODO: Uncomment once https://github.com/elastic/kibana/issues/22561 is fixed
    // it('timeline is filtered', async () => {
    //   await dashboardExpect.timelineLegendCount(0)
    // })

    it('vega is filtered', () => {
      cy.get('.vgaVis__view text').each(($el, index, $list) => {
        cy.get($el).should('not.contain', /^5,000$/)
      })
    })
  })

  describe('using a pinned filter that excludes all data', () => {
    before(() => {
      cy.get('[data-test-subj="filter filter-enabled filter-key-bytes filter-value-12,345,678 filter-unpinned "]').click()
      cy.get('[data-test-subj="pinFilter"]').click()
    })

    after(() => {
      cy.get('[data-test-subj="filter filter-enabled filter-key-bytes filter-value-12,345,678 filter-pinned "]').click()
      cy.get('[data-test-subj="pinFilter"]').click()
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
      cy.get('svg > g > g > text.chart-label').should('be.length', 2).each(($el, index, $list) => {
        cy.get($el).contains(/^0%?$/)
      })
    })

    it('metric value shows no data', () => {
      // The metrics should show '-'
      cy.get('.mtrVis__value').each(($el, index, $list) => {
        cy.get($el).contains(/^ - $/)
      })
    })

    it('tag cloud values are filtered', () => {
      cy.get('[data-test-subj="tagCloudVisualization"]').each(($el, index, $list) => {
        cy.get($el).find('svg > g > text').should('not.exist')
      })
    })

    it('tsvb metric is filtered', () => {
      cy.get('[data-test-subj="tsvbMetricValue"]').each(($el, index, $list) => {
        cy.get($el).contains(/^0 custom template$/)
      })
    })

    it('tsvb top n is filtered', () => {
      cy.get('[data-test-subj="tsvbTopNValue"]').should('be.length', 2).each(($el, index, $list) => {
        cy.get($el).contains(/^0$/)
      })
    })

    it('saved search is filtered', () => {
      cy.get('[data-test-subj="docTableExpandToggleColumn"]').should('not.exist')
    })

    // TODO: Uncomment once https://github.com/elastic/kibana/issues/22561 is fixed
    // it('timeline is filtered', async () => {
    //   await dashboardExpect.timelineLegendCount(0)
    // })

    it('vega is filtered', () => {
      cy.get('.vgaVis__view text').each(($el, index, $list) => {
        cy.get($el).should('not.contain', /^5,000$/)
      })
    })
  })

  describe('disabling a filter unfilters the data on', () => {
    before(() => {
      cy.get('[data-test-subj="filter filter-enabled filter-key-bytes filter-value-12,345,678 filter-unpinned "]').click()
      cy.get('[data-test-subj="deleteFilter"]').click()
      cy.get('[data-test-subj="filter filter-enabled filter-key-bytes filter-value-12,345,678 filter-unpinned "]').should('not.exist')
    })

    it('pie charts', () => {
      // Check that there are 5 slice in the  pie charts
      cy.get('svg > g > g.arcs > path.slice').should('be.length', 5)
    })

    it('area, bar and heatmap charts', () => {
      // Check that there are 3 charts
      cy.get('svg > g > g.series').should('be.length', 3)
    })

    it('data tables', () => {
      // Check that there are 10 table rows
      cy.get('[data-test-subj="paginated-table-body"] [data-cell-content]').should('be.length', 10)
    })

    it('goal and guages', () => {
      // Goal label should be 7,544, gauge label should be 39.958%%
      cy.get('svg > g > g > text.chart-label').should('be.length', 2).each(($el, index, $list) => {
        // to do
        cy.get($el).contains(/^(7,544)|(39.958%)$/)
      })
    })

    it('metric value', () => {
      // The metrics should show '101'
      cy.get('.mtrVis__value').each(($el, index, $list) => {
        cy.get($el).contains(/^101$/)
      })
    })

    it('tag cloud', () => {
      cy.get('[data-test-subj="tagCloudVisualization"]').each(($el, index, $list) => {
        cy.get($el).find('svg > g > text').contains(/^9,972|4,886|1,944|9,025$/)
      })
    })

    it('tsvb metric', () => {
      cy.get('[data-test-subj="tsvbMetricValue"]').each(($el, index, $list) => {
        cy.get($el).contains(/^50,465 custom template$/)
      })
    })

    it('tsvb top n', () => {
      cy.get('[data-test-subj="tsvbTopNValue"]').should('be.length', 2).each(($el, index, $list) => {
        cy.get($el).contains(/^6,308.125$/)
      })
    })
    it('tsvb markdown', () => {
      cy.get('[data-test-subj="tsvbMarkdown"]').should('be.length', 1).each(($el, index, $list) => {
        cy.get($el).contains(/^7,209.286$/)
      })
    })
    it('saved search is filtered', () => {
      cy.get('[data-test-subj="docTableExpandToggleColumn"]').should('be.length', 1)
    })

    // TODO: Uncomment once https://github.com/elastic/kibana/issues/22561 is fixed
    // it('timeline is filtered', async () => {
    //   await dashboardExpect.timelineLegendCount(0)
    // })

    it('vega is filtered', () => {
      cy.get('.vgaVis__view text').each(($el, index, $list) => {
        // To do: need to figure out way to check that a 5,000 exists, rather than checking each
        // scy.get($el).contains(/^5,000$/)
      })
    })
  })

  describe('nested filtering', () => {
    before(() => {
      // Go to the Dashboards list page
      cy.visit('app/dashboards/list')
    })
    it('visualization saved with a query filters data', () => {
      // Click the "Create dashboard" button
      cy.get('[data-test-subj="newItemButton"]', { timeout: 20000 }).should('be.visible').click()
      cy.get('[data-test-subj="emptyDashboardWidget"]').should('be.visible')
      // Change the time to be between Jan 1 2018 and Apr 13, 2018
      cy.setDashboardDataRange('Apr 13, 2018 @ 00:00:00.000', 'Jan 1, 2018 @ 00:00:00.000')

      cy.addDashboardPanels('Rendering Test: animal sounds pie', 'visualization', false)

      cy.get('svg > g > g.arcs > path.slice').should('be.length', 5)

      cy.get('[data-test-subj="embeddablePanelToggleMenuIcon"]').click()
      cy.get('[data-test-subj="embeddablePanelAction-editPanel"]').click()

      cy.get('[data-test-subj="queryInput"]').type('{selectall}weightLbs:>50')
      cy.get('[data-test-subj="querySubmitButton"]').click()
      cy.get('svg > g > g.arcs > path.slice').should('be.length', 3)

      cy.get('[data-test-subj="visualizeSaveButton"]').click()
      cy.get('[data-test-subj="savedObjectTitle"]').type('{selectall}Rendering Test: animal sounds pie')
      cy.get('[data-test-subj="saveAsNewCheckbox"]').click()
      cy.get('[data-test-subj="returnToOriginModeSwitch"]').click()
      cy.get('[data-test-subj="confirmSaveSavedObjectButton"]').click()

      cy.get('[data-test-subj="toggleNavButton"]').click()
      cy.get('[data-test-subj="collapsibleNavAppLink"]').contains('Dashboard').click()
      cy.get('svg > g > g.arcs > path.slice').should('be.length', 3)
    })

    it('Nested visualization filter pills filters data as expected', () => {
      cy.get('[data-test-subj="embeddablePanelToggleMenuIcon"]').click()
      cy.get('[data-test-subj="embeddablePanelAction-editPanel"]').click()

      cy.get('[data-test-subj="pieSlice-grr"]').click()
      cy.get('svg > g > g.arcs > path.slice').should('be.length', 1)

      // === to the saveVisualizationExpectSuccess function
      cy.get('[data-test-subj="visualizeSaveButton"]').click()
      cy.get('[data-test-subj="savedObjectTitle"]').type('{selectall}animal sounds pie')
      cy.get('[data-test-subj="saveAsNewCheckbox"]').click()
      cy.get('[data-test-subj="returnToOriginModeSwitch"]').click()
      cy.get('[data-test-subj="confirmSaveSavedObjectButton"]').click()

      cy.get('[data-test-subj="toggleNavButton"]').click()
      cy.get('[data-test-subj="collapsibleNavAppLink"]').contains('Dashboard').click()
      cy.get('svg > g > g.arcs > path.slice').should('be.length', 1)
    })

    it('Removing filter pills and query unfiters data as expected', () => {
      cy.get('[data-test-subj="embeddablePanelToggleMenuIcon"]').click()
      cy.get('[data-test-subj="embeddablePanelAction-editPanel"]').click()

      cy.get('[data-test-subj="queryInput"]').type('{selectall}{backspace}')
      cy.get('[data-test-subj="querySubmitButton"]').click()

      cy.get('[data-test-subj="filter filter-enabled filter-key-sound.keyword filter-value-grr filter-unpinned "]').click()
      cy.get('[data-test-subj="deleteFilter"]').click()

      cy.get('svg > g > g.arcs > path.slice').should('be.length', 5)

      cy.get('[data-test-subj="visualizeSaveButton"]').click()
      cy.get('[data-test-subj="savedObjectTitle"]').type('{selectall}Rendering Test: animal sounds pie')
      cy.get('[data-test-subj="saveAsNewCheckbox"]').click()
      cy.get('[data-test-subj="returnToOriginModeSwitch"]').click()
      cy.get('[data-test-subj="confirmSaveSavedObjectButton"]').click()

      cy.get('[data-test-subj="toggleNavButton"]').click()
      cy.get('[data-test-subj="collapsibleNavAppLink"]').contains('Dashboard').click()
      cy.get('svg > g > g.arcs > path.slice').should('be.length', 5)
    })
    it('Pie chart linked to saved search filters data', () => {
      cy.get('[data-test-subj="dashboardAddPanelButton"]').should('be.visible').click()

      cy.get('[data-test-subj="savedObjectFinderFilterButton"]').should('be.visible').click()
      cy.get('[data-test-subj="savedObjectFinderFilter-visualization"]').should('be.visible').click()
      cy.get('[data-test-subj="savedObjectFinderFilterButton"]').should('be.visible').click()

      cy.get('[data-test-subj="savedObjectFinderSearchInput"]').should('be.visible').type('Filter Test: animals: linked to search with filter')
      cy.get('[data-test-subj="savedObjectTitleFilter-Test:-animals:-linked-to-search-with-filter"]').should('be.visible').click({ multiple: true })
      cy.get('[data-test-subj="euiFlyoutCloseButton"]').click()
      cy.get('svg > g > g.arcs > path.slice').should('be.length', 7)
    })

    it('Pie chart linked to saved search filters shows no data with conflicting dashboard query', () => {
      cy.get('[data-test-subj="queryInput"]').type('{selectall}weightLbs<40')
      cy.get('[data-test-subj="querySubmitButton"]').click()
      cy.get('svg > g > g.arcs > path.slice').should('be.length', 5)
    })
  })
})
