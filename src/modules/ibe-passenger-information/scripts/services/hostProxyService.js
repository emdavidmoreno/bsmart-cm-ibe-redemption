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
      if($('.formCheckboxArea input[type="checkbox"]:checked').length == 0)
        $('.formCheckboxArea').find('input[type="checkbox"]').click();
    
      };

      return hostProxyService;
    }

  angular
      .module('responsiveBookingEngine')
      .factory('hostProxyService', hostProxyService);
})();
