define(['jquery'], function($jq) {
  'use strict'
  // selectors
  let SELECTOR_CELLS = '.lowest'

  return {
    getCells: function() {
      let cells = {
        inboundDates: {},
        outboundDates: {},
      }
      $(SELECTOR_CELLS).each((index, el) => {
        let $el = $(el)
        let [outboundDate, inboundDate] =
          $el.attr('onclick').match(/.*\'(.*)\'.*\'(.*)\'/).slice(1)

        let price = $el.has('div.colPrice').text().trim()
        let isSelected = $el.is('.selected')
        let msOutboundDate = Date.parse(outboundDate)

        if(!cells.outboundDates.hasOwnProperty(msOutboundDate)) {
          cells.outboundDates[msOutboundDate] = []
        }
        cells.inboundDates[Date.parse(inboundDate)] = {}

        cells.outboundDates[msOutboundDate].push({
          inboundDate,
          price,
          isSelected,
          jqElement: $el,
          onClick: function() {
            this.jqElement[0].click()
          },
        })
      })
      return cells
    },
  }
})
