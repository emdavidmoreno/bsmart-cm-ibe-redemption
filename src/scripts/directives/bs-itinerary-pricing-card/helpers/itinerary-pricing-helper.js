/* eslint-disable max-len */
'use strict'

define(['jquery'], function($) {
  let SELECTOR_ITINERARY_PRICING_BLOCK = '.itineraryPricingBlock .bodyBlock .bodySection:first'
  let SELECTOR_MAINSTREAM_HEADER = '.expandedPart .mainstream .item'
  let SELECTOR_DETAILS_ROWS = '.expandedPart .detailedPrice tr'
  let SELECTOR_DESC_NAME = '.item'
  let SELECTOR_DESC_PRICE = '.price'
  let SELECTOR_TOTAL_PRICE_BLOCK = '.itineraryPricingBlock .bodyBlock .totalPrice .totalPriceRow'
  let SELECTOR_TP_LABEL = '.label'
  let SELECTOR_TP_PRICE = '.price'

  let ipHelper = {}

  /**
   * @return {Object[]}
   */
  ipHelper.getItineraryPriceInfo = function() {
    let itineraryPrices = []
    $(SELECTOR_ITINERARY_PRICING_BLOCK).each(function(index, item) {
      itineraryPrices.push(getBlockDetails($(item)))
    })
    return itineraryPrices
  }

  /**
   * @return {Object}
   *         {Object.label}
   *         {Object.price}
   */
  ipHelper.getItineraryTotalPrice = function() {
    let $block = $(SELECTOR_TOTAL_PRICE_BLOCK)
    return {
      label: $block.find(SELECTOR_TP_LABEL).text().trim(),
      price: $block.find(SELECTOR_TP_PRICE).text().trim(),
    }
  }

  return ipHelper

  /**
   * @param {Object} $el
   * @return {Object}
   */
  function getBlockDetails($el) {
    return {
      name: $el.find(SELECTOR_MAINSTREAM_HEADER).text().trim(),
      details: getDetails($el),
    }
  }

  /**
   * @param {Object} $el
   * @return {Object[]}
   */
  function getDetails($el) {
    let details = []
    $el.find(SELECTOR_DETAILS_ROWS).each(function(index, row) {
      let $row = $(row)
      details.push(getDescInfo($row))
    })
    return details
  }

  /**
   * @param {Object} $el
   * @return {Object}
   *      {Object.name}
   *      {Object.price}
   */
  function getDescInfo($el) {
    let priceField = $el.find(SELECTOR_DESC_PRICE).text().trim().split(' ')
    let priceValue = 0
    if (priceField.length) {
      priceValue = priceField[priceField.length - 1]
    }
    return {
      name: $el.find(SELECTOR_DESC_NAME).text().trim(),
      price: priceValue,
    }
  }
})
