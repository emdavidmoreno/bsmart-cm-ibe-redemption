(function() {
  function hostProxyService() {
    var hostProxyService = {};
    var scrapSelectors = {
      generalActions: {
        continueButton: '#pgButtonNext'
      }
    };

    hostProxyService.getFormActionNodeSelector = function(){
      return scrapSelectors.generalActions.continueButton;
    }

    hostProxyService.getFormActionNodeSelector = function(){
      return scrapSelectors.generalActions.continueButton;
    }

    // Object: insuranceComponent
    //  fn: updatingSelectedMerchandizingInsuranceTotalPrice
    window.___privWrapUpdatingSelectedMerchandizingInsuranceTotalPrice
      = window.updatingSelectedMerchandizingInsuranceTotalPrice;
    /**
     *
     * @param {Mixed} error if null no have error in the request, otherwise contain
     *        the message with error
     * @param {Mixed} value requested
     */
    var __handlerInsurance = function(/*error, success*/) {};
    /**
     * Set the handler
     *
     * @param {Function} callback
     */
    hostProxyService.setHandlerInsurance = function(callback) {
      __handlerInsurance = callback;
    };

    function fakeInsuranceTotalPrice() {
      var args = [].slice.call(arguments);
      window.
        ___privWrapUpdatingSelectedMerchandizingInsuranceTotalPrice
        .apply(window, args);

      var insuranceTotalPriceMerch = $('#SELECTED_INSURANCE_TOTAL_PRICE_MERCH')
        .text().trim().split(' ');
      var insuranceSummarySelector =
        $('.bodySection.expandedSection:nth-child(2) .expandedPart');

      var insurance = {
        totalPriceMerch: 0,
        head: null,
        body: null
      };

      if (insuranceTotalPriceMerch.length > 1) {
        insurance.totalPriceMerch = insuranceTotalPriceMerch[1];
        insurance.head =
          insuranceSummarySelector.find('.mainstream td.item').text().trim();
        var insurancePrice = insuranceSummarySelector
          .find('.detailedPrice td.price').text().trim().split(' ');
        insurance.body = {
          detail: insuranceSummarySelector.find('.detailedPrice td.item').html(),
          price: insurancePrice[insurancePrice.length - 1]
        };
      }

      __handlerInsurance(insurance);
    }

    hostProxyService.activateMockForInsurance = function() {
      window.___privWrapUpdatingSelectedMerchandizingInsuranceTotalPrice
        = window.updatingSelectedMerchandizingInsuranceTotalPrice;
      window.updatingSelectedMerchandizingInsuranceTotalPrice
        = fakeInsuranceTotalPrice.bind(window);
    }

    hostProxyService.deactivateMockForInsurance = function() {
      window.updatingSelectedMerchandizingInsuranceTotalPrice
        = window.___privWrapUpdatingSelectedMerchandizingInsuranceTotalPrice;
      window.___privWrapUpdatingSelectedMerchandizingInsuranceTotalPrice
        = null;
    }

    return hostProxyService;
  }

  angular
    .module('responsiveBookingEngine')
    .factory('hostProxyService', hostProxyService);
})();
