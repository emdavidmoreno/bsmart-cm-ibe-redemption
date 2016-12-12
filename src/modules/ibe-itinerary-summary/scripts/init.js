// add new properties to the angular configuration
require.config({
  context: "bs1.0.0",
  paths: {
    angular: '../../lib/angular/angular.min',
    assetsLoaderService: '../../../../../core/services/assetsLoaderService'
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

      // intializing angular
      angular.bootstrap(document, ['responsiveBookingEngine']);
    });
  };
  return instance;
});
