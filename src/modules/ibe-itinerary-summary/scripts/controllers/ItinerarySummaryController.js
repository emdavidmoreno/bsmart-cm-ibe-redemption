// jshint -W003
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
  '../../../../scripts/directives/jqui-dialog',
  '../../../../scripts/directives/bs-itinerary-pricing-card/bs-itinerary-pricing-card',
  '../../../../scripts/directives/bs-itinerary-pricing-card/bs-itinerary-pricing-card-per-passenger',
  'lodash',
  'statsService',
  '../../../../scripts/services/hostUIService'
], function($, angular, hostUIService,
  hostScrapService, hostProxyService, strDuration, strSimpleDate,
  sanitize, collUnique, appHostProxyService, jquiDialog, bsItineraryPricingCard,
  bsItineraryPricingCardPerPassenger, _, statsService, ApphostUIService) {

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
    function ItinerarySummaryController($scope,
      hostUIService, hostScrapService, hostProxyService, $timeout,
      appHostProxyService, $sce, ApphostUIService) {

      var instance = this;

      //-------------------------------------------------------
      // starting code
      //-------------------------------------------------------

      instance.init = function() {
        console.log('ItinerarySummaryController init');
      };

      // activate the mock to catch the insurance data
      hostProxyService.activateMockForInsurance();

      //-------------------------------------------------------
      // binding properties
      //-------------------------------------------------------

      // the model that is used to populated the view model
      // the actual values are just for example purposes
      // we are taking the values from the farenet API
      var model = {
        airline: {
          id: 'copaair',
          code: 'cm'
        },
        datasource: {
          step: 'ibe-summary',
          type: 'default',
          url: 'https:'
        },
        passengers: {
          user_input_adults: 1,
          user_input_children: 0,
          user_input_infants: 0
        },
        user_input_journey_type: 'Round Trip',
        total_price: {
          cash: 2306.66,
          miles: -1,
          taxes: 114.66,
          currency: '$',
          currency_code: 'USD'
        },
        geo: {
          language: {
            site_edition: 'en-us',
            lang: 'en'
          },
          location: [
            {
              user_input_origin_airport_code: 'MIA',
              user_input_destination_airport_code: 'PTY'
            }
          ]
        },
        departure: [
          {
            user_input_travel_class: 'Business',
            user_input_date: '2016-05-09',
            dates: [
              {
                date: '2016-05-09',
                flights: [
                  {
                    info: {
                      departure_time: '06:11',
                      arrival_time: '08:24',
                      flight_list: [
                        'CM0173'
                      ],
                      classes: [
                        {
                          name: 'Business Flex',
                          price: {
                            cash: -1,
                            miles: -1
                          },
                          seat: -1
                        }
                      ]
                    }
                  }
                ]
              }
            ]
          }
        ],
        extra_info: {
          geo: [
            {
              origin_city_name: 'Miami',
              origin_country_name: 'United States of America',
              destination_city_name: 'Panama',
              destination_country_name: 'Panama'
            }
          ],
          device_category: 'mobile'
        },
        return: [
          {
            user_input_travel_class: 'Business',
            user_input_date: '2016-05-19',
            dates: [
              {
                date: '2016-05-19',
                flights: [
                  {
                    info: {
                      departure_time: '07:37',
                      arrival_time: '11:40',
                      flight_list: [
                        'CM0226'
                      ],
                      classes: [
                        {
                          name: 'Business Flex',
                          price: {
                            cash: -1,
                            miles: -1
                          },
                          seat: -1
                        }
                      ]
                    }
                  }
                ]
              }
            ]
          }
        ]
      };

      // allow to farenet bring back the prices html nodes to
      Farenet2.verbose = 1;
      // populate the model with the Farenet values
      model = Farenet2.parse();

      $scope.$parent.showMiniSummary = true;
      $scope.$parent.stepper.goToStep(2);
     

      // select by default proceed to pay
      hostScrapService.selectPaymentProceedToPay();

      // view model
      var ui = {
        locations: getLocations(),
        passengers: model.passengers,
        total_price_per_passenger_type: model.total_price_per_passenger_type,
        total_price: model.total_price,
        insurance: {
          totalPriceMerch: 0
        },
        discounts: model.discounts,
        messages: hostScrapService.getMessages(),
        disclaimer_mapping:
          _.isEmpty(model.disclaimer_mapping) ? null : model.disclaimer_mapping,
        user_input_journey_type: model.user_input_journey_type,
        sellingClass: {
          openDialog: false,
          html: $sce.trustAsHtml('<div> </div>')
        },
        flightDetails: {
          openDialog: false,
          data: {}
        },
        payment: {
          // name == 1 => Proceed to Pay
          // name == 0 => Other
          name: hostScrapService.isPaymentProccedToPaySelected() ? '1' : '0',
          info: hostScrapService.getPaymentProceedInfo()
        },
        showPayment: hostScrapService.showPaymentProcced(),
       
        errors: {},
        showContinueButton: 1,

        // payment functions
        selectPaymentProceedToPay: function() {
          hostScrapService.selectPaymentProceedToPay();
        },
        selectPaymentReserveAndHold: function() {
          hostScrapService.selectPaymentReserveAndHoldOption();
        },
        tavelInsurance: getTravelInsurance(),
        insurance: {
          totalPriceMerch: 0,
          price_per_passenger: 0
        },
        insuranceIcon: hostScrapService.insuranceIcon(),
        model: model,
      };

      ui.total_price.base_fare = getBaseFare(model);

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

      $scope.ui = ui;

      /**
       * Normalize currency code value
       * @param {String} currencyCode Values: [BRL, COL, ...]
       * @return {Float}
       */
      function normalizeCurrencyValue(currencyCode, cash) {
        var cashValue
        if (cash === 0) {
          return 0
        }
        if (currencyCode === 'BRL' || currencyCode === 'ARS') {
          // 1.241,04 => 1241.04
          cashValue = parseFloat(cash.replace(/\./g, '').replace(/,/g, '.'))
        } else if (currencyCode === 'CAD' || currencyCode === 'USD' ||
          currencyCode === 'MXN') {
          // 1,241.04 => 1241.04
          cashValue = parseFloat(cash.replace(/,/g, ''))
        } else if (currencyCode === 'COP') {
          // 1.292.930 => 1292930
          cashValue = parseFloat(cash.replace(/\./g, ''))
        }
        return cashValue
      }

      // app manipulation vars
      $scope.$parent.showLoading = false;

      // sync the ui height to garanty footer correct positioning
      appHostProxyService.syncHeight($timeout);

      statsService.ruleShowed(Farenet2.getResult(), wrapperInstance.actionConfig);

      hostScrapService.waitForInsuranceBox(function() {
        $timeout(function() {
          $scope.ui.tavelInsurance = getTravelInsurance();
          $scope.ui.tavelInsurance.setNoAccept();
          $scope.ui.insuranceIcon = hostScrapService.insuranceIcon();
        }, 0);
      });

      hostProxyService.setHandlerInsurance(function(insurance) {
        $timeout(function() {
          var insuranceTotalPrice =
            normalizeCurrencyValue($scope.ui.total_price.currency_code,
              insurance.totalPriceMerch)
          if (insuranceTotalPrice) {
            $scope.ui.total_price.cash += insuranceTotalPrice;
            $scope.main.miniSummary.total_price.cash += insuranceTotalPrice;
            $scope.ui.showPayment = false;
          } else {
            $scope.ui.total_price.cash -= $scope.ui.insurance.totalPriceMerch;
            $scope.main.miniSummary.total_price.cash -= $scope.ui.insurance.totalPriceMerch;
            $scope.ui.showPayment = hostScrapService.showPaymentProcced();
          }
          // clear insurance object
          delete $scope.ui.insurance.body;
          delete $scope.ui.insurance.head;
          $scope.ui.insurance = {};
          $scope.ui.insurance.totalPriceMerch = insuranceTotalPrice;
          $scope.ui.insurance.body = insurance.body;
          $scope.ui.insurance.head = insurance.head;
          if (insurance.body) {
            var totalPassengers = 0
            for (var p in ui.passengers) {
              totalPassengers += ui.passengers[p];
            }
            ui.insurance.body.price = normalizeCurrencyValue(
              $scope.ui.total_price.currency_code,
              ui.insurance.body.price
            )
            $scope.ui.insurance.price_per_passenger =
              (ui.insurance.body.price / totalPassengers)
          }
        }, 0);
      });

      //-------------------------------------------------------
      // binding functions
      //-------------------------------------------------------

      $scope.continueButtonAction = function(){
        var formActionNodeSelector = hostProxyService.getFormActionNodeSelector();
        var deferred = appHostProxyService.submitFormAction(formActionNodeSelector);
        $scope.$parent.showLoading = true;
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

      function getBaseFare(model) {
        /**
         * return {Float} return float without sign
         */
        function unsignedFloat(value) {
          if (value < 0) {
            return 0
          }
          return parseFloat(value)
        }

        var totalPriceModel = model.total_price;
        var fuel_surcharges = unsignedFloat(totalPriceModel.fuel_surcharges);
        var cash = unsignedFloat(totalPriceModel.cash);
        var taxes = unsignedFloat(totalPriceModel.taxes);

        var baseFare = cash - taxes - fuel_surcharges;

        $.each(model.discounts, function(index, item) {
          baseFare += unsignedFloat(item.price);
        });

        return baseFare;
      }

      // - model helpers
      function getTravelInsurance() {
        if(!hostScrapService.isInsuranceVisisble()) {
          return null;
        }

        return {
          display: hostScrapService.getTravelInsuranceDisplay(),
          accept: hostScrapService.getTravelInsuranceAccept(),
          setAccept: function(){
            $scope.ui.tavelInsurance.accept = true;
            $scope.ui.showPayment = false;
            $scope.ui.payment.name = true;
            hostScrapService.setTravelInsuranceAccept();
          },
          setNoAccept: function(){
            $scope.ui.tavelInsurance.accept = false;
            $scope.ui.showPayment = true;
            hostScrapService.setTravelInsuranceNotAccept();
          },
        };
      }

      $scope.$on("$destroy", function() {
        hostProxyService.deactivateMockForInsurance();
      });

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
            //TODO: Farenet must change
            if(!this.departure){
              this.departure = model.departure[index][0];
            }

            this.departure.availableClasses =
              getAvailableClasses(this.departure.dates[0].flights);

            this.extra_info = {
              geo: model.extra_info.geo[index]
            };
            this.departure.selectedClassIndex = this.departure.availableClasses[0];
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
              this.return.selectedClassIndex = this.return.availableClasses[0];
            }
          });

          return locations;
      }

      function getAvailableClasses(flights){
        var availableClasses = [];
        if(flights.length > 0) {
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
            if(cheapestPrice === -1) {
              cheapestPrice = 'Non/Ava';
            } else if(cheapestPrice === -3){
              cheapestPrice = '';
            }

            availableClasses.push({
              name: value.name,
              cheapestPrice: cheapestPrice,
              id: index,
              cssClass: cssClassesMapping[value.name]
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
        ApphostUIService.scrollToTop();
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
          if(message.property){
            // validate an specific input
            // TODO: Implement this feature
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

      // - visual helpers

      //-------------------------------------------------------
      // listeners
      //-------------------------------------------------------
      instance.init();

      $scope.$on("$destroy", function() {
        hostProxyService.deactivateMockForInsurance();
      });

      return instance;
    }

    ItinerarySummaryController.$inject = [
      '$scope',
      'hostUIService',
      'hostScrapService',
      'hostProxyService',
      '$timeout',
      'appHostProxyService',
      '$sce',
      'ApphostUIService'];
    angular
        .module('responsiveBookingEngine')
        .factory('hostUIService', hostUIService)
        .filter('duration', strDuration)
        .filter('simpledate', strSimpleDate)
        .filter('sanitize', sanitize)
        .filter('unique', collUnique)
        .directive('jquiDialog', jquiDialog)
        .directive('bsItineraryPricingCard', bsItineraryPricingCard)
        .directive('bsItineraryPricingCardPerPassenger', bsItineraryPricingCardPerPassenger)
        .controller('ItinerarySummaryController', ItinerarySummaryController);
  })({});

  return wrapperInstance;
});
