'use strict';

// add new properties to the angular configuration
require.config({
  context: "bs1.0.0",
  paths: {
    angular: '../../lib/angular/angular.min',
    assetsLoaderService: 'core/services/assetsLoaderService'
  },
  shim: {
    angular: {
      exports: 'angular'
    }
  }
});

/*global require*/
define([
  'require',
  'angular',
  './config',
  'assetsLoaderService',
], function(require, angular, Config, assetsLoaderService) {
  'use strict';

  var instance = {};

  instance.init = function(actionConfig) {

    // We need intialize controller and other assets here

    // loading css
    assetsLoaderService.loadCSS(Config.getConfig().stylesFilesPath);

    // this require is here instead to be in the define because we want
    // load the css before the scripts to COVER
    // the interface as soon as posible
    require(['./app'], function(App) {
      App.init(Config.getConfig(), actionConfig);
      var element = angular.element(document);
      //This will be truthy if initialized and falsey otherwise.
      var isInitialized = element.injector();
      if(!isInitialized) {
        function shouldSetTimer() {
          var result = true;
          $("#AIR_SEARCH_RESULT_CONTEXT_ID0 .colCost_CM_PROMO").each(function(i, e) {
            if(i > 0 && !$(e).hasClass("colCostNotAvail")) {
              result = false;
              return;
            }
          })
          return result;
        }
        // this is a quick fix for a critical bug. https://everymundo.atlassian.net/browse/BSMART-687
        if(shouldSetTimer()) {
          var timer = setInterval(function() {
            if($(".colCostSelected").length > 1) {
              angular.bootstrap(document, ['responsiveBookingEngine']);
              clearInterval(timer);
            }
          }, 100)
        }
        else {
          angular.bootstrap(document, ['responsiveBookingEngine']);
        }
        // intializing angular
      }
    });
  };
  return instance;
});
