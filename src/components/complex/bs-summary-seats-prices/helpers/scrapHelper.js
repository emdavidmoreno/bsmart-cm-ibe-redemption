/* eslint-disable max-len */
define(['jquery'], function($jq) {
  'use strict'
  const BASE_SELECTOR = '#summaryBot_Top .expandedSection:eq(1)'
  // ----------------------- SEATS Info --------------------
  /**
   * @return {Array}
   */
  const getSeatsInfo = function() {
    let infoList = []
    $(`${BASE_SELECTOR} .detailedPrice tbody tr`)
      .each((index, tr) => {
        let info = $(tr).text().split('\n')
          .filter((t) => t.trim() !== '' )
          .map((t) => t.trim())

        const priceText = info[info.length - 1].split(' ')

        infoList.push({
          title: info[0],
          currencyCode: priceText[0],
          price: formatPrice(priceText[0], priceText[1]),
        })
      })
    return infoList
  }
  /**
   * @return {String}
   */
  const getTotalPrice = () => {
    return $(`${BASE_SELECTOR} .collapsedPart tbody .price .money`).text().trim()
  }
  /**
   * @return {Object}
   *         {String} .tittle
   *         {String} .link
   */
  const getHeaderInfo = () => {
    return {
      title: $(`${BASE_SELECTOR} .mainstream:last tbody tr .item:first`).text().trim(),
    }
  }
  /**
   *
   * @param {String} currency
   * @param {String} priceString
   * @return {String}
   */
  function formatPrice(currency, priceString) {
    let price
    if (priceString) {
      switch(currency) {
      case 'BRL':
        price = +priceString.replace(/\./g, '').replace(',', '.')
        break
      case 'CAD':
        price = +priceString.replace(/\,/g, '')
        break
      case 'COP':
        price = +priceString.replace(/\./g, '')
        break
      case 'CLP':
        price = +priceString.replace(/\,/g, '')
        break
      case 'ARS':
        price = +priceString.replace(/\./g, '').replace(',', '.')
        break
      default:
        price = +priceString.replace(/\,/g, '')
      }
    }
    return price
  }

  return {
    getSeatsInfo,
    getTotalPrice,
    getHeaderInfo,
  }
})
