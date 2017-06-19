define(['jquery'], function($jq) {
  'use strict'
  // selectors
  let SELECTOR_CELLS_FIRST =
    '.blockBankTransferDetails .componentDetails tbody td.colFirst'
  let SELECTOR_CELLS_LAST =
    '.blockBankTransferDetails .componentDetails tbody td.colLast'
  let SELECTOR_CELLS_H = '.blockBankTransferDetails .componentHeader'

  return {
    /**
     * @return {Array.<Object>}
     */
    getBankTransferDetails: function() {
      let cells = []
      const colLastList = $jq(SELECTOR_CELLS_LAST)
      const colFirstList = $jq(SELECTOR_CELLS_FIRST)
      colFirstList.each((index, el) => {
        const name = $jq(el).text().trim().replace(':', '')
        const value = colLastList.eq(index)
          .text()
          .trim().replace(':', '')
        cells.push({
          name,
          value,
        })
      })
      return cells
    },
    /**
     * @return {String}
     */
    getHeaderName: function() {
      return $(SELECTOR_CELLS_H).text().trim()
    },
  }
})
