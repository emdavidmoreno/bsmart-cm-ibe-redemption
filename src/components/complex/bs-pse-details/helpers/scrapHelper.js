define(['jquery'], function($jq) {
  'use strict'
  // selectors
  let SELECTOR_CELLS = '.blockPseDetails .componentDetails tbody td'
  let SELECTOR_CELLS_H = '.blockPseDetails .componentHeader'

  return {
    /**
     * @return {Array.<Object>}
     */
    getPseDetails: function() {
      let cells = []
      $jq(SELECTOR_CELLS).each((index, el) => {
        const textList = $jq(el).text().trim().split(':')
        if(textList.length > 1) {
          cells.push({
            name: textList[0],
            value: textList[1],
          })
        }
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
