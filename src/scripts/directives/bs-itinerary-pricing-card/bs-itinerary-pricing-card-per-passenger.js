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
  function bsItineraryPricingCardPerPassenger ($sce) {
    return {
      restrict: 'EA',
      scope: {
        ui: '='
      },
      replace: true,
      template: tmplHelper.templatePerPassenger,
      link: function(scope/*, element, attrs*/) {
        var priceInfoList = ipHelper.getItineraryPriceInfo()
        if (priceInfoList.length <= 1) {
          return
        }
        var InsuranceInfo = priceInfoList[1]
        if (!scope.ui.insurance) {
          scope.ui.insurance = {
            head: '',
            body: {}
          }
        }
        scope.ui.insurance.head = InsuranceInfo.name
        scope.ui.insurance.price =
          parseFloat(InsuranceInfo.details[0].price)
      }
    };
  }

  bsItineraryPricingCardPerPassenger.$inject = [];

  return bsItineraryPricingCardPerPassenger;
});
