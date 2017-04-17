define(['jquery'], function($jq) {
  'use strict'
  // selectors
  let SELECTOR_CELLS = 'td[onclick],.notAvail'
  let SELECTOR_HEADERS = 'table.calendarTable th'

  return {
    getTableData: function() {
      let days = []
      let prices = []

      $(SELECTOR_HEADERS).each((index, el) => {
        let header = $(el).text().trim()
        days.push(header)
      })

      $(SELECTOR_CELLS).each((index, el) => {
        let $el = $(el)
        let mprice = 'N/D'
        let isSelected = false

        if(!$el.is('.notAvail')) {
          mprice = $el.has('div.colPrice').text().trim()
          isSelected = $el.is('.selected')
        }

        if (index % 7 == 0) {
          prices.push([])
        }

        prices[prices.length -1].push({
          price: mprice, isSelected,
          jqElement: $el,
          onClick: function() {
            this.jqElement[0].click()
          }})
      })
      let priceCalendar = {m_days: days, m_prices: prices}
      return priceCalendar
    },
  }
})

