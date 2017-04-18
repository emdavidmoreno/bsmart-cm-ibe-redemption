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
  '../../../../components/complex/bs-flexible-dates-calendar-area/index.component', // eslint-disable-line
  '../../../../components/complex/bs-btn-continue/index.component',
  '../../../../components/complex/bs-search-result/index.component',
], function ($, angular, hostScrapService, hostProxyService,
  strDuration, strSimpleDate, sanitize, collUnique, appHostProxyService,
  jquiDialog, statsService, _, bsFlexibleDatesCalendarAreaComponent,
  bsBtnContinueComponent, bsSearchResultComponent) {
    let wrapperInstance = {}

    wrapperInstance.init = function (config, actionConfig) {
      wrapperInstance.config = config
      wrapperInstance.actionConfig = actionConfig
    };

    /**
     * Angular Controller
     * @author devs@everymundo.com
     */
    (function () {
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
      function FlexibleDatesOneWayController(
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

        instance.init = function () {
          console.log('FlexibleDatesOneWayController init')
        }

        $scope.$parent.showMiniSummary = true
        $scope.$parent.stepper.goToStep(1)


        // allow to farenet bring back the prices html nodes to
        Farenet2.verbose = 1
        // populate the model with the Farenet values
        let model = Farenet2.parse()
        let ui = {
          model,
          pageTitle: hostScrapService.getPageTitle(),
          commentBlock: hostScrapService.getCommentBlock(),
          message: hostScrapService.getMsg(),
          states: {},
          updateStates: (states) => {
            $timeout(() => {
              $scope.ui.states = angular.merge({}, $scope.ui.states, states)
              if (states.showLoading) {
                $scope.$parent.showLoading = true
              } else if (states.showLoading === false) {
                $scope.$parent.showLoading = false
              }
            }, 0)
          },
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

      FlexibleDatesOneWayController.$inject = [
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
        .component('bsFlexibleDatesCalendarAreaComponent',
        bsFlexibleDatesCalendarAreaComponent
        )
        .component('bsBtnContinueComponent',
        bsBtnContinueComponent
        )
        .component('bsSearchResultComponent',
        bsSearchResultComponent
        )
        .controller('FlexibleDatesOneWayController',
        FlexibleDatesOneWayController)
    })({})

    return wrapperInstance
  })
