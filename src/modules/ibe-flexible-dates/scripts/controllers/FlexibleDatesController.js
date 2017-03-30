// jshint -W003
'use strict';

define([
  'jquery',
  'angular',
 
  '../services/hostScrapService',
  '../services/hostProxyService',
  '../../../../scripts/filters/strDuration',
  '../../../../scripts/filters/strSimpleDate',
  '../../../../scripts/filters/sanitize',
  '../../../../scripts/filters/collUnique',
  '../../../../scripts/services/hostProxyService',
  '../../../../scripts/directives/jqui-dialog',
  'statsService',
  'lodash'
], function($, angular,  hostScrapService, hostProxyService,
  strDuration, strSimpleDate, sanitize, collUnique, appHostProxyService,
  jquiDialog, statsService, _) {

  var wrapperInstance = {};

  wrapperInstance.init = function(config, actionConfig) {
    wrapperInstance.config = config;
    wrapperInstance.actionConfig = actionConfig;
  };

  /**
   * Angular Controller
   * @author devs@everymundo.com
   */
  (function() {
    function FlexibleDatesController(
      $scope,
     
      hostScrapService,
      hostProxyService,
      $timeout,
      appHostProxyService,
      $filter,
      $sce
    ) {

      var instance = this;

      //-------------------------------------------------------
      // starting code
      //-------------------------------------------------------

      instance.init = function() {
        console.log('FlexibleDatesController init');
      };
      
      $scope.$parent.showMiniSummary = true;
      $scope.$parent.stepper.goToStep(0);
     // $scope.ui = ui;

      // app manipulation vars
      $scope.$parent.showLoading = false;

 
      //-------------------------------------------------------
      // listeners
      //-------------------------------------------------------
      instance.init();
      return instance;
    }

    FlexibleDatesController.$inject = [
      '$scope',
     
      'hostScrapService',
      'hostProxyService',
      '$timeout',
      'appHostProxyService',
      '$filter',
      '$sce'
    ];

    angular
        .module('responsiveBookingEngine')
      
        .filter('duration', strDuration)
        .filter('simpledate', strSimpleDate)
        .filter('sanitize', sanitize)
        .filter('unique', collUnique)
        .directive('jquiDialog', jquiDialog)
        .controller('FlexibleDatesController', FlexibleDatesController);

  })({});

  return wrapperInstance;
});
