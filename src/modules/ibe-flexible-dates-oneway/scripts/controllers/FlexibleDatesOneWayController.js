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
  '../../../../components/complex/bs-fare-hold/index.component',
  'statsService',
  'lodash',
  '../../../../components/complex/bs-flexible-dates-calendar-area/index.component', // eslint-disable-line
  '../../../../components/complex/bs-btn-continue/index.component',
  '../../../../components/complex/bs-search-result/index.component',
], function($, angular, hostScrapService, hostProxyService,
  strDuration, strSimpleDate, sanitize, collUnique, appHostProxyService,
  jquiDialog, bsFareHoldComponent, statsService, _, bsFlexibleDatesCalendarAreaComponent,
  bsBtnContinueComponent, bsSearchResultComponent) {
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
    function FlexibleDatesOneWayController(
      $scope,
      hostScrapService,
      hostProxyService,
      $timeout,
      appHostProxyService,
      $filter,
      $sce,
      $interval
    ) {
      let instance = this

      // -------------------------------------------------------
      // starting code
      // -------------------------------------------------------

      instance.init = function() {
        console.log('FlexibleDatesOneWayController init')
        setFareHoldData()
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
        messages: hostScrapService.getDefaultInfoMessages(),
        states: {},
        fareHoldData: 'undefined',
        updateStates: (states) => {
          $timeout(() => {
            $scope.ui.states = angular.merge({}, $scope.ui.states, states)
            if(states.showLoading) {
              $scope.$parent.showLoading = true
            } else if(states.showLoading === false) {
              $scope.$parent.showLoading = false
            }
          }, 0)
        },
      }

      $scope.ui = ui
     
      // app manipulation vars
      $scope.$parent.showLoading = false


       // SliderBar Currency
      $scope.main.chooseCurrency = (function() {
        return hostScrapService.getChooseCurrencyOptions()
      })()
      $scope.main.selectedChooseCurrency = (function() {
        let strValue = hostScrapService.getChooseCurrency()
        let value = null
        $scope.main.chooseCurrency.forEach(function(el) {
          if (el.value === strValue) {
            value = el
          }
        })
        if (!value) {
          value = $scope.main.chooseCurrency[0]
        }
        return value
      })()
      $scope.main.onChangeChooseCurrency = function(selected) {
        $scope.$parent.hideMenu()
        $scope.$parent.showLoading = true
        appHostProxyService.mockProcessAirFlightSearchFormValidationErrors()
        //appHostProxyService.mockInvokeBusinessAction()
        appHostProxyService.mockProcessResult()
        hostScrapService.getSetChooseCurrency(selected)
      }

      $scope.changePriceLock = function(){
        setFareHoldData()
      }

      /**
       * Helper functions
       */

      function setFareHoldData(){
        var promise = $interval(()=>{
          if(hostScrapService.existFareHold() == true){
            console.log("iteracion")
            $timeout(()=>{
              $scope.ui.fareHoldData = {
                textDescription: hostScrapService.getDescriptionImg() || '',
                linkDescription: hostScrapService.getDescriptionNote() || '',
                priceOptions: hostScrapService.getFareHoldOffers() || [],
                bannerImg: hostScrapService.getBannerImg() || '#',
                existFareHold: hostScrapService.existFareHold() || false
              } 
            },0)            
            $interval.cancel(promise)
          }
        },500)
      }

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
      '$interval'
    ]

    angular
        .module('responsiveBookingEngine')
        .filter('duration', strDuration)
        .filter('simpledate', strSimpleDate)
        .filter('sanitize', sanitize)
        .filter('unique', collUnique)
        .directive('jquiDialog', jquiDialog)
        .component('bsFareHoldComponent', bsFareHoldComponent)
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
