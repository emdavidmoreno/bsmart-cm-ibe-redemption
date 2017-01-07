define(['jquery'], function($) {
  'use strict';
  //jshint -W003

  /**
   * ScrapService
   *
   * Clase encargada de los cambios en el modelo actual reflejarlos en el
   * modelo de la pagina anfitrión
   */
  function hostScrapService() {
    var HostScrapService = function() {
      this._selectors = {
        flightType: {
          selected:
            '.flightSearchTypeGroup input[type=radio]:checked',
          // radio button [Round Trip]
          RT: '.flightSearchTypeGroup input[type=radio]:eq(0)',
          // radio button [One Way]
          OW: '.flightSearchTypeGroup input[type=radio]:eq(1)',
          // radio button [Multi City]
          MC: '.flightSearchTypeGroup input[type=radio]:eq(2)'
        },
        passengers: {
          // show extra passengers:
          showExtra: '.extraPassengersLink a',
          // Passengers Adult 12+
          guestAdultAmount: '#AirFlightSearchForm select[name="guestTypes[0].amount"]',
          // Passengers Child 2-11
          guestChildAmount: '#AirFlightSearchForm select[name="guestTypes[1].amount"]',
          // Passengers Infant 0-1
          guestInfantAmount: '#AirFlightSearchForm select[name="guestTypes[2].amount"]'
        },
        cabin: {
          // selected class
          selected: '.flightSearchCabin input[type=radio]:checked',
          // Cabin Economy Class
          Economy: '.flightSearchCabin input[type=radio]:eq(0)',
          // Cabin Business Class
          Business: '.flightSearchCabin input[type=radio]:eq(1)'
        },
        travel: {
          // From
          departureCity: '.departureLocationArea input[type=text]:eq(0)',
          // Depart on
          departureDate: '.departureDateArea input[type=text]:eq(0)',
          // To
          arrivalCity: '.arrivalLocationArea input[type=text]:eq(0)',
          // Return on
          arrivalDate: '.arrivalDateArea input[type=text]:eq(0)',
          // I must travel on these dates
          notFlexibleSearch: '.flightSearchOptionsGroup input[type=radio]:eq(0)',
          // My travel dates are flexible
          flexibleSearch: '.flightSearchOptionsGroup input[type=radio]:eq(1)',
          // Enter your coupon
          cuponInput: '.couponBlock input[type=text]',

          locations: [
            {
              origin: {
                locationName:
                  '#AirFlightSearchForm input[name="outboundOption.originLocationName"]',
                locationCode:
                  '#AirFlightSearchForm input[name="outboundOption.originLocationCode"]',
                locationType:
                  '#AirFlightSearchForm input[name="outboundOption.originLocationType"]',
                errorTypes: [
                  'outboundOption.originLocationCode',
                  'outboundOption.originLocationType',
                  'outboundOption.originLocationName'
                ]
              },
              destination: {
                locationName:
                  '#AirFlightSearchForm input[name="outboundOption.destinationLocationName"]',
                locationCode:
                  '#AirFlightSearchForm input[name="outboundOption.destinationLocationCode"]',
                locationType:
                  '#AirFlightSearchForm input[name="outboundOption.destinationLocationType"]',
                  errorTypes: [
                    'outboundOption.destinationLocationName',
                    'outboundOption.destinationLocationCode',
                    'outboundOption.destinationLocationType'
                  ]
              },
              date: {
                origin: '#AirFlightSearchForm input[id="departureDate1"]',
                destination: '#AirFlightSearchForm input[id="departureDate2"]',
                originErrorTypes: [
                  'outboundOption.departureDate',
                  'outboundOption.departureMonth',
                  'outboundOption.departureDay'
                ],
                destinationErrorTypes: [
                  'inboundOption.departureDate',
                  'inboundOption.departureMonth',
                  'inboundOption.departureDay'
                ]
              }
            },
            // multicity
            {
              origin: {
                locationName:
                  '#AirFlightSearchForm input[name="multiCityOptions[0].originLocationName"]',
                locationCode:
                  '#AirFlightSearchForm input[name="multiCityOptions[0].originLocationCode"]',
                locationType:
                  '#AirFlightSearchForm input[name="multiCityOptions[0].originLocationType"]',
                errorTypes: [
                  'multiCityOptions[0].originLocationName',
                  'multiCityOptions[0].originLocationCode',
                  'multiCityOptions[0].originLocationCode'
                ]
              },
              destination: {
                locationName:
                  '#AirFlightSearchForm input[name="multiCityOptions[0].destinationLocationName"]',
                locationCode:
                  '#AirFlightSearchForm input[name="multiCityOptions[0].destinationLocationCode"]',
                locationType:
                  '#AirFlightSearchForm input[name="multiCityOptions[0].destinationLocationType"]',
                errorTypes: [
                  'multiCityOptions[0].destinationLocationName',
                  'multiCityOptions[0].destinationLocationCode',
                  'multiCityOptions[0].destinationLocationType'
                ]
              },
              date: {
                origin: '#AirFlightSearchForm input[name="multiCityOptions[0].departureDate"]',
                errorTypes: [
                  'multiCityOptions[0].departureDate',
                  'multiCityOptions[0].departureMonth',
                  'multiCityOptions[0].departureDay',
                  'multiCityOptions[0].departureYear',
                ]
              }
            },
            {
              origin: {
                locationName:
                  '#AirFlightSearchForm input[name="multiCityOptions[1].originLocationName"]',
                locationCode:
                  '#AirFlightSearchForm input[name="multiCityOptions[1].originLocationCode"]',
                locationType:
                  '#AirFlightSearchForm input[name="multiCityOptions[1].originLocationType"]',
                errorTypes: [
                  'multiCityOptions[1].originLocationName',
                  'multiCityOptions[1].originLocationCode',
                  'multiCityOptions[1].originLocationType'
                ]
              },
              destination: {
                locationName:
                  '#AirFlightSearchForm input[name="multiCityOptions[1].destinationLocationName"]',
                locationCode:
                  '#AirFlightSearchForm input[name="multiCityOptions[1].destinationLocationCode"]',
                locationType:
                  '#AirFlightSearchForm input[name="multiCityOptions[1].destinationLocationType"]',
                errorTypes: [
                  'multiCityOptions[1].destinationLocationName',
                  'multiCityOptions[1].destinationLocationCode',
                  'multiCityOptions[1].destinationLocationType'
                ]
              },
              date: {
                origin: '#AirFlightSearchForm input[name="multiCityOptions[1].departureDate"]',
                errorTypes: [
                  'multiCityOptions[1].departureDate',
                  'multiCityOptions[1].departureMonth',
                  'multiCityOptions[1].departureDay',
                  'multiCityOptions[1].departureYear',
                ]
              }
            },
            {
              origin: {
                locationName:
                  '#AirFlightSearchForm input[name="multiCityOptions[2].originLocationName"]',
                locationCode:
                  '#AirFlightSearchForm input[name="multiCityOptions[2].originLocationCode"]',
                locationType:
                  '#AirFlightSearchForm input[name="multiCityOptions[2].originLocationType"]',
                errorTypes: [
                  'multiCityOptions[2].originLocationName',
                  'multiCityOptions[2].originLocationCode',
                  'multiCityOptions[2].originLocationType'
                ]
              },
              destination: {
                locationName:
                  '#AirFlightSearchForm input[name="multiCityOptions[2].destinationLocationName"]',
                locationCode:
                  '#AirFlightSearchForm input[name="multiCityOptions[2].destinationLocationCode"]',
                locationType:
                  '#AirFlightSearchForm input[name="multiCityOptions[2].destinationLocationType"]',
                errorTypes: [
                  'multiCityOptions[2].destinationLocationName',
                  'multiCityOptions[2].destinationLocationCode',
                  'multiCityOptions[2].destinationLocationType'
                ]
              },
              date: {
                origin:
                  '#AirFlightSearchForm input[name="multiCityOptions[2].departureDate"]',
                errorTypes: [
                  'multiCityOptions[2].departureDate',
                  'multiCityOptions[2].departureMonth',
                  'multiCityOptions[2].departureDay',
                  'multiCityOptions[2].departureYear',
                ]
              }
            },
            {
              origin: {
                locationName:
                  '#AirFlightSearchForm input[name="multiCityOptions[3].originLocationName"]',
                locationCode:
                  '#AirFlightSearchForm input[name="multiCityOptions[3].originLocationCode"]',
                locationType:
                  '#AirFlightSearchForm input[name="multiCityOptions[3].originLocationType"]',
                errorTypes: [
                  'multiCityOptions[3].originLocationName',
                  'multiCityOptions[3].originLocationCode',
                  'multiCityOptions[3].originLocationType'
                ]
              },
              destination: {
                locationName:
                  '#AirFlightSearchForm input[name="multiCityOptions[3].destinationLocationName"]',
                locationCode:
                  '#AirFlightSearchForm input[name="multiCityOptions[3].destinationLocationCode"]',
                locationType:
                  '#AirFlightSearchForm input[name="multiCityOptions[3].destinationLocationType"]',
                errorTypes: [
                  'multiCityOptions[3].destinationLocationName',
                  'multiCityOptions[3].destinationLocationCode',
                  'multiCityOptions[3].destinationLocationType'
                ]
              },
              date: {
                origin: '#AirFlightSearchForm input[name="multiCityOptions[3].departureDate"]',
                errorTypes: [
                  'multiCityOptions[3].departureDate',
                  'multiCityOptions[3].departureMonth',
                  'multiCityOptions[3].departureDay',
                  'multiCityOptions[3].departureYear',
                ]
              }
            },
            {
              origin: {
                locationName:
                  '#AirFlightSearchForm input[name="multiCityOptions[4].originLocationName"]',
                locationCode:
                  '#AirFlightSearchForm input[name="multiCityOptions[4].originLocationCode"]',
                locationType:
                  '#AirFlightSearchForm input[name="multiCityOptions[4].originLocationType"]',
                errorTypes: [
                  'multiCityOptions[4].originLocationName',
                  'multiCityOptions[4].originLocationCode',
                  'multiCityOptions[4].originLocationType'
                ]
              },
              destination: {
                locationName:
                  '#AirFlightSearchForm input[name="multiCityOptions[4].destinationLocationName"]',
                locationCode:
                  '#AirFlightSearchForm input[name="multiCityOptions[4].destinationLocationCode"]',
                locationType:
                  '#AirFlightSearchForm input[name="multiCityOptions[4].destinationLocationType"]',
                errorTypes: [
                  'multiCityOptions[4].destinationLocationName',
                  'multiCityOptions[4].destinationLocationCode',
                  'multiCityOptions[4].destinationLocationType'
                ]
              },
              date: {
                origin: '#AirFlightSearchForm input[name="multiCityOptions[4].departureDate"]',
                errorTypes: [
                  'multiCityOptions[4].departureDate',
                  'multiCityOptions[4].departureMonth',
                  'multiCityOptions[4].departureDay',
                  'multiCityOptions[4].departureYear',
                ]
              }
            }
            // TODO: Add the other multicity options
          ]
        },
        promo_code: '#AirFlightSearchForm [name="coupon"]'
      };

      // https://everymundo.atlassian.net/wiki/display/FAR/JSON+Draft+2
      this._model = {
        passengers: {
          user_input_adults: '',
          user_input_children: '',
          user_input_infants: '',
        },
        user_input_journey_type: 'Round Trip',
        geo: {
          location: [{
            user_input_origin_airport_code: 'BBB',
            user_input_destination_airport_code: 'AAA',
          }],
          language: {
            site_edition: 'en-us',
            lang: 'en',
          }
        },
        departure: [{
          user_input_travel_class: 'Economy Promo',
          user_input_date: '2016-03-20',
        }],
        return: [{
          user_input_travel_class: 'Economy Promo',
          user_input_date: '2016-03-20',
        }],
        extra_info: {
          geo: [{
            origin_city_name: 'Miami',
            origin_country_name: 'United States',
            destination_city_name: 'Miami',
            destination_country_name: 'United States'
          }]
        }
      };

      // show extra passengers by defaults
      if($(this._selectors.passengers.showExtra)[0]) {
        $(this._selectors.passengers.showExtra)[0].click();
      }
    };

    /**
     * Return a model
     * the model must follow this structure
     * @return {Object} Model
     */
    HostScrapService.prototype.getModel = function() {
      return this._model;
    };

    //------------------------------------------------------
    // - Passengers
    //------------------------------------------------------

    HostScrapService.prototype.getPassengersAdults = function(){
      var adults;
      adults = $(this._selectors.passengers.guestAdultAmount).val();
      return adults;
    };
    HostScrapService.prototype.getPassengersChildren = function(){
      var children;
      children = $(this._selectors.passengers.guestChildAmount).val();
      return children;
    };
    HostScrapService.prototype.getPassengersInfants = function(){
      var infants;
      infants = $(this._selectors.passengers.guestInfantAmount).val();
      return infants;
    };

    HostScrapService.prototype.setPassengersAdults = function(value){
      $(this._selectors.passengers.guestAdultAmount).val(value);
    };
    HostScrapService.prototype.setPassengersChildren = function(value){
      $(this._selectors.passengers.guestChildAmount).val(value);
    };
    HostScrapService.prototype.setPassengersInfants = function(value){
      $(this._selectors.passengers.guestInfantAmount).val(value);
    };



    //------------------------------------------------------
    // - Flight Types
    //------------------------------------------------------
    /**
     * Selected flight type
     *
     * @return {String} RT | OW | MC
     *  => Round Trip = RT
     *  => One Way    = OW
     *  => Multi City = MC
     */
    HostScrapService.prototype.getSelectedFlightType = function() {
      this._model.user_input_journey_type =
        $(this._selectors.flightType.selected).val();
      return this._model.user_input_journey_type;
    };

    /**
     * Is selected
     *
     * @return {Boolean} Return true if some checkbox is selected
     */
    HostScrapService.prototype.isFlightTypeSelected = function() {
      return $(this._selectors.flightType.selected).length > 0;
    };

    /**
     * Set the selected flight to host
     *
     * @param {String} flightValue  RT | OW | MC
     *  => Round Trip = RT
     *  => One Way    = OW
     *  => Multi City = MC
     */
    HostScrapService.prototype.setHostFlightType = function(flightValue) {
      this._model.user_input_journey_type = flightValue;
      // change tripType view
      window.switchTripType({tripType: flightValue});

      $(this._selectors.flightType[flightValue]).prop('checked', true);
    };

    //------------------------------------------------------
    // - Cabin
    //------------------------------------------------------
    /**
     * Selected cabin type
     *
     * @return {String} Economy | Business
     */
    HostScrapService.prototype.getSelectedCabinType = function() {

      this._model.departure[0].user_input_travel_class =
        $(this._selectors.cabin.selected).val();
      this._model.return[0].user_input_travel_class =
        this._model.departure[0].user_input_travel_class;

      return this._model.departure[0].user_input_travel_class;
    };

    /**
     * Set the cabin type to host
     *
     * @return {String} Economy | Business
     */
    HostScrapService.prototype.setHostCabinType = function(cabinValue) {
      this._model.departure[0].user_input_travel_class = cabinValue;
      this._model.return[0].user_input_travel_class =
        this._model.departure[0].user_input_travel_class;

      $(this._selectors.cabin[cabinValue]).prop('checked', true);
    };

    //------------------------------------------------------
    // - Promo Code
    //------------------------------------------------------

    HostScrapService.prototype.getPromoCode = function() {
      var value = $(this._selectors.promo_code).val();
      return value;
    };

    HostScrapService.prototype.setPromoCode = function(value) {
      $(this._selectors.promo_code).val(value);
    };

    //------------------------------------------------------
    // - Multicity Departure and Arrival
    //------------------------------------------------------

    HostScrapService.prototype.getLocations = function() {
      var locations = [];
      var locationSelectors = this._selectors.travel.locations;

      // - first get the Round-Trip - One way - Location
      // - second populate the Multi - City - Location
      $.each(locationSelectors, function( index, value ) {
        var locationSelectorInstance = this;
        var locationItem = {
          ui: {
            expanded: 1
          },
          origin: {
            locationName: $(locationSelectorInstance.origin.locationName).val(),
            locationCode: $(locationSelectorInstance.origin.locationCode).val(),
            locationType: $(locationSelectorInstance.origin.locationType).val(),
            errorTypes: locationSelectorInstance.origin.errorTypes
          },
          destination: {
            locationName:
              $(locationSelectorInstance.destination.locationName).val(),
            locationCode:
              $(locationSelectorInstance.destination.locationCode).val(),
            locationType:
              $(locationSelectorInstance.destination.locationType).val(),
            errorTypes: locationSelectorInstance.destination.errorTypes
          },
          date: {
            origin: $(locationSelectorInstance.date.origin).val(),
            destination: $(locationSelectorInstance.date.destination).val()
          }
        };
        if(locationSelectorInstance.date.errorTypes) {
          locationItem.date.errorTypes =
            locationSelectorInstance.date.errorTypes;
        }
        if(locationSelectorInstance.date.originErrorTypes) {
          locationItem.date.originErrorTypes =
            locationSelectorInstance.date.originErrorTypes;
        }
        if(locationSelectorInstance.date.destinationErrorTypes) {
          locationItem.date.destinationErrorTypes =
            locationSelectorInstance.date.destinationErrorTypes;
        }

        if(index > 2){
          locationItem.ui.expanded = 0;
        }

        locations.push(locationItem);
      });

      // TODO: Save to the farenet model before return
      return locations;
    };

    /**
     *
     * Round trip and one way are been the index number 0
     * then multicity starts in 1
     * @param {[type]} location [description]
     * @param {[type]} index    [description]
     */
    HostScrapService.prototype.setLocationOrigin = function(location, index) {
      var locationSelectors = this._selectors.travel.locations;
      var locationSelectorInstance = locationSelectors[index];

      //TODO: Basically we have the same code here 3 times, so...

      $(locationSelectorInstance.origin.locationName)
        .val(location.locationName);
      $(locationSelectorInstance.origin.locationCode)
        .val(location.locationCode);
      $(locationSelectorInstance.origin.locationType)
        .val(location.locationType);

      // if we are in multicity or one way we should populate the multicity
      // first 2 routes
      if(index === "0"){
        locationSelectorInstance = locationSelectors[1];
        $(locationSelectorInstance.origin.locationName)
          .val(location.locationName);
        $(locationSelectorInstance.origin.locationCode)
          .val(location.locationCode);
        $(locationSelectorInstance.origin.locationType)
          .val(location.locationType);
      }

      // if we are in multicity or one way we should populate the multicity
      // first 2 routes
      if(index === "1"){
        locationSelectorInstance = locationSelectors[0];
        $(locationSelectorInstance.origin.locationName)
          .val(location.locationName);
        $(locationSelectorInstance.origin.locationCode)
          .val(location.locationCode);
        $(locationSelectorInstance.origin.locationType)
          .val(location.locationType);
      }
    };

    HostScrapService.prototype.setLocationDestination =
      function(location, index) {
        var locationSelectors = this._selectors.travel.locations;
        var locationSelectorInstance = locationSelectors[index];
        $(locationSelectorInstance.destination.locationName)
          .val(location.locationName);
        $(locationSelectorInstance.destination.locationCode)
          .val(location.locationCode);
        $(locationSelectorInstance.destination.locationType)
          .val(location.locationType);
      };

    HostScrapService.prototype.setLocationDate = function(location, index,
      isOrigin) {
      var locationSelectors = this._selectors.travel.locations;
      var locationSelectorInstance = locationSelectors[index];
      var date = location.date;

      if(isOrigin) {
        $(locationSelectorInstance.date.origin).val(date.origin);
      } else {
        $(locationSelectorInstance.date.destination).val(date.destination);
      }

      // if we are in multicity or one way we should populate the multicity
      // first 2 routes
      if(index === "0"){
        locationSelectorInstance = locationSelectors[1];
        if(isOrigin) {
          $(locationSelectorInstance.date.origin).val(date.origin);
        }
      }

      // if we are in multicity or one way we should populate the multicity
      // first 2 routes
      if(index === "1"){
        locationSelectorInstance = locationSelectors[0];
        if(isOrigin) {
          $(locationSelectorInstance.date.origin).val(date.origin);
        }
      }
    };

    //------------------------------------------------------
    // - Journey Type
    //------------------------------------------------------

    HostScrapService.prototype.getJourneyType = function() {
      var user_input_journey_type = 'Round Trip';
      return user_input_journey_type;
    };

    HostScrapService.prototype.setJourneyType = function() {
    };

    //------------------------------------------------------
    // - Location
    //------------------------------------------------------

    HostScrapService.prototype.getLocation = function() {
      var location = [
          {
            user_input_origin_airport_code: 'BBB',
            user_input_destination_airport_code: 'AAA'
          }
      ];
      return location;
    };

    HostScrapService.prototype.setLocation = function() {
    };


    //------------------------------------------------------
    // - Extra Info Geo
    //------------------------------------------------------

    HostScrapService.prototype.getExtraInfoGeo = function() {
      var geo = [
        {
          origin_city_name: 'Miami',
          origin_country_name: 'United States',
          destination_city_name: 'Miami',
          destination_country_name: 'United States'
        }
      ];
      return geo;
    };

    //------------------------------------------------------
    // - Departure
    //------------------------------------------------------

    HostScrapService.prototype.getDeparture = function() {
      var departure = [
        {
          user_input_travel_class: 'Economy Promo',
          user_input_date: '2016-03-20',
        }
      ];
      return departure;

    };

    HostScrapService.prototype.setDeparture = function() {
    };

    //------------------------------------------------------
    // - Return
    //------------------------------------------------------

    HostScrapService.prototype.getReturn = function() {
      var return1 = [
            {
              user_input_travel_class: 'Economy Promo',
              user_input_date: '2016-03-20',
            }
      ];
      return return1;
    };

    HostScrapService.prototype.setReturn = function() {
    };

    return new HostScrapService();
  }

  angular
      .module('responsiveBookingEngine')
      .factory('hostScrapService', hostScrapService);

});
