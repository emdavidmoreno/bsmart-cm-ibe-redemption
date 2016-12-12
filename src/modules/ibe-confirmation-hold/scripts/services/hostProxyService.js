(function() {
  'use strict';

  function hostProxyService() {
      var hostProxyService = {};
      var scrapSelectors = {
        generalActions: {
          continueButton: '#fbButtonSend'
        }
      };

      hostProxyService.getFormActionNodeSelector = function() {
        return scrapSelectors.generalActions.continueButton;
      };

      hostProxyService.acceptInformationContinueAction = function(){
        $(scrapSelectors.generalActions.acceptInformationContinue).click();
      };

      return hostProxyService;
  }

  angular
      .module('responsiveBookingEngine')
      .factory('hostProxyService', hostProxyService);
})();
