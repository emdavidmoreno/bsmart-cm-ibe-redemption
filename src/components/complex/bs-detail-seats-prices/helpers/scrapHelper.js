/* eslint-disable max-len */
define(['jquery'], function($jq) {
  'use strict'
  const BASE_SELECTOR = '[aria-labelledby="idBlockExtraServicesTitle_ancillaryComponents.seats.block.title"]'
  // ----------------------- SEATS Info --------------------
  /**
   * @return {Array}
   */
  const getSeatsInfo = function() {
    let infoList = []
    $(`${BASE_SELECTOR} .detailsTable tbody tr`)
      .each((index, tr) => {
        let info = $(tr).text().split('\n')
          .filter((t) => t.trim() !== '' )
          .map((t) => t.trim())

        const details = info.slice(1, info.length - 1).join(',')
        const priceText = info[info.length - 1].split(' ')

        infoList.push({
          title: info[0],
          currencyCode: priceText[0],
          price: priceText[1],
          details,
        })
      })
    return infoList
  }
  /**
   * @return {String}
   */
  const getTotalPrice = () => {
    return $(`${BASE_SELECTOR} .componentTotal tbody .colTotal .money`).text().trim()
  }
  /**
   * @return {Object}
   *         {String} .tittle
   *         {String} .link
   */
  const getHeaderInfo = () => {
    return {
      title: $(`${BASE_SELECTOR} .componentHeader h2`).text().trim(),
      link: $(`${BASE_SELECTOR} .componentHeader .links`).html(),
    }
  }

  return {
    getSeatsInfo,
    getTotalPrice,
    getHeaderInfo,
  }
})
