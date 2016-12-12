(function() {
  'use strict';

  function hostProxyService() {
      var hostProxyService = {};
      var scrapSelectors = {
        generalActions: {
          continueButton: '#pgButtonProceed'
        }
      };

      hostProxyService.getFormActionNodeSelector = function() {
        return scrapSelectors.generalActions.continueButton;
      };

      return hostProxyService;
    }

  angular
      .module('responsiveBookingEngine')
      .factory('hostProxyService', hostProxyService);
})();
