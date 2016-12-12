var Farenet = (function() {
  'use strict';

  /*
    Private variables
  */
  var SPECIAL_VALUES = {
    NOT_EXIST: -1,
    TOO_MANY: -2,
    UNKNOWN: -3
  };

  function VALUE_UNDEFINED(value) {
    for(var key in SPECIAL_VALUES) {
      if (value === SPECIAL_VALUES[key]) return true;
    }

    if (typeof value === 'undefined') return true;
  }

  var LOCAL_VARIABLES = {
    DOMESTIC_COUNTRY: ['Panama', 'Panamá', 'PA'],
    DOMESTIC: 'Domestic',
    INTERNATIONAL: 'International',
    DIRECTION: {DEPARTURE: 'departure', RETURN: 'return'},
    DEPARTURE_DATA_ID: '#tripIndexID_0',
    RETURN_DATA_ID: '#tripIndexID_1',
    TRAVEL_CLASS: {
      USER: {ECONOMY_LIGHT: 'Economy Light', ECONOMY_EXTRA: 'Economy Extra', ECONOMY_FLEX: 'Economy Flex',
        ECONOMY_CLASS: 'Economy Class', BUSINESS_PROMO: 'Business Promo', BUSINESS_FLEX: 'Business Flex'},
      FARENET: { DEFAULT_TRAVEL_CLASS: 'Economy', ECONOMY: 'Economy',
        BUSINESS: 'Business', PREMIUM_ECONOMY: 'Premium Economy', FIRST: 'First' },
    },
    JOURNEY_TYPE: {ROUND_TRIP: 'Round Trip', ONE_WAY: 'One Way', MULTI_CITY: 'Multy City'},

    url: SPECIAL_VALUES.UNKNOWN,
    adults: SPECIAL_VALUES.NOT_EXIST,
    children: SPECIAL_VALUES.NOT_EXIST,
    infants: SPECIAL_VALUES.NOT_EXIST,
    oac: SPECIAL_VALUES.NOT_EXIST,
    dac: SPECIAL_VALUES.NOT_EXIST,
    depDate: SPECIAL_VALUES.NOT_EXIST,
    retDate: SPECIAL_VALUES.NOT_EXIST,
    promoCode: SPECIAL_VALUES.UNKNOWN,
    currency_code: SPECIAL_VALUES.NOT_EXIST,
    journeyType: SPECIAL_VALUES.NOT_EXIST,
    travelClass: SPECIAL_VALUES.NOT_EXIST,

    sessionSummaries: SPECIAL_VALUES.NOT_EXIST,
  };

  var PANAMA_AIRPORT_CODES = ["BOC", "CTD", "CHX", "DAV", "ONX", "BLB", "BLB", "JQE",
    "PLP", "PAC", "PUE", "RIH", "SYP", "PTY", "PVE", "NBL"];

  var $ = jQuery,
      instance = {};

  /*
    Public API
  */
  instance.getResult = function() {
    var result = instance.parse();
    return result;
  };

  instance.parseAndSend = function() {
    var result = instance.parse();
    if (result && (typeof result === 'object')) {
      sendData(result);
    }
	};

  instance.parse = function() {
    try {
      var result = getResult();
      return result;
    } catch (e) {
      console.log('There was an error ' + e.name + ': ' + e.message + '\n' + e.stack);
    }

  };

  // First time trigger
  instance.parseAndSend();

  return instance;

  /*
    Private functions (parse)
  */
  function sendData(result) {
    /*  TODO uncomment to send data to server  add ajax POST
    result = JSON.stringify(result);


    */
  }


	function getResult() {
	  parseSessionStorage();
    var JSON_VERSION = '2.1.0',
      AIRLINE = {
        id: 'copaair',
        code: 'cm'
      },
      datasource = getDatasource(),
      passengers = getPassengers(),
      total_price = getTotalPrice(),
      geo = getGeo(),
      extra_info = getExtraInfo(),
      user_input_journey_type = getJourneyType(),
      result;

    var flightType = getFlightType(extra_info, geo.location);

    var routes = getFlightRoutes();


    var departureDirectionData;
    var returnDirectionData;

    switch(user_input_journey_type) {
      case LOCAL_VARIABLES.JOURNEY_TYPE.ONE_WAY:
      case LOCAL_VARIABLES.JOURNEY_TYPE.MULTI_CITY:
        departureDirectionData = routes;
        break;
      case LOCAL_VARIABLES.JOURNEY_TYPE.ROUND_TRIP:
        if (routes.length === 2) {
          departureDirectionData = [routes[0]];
          returnDirectionData = [routes[1]];
        }
        break;
       default:
        departureDirectionData = routes;
        break;
    }

    result = {
      version: JSON_VERSION,
      airline: AIRLINE,
      datasource: datasource,
      passengers: passengers,
      user_input_journey_type: user_input_journey_type,
      flight_type: flightType,
      total_price: total_price,
      geo: geo,
      departure: departureDirectionData,
      return: returnDirectionData,
      extra_info: extra_info
    };

		return result;
	}

  function parseSessionStorage() {
    var storageExist = window.sessionStorage["Model.Reservation"];
    var reservation;

    if (storageExist) {
      try {
        reservation = JSON.parse(storageExist);
      } catch (e) {
        return;
      }
    } else return;

    if (!reservation.summaries[0] || !reservation.summaries[0]) return;

    LOCAL_VARIABLES.sessionSummaries = reservation.summaries[0];
  }

	function getDatasource() {
    var url = getUrl();
    return {
			step: 'ibe-flight-selection',
			type: 'flexible-dates',
			url : url
    };
  }

  function getUrl() {
    LOCAL_VARIABLES.url = document.URL;

    return LOCAL_VARIABLES.url;
  }

  /* Create date based on utc, in which returned object after
   * use getUTC* - returned not changed date on every timezone*/
  function getDateInUTC(dateArray) {
    var parsedDate = {
      year: +dateArray[2],
      month: +dateArray[1] - 1,
      day: +dateArray[0]
    };
    var utcDate = new Date(Date.UTC(parsedDate.year, parsedDate.month, parsedDate.day));

    return utcDate;
  }

	function getPassengers() {
    var passengers = SPECIAL_VALUES.NOT_EXIST;

    var passengersNumber = $('.table-row.passengerLabel').length;
    if (passengersNumber) return passengersNumber;

    var storageExist = window.sessionStorage["Model.Reservation"];
    var reservation;

    if (storageExist) {
      try {
        reservation = JSON.parse(storageExist);
      } catch (e) {
        return passengers;
      }
    } else return passengers;

    if (!reservation || !reservation.summaries[0] || !reservation.summaries[0].passengers) {
      return passengers;
    }

    passengersNumber = reservation.summaries[0].passengers.length;
    if (passengersNumber) return passengersNumber;

    return passengers;
	}

  function getTotalPrice() {
    var totalPrice = {
      cash: SPECIAL_VALUES.NOT_EXIST,
      miles: SPECIAL_VALUES.NOT_EXIST,
      taxes: SPECIAL_VALUES.NOT_EXIST,
      currency: SPECIAL_VALUES.NOT_EXIST,
      currency_code: SPECIAL_VALUES.NOT_EXIST
    };

    var currency = getCurrency();

    totalPrice.currency = currency;
    totalPrice.currency_code = currency;

    return totalPrice;
  }

  function getCurrency() {
    var currency = SPECIAL_VALUES.NOT_EXIST;

    if (window.s) {
      if (window.s.currencyCode) {
        currency = window.s.currencyCode;
      }
    }

    LOCAL_VARIABLES.currency_code = currency;

    return currency;
  }

  function getGeo() {
    var geo = {
      location: SPECIAL_VALUES.NOT_EXIST,
      language: SPECIAL_VALUES.NOT_EXIST
    };

    var location = getLocation();
    var language = getLanguage();

    geo.location = location;
    geo.language = language;

    return geo;
  }

  /* Try to use URL value, else parse first flight-info*/
  function getLocation() {
    var location = [{
      user_input_origin_airport_code: LOCAL_VARIABLES.oac,
      user_input_destination_airport_code: LOCAL_VARIABLES.dac
    }];


    var cityCodes = getAirportCodesFromFlightList();
    if (!cityCodes) {
      cityCodes = getAirportCodesFromSessionStorage();
    }

    if (!cityCodes) return location;

    var oneWay = cityCodes.length === 2;
    var roundTrip = cityCodes.length === 4 &&
      cityCodes[0] === cityCodes[3] &&
      cityCodes[1] === cityCodes[2];
    var multiCity = cityCodes.length && cityCodes.length % 2 === 0;

    if (oneWay) {
      LOCAL_VARIABLES.journeyType = LOCAL_VARIABLES.JOURNEY_TYPE.ONE_WAY;

    } else if (roundTrip) {
      LOCAL_VARIABLES.journeyType = LOCAL_VARIABLES.JOURNEY_TYPE.ROUND_TRIP;

    } else if (multiCity) {
      LOCAL_VARIABLES.journeyType = LOCAL_VARIABLES.JOURNEY_TYPE.MULTI_CITY;
    }

    location = [];
    for (var codeIndex = 0; codeIndex < cityCodes.length; codeIndex = codeIndex + 2) {
      var tripCodes = {
        user_input_origin_airport_code: cityCodes[codeIndex],
        user_input_destination_airport_code: cityCodes[codeIndex + 1]
      };

      location.push(tripCodes);
    }

    return location;
  }

  function getAirportCodesFromFlightList() {
    var flightList = $('.-ncr-theme-scope-AirportName');

    var airportCodes = [];
    var codeRegExp = /(?!-)[A-Z]{3}/;
    for (var index = 0; index < flightList.length; index++) {
      var codeMatch = $(flightList[index]).attr('class').match(codeRegExp);
      if (codeMatch) airportCodes.push(codeMatch[0]);
    }

    if (airportCodes.length === 0) return;
    if (airportCodes.length !== flightList.length)  return;

    return airportCodes;
  }

  function getAirportCodesFromSessionStorage() {
    var summaries = LOCAL_VARIABLES.sessionSummaries;
    if (VALUE_UNDEFINED(summaries)) return;

    var flights = summaries.flightSegments;
    if (VALUE_UNDEFINED(flights) || flights.length === 0) return;

    var airportCodes = [];

    for (var index = 0; index < flights.length; index++) {
      airportCodes.push(flights[index].departureAirport);
      airportCodes.push(flights[index].arrivalAirport);
    }

    if (airportCodes.length === 0) return;

    return airportCodes;
  }

  function getLanguage() {
    var language = {
      site_edition: SPECIAL_VALUES.NOT_EXIST,
      lang: SPECIAL_VALUES.NOT_EXIST
    };

    var langRegExp = /lang_(\w{2}).*locale_(\w{2})/;
    var langMatch = $('#copa-header').find('div[class^="lang"]').attr('class').match(langRegExp);

    // we can exit or try another method
    if (langMatch.length !== 3) return language;

    language.lang = langMatch[1];
    language.site_edition = langMatch[1] + '-' + langMatch[2];

    return language;
  }

  function getExtraInfo() {
    var extraInfo = {
      device_category: SPECIAL_VALUES.UNKNOWN,
      promo_code: SPECIAL_VALUES.UNKNOWN,
      geo: [{
        origin_city_name: SPECIAL_VALUES.UNKNOWN,
        origin_country_name: SPECIAL_VALUES.UNKNOWN,
        destination_city_name: SPECIAL_VALUES.UNKNOWN,
        destination_country_name: SPECIAL_VALUES.UNKNOWN
      }],
      script_filename: SPECIAL_VALUES.UNKNOWN
    };

    var deviceCategory = getDeviceCategory();
    var promoCode = getPromoCode();
    var geo = getGeoExtraInfo();
    var scriptFileName = '';

    extraInfo.device_category = deviceCategory;
    extraInfo.promo_code = promoCode;
    extraInfo.geo = geo;
    extraInfo.script_filename = scriptFileName;

    return extraInfo;
  }

  function getDeviceCategory() {
    var deviceCategory;
    if (navigator.userAgent.match(/iPad|PlayBook|Silk/i)) {
      deviceCategory = 'tablet';
    } else if (navigator.userAgent.match(/Android|webOS|iPhone|iPod|Blackberry|IEMobile|Opera Mini/i)) {
      deviceCategory = 'mobile';
    } else {
      deviceCategory = 'desktop';
    }
    return deviceCategory;
  }

  function getPromoCode() {
    return LOCAL_VARIABLES.promoCode;
  }

  function getGeoExtraInfo() {
    var geo = [{
      origin_city_name: SPECIAL_VALUES.UNKNOWN,
      origin_country_name: SPECIAL_VALUES.UNKNOWN,
      destination_city_name: SPECIAL_VALUES.UNKNOWN,
      destination_country_name: SPECIAL_VALUES.UNKNOWN
    }];

    var flightCityContryInfo = getCityContryFromFlightList();
    if (!flightCityContryInfo) {
      flightCityContryInfo = getCityContryFromSessionStorage();
    }

    var geoInfo = [];
    for (var index = 0; index < flightCityContryInfo.length; index = index + 2) {
      if (!flightCityContryInfo[0] || !flightCityContryInfo[1]) return geo;

      var info = {
        origin_city_name: flightCityContryInfo[0].city,
        origin_country_name: flightCityContryInfo[0].country,
        destination_city_name: flightCityContryInfo[1].city,
        destination_country_name: flightCityContryInfo[1].country
      };

      geoInfo.push(info);
    }

    return geoInfo;
  }

  function getCityContryFromFlightList() {

    var flightList = $('.-ncr-theme-scope-AirportName');
    var flightCityContryInfo = $(flightList).map(function getFlightCityCountry() {
      var flightText = $(this).text().trim();
      var textArray = flightText.split(',');
      if (textArray.length !== 2) return;

      return {
        city: textArray[0].trim(),
        country: textArray[1].trim()
      };
    });

    var indexOf = [].indexOf;

    if (!flightCityContryInfo || ~indexOf.call(flightCityContryInfo, undefined)) {
      return;
    }

    return flightCityContryInfo;
  }


  function getJourneyType() {
    return LOCAL_VARIABLES.journeyType;
  }

  function getFlightType(extraInfo, location) {
    var flightType = SPECIAL_VALUES.NOT_EXIST;

    var domestic = getDomesticByCountryName(extraInfo);
    if (!domestic) {
      domestic = getDomesticByAirportCodes(location);
    }

    if (domestic) {
      flightType = LOCAL_VARIABLES.DOMESTIC;
    } else if (typeof domestic !== 'undefined') {
      flightType = LOCAL_VARIABLES.INTERNATIONAL;
    }

    return flightType;
  }

  function getDomesticByCountryName(extraInfo) {

    if (!extraInfo || !extraInfo.geo || extraInfo.geo.length === 0) return;

    var domestic = true;
    for (var index = 0; index < extraInfo.geo.length; index++) {
      var origDomestic = ~LOCAL_VARIABLES.DOMESTIC_COUNTRY.indexOf(extraInfo.geo[index].origin_country_name);
      var destDomestic = ~LOCAL_VARIABLES.DOMESTIC_COUNTRY.indexOf(extraInfo.geo[index].destination_country_name);

      if (!origDomestic || !destDomestic) {
        domestic = false;
        break;
      }
    }

    return domestic;
  }

  function getDomesticByAirportCodes(location) {
    if (!location || location.length === 0) return;

    var domestic = true;

    for (var index = 0; index < location.length; index++) {

      if (VALUE_UNDEFINED(location[index].user_input_origin_airport_code) ||
          VALUE_UNDEFINED(location[index].user_input_destination_airport_code)) {
            return;
      }

      var origDomestic = checkDomestic(
        PANAMA_AIRPORT_CODES, location[index].user_input_origin_airport_code);
      var destDomestic = checkDomestic(
        PANAMA_AIRPORT_CODES, location[index].user_input_destination_airport_code);

      if (!origDomestic || !destDomestic) {
        domestic = false;
        break;
      }
    }

    return domestic;

    function checkDomestic(elementsList, checkingElement) {
      return elementsList.some(function checkVariant(element) {
        return checkingElement === element;
      });
    }
  }

  function formatDate(date) {
    if (VALUE_UNDEFINED(date)) return date;

    var month = date.getUTCMonth() + 1,
        day = date.getUTCDate();
    month = (month < 10) ? '0' + month : month;
    day = (day < 10) ? '0' + day : day;
    date = date.getUTCFullYear() + '-' + month + '-' + day;
    return date;
  }

  function convertStringDateToUTC(stringDate) {
    var utcDate = SPECIAL_VALUES.NOT_EXIST;

    var localDate = new Date(stringDate);
    if (isNaN(localDate)) return utcDate;

    var timezoneOffset = (new Date()).getTimezoneOffset();
    utcDate = new Date(localDate.setMinutes(localDate.getMinutes() - timezoneOffset));

    return utcDate;
  }

  function getFlightRoutes() {
    var routes = [];

    var summaries = LOCAL_VARIABLES.sessionSummaries;

    var segments = [];
    if (!VALUE_UNDEFINED(summaries) && summaries.flightSegments &&
      summaries.flightSegments.length !== 0) {
        segments = summaries.flightSegments;
     }



    var flightsElements = $('.flight-row, .itinerary-segments-panel');

    if (flightsElements.length === 0) flightsElements = [];

    var flightsNumber = segments.length || flightsElements.length;

    for (var index = 0; index < flightsNumber; index++) {
      var routeInfo = getFlightDirectionInfo(segments[index], flightsElements[index], index);
      if (routeInfo) routes.push(routeInfo);
    }

    if (routes.length) return routes;
   }

  function getFlightDirectionInfo(flight, flightElement, index) {

    var userInputTravelClass = getInputTravelClass(flight);
    var farenetTravelClass = getFarenetTravelClass(userInputTravelClass);

    var userInputDate = getUserInputDate(flight);

    //if (VALUE_UNDEFINED(userInputDate)) return;

    var lowestPrice = SPECIAL_VALUES.UNKNOWN;

    var selectedDate = {
      date: userInputDate,
      lowest_price: lowestPrice,
      flights: [],
      selected: 1
    };

    var flights = getFlightInfo(flight, flightElement, index);

    selectedDate.flights = flights;

    var dates = [selectedDate];

    var directionData = {
      user_input_travel_class: userInputTravelClass,
      farenet_travel_class: farenetTravelClass,
      user_input_date: userInputDate,
      dates: dates,
    };

    return directionData;
  }

  function getInputTravelClass(flight) {
    var userClass = SPECIAL_VALUES.NOT_EXIST;

    if (!flight || !flight.currentCabinClass) return userClass;

    var cabinClass = flight.currentCabinClass;

    var USER = LOCAL_VARIABLES.TRAVEL_CLASS.USER;
    switch(cabinClass) {
      case 'ECONOMY_CLASS':
        userClass = USER.ECONOMY_CLASS; break;
      case 'ECONOMY_LIGHT':
        userClass = USER.ECONOMY_LIGHT; break;
      case 'ECONOMY_EXTRA':
        userClass = USER.ECONOMY_EXTRA; break;
      case 'ECONOMY_FLEX':
        userClass = USER.ECONOMY_FLEX; break;
      case 'BUSINESS_PROMO':
        userClass = USER.BUSINESS_PROMO; break;
      case 'BUSINESS_FLEX':
        userClass = USER.BUSINESS_FLEX; break;
    }

    return userClass;
  }

  function getFarenetTravelClass(travelClass) {
    var farenetClass = SPECIAL_VALUES.NOT_EXIST;

    var USER = LOCAL_VARIABLES.TRAVEL_CLASS.USER;
    switch(travelClass) {
      case USER.ECONOMY_LIGHT:
      case USER.ECONOMY_EXTRA:
      case USER.ECONOMY_FLEX:
      case USER.ECONOMY_CLASS:
        farenetClass = LOCAL_VARIABLES.TRAVEL_CLASS.FARENET.ECONOMY;
        break;
      case USER.BUSINESS_PROMO:
      case USER.BUSINESS_FLEX:
        farenetClass = LOCAL_VARIABLES.TRAVEL_CLASS.FARENET.BUSINESS;
        break;
    }

    return farenetClass;
  }

  function getUserInputDate(flight) {
    var userInputDate = SPECIAL_VALUES.NOT_EXIST;

    if (!flight || !flight.departureTime) return userInputDate;

    var utcDate = convertStringDateToUTC(flight.departureTime);

    userInputDate = formatDate(utcDate);

    return userInputDate;
  }

  function getFlightInfo(flight, flightElement, index) {
    var flightInfo = [];

    //if (!flight) return flightInfo;

    var flightData = {
      departure_time: SPECIAL_VALUES.NOT_EXIST,
      arrival_time: SPECIAL_VALUES.NOT_EXIST,
      duration: SPECIAL_VALUES.NOT_EXIST,
      flight_list: []
    };

    var flightList = [];
    flightInfo = {
      number: SPECIAL_VALUES.NOT_EXIST,
      departure_time: SPECIAL_VALUES.NOT_EXIST,
      arrival_time: SPECIAL_VALUES.NOT_EXIST,
      duration: SPECIAL_VALUES.NOT_EXIST,
      origin_airport_code: SPECIAL_VALUES.NOT_EXIST,
      destination_airport_code: SPECIAL_VALUES.NOT_EXIST,
    };

    flightInfo.number = getRoute(flight, flightElement, index);
    var flightTime = getArrivalDepartureTime(flight, flightElement);
    flightInfo.departure_time  = flightTime.departureTime;
    flightInfo.arrival_time = flightTime.arrivalTime;

    var duration =  getRouteDuration(flightTime);
    flightInfo.duration = duration;

    var airportCodes = getAirportCodes(flight);
    flightInfo.origin_airport_code = airportCodes.origin_airport_code;
    flightInfo.destination_airport_code = airportCodes.destination_airport_code;

    var gates = getGates(flight, index);
    if (typeof gates !== 'undefined') {
      flightInfo.departure_gate = gates;
    }

    var boardingTime = getBoardingTime(flight, index);
    if (typeof boardingTime !== 'undefined') {
      flightInfo.boarding_time = boardingTime;
    }

    flightList.push(flightInfo);

    flightData.departure_time = flightInfo.departure_time;
    flightData.arrival_time = flightInfo.arrival_time;
    flightData.duration = duration;
    flightData.flight_list = flightList;

    return flightData;
  }

  function getRoute(flight, flightElement, index) {
    var flightNumber = SPECIAL_VALUES.NOT_EXIST;
    var flightRoute = getFlightRouteFromPageElement(flightElement, index);
    if (!flightRoute) {
      flightRoute = getFlightRouteFromSessionStorage(flight);
    }

    if (!flightRoute) return flightNumber;

    flightNumber = flightRoute;

    return flightNumber;

    function getFlightRouteFromPageElement(flightElement, index) {

      var flightRoute =  getFlightRouteFromThankYouPage(index);

      if (VALUE_UNDEFINED(flightElement)) return;

      if (flightRoute) return flightRoute;

      flightRoute = $(flightElement).find('.column-flight').text();
      if (!flightRoute) return;

      return flightRoute;
    }

    function getFlightRouteFromThankYouPage(index) {
      var pageThankYou = $('#thank-you-panel');

      if (pageThankYou.length === 0) return;

      var flightList = $(pageThankYou).find('.itinerary-segments-panel');
      if (flightList.length === 0) return;

      var selectedFlight = flightList[index];
      if (!selectedFlight) return;

      var routeText = $(selectedFlight).find('[data-repeat-index=0] span').eq(1).text().trim();
      var numberRegExp = /^(\w+).*\s(\d+)$/;
      var numberMatch = routeText.match(numberRegExp);
      if (!numberMatch || numberMatch.length !== 3) return;

      return numberMatch[1] + ' ' + numberMatch[2];
    }

    function getFlightRouteFromSessionStorage(flight) {
      if (!flight) return;

      if (!flight.marketingAirline || !flight.marketingAirline.code) return;

      var airline = flight.marketingAirline.code;
      var number = flight.flightNumber;

      if (!airline || !number) return;

      return airline + ' ' + number;
    }
  }

  function getGates(flight, index) {
    var gate = SPECIAL_VALUES.NOT_EXIST;
    var pageThankYou = $('#thank-you-panel');

    if (flight && flight.departureGate) {
      gate = flight.departureGate;
      return gate;
    }

    if (pageThankYou.length === 0) return;

    var flightList = $(pageThankYou).find('.itinerary-segments-panel');
    if (flightList.length === 0) return gate;

    var selectedFlight = flightList[index];
    if (!selectedFlight) return gate;

    var gateText = $(selectedFlight).find('[data-repeat-index=2] span').eq(1).text().trim();
    if (!gateText || gateText === '****') return gate;

    return gateText;
  }

  function getBoardingTime(flight, index) {
    var boardingTime = SPECIAL_VALUES.NOT_EXIST;

    var time = getBoardingTimeFromPage(index);

    if (!VALUE_UNDEFINED(time)) return time;

    time = getBoardingTimeFromSessionSummaries(flight);

    return time;

    function getBoardingTimeFromPage(index) {
      var time = SPECIAL_VALUES.NOT_EXIST;

      var pageThankYou = $('#thank-you-panel');

      if (pageThankYou.length === 0) return;

      var flightList = $(pageThankYou).find('.itinerary-segments-panel');
      if (flightList.length === 0) return;

      var selectedFlight = flightList[index];
      if (!selectedFlight) return time;

      var timeText = $(selectedFlight).find('[data-repeat-index=3] span').eq(1).text().trim();

      var boardingTime = get24Time(timeText);
      return boardingTime;
    }

    function getBoardingTimeFromSessionSummaries(flight) {
      var time = SPECIAL_VALUES.NOT_EXIST;
      if (!flight || !flight.boardingTime) return time;

      var timeRegExp = /\d{1,2}:\d{2}(?=:)/;
      var boardingTimeMatch = flight.boardingTime.match(timeRegExp);

      if (boardingTimeMatch) return boardingTimeMatch[0];

      return time;
    }

  }

  function getFlightIndexFromSessionSummaries(flightSummariesElement) {
    if (!flightSummairesElement) return;
    if (!LOCAL_VARIABLES.sessionSummaries || !LOCAL_VARIABLES.sessionSummaries.flightSegments)
      return;

    return LOCAL_VARIABLES.sessionSummaries.flightSegments.indexOf(
      flightSummariesElement);
  }

  function getArrivalDepartureTime(flight, flightElement) {
    var departureTime = SPECIAL_VALUES.NOT_EXIST;
    var arrivalTime = SPECIAL_VALUES.NOT_EXIST;

    var time = getTimeFromPageElement(flightElement);

    if (VALUE_UNDEFINED(time.departureTime) ||
        VALUE_UNDEFINED(time.arrivalTime)) {
        time = getTimeFromSessionStorage(time, flight);
    }

    return time;

    function getTimeFromPageElement(flight) {
      var departureTime = SPECIAL_VALUES.NOT_EXIST;
      var arrivalTime = SPECIAL_VALUES.NOT_EXIST;

      var depTimeText = $(flight).find('.column-departuretime').text().trim();

      var dep24Time;
      if (depTimeText) {
        dep24Time = get24Time(depTimeText);
      }

      if (dep24Time) {
        departureTime = dep24Time;
      }

      var arrTimeText = $(flight).find('.column-arrivaltime').text().trim();
      var arr24Time;
      if (arrTimeText) {
        arr24Time = get24Time(arrTimeText);
      }

      if (arr24Time) {
        arrivalTime = arr24Time;
      }

      return {
        departureTime: departureTime,
        arrivalTime: arrivalTime,
      };
    }

    function getTimeFromSessionStorage(time, flight) {
      if (!flight || !flight.departureTime || !flight.arrivalTime)
        return time;

      var timeRegExp = /\d{1,2}:\d{2}(?=:)/;
      var departureTimeMatch = flight.departureTime.match(timeRegExp);
      if (departureTimeMatch) {
        time.departureTime = departureTimeMatch[0];
      }

      var arrivalTimeMatch = flight.arrivalTime.match(timeRegExp);
      if (arrivalTimeMatch) {
        time.arrivalTime = arrivalTimeMatch[0];
      }

      return time;
    }

  }

  function get24Time(receivedTime) {
    var resultTime;
    receivedTime = receivedTime.split(' ');

    if (receivedTime.length > 1) {
      resultTime = receivedTime[0].split(':');
      if (receivedTime[1] === 'pm' || receivedTime[1] === 'PM') {
        resultTime[0] = +resultTime[0];
        resultTime[0] += 12;
        if (resultTime[0] === 24) {
          resultTime[0] = '12';
        }
        resultTime = resultTime[0] + ':' + resultTime[1];
      } else {
        if (resultTime[0] === '12') {
          resultTime[0] = '00';
        }
        resultTime = resultTime[0] + ':' + resultTime[1];
      }
    } else {
      resultTime = receivedTime[0];
    }

    var timeRegExp = /\d{1,2}:\d{2}/;
    if (resultTime.match(timeRegExp)) {
      return resultTime;
    }
    return SPECIAL_VALUES.NOT_EXIST;
  }

  function getRouteDuration(flightTime) {
    var duration = SPECIAL_VALUES.NOT_EXIST;
    var departure = flightTime.departureTime;
    var arrival = flightTime.arrivalTime;

    if (VALUE_UNDEFINED(departure) || VALUE_UNDEFINED(arrival)) return duration;

    var depArray = departure.split(':');
    var departureMins = +depArray[0] * 60 + (+depArray[1]);


    var arrArray = arrival.split(':');
    var arrMins = +arrArray[0] * 60 + (+arrArray[1]);

    if (arrMins < departureMins) {
      arrMins = 24 * 60 + arrMins;
    }

    duration = arrMins - departureMins;
    return duration;
  }

  function getAirportCodes(flight) {
    var flightInfo = {
      origin_airport_code: SPECIAL_VALUES.NOT_EXIST,
      destination_airport_code: SPECIAL_VALUES.NOT_EXIST
    };
    if (!flight) return flightInfo;

    if (flight.departureAirport) {
      flightInfo.origin_airport_code = flight.departureAirport;
    }

     if (flight.arrivalAirport) {
      flightInfo.destination_airport_code = flight.arrivalAirport;
    }

    return flightInfo;
  }

})();
