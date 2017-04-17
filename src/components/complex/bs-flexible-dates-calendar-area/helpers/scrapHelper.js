define(['jquery'], function($jq) {
  'use strict'
  // selectors
  // eslint-disable-next-line
  const TABS_DATE_SELECTOR = '#bodyBlock_0 .calendarTabsArea [role="listitem"],#bodyBlock_0 .calendarTabsArea [role="tab"]'
  /**
   * @return {String}
   */
  function getYear() {
    // Ex: Miami (MIA), Florida, Estados Unidos de América -
    //      Bogotá (BOG), Colombia - sáb abr 15 2017
    return $('#headBlock_0').text().trim().split('-')
      .slice(-1)[0] // get the date: 'sáb abr 15 2017'
      .trim().split(' ').slice(-1)[0] // get year
  }
  /**
   * getDateAsTimestamp
   *
   * @param {String} knowYear
   * @param {String} partialDate
   * @return {int}
   */
  function getDateAsTimestamp(knowYear, partialDate) {
    const [, month, day] = partialDate.split(' ')
    return (
      new Date(
        parseInt(knowYear),
        convertMonthToNumber(month),
        parseInt(day))
      ).getTime()
  }

  /**
   * convertPrice
   * @param {String} priceString
   * @return {Number}
   */
  function convertPrice(priceString) {
    let priceText = priceString.trim()

    let fractionRegExp = /\,(?=\d{2}\b)/g
    let separatorsRegExp = /(?!\d{1})([.,\s])(?=\d{3})/g
    let extraCharRegExp = /[^.0-9]/g

    return +priceText.replace(separatorsRegExp)
      .replace(fractionRegExp, '.')
      .replace(extraCharRegExp, '')
  }


  /**
   *
   * @param {String} month
   * @return {int} month number
   */
  function convertMonthToNumber(month) {
    month = month.toLowerCase().trim()

    // months in english, portugese, spanish formats
    if (month === 'jan' || month === 'jan' || month === 'ene') return 0
    if (month === 'feb' || month === 'fev' || month === 'feb') return 1
    if (month === 'mar' || month === 'mar' || month === 'mar') return 2
    if (month === 'apr' || month === 'abr' || month === 'abr') return 3
    if (month === 'may' || month === 'mai' || month === 'may') return 4
    if (month === 'jun' || month === 'jun' || month === 'jun') return 5
    if (month === 'jul' || month === 'jul' || month === 'jul') return 6
    if (month === 'aug' || month === 'ago' || month === 'ago') return 7
    if (month === 'sep' || month === 'set' || month === 'set') return 8
    if (month === 'oct' || month === 'out' || month === 'oct') return 9
    if (month === 'nov' || month === 'nov' || month === 'nov') return 10
    if (month === 'dec' || month === 'dez' || month === 'dic') return 11

    return (new Date()).getMonth()
  }
  /**
   * @return {Object}
   */
  function getTabsInfo() {
    const $tabs = $(TABS_DATE_SELECTOR)
    let tabsInfo = {}
    const year = getYear()

    $tabs.each((index, elem) => {
      let $elem = $(elem)
      const isDisabledTab = $elem.is('.disabledTab')
      const selected = $elem.is('.selectedTab')
      const date = getDateAsTimestamp(
        year,
        $elem.find('span.date').text().trim()
      )
      const priceText = $elem.find('span.price').text().trim()
      let lowerPrice = convertPrice(priceText)
      if(lowerPrice === 0) {
        lowerPrice = priceText
      }
      tabsInfo[date] = {
        isDisabledTab,
        selected,
        lowerPrice,
        hostTab: $elem,
        onClick: function() {
          if(!this.isDisabledTab && !this.selected) {
            this.hostTab.children().first()[0].click()
          }
        },
      }
    })
    return tabsInfo
  }

  return {
    getTabsInfo,
  }
})
