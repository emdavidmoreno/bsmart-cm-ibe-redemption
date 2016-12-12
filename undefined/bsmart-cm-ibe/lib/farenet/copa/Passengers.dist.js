var timer = setInterval(function() {
  if (typeof jQuery !== 'undefined') {
     clearInterval(timer);

     window.Farenet = (function() {
      'use strict';

      /*
        Private variables
      */
      var instance = {},
          $ = jQuery;

      /*
        Public API
      */
      instance.getResult = function() {
        var result = instance.parse();
        return result;
      };

      instance.parseAndSend = function() {
        var result = instance.parse();
        sendData(result);
      };

      instance.parse = function() {
        try {
          var result = getResult();
          return result;
        } catch (e) {
          console.log('There was an error: ' + e);
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
        var JSON_VERSION = '2.1.0',
            AIRLINE = {
              id: 'copaair',
              code: 'cm'
            },
            datasource = getDatasource(),
            user_input_journey_type = getJourneyType(),
            passengers = getPassengers(),
            total_price,
            geo = {},
            discounts,
            extra_info = {},
            departure;

        // 'currentLang' & 'current_PoS' are taken from Global Scope of current page
        geo.language = getSiteEditionAndLanguage(currentLang, current_PoS);
        geo.location = getLocation(user_input_journey_type, 'location');

        total_price = getTotalPrice(geo.language.lang);
        departure = getDeparture(user_input_journey_type, geo.location.length);
        discounts = getDiscounts(total_price.currency_code);

        extra_info.geo = getLocation(user_input_journey_type, 'geo');
        extra_info.device_category = getDeviceCategory();

        var result = {
          version: JSON_VERSION,
          airline: AIRLINE,
          datasource: datasource,
          passengers: passengers,
          user_input_journey_type: user_input_journey_type,
          total_price: total_price,
          discounts: discounts,
          geo: geo,
          departure: departure,
          disclaimer: {},
          extra_info: extra_info
        };

        if (user_input_journey_type === 'Round Trip') {
          result.return = getReturn();
        }

        if (user_input_journey_type === 'Round Trip' || user_input_journey_type === 'One Way') {
          if ((extra_info.geo[0].origin_country_name === 'Panama' ||
               extra_info.geo[0].origin_country_name === 'Panamá') &&
               extra_info.geo[0].origin_country_name === extra_info.geo[0].destination_country_name) {
            result.flight_type = 'Domestic';
          } else {
            result.flight_type = 'International';
          }
        } else {
          result.flight_type = -1;
        }

        return result;
      }

      function getDiscounts(currency) {
        var discountElems = $('.rowDiscount'),
            discounts = [];

        if (currency && currency !== -1 && currency !== -3) {
          discountElems.each(function(i) {
            var name = $(this).find('.item').text().trim(),
                price = formatPrice(currency, $(this).find('.price').text().trim().split(' ')[1]);
            discounts.push({
              name: name,
              price: price
            });
          });
        }
        return discounts;
      }

      function getReturn() {
        return getRoundTripFlightInfo(1);
      }

      function getDeparture(journeyType, numberOfFlights) {
        var departure = [];

        if (journeyType === 'One Way') {
          var info = $('.detailedPrice .item').first().text().trim().split('.')[1];
          info = info.split(' - ');

          var departureInfo = info[0].split(','),
              arrivalInfo = info[1].split(',');

          var inputDate = formatDate(departureInfo[1].trim()),
              departureTime = get24Time(departureInfo[2].trim()),
              arrivalTime = get24Time(arrivalInfo[2].trim());

          departure.push({
            user_input_date: inputDate,
            user_input_travel_class: -3,
            farenet_travel_class: -3,
            dates: [
              {
                date: inputDate,
                lowest_price: -3,
                selected: 1,
                flights: [
                  {
                    info: {
                      departure_time: departureTime,
                      arrival_time: arrivalTime,
                      duration: -3,
                      flight_list: []
                    }
                  }
                ]
              }
            ]
          });
          return departure;

        } else if (journeyType === 'Round Trip') {

          return getRoundTripFlightInfo(0);

        } else if (journeyType === 'Multi City') {
          var dates = $('#summaryBot_Top .detailedPrice tr').first().find('.item').text(),
              firstFlightDate,
              lastFlightDate,
              date;

          if (dates && dates.length > 0) {
            dates = dates.trim().split(',');
            firstFlightDate = formatDate(dates[dates.length - 4].trim());
            lastFlightDate = formatDate(dates[dates.length - 2].trim());
          }

          // handle departure for Multi City
          // doesn't have enough data on page
          for (var i = 0; i < numberOfFlights; i ++) {
            if (i === 0) {
              date = firstFlightDate;
            } else if (i === numberOfFlights - 1) {
              date = lastFlightDate;
            } else {
              date = -3;
            }

            departure.push({
              user_input_date: date,
              user_input_travel_class: -3,
              farenet_travel_class: -3,
              dates: [
                {
                  date: date,
                  lowest_price: -3,
                  selected: 1,
                  flights: [
                    {
                      info: {
                        departure_time: -3,
                        arrival_time: -3,
                        duration: -3,
                        flight_list: []
                      }
                    }
                  ]
                }
              ]
            });
          }
          return departure;
        }
      }

      // If elementNumber = 0 -> get departure for RoundTrip
      // If elementNumber = 1 -> get return for RoundTrip
      function getRoundTripFlightInfo(elementNumber) {
        var info = $('.detailedPrice .item').first().text().trim().split('.')[1],
            resultArray = [];
        info = info.split(' - ');

        var resultInfo = info[elementNumber].split(','),
            inputDate = formatDate(resultInfo[1].trim()),
            departureTime = get24Time(resultInfo[2].trim());

        resultArray.push({
          user_input_date: inputDate,
          user_input_travel_class: -3,
          farenet_travel_class: -3,
          dates: [
            {
              date: inputDate,
              lowest_price: -3,
              selected: 1,
              flights: [
                {
                  info: {
                    departure_time: departureTime,
                    arrival_time: -3,
                    duration: -3,
                    flight_list: []
                  }
                }
              ]
            }
          ]
        });
        return resultArray;
      }

      function formatDate(date) {
        var fDate = new Date(date);

        if (Object.prototype.toString.call(fDate) === "[object Date]") {
          // it is a date
          if ( isNaN( fDate.getTime() ) ) {  // d.valueOf() could also work
            // date is not valid
            var spanishMonths = {
              'enero': 'january',
              'febrero': 'february',
              'marzo': 'march',
              'abril': 'april',
              'mayo': 'may',
              'junio': 'june',
              'julio': 'july',
              'agosto': 'august',
              'septiembre': 'september',
              'octubre': 'october',
              'noviembre': 'november',
              'diciembre': 'december'
            },
            portugalMonths = {
              'Janeiro': 'january',
              'Fevereiro': 'february',
              'Março': 'march',
              'Abril': 'april',
              'Maio': 'may',
              'Junho': 'june',
              'Julho': 'july',
              'Agosto': 'august',
              'Setembro': 'september',
              'Outubro': 'october',
              'Novembro': 'november',
              'Dezembro': 'december'
            },
            dateArr = date.split(' '),
            m;

            for (m in portugalMonths) {
              if (dateArr[0] === m || smallFirstLetter(dateArr[0]) === m) {
                dateArr[0] = portugalMonths[m];
                break;
              }
            }

            for (m in spanishMonths) {
              if (dateArr[0] === m || capitalizeFirstLetter(dateArr[0]) === m) {
                dateArr[0] = spanishMonths[m];
                break;
              }
            }

            fDate = makeDate(dateArr.join(' '));
          } else {
            // date is valid
            fDate = makeDate(fDate);
          }
        } else {
          // it is not date object
          fDate = -1;
        }
        return fDate;
      }

      function makeDate(someDate) {
        someDate = new Date(someDate);
        var month = '' + (someDate.getMonth() + 1),
            day = '' + someDate.getDate(),
            year = someDate.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return year + '-' + month + '-' + day;
      }

      function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
      }

      function smallFirstLetter(string) {
        return string.charAt(0).toLowerCase() + string.slice(1);
      }

      function get24Time(time) {
        time = time.split(' ');

        var resultTime = time[0].split(':');

        if (time[1] === 'PM') {
          resultTime[0] = +resultTime[0] + 12;
          if (resultTime[0] === 24) {
            resultTime[0] = '12';
          }
        } else {
          if (resultTime[0] === '12') {
            resultTime[0] = '00';
          }
        }
        return resultTime[0] + ':' + resultTime[1];
      }

      function getPassengers() {
        var passengers = {
          user_input_adults: 0,
          user_input_children: 0,
          user_input_infants: 0
        };

        var passengersTypes = $('.detailedPrice .item').first().text().trim().split('.')[0];
        passengersTypes = passengersTypes.split(',');

        passengersTypes.forEach(function(item) {
          var type = item.trim().split(' ');

          if (type[1].indexOf('ADULT') !== -1 || type[1].indexOf('ADULTO') !== -1) {
            passengers.user_input_adults = +type[0];;
          } else if (type[1].indexOf('CHILD') !== -1 || type[1].indexOf('CRIANÇAS') !== -1 || type[1].indexOf('NIÑOS') !== -1) {
            passengers.user_input_children = +type[0];
          } else if (type[1].indexOf('INFANT') !== -1 || type[1].indexOf('BEBÉS') !== -1 || type[1].indexOf('INFANTES') !== -1) {
            passengers.user_input_infants = +type[0];
          }
        });

        return passengers;
      }

      function getLocation(journeyType, output) {
        var flights = $('#fbTravellerDetails .allocatedItems label').eq(0).text().trim().slice(9),
            location = [],
            geo = [];

        if (journeyType === 'One Way' || journeyType ==='Round Trip') {
          flights = flights.split('-');

          var origin = parseCityCountryAirport(flights[0]),
              destination = parseCityCountryAirport(flights[1]);

          location.push({
            user_input_origin_airport_code: origin.ac,
            user_input_destination_airport_code: destination.ac,
          });

          geo.push({
            origin_city_name: origin.city,
            origin_country_name: origin.country,
            destination_city_name: destination.city,
            destination_country_name: destination.country
          });

        } else if (journeyType === 'Multi City') {
          flights = flights.split(';');

          flights.forEach(function(item) {
            var flight = item.split('-');

            if (flight.length > 2) {
              // if we have this case then we have portugal or spanish language
              // and we have excess '-' symbol and excess array element
              flight[0] = flight[0] + flight[1];
              flight[0] = flight[0].replace('Ciudad', '').replace('Cidade', '');
              flight[1] = flight[2];
              delete flight[2];
            }

            var origin = parseCityCountryAirport(flight[0]),
                destination = parseCityCountryAirport(flight[1]);

            location.push({
              user_input_origin_airport_code: origin.ac,
              user_input_destination_airport_code: destination.ac,
            });

            geo.push({
              origin_city_name: origin.city,
              origin_country_name: origin.country,
              destination_city_name: destination.city,
              destination_country_name: destination.country
            });
          });
        }

        if (output === 'location') {
          return location;
        } else if (output === 'geo') {
          return geo;
        }

        function parseCityCountryAirport(infoString) {
          var direction = infoString.trim().split(','),
              directionCity;

          // Because of ', ' in the begining of some first elements
          if (direction[0] === '') {
            directionCity = direction[1].slice( 0, direction[1].indexOf('(') ).trim();
          } else {
            directionCity = direction[0].slice( 0, direction[0].indexOf('(') ).trim();
          }

          var countryAndCode = direction[direction.length - 1].split('(');

          var directionCountry = countryAndCode[0].trim(),
              ac = countryAndCode[1];

          if (ac) {
            ac = ac.replace(')', '').trim();
          }

          return {
            city: directionCity,
            country: directionCountry,
            ac: ac
          };
        }
      }

      function getJourneyType() {
        // Need to slice from 9 character because of 'Flight - ' at the begining of string
        var journeyInfo = $('#fbTravellerDetails .allocatedItems label').eq(0).text().trim().slice(9),
            journeyType = '';

        if (journeyInfo.indexOf(';') === -1) {
          // 'One Way' or 'Round Trip'
          var pos = 0,
              counter = 0;

          while(true) {
            var foundPos = journeyInfo.indexOf('-', pos);

            if (foundPos == -1) break;

            counter ++;
            pos = foundPos + 1;
          }

          if (counter === 1) {
            // In 'One Way' we will have 1 '-' character
            journeyType = 'One Way';
          } else if (counter > 1) {
            // In 'Round Trip' we will have several '-' characters
            journeyType = 'Round Trip';
          }

        } else {
          // 'Multi City' (each item of journeyInfo is 1 flight)
          journeyType = 'Multi City';
        }

        return journeyType;
      }

      function getTotalPrice(lang) {
        var totalPrice = $('#summaryBot_Top_totalPrice').text().trim().split(' '),
            cash = totalPrice[1],
            currencyCode = totalPrice[0],
            currency = '',
            taxes = $('.detailedPrice .price').last().text().trim().split(' ')[1],
            miles = -1,
            fuelSurcharges,
            fuelSurchargesStr,
            fuelSurchargesRow,
            priceRows = $('.detailedPrice tr');

        if (lang === 'en') {
          fuelSurchargesStr = 'Fuel Surcharges';
        } else if (lang === 'pt') {
          fuelSurchargesStr = 'Sobretaxas de combustível';
        } else if (lang === 'es') {
          fuelSurchargesStr = 'Recargos de combustible';
        }

        priceRows.each(function(i, row) {
          var nameOfRow = $(row).text();
          if (nameOfRow.indexOf(fuelSurchargesStr) !== -1) {
            // if we have '+' in the row, so it is table with 'base_fare + fuel_surcharges' priceRows
            // need to pass fuel_surcharges as -3
            if (nameOfRow.indexOf('+') === -1) {
              fuelSurchargesRow = row;
              fuelSurcharges = $(fuelSurchargesRow).find('.money').last();
            } else {
              fuelSurcharges = -3;
            }
          }
        });

        if (fuelSurcharges) {
          if (fuelSurcharges !== -3) {
            fuelSurcharges = formatPrice(currencyCode, fuelSurcharges.eq(0).text().trim().split(' ')[1]);
          }
        } else {
          fuelSurcharges = -1;
        }

        cash = formatPrice(currencyCode, cash);
        taxes = formatPrice(currencyCode, taxes);
        currency = selectCurrency(currencyCode);

        totalPrice = {
          cash: cash || -1,
          miles: miles,
          taxes: taxes || -1,
          currency: currency,
          currency_code: currencyCode,
          fuel_surcharges: fuelSurcharges
        };

        return totalPrice;
      }

      function getSiteEditionAndLanguage(langFromSite, editionFromSite) {
        var siteEdition = editionFromSite.replace('CM', '').toLowerCase(),
            language = {};

        siteEdition = langFromSite + '-' + siteEdition;

        language.site_edition = siteEdition;
        language.lang = langFromSite;

        return language;
      }

      function getDatasource() {
        var referrer = document.referrer;
        return {
          step: 'ibe-passengers-info',
          type: 'default',
          url: document.URL,
          referrer: referrer
        };
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

      function formatPrice(currency, priceString) {
        var price;
        if (priceString) {
          switch(currency) {
            case 'BRL':
              price = +priceString.replace(/\./g, '').replace(',', '.');
              break;
            case 'CAD':
              price = +priceString.replace(/\,/g, '');
              break;
            case 'COP':
              price = +priceString.replace(/\./g, '');
              break;
            case 'CLP':
              price = +priceString.replace(/\,/g, '');
              break;
            case 'ARS':
              price = +priceString.replace(/\./g, '').replace(',', '.');
              break;
            default:
              price = +priceString.replace(/\,/g, '');
            }
        }
        return price;
      }

      function selectCurrency(currencyCode) {
        var currency;
        if (currencyCode) {
          switch(currencyCode) {
            case 'BRL':
              currency = 'R$';
              break;
            case 'CAD':
              currency = 'C$';
              break;
            case 'COP':
              currency = 'COL$';
              break;
            case 'CLP':
              currency = 'CLP$';
              break;
            default:
              currency = '$';
          }
        }
        return currency;
      }

     })();
   }
 }, 300);
