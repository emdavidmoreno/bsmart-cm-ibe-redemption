/* jshint browser:true */
/* jshint -W003*/
'use strict';
define([
  'jquery',
  './helpers/itinerary-pricing-helper',
  './helpers/template-string-helper',
  'angular'
], function($, ipHelper, tmplHelper) {
  /**
   * Angular directive
   */
  function bsItineraryPricingCard ($sce) {
    return {
      restrict: 'EA',
      scope: {
        ui: '='
      },
      replace: true,
      template: tmplHelper.template,
      link: function(scope /*, element, attrs*/) {
        var priceInfoList = ipHelper.getItineraryPriceInfo()
        if (priceInfoList.length <= 1) {
          return
        }
        var InsuranceInfo = priceInfoList[1]
        var totalPassengers = 0
        for (var p in scope.ui.passengers) {
          totalPassengers += scope.ui.passengers[p];
        }
        if (!scope.ui.insurance) {
          scope.ui.insurance = {}
        }
        scope.ui.insurance.head = InsuranceInfo.name
        scope.ui.insurance.body = {}
        var insuranceTotalPrice = parseFloat(InsuranceInfo.details[0].price)
        scope.ui.insurance.price_per_passenger =
          (insuranceTotalPrice / totalPassengers)
      }
    };
  }

  bsItineraryPricingCard.$inject = [];

  return bsItineraryPricingCard;
});
