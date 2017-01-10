/* jshint browser:true */
/* jshint -W003*/
'use strict';
define([
  'jquery',
  'angular',
  '../services/hostUIService',
  '../services/hostScrapService',
  '../services/hostProxyService',
  '../directives/jqui-datepicker',
  '../directives/jqui-autocomplete',
  '../../../../scripts/services/hostProxyService',
  'statsService'
], function($, angular, hostUIService, hostScrapService, hostProxyService,
  jquiDatepicker, jquiAutocomplete, appHostProxyService, statsService) {

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
    function ExternalBookingController($scope,
      hostUIService, hostScrapService, hostProxyService, $timeout, appHostProxyService) {

      var instance = this;

      //-------------------------------------------------------
      // starting code
      //-------------------------------------------------------

      instance.init = function() {
        console.log('ExternalBookingController init');
      };

      //-------------------------------------------------------
      // binding properties
      //-------------------------------------------------------
      $scope.$parent.showLoading = false;
      $scope.childName = 'ExternalBookingController';

      $scope.model = hostScrapService.getModel();

      $scope.passengersExtraOptionsSelected = 0;

      hostScrapService.setHostFlightType('RT');

      // UI
      var ui = {
        // Round Trip = RT
        // One Way    = OW
        // Multi City = MC
        flightType: {
          value: hostScrapService.getSelectedFlightType(),
          change: function(value) {
            $scope.ui.flightType.value = value;
            hostScrapService.setHostFlightType($scope.ui.flightType.value);
            $scope.ui.locations.list = hostScrapService.getLocations();
          }
        },
        // Business Class => Business
        // Economy Class => Economy
        cabinType: {
          value: hostScrapService.getSelectedCabinType(),
          change: function(value) {
            $scope.ui.cabinType.value = value;
            hostScrapService.setHostCabinType($scope.ui.cabinType.value);
          }
        },
        locations: {
          list: hostScrapService.getLocations(),
          onChangeLocationOrigin: function(location, index) {
            // check if location have a sub object origin
            var data = location.origin || location;

            if ($scope.ui.errors[index] && $scope.ui.errors[index].origin) {
               $timeout(function() {
                  delete $scope.ui.errors[index].origin;
                }, 0);
            }

            // TODO: We must todo the set when the user select one result
            hostScrapService.setLocationOrigin(data, index);
          },
          onChangeLocationDestination: function(location, index) {
            if ($scope.ui.errors[index] &&
              $scope.ui.errors[index].destination) {
               $timeout(function() {
                    delete $scope.ui.errors[index].destination;
                }, 0);
            }

            // TODO: We must todo the set when the user select one result
            hostScrapService.setLocationDestination(location, index);
          },
          onChangeLocationDate: function(location, index, isOrigin) {
            if ($scope.ui.errors[index] &&
              ($scope.ui.errors[index].departDate ||
                $scope.ui.errors[index].returnDate)) {
              if (isOrigin) {
               $timeout(function() {
                    delete $scope.ui.errors[index].departDate;
                }, 0);
              } else {
               $timeout(function() {
                    delete $scope.ui.errors[index].returnDate;
                }, 0);
              }
            }
            hostScrapService.setLocationDate(location, index, isOrigin);
          },
          expandAction: function(location){
            location.ui.expanded = !location.ui.expanded;
          }
        },
        passengers: {
          adults: hostScrapService.getPassengersAdults(),
          children: hostScrapService.getPassengersChildren(),
          infants: hostScrapService.getPassengersInfants(),
          onChangeAdults: function() {
            hostScrapService.setPassengersAdults($scope.ui.passengers.adults);
          },
          onChangeChildren: function() {
            hostScrapService.setPassengersChildren($scope.ui.passengers.children);
          },
          onChangeInfants: function(){
            hostScrapService.setPassengersInfants($scope.ui.passengers.infants);
          }
        },
        promo_code: {
          value: hostScrapService.getPromoCode(),
          change: function() {
            hostScrapService.setPromoCode($scope.ui.promo_code.value);
          }
        },
        messages:[
          // {
          //   type: 'error',
          //   content: 'The page contains errors'
          // }
        ],
        errors: {}
      };

      $scope.ui = ui;

      syncDefaultErrorMessages();

      if($scope.ui.passengers.children > 0 || $scope.ui.passengers.infants > 0){
        $scope.passengersExtraOptionsSelected = 1;
      }

      // sync the ui height to garanty footer correct positioning
      appHostProxyService.syncHeight($timeout);

      statsService.ruleShowed(Farenet.getResult(), wrapperInstance.actionConfig);
      //-------------------------------------------------------
      // binding functions
      //-------------------------------------------------------

      // https://projects.invisionapp.com/d/main#/console/6681575/143910336/preview

      $scope.submitFormAction = function() {
        var formActionNodeSelector = hostProxyService.getFormActionNodeSelector();
        var deferred = appHostProxyService.submitFormAction(formActionNodeSelector);
        $scope.$parent.showLoading = true;
        clearErrorsHelper();
        deferred.done(function(value) {
          validationHelper(value.errors);
         $timeout(function() {
              $scope.$parent.showLoading = false;
          }, 0);
        });
      };

      //-------------------------------------------------------
      // Helpers
      //-------------------------------------------------------

      function addMulticityOptionsHelper() {
        // $scope.model.
        hostScrapService.getMulticity();
        $scope.model.hostScrapService.getModel();
      }

      /**
       * Add the validation messages to the UI
       * errors: {
       *   validationErrors: [
       *     {
       *       messages:['you must provide origin'],
       *       property: "outboundOption.originLocationCode"
       *     },
       *     {
       *       messages:['you must provide origin']
       *     }
       *   ]
       * }
       * @param  {[type]} errors [description]
       * @return {[type]}        [description]
       */
      function validationHelper(errors) {
        var validationErrors = errors.validationErrors;
        if(!validationErrors && errors.length > 0){
          validationErrors = [];
          $.each(errors, function(){
            validationErrors.push({
              messages: [
                this.message
              ]
            })
          });
        }
        $.each(validationErrors, function(/*value, index*/){
          var message = this;
          if(message.property){
            // validate an specific input
            // TODO: Implement this feature
            addMessageToInput(message.property, message.messages[0]);
          } else {
            // add the message to the general messages
            $scope.ui.messages = [];
            $scope.ui.messages.push(
              {
                type: 'error',
                content: message.messages[0]
              }
            );
          }
        });
        $scope.$apply();
      }

      function syncDefaultErrorMessages(){
        var deferred = hostScrapService.getDefaultErrorMessages();
        deferred.done(function(value) {
         $timeout(function() {
            $scope.ui.messages = value;
          }, 0);
        });
      }

      function addMessageToInput(propertyName, message) {
        var locationList = ui.locations.list;
        /**
         * @param {String[]} arrayErrors
         * @param {int} index
         * @param {int} type
         */
        function setMessageError(arrayErrors, index, type) {
          var found = false;
          arrayErrors.forEach(function(errorType) {
            if (errorType === propertyName) {
              if(!ui.errors[index]) {
                ui.errors[index] = {};
              }
              ui.errors[index][type] = message;
              found = true;
            }
          });
          return found;
        }

        var i = locationList.length - 1;
        for(; i >= 0; i--) {
          if (setMessageError(locationList[i].origin.errorTypes, i, 'origin')) {
            return;
          }
          if (setMessageError(locationList[i].destination.errorTypes, i, 'destination')) {
            return;
          }
          if (locationList[i].date.errorTypes &&
            setMessageError(locationList[i].date.errorTypes, i, 'departDate')) {
            return;
          }
          if (locationList[i].date.originErrorTypes &&
            setMessageError(locationList[i].date.originErrorTypes, i, 'departDate')) {
            return;
          }
          if (locationList[i].date.destinationErrorTypes &&
            setMessageError(locationList[i].date.destinationErrorTypes, i, 'returnDate')) {
            return;
          }
        }

        if(propertyName === 'guestTypes'){
          $scope.ui.errors.guestTypes = message;
        }
      }

      function clearErrorsHelper(){
        $scope.ui.errors = {};
      }

      //-------------------------------------------------------
      // listeners
      //-------------------------------------------------------


      //-------------------------------------------------------
      // Initial code
      //-------------------------------------------------------
      instance.init();
      return instance;
    }

    //-------------------------------------------------------
    // Angular
    //-------------------------------------------------------
    ExternalBookingController.$inject =
      ['$scope', 'hostUIService', 'hostScrapService', 'hostProxyService', '$timeout', 'appHostProxyService'];

    angular
        .module('responsiveBookingEngine')
        .directive('jquiDatepicker', jquiDatepicker)
        .directive('jquiAutocomplete', jquiAutocomplete)
        .controller('ExternalBookingController', ExternalBookingController);
  })({});

  return wrapperInstance;
});
