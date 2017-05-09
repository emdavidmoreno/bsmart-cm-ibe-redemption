(function() {
  'use strict';

  function hostProxyService() {
      var hostProxyService = {};
      var scrapSelectors = {
        generalActions: {
          continueButton: '#pgButtonProceed span span'
        }
      };

      hostProxyService.getFormActionNodeSelector = function() {
        return scrapSelectors.generalActions.continueButton;
      };

      hostProxyService.clickToCheckedBox = function() {
        if($('.formCheckboxArea input[type="checkbox"]:checked').length !==1)
            $('.formCheckboxArea').find('input[type="checkbox"]').click();
        $('.formCheckboxArea').find('input[type="checkbox"]').val(1);
      };

      return hostProxyService;
    }

  angular
      .module('responsiveBookingEngine')
      .factory('hostProxyService', hostProxyService);
})();
