'use strict';

define(['jquery'], function($) {
  var SELECTOR_ITINERARY_PRICING_BLOCK = '.itineraryPricingBlock .bodyBlock .bodySection';
  var SELECTOR_MAINSTREAM_HEADER = '.expandedPart .mainstream .item';
  var SELECTOR_DETAILS_ROWS = '.expandedPart .detailedPrice tr';
  var SELECTOR_DESC_NAME = '.item';
  var SELECTOR_DESC_PRICE = '.price';
  var SELECTOR_TOTAL_PRICE_BLOCK = '.itineraryPricingBlock .bodyBlock .totalPrice .totalPriceRow';
  var SELECTOR_TP_LABEL = '.label';
  var SELECTOR_TP_PRICE = '.price';

  var ipHelper = {};

  /**
   * @return {Object[]}
   */
  ipHelper.getItineraryPriceInfo = function() {
    var itineraryPrices = [];
    $(SELECTOR_ITINERARY_PRICING_BLOCK).each(function(index, item) {
      itineraryPrices.push(getBlockDetails($(item)));
    });
    return itineraryPrices;
  }

  /**
   * @return {Object}
   *         {Object.label}
   *         {Object.price}
   */
  ipHelper.getItineraryTotalPrice = function() {
    var $block = $(SELECTOR_TOTAL_PRICE_BLOCK);
    return {
      label: $block.find(SELECTOR_TP_LABEL).text().trim(),
      price: $block.find(SELECTOR_TP_PRICE).text().trim(),
    };
  }

  return ipHelper;

  /**
   * @return {Object}
   */
  function getBlockDetails($el) {
    return {
      name: $el.find(SELECTOR_MAINSTREAM_HEADER).text().trim(),
      details: getDetails($el)
    }
  }

  /**
   * @return {Object[]}
   */
  function getDetails($el) {
    var details = [];
    $el.find(SELECTOR_DETAILS_ROWS).each(function(index, row) {
      var $row = $(row);
      details.push(getDescInfo($row));
    });
    return details;
  }

  /**
   * @return {Object}
   *      {Object.name}
   *      {Object.price}
   */
  function getDescInfo($el) {
    var priceField = $el.find(SELECTOR_DESC_PRICE).text().trim().split(' ');
    var priceValue = 0;
    if (priceField.length) {
      priceValue = priceField[priceField.length - 1];
    }
    return {
      name: $el.find(SELECTOR_DESC_NAME).text().trim(),
      price: priceValue,
    };
  }
});
