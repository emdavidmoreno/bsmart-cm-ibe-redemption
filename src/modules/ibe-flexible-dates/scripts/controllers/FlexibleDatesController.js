// jshint -W003
'use strict'

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
  'lodash',
  '../../../../components/complex/bs-flexible-dates-prices/index.component',
], function($, angular, hostScrapService, hostProxyService,
  strDuration, strSimpleDate, sanitize, collUnique, appHostProxyService,
  jquiDialog, statsService, _, bsFlexibleDatesPricesComponent) {
  let wrapperInstance = {}

  wrapperInstance.init = function(config, actionConfig) {
    wrapperInstance.config = config
    wrapperInstance.actionConfig = actionConfig
  };

  /**
   * Angular Controller
   * @author devs@everymundo.com
   */
  (function() {
    /**
     * FlexibleDates Angular controller
     *
     * @param {Object} $scope
     * @param {Object} hostScrapService
     * @param {Object} hostProxyService
     * @param {Function} $timeout
     * @param {Object} appHostProxyService
     * @param {Function} $filter
     * @param {Function} $sce
     *
     * @return {Object}
     */
    function FlexibleDatesController(
      $scope,
      hostScrapService,
      hostProxyService,
      $timeout,
      appHostProxyService,
      $filter,
      $sce
    ) {
      let instance = this

      // -------------------------------------------------------
      // starting code
      // -------------------------------------------------------

      instance.init = function() {
        console.log('FlexibleDatesController init')
      }

      $scope.$parent.showMiniSummary = true
      $scope.$parent.stepper.goToStep(0)

      // allow to farenet bring back the prices html nodes to
      Farenet2.verbose = 1
      // populate the model with the Farenet values
      let model = Farenet2.parse()
      let ui = {
        model,
      }

      $scope.ui = ui

      // app manipulation vars
      $scope.$parent.showLoading = false


      // -------------------------------------------------------
      // listeners
      // -------------------------------------------------------
      instance.init()
      return instance
    }

    FlexibleDatesController.$inject = [
      '$scope',
      'hostScrapService',
      'hostProxyService',
      '$timeout',
      'appHostProxyService',
      '$filter',
      '$sce',
    ]

    angular
        .module('responsiveBookingEngine')
        .filter('duration', strDuration)
        .filter('simpledate', strSimpleDate)
        .filter('sanitize', sanitize)
        .filter('unique', collUnique)
        .directive('jquiDialog', jquiDialog)
        .component('bsFlexibleDatesPricesComponent',
          bsFlexibleDatesPricesComponent
        )
        .controller('FlexibleDatesController', FlexibleDatesController)
  })({})

  return wrapperInstance
})
