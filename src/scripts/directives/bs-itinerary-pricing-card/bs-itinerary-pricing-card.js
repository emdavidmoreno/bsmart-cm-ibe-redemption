'use strict'
define([
  'jquery',
  './helpers/itinerary-pricing-helper',
  './helpers/template-string-helper',
  'angular',
], function($, ipHelper, tmplHelper) {
  /**
   * Angular directive
   *
   * @param {Object} $sce
   * @return {Object}
   */
  function bsItineraryPricingCard($sce) {
    return {
      restrict: 'EA',
      scope: {
        ui: '=',
      },
      replace: true,
      template: tmplHelper.template,
      link: function(scope /* , element, attrs*/) {
        let priceInfoList = ipHelper.getItineraryPriceInfo()
        if (priceInfoList.length <= 1) {
          return
        }
        let InsuranceInfo = priceInfoList[1]
        let totalPassengers = 0
        // eslint-disable-next-line
        for (let p in scope.ui.passengers) {
          totalPassengers += scope.ui.passengers[p]
        }
        if (!scope.ui.insurance) {
          scope.ui.insurance = {}
        }
        scope.ui.insurance.head = InsuranceInfo.name
        scope.ui.insurance.body = {}
        let insuranceTotalPrice = parseFloat(InsuranceInfo.details[0].price)
        scope.ui.insurance.price_per_passenger =
          (insuranceTotalPrice / totalPassengers)
      },
    }
  }

  bsItineraryPricingCard.$inject = []

  return bsItineraryPricingCard
})
