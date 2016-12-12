// jshint -W003
// jshint -W072
'use strict';

define([
  'jquery',
  'angular',
  '../services/hostUIService',
  '../services/hostScrapService',
  '../services/hostProxyService',
  '../../../../scripts/filters/strDuration',
  '../../../../scripts/filters/strSimpleDate',
  '../../../../scripts/filters/sanitize',
  '../../../../scripts/filters/collUnique',
  '../../../../scripts/services/hostProxyService',
  '../../../../scripts/filters/range',
  'lodash',
  '../../../../scripts/directives/jqui-dialog',
  '../../../../scripts/directives/bs-card-ref-id',
  'statsService',
  '../../../../scripts/directives/bs-itinerary-pricing-card/bs-itinerary-pricing-card',
  '../../../../scripts/directives/bs-itinerary-pricing-card/bs-itinerary-pricing-card-per-passenger'
], function($, angular, hostUIService, hostScrapService, hostProxyService,
  strDuration, strSimpleDate, sanitize, collUnique, appHostProxyService, range,
  _, jquiDialog, bsCardRefId, statsService, bsItineraryPricingCard,
  bsItineraryPricingCardPerPassenger) {

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
    function ConfirmationHoldController($scope, hostUIService,
      hostScrapService, hostProxyService, $timeout, appHostProxyService,
      $translate, $sce) {

      var instance = this;

      // allow to farenet bring back the prices html nodes to
      Farenet.verbose = 1;
      // populate the model with the Farenet values
      var model = Farenet.parse();

      // view model
      var ui = {
        locations: getLocations(),
        total_price: model.total_price,
        total_price_per_passenger_type: model.total_price_per_passenger_type,
        passengers: model.passengers,
        user_input_journey_type: model.user_input_journey_type,
        disclaimer_mapping: _.isEmpty(model.disclaimer_mapping) ? null : model.disclaimer_mapping,
        discounts: model.discounts,
        messages: [],
        infoMessages: hostScrapService.getMessages(),
        errors: {},
        showContinueButton: 1,
        static_messages: {},
        partialErrors: {},
        sellingClass: {
          openDialog: false,
          html: $sce.trustAsHtml('<div> </div>')
        },
        flightDetails: {
          openDialog: false,
          data: {}
        },
        confirmation: {
          message: hostScrapService.getConfirmationMessage(),
          number: hostScrapService.getConfirmationNumber(),
          label: hostScrapService.getConfirmationLabel(),
          email_sended_message: '',
          card_charged_message: hostScrapService.getCardChargedMessage(),
          card_charged_amount: hostScrapService.getCardChargedAmount(),
          thanks_message: hostScrapService.getThanksMessage(),
        },
        contact_info: hostScrapService.getContactInfo(),
        passengers_info: hostScrapService.getPassengersInfo(),
        continueButton:{
          href: hostScrapService.getContinueButtonHref()
        }
      };

      if(isEmpty(ui.disclaimer_mapping)){
        ui.disclaimer_mapping = null;
      } else {
        function getDisclaimers(locationFlights) {
          var disclaimers = [];
          locationFlights.flights.forEach(function(flight) {
            flight.info.flight_list.forEach(function(f) {
              f.disclaimer.forEach(function(d) {
                disclaimers.push({id: d.id});
              });
            });
          });
          return disclaimers;
        }

        if (ui.locations.length > 1) {
          ui.locations = ui.locations.map(function(location) {
            location.disclaimers = getDisclaimers(location.departure.dates[0]);
            return location;
          });
        } else {
          ui.locations[0].disclaimers = [].concat(
            getDisclaimers(ui.locations[0].departure.dates[0])
          );
          if (ui.locations[0].return) {
            ui.locations[0].disclaimers = ui.locations[0].disclaimers.concat(
              getDisclaimers(ui.locations[0].return.dates[0])
            );
          }
        }
      }

      ui.total_price.base_fare = getBaseFare(model);

      //-------------------------------------------------------
      // starting code
      //-------------------------------------------------------


      instance.init = function() {
        console.log('ConfirmationHoldController init');
      };

      //-------------------------------------------------------
      // binding properties
      //-------------------------------------------------------

      $scope.$parent.showMiniSummary = true;
      $scope.$parent.stepper.goToStep(5);
      $scope.ui = ui;

      // app manipulation vars
      $scope.$parent.showLoading = false;

      statsService.ruleShowed(Farenet.getResult(), wrapperInstance.actionConfig);


      //-------------------------------------------------------
      // binding functions
      //-------------------------------------------------------
      $scope.setItineraryCopyEmail = function(value){
        hostScrapService.setItineraryCopyEmail(value);
      };

      $scope.sendItineraryCopyAction = function(){
        var formActionNodeSelector = hostProxyService.getFormActionNodeSelector();
        var deferred = appHostProxyService.submitFormAction(formActionNodeSelector, 'confirmationPage');
        $scope.$parent.showLoading = true;
        deferred
          .done(function(value) {
            $timeout(function() {
              ui.confirmation.email_sended_message = value.contentData.UpdateCont;
              $scope.$parent.showLoading = false;
            }, 0);
          })
          .fail(function(value) {
            validationHelper(value.errors);
            $timeout(function() {
              $scope.$parent.showLoading = false;
            }, 0);
          });
      }

      //-------------------------------------------------------
      // Helpers
      //-------------------------------------------------------

      // - model helpers

      function getBaseFare(model){
        var totalPriceModel = model.total_price;
        var discountsModel = model.discounts;
        var baseFare = 0;
        baseFare = totalPriceModel.cash - totalPriceModel.taxes - totalPriceModel.fuel_surcharges;
        $.each(discountsModel, function(index, item){
          baseFare += item.price;
        });
        return baseFare;
      }

      /**
       * Augment the locations ViewModel with
       * the necessary properties for the UI like:
       * (selectedClassIndex, show, summary)
       * @return
       */
      function getLocations() {
          var locations = model.geo.location;
          $.each(locations, function(index, value) {
            this.departure = model.departure[index];
            this.departure.availableClasses =
              getAvailableClasses(this.departure.dates[0].flights);
            this.extra_info = {
              geo: model.extra_info.geo[index]
            };
            this.departure.show = 1;
            this.departure.done = 0;
            this.departure.summary = {
              show: 0,
              departure_time: '',
              arrival_time: '',
              duration: 960,
              stops: 0,
              flight_list: [],
              price: 0
            };

            if(model.return && model.return[index]) {
              this.return = model.return[index];
              this.return.show = 0;
              this.return.done = 0;
              this.return.summary = {
                show:0,
                departure_time: '',
                arrival_time: '',
                duration: 300,
                stops: 0,
                flight_list: [],
                price: 0
              };

              this.return.availableClasses =
                getAvailableClasses(this.return.dates[0].flights);
            }
          });

          return locations;
      }

      function getAvailableClasses(flights){
        var availableClasses = [];
        if(flights.length > 0){
          var cssClassesMapping = {
            'Economy Promo': 'flight-class-color--level1',
            'Economy Extra': 'flight-class-color--level2',
            'Economy Flex': 'flight-class-color--level3',
            'Business Promo': 'flight-class-color--level4',
            'Business Flex': 'flight-class-color--level5'
          };

          // this aproach asumes that the classes are
          // the same for all the fligths, that works for Copa
          // but we need to be carful in next implementations
          var firstFlightClasses = flights[0].info.classes || [];
          $.each(firstFlightClasses, function(index, value) {
            var cheapestPrice = value.price.cash;
            if(cheapestPrice === -1){
              cheapestPrice = 'Non/Ava';
            } else if(cheapestPrice === -3){
              cheapestPrice = '';
            }

            availableClasses.push({
              name: value.name,
              cheapestPrice: cheapestPrice,
              id: index,
              cssClass: cssClassesMapping[value.name],
            });
          });

          flights.forEach(function(flight) {
            flight.info.classes = flight.info.classes.map(function(cls) {
              // Selling Class
              var sellingClassLink = cls.sellingClassNode;
              if (sellingClassLink.length > 0) {
                cls.sellingClass = {
                  text: sellingClassLink.text(),
                  onclick: function() {
                    hostUIService.swapToBSFillFareRuleTabCallback();
                    sellingClassLink[0].click();
                    $('#airFareRulesPopUpOuter').attr('style', 'display:none');
                    $('#popupShimOuter').attr('style', 'display:none');

                    $scope.ui.sellingClass.isLoading = true;
                    $scope.ui.sellingClass.openDialog = true;
                  }
                };
              }
              return cls;
            });
            flight.info.flight_list.forEach(function(fInfo) {
              fInfo.onclick = function() {
                hostUIService.swapToBSFlightDetailsLoadCallback();
                fInfo.flightNumberNode[0].click();

                // This hide the dialog and shadow
                $timeout(function() {
                  $('#flightDetailsPopUpOuter').attr('style', 'display:none');
                  $('.dialogFooter .button2')[0].click();
                  $scope.ui.flightDetails.openDialog = true;
                  $scope.ui.flightDetails.isLoading = true;
                }, 0);
              };
            });
          });
        }
        return availableClasses;
      }


      hostUIService.setHandlerSellingClass(function(error, response) {
        if(error) {
          console.log('[error] Loading Selling Class Info');
        }

        $timeout(function() {
          $scope.ui.sellingClass.html = $sce.trustAsHtml(response);
          $scope.ui.sellingClass.isLoading = false;
        }, 0);

        hostUIService.swapToOrgFillFareRuleTabCallback();

        var closeDialog = $('#airFareRulesPopUpOuter .dialogClose a');
        if(closeDialog.length > 0) {
          closeDialog[0].click();
        }
      });

      hostUIService.setHandlerFlightDetails(function(error, success) {
        if(error) {
          console.log('[error]', error);
          return;
        }

        hostUIService.swapToOrgFlightDetailsCallbacks();

        $timeout(function() {
          $scope.ui.flightDetails.isLoading = false;
          $scope.ui.flightDetails.data = success;
        }, 0);
      });

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
        ui.errors = [];

        if(!validationErrors && errors.length > 0){
          validationErrors = [];
          $.each(errors, function(){
            validationErrors.push({
              messages: [
                this.message
              ]
            });
          });
        }
        $.each(validationErrors, function(/*value, index*/){
          var message = this;
          if(message.property) {
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

      function addMessageToInput(propertyName, message) {
        ui.errors[0] = {};
        ui.errors[0][propertyName] = message;
      }

      function isEmpty(ob) {
         for(var i in ob) {
           return false;
         }
        return true;
      }

      // - visual helpers

      //-------------------------------------------------------
      // listeners
      //-------------------------------------------------------
      instance.init();
      return instance;
    }

    ConfirmationHoldController.$inject = [
      '$scope',
      'hostUIService',
      'hostScrapService',
      'hostProxyService',
      '$timeout',
      'appHostProxyService',
      '$translate',
      '$sce'
    ];
    angular
      .module('responsiveBookingEngine')
      .factory('hostUIService', hostUIService)
      .filter('duration', strDuration)
      .filter('simpledate', strSimpleDate)
      .filter('range', range)
      .filter('sanitize', sanitize)
      .filter('unique', collUnique)
      .directive('jquiDialog', jquiDialog)
      .directive('bsCardRefId', bsCardRefId)
      .directive('bsItineraryPricingCard', bsItineraryPricingCard)
      .directive('bsItineraryPricingCardPerPassenger', bsItineraryPricingCardPerPassenger)
      .controller('ConfirmationHoldController', ConfirmationHoldController);
  })({});

  return wrapperInstance;
});
