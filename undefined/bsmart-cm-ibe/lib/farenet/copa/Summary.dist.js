(function(){
  var timer = setInterval(function() {
    if (typeof window.jQuery !== 'undefined') {
       clearInterval(timer);

       // We are not triggering a Farenet if there are a Farenet already there
       if (!window.Farenet) {
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
                // 's.products' is taken from Global Scope of current page
                user_input_journey_type = getJourneyType(s.products),
                passengers = getPassengers(),
                total_price,
                total_price_per_passenger_type,
                disclaimer = getDisclaimers(),
                geo = {},
                extra_info = {},
                departure,
                discounts,
                result;

            // 'currentLang' & 'current_PoS' are taken from Global Scope of current page
            geo.language = getSiteEditionAndLanguage(currentLang, current_PoS);
            geo.location = getLocation(user_input_journey_type);

            total_price = getTotalPrice(geo.language.lang);
            total_price_per_passenger_type = getTotalPricePerPassengerType(total_price.currency_code, total_price.fuel_surcharges, geo.language.lang);
            discounts = getDiscounts(total_price.currency_code);

            extra_info.geo = getCitiesAndCountries(user_input_journey_type);
            extra_info.device_category = getDeviceCategory();

            departure = getDeparture(user_input_journey_type);

            result = {
              version: JSON_VERSION,
              airline: AIRLINE,
              datasource: datasource,
              passengers: passengers,
              user_input_journey_type: user_input_journey_type,
              total_price: total_price,
              total_price_per_passenger_type: total_price_per_passenger_type,
              discounts: discounts,
              geo: geo,
              departure: departure,
              disclaimer_mapping: disclaimer,
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

          function getDisclaimers() {
            var container = $('.footnote'),
                refTime = container.find('.refTime'),
                ref = container.find('.ref'),
                disclaimerMapping = {};

            if (ref.length > 0) {
              disclaimerMapping = parseDisclaimers(ref, disclaimerMapping);
            }

            if (refTime.length > 0) {
              disclaimerMapping = parseDisclaimers(refTime, disclaimerMapping);
            }

            return disclaimerMapping;

            function parseDisclaimers(elements, output) {
              var parent = elements.parents().eq(0).clone().children().remove().end().html().trim().split('\n');

              elements.each(function(i) {
                var name = $(this).text(),
                    text = parent[i].trim();

                if (text[text.length - 1] === ',') {
                  text = text.slice(0, text.length - 1);
                }

                output[name] = {
                  symbol: name,
                  text: text
                };
              });
              return output;
            }
          }

          function getReturn() {
            return getFlightInfo(1);
          }

          function getDeparture(journeyType) {
            var departure = [],
                depToAdd;

            if (journeyType === 'One Way' || journeyType === 'Round Trip') {

              return getFlightInfo(0);

            } else if (journeyType === 'Multi City') {

              var flights = $('.flightLeg');
              flights.each(function(i) {
                var depToAdd = getFlightInfo(i);
                departure.push(depToAdd[0]);
              });
              return departure;

            }
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

          // If wrapperNumber = 0 then get departure
          // If wrapperNumber = 1 then get return
          // If wrapperNumber = i then get several departures for 'Multi City' journey type
          function getFlightInfo(wrapperNumber) {
            var result = [],
                resultToAdd,
                flights,
                fTravelClass,
                travelClass,
                date = getInputDate(wrapperNumber);

            window.selectedDate = date;

            // get flights array
            flights = getFlightsArray(wrapperNumber);
            travelClass = flights[0].info.classes[0].name;

            if (travelClass === 'Economy Light' || travelClass === 'Economy Extra' || travelClass === 'Economy Flex' || travelClass === 'Economy Class') {
              fTravelClass = 'Economy';
            } else if (travelClass === 'Business Promo' || travelClass === 'Business Flex') {
              fTravelClass = 'Business';
            }

            resultToAdd = {
              user_input_travel_class: travelClass || -1,
              farenet_travel_class: fTravelClass || -1,
              user_input_date: date,
              dates: []
            };

            resultToAdd.dates.push({
              date: date,
              lowest_price: -3,
              selected: 1,
              flights: flights
            });

            result.push(resultToAdd);

            return result;
          }

          function getInputDate(elementNumber) {
            var wrapper = $('.flightLeg').eq(elementNumber).find('tr')[0],
                params = $(wrapper).find('.colFlight .flightNum a').eq(0).attr('onclick'),
                posToSlice = params.indexOf('?') + 1;

            params = params.slice(posToSlice).split('&');

            var day = params[4].split('=')[1],
                month = +params[5].split('=')[1] + 1,
                year = params[6].split('=')[1];

            month = month.toString();

            if (month.length === 1 ) {
              month = '0' + month;
            }

            if (day.length === 1 ) {
              day = '0' + day;
            }

            var date = year + '-' + month + '-' + day;

            return date;
          }

          function getFlightsArray(elementNumber) {
            var wrapper = $('.flightLeg').eq(elementNumber),
                flightRows = wrapper.find('tr'),
                flights = [];

            if (flightRows.length == 2) {
              // handle direct flight, need to parse only first(0) row
              flights.push(parseSimpleRow(flightRows[0]));

            } else {
              // handle combine flight, need to parse several rows
              // from first(0) row need to collect: departureTime, flightList, classes
              var flightToAdd = parseSimpleRow(flightRows[0]),
                  totalDuration = flightToAdd.info.duration;

              // then parse other rows
              // info is contained only in even rows, so start from 2
              for (var i = 2; i < flightRows.length; i+=2) {
                var tempData;

                if (i === flightRows.length - 2) {
                  // from last row need to collect: arrivalTime, flightList
                  tempData = parseSimpleRow(flightRows[i]);
                  flightToAdd.info.arrival_time = tempData.info.arrival_time;
                  flightToAdd.info.flight_list.push(tempData.info.flight_list[0]);
                  totalDuration += tempData.info.duration;
                } else {
                  // from intermediate rows need to collect: flightList
                  tempData = parseSimpleRow(flightRows[i]);
                  flightToAdd.info.flight_list.push(tempData.info.flight_list[0]);
                  totalDuration += tempData.info.duration;
                }
              }
              flightToAdd.info.duration = totalDuration;
              flights.push(flightToAdd);
            }
            return flights;
          }

          function parseSimpleRow(row) {
            var departureTime = get24Time(row, '.colDeparture .time'),
                arrivalTime = get24Time(row, '.colArrival .time'),
                arrivalDate = $(row).find('.colArrival .date').text(),
                flightNumber = $(row).find('.colFlight .flightNum a').text(),
                carrier = $(row).find('.colFlight .airline').text().trim(),
                disclaimerNum = $(row).find('.colFlight sup'),
                flightList = [],
                classes = [],
                disclaimer = [],
                params = $(row).find('.colFlight a').attr('onclick').split('&'),
                duration,
                oac,
                dac,
                dateFrom = window.selectedDate,
                dayFrom = dateFrom.split('-'),
                dateTo = dateFrom,
                dayTo = arrivalDate.split(' ');

            dayFrom = dayFrom[dayFrom.length - 1];
            dayTo = dayTo[dayTo.length - 1];

            dateFrom = new Date(dateFrom + ' ' + departureTime);
            dateTo = new Date(dateTo + ' ' + arrivalTime);
            if (dayTo !== dayFrom) {
              dateTo.setDate(dateTo.getDate() + 1);
            }

            duration = +((+dateTo - +dateFrom) / 1000 / 60);

            if (disclaimerNum.length > 0) {
              disclaimer.push({
                id: disclaimerNum.text(),
                field: 'flight_number'
              });
            }

            oac = params[2].split('=')[1];
            dac = params[3].split('=')[1];

            var flight = {
              number: flightNumber,
              departure_time: departureTime,
              arrival_time: arrivalTime,
              duration: duration,
              origin_airport_code: oac,
              destination_airport_code: dac,
              disclaimer: disclaimer,
              carrier: carrier
            };

            if(instance.verbose) {
              flight.flightNumberNode = $(row).find('.colFlight .flightNum a');
            }

            flightList.push(flight);

            var classType = $(row).find('.colDetails .cabin').text();

            if (classType.indexOf(':') !== -1) {
              classType = classType.trim().split(':')[1].trim();
            } else {
              classType = classType.trim();
            }

            if (classType === 'Económica Promo') {
                classType = 'Economy Promo';
            } else if (classType === 'Económica Extra') {
              classType = 'Economy Extra';
            } else if (classType === 'Económica Flex') {
              classType = 'Economy Flex';
            } else if (classType === 'Executiva Promo' || classType === 'Promo Ejecutiva') {
              classType = 'Business Promo';
            } else if (classType === 'Executiva Flex' || classType === 'Ejecutiva Flex') {
              classType = 'Business Flex';
            }

            var cls = {
              name: classType || -1,
              price: {
                cash: -1,
                miles: -1,
              },
              seat: -1
            };

            if(instance.verbose) {
              cls.sellingClassNode =
                $(row).find('.colDetails .sellingClass a');
            }

            classes.push(cls);

            return {
              info: {
                departure_time: departureTime,
                arrival_time: arrivalTime,
                duration: duration,
                flight_list: flightList,
                classes: classes
              }
            };
          }

          function get24Time(row, selector) {
            var receivedTime = $(row).find(selector).text().trim().split(' '),
                resultTime = receivedTime[0].split(':');

            if (receivedTime[1] === 'PM') {

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
            return resultTime;
          }

          function getTotalPrice(lang) {
            var totalPrice = $('#shoppingCartReservation_SummaryBot_Top_totalPrice').text().trim().split(' '),
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

          function getPassengers() {
            var passengers = {
              user_input_adults: 0,
              user_input_children: 0,
              user_input_infants: 0
            };

            var passengersTypes = $('#airItineraryFareBreakdown tbody tr');

            for (var i = 0; i < passengersTypes.length; i++) {
              // non-breakable space '&nbsp;' is char 0xa0 (160 dec)
              var numberOfPassengers = $(passengersTypes[i]).find('.colPrice'),
                  type = $(passengersTypes[i]).find('.colFirst').text().trim();

              numberOfPassengers = +numberOfPassengers.eq(numberOfPassengers.length - 2).text().split('\xa0')[1];

              if (type.indexOf('ADULT') !== -1 || type.indexOf('ADULTO') !== -1) {
                passengers.user_input_adults = numberOfPassengers;
              } else if (type.indexOf('CHILD') !== -1 || type.indexOf('CRIANÇAS') !== -1 || type.indexOf('NIÑOS') !== -1) {
                passengers.user_input_children = numberOfPassengers;
              } else if (type.indexOf('INFANT') !== -1 || type.indexOf('BEBÉS') !== -1 || type.indexOf('INFANTES') !== -1) {
                passengers.user_input_infants = numberOfPassengers;
              }
            }
            return passengers;
          }

          function getTotalPricePerPassengerType(currency, fuel, lang) {
            var passengersTypes = $('#airItineraryFareBreakdown tbody tr'),
                prices,
                adultName,
                childName,
                infantName;

            if (lang === 'en') {
              adultName = 'ADULT 12+';
              childName = 'CHILD 2-11',
              infantName = 'INFANT 0-1';
            } else if (lang === 'pt') {
              adultName = 'ADULTO 12+';
              childName = 'CRIANÇAS 2-11',
              infantName = 'BEBÉS 0-1';
            } else if (lang === 'es') {
              adultName = 'ADULTO 12+';
              childName = 'NIÑOS 2-11',
              infantName = 'INFANTES 0-1';
            }

            prices = {
              adults: {
                name: adultName,
                base_fare: -1,
                total_fare: -1,
                taxes: -1,
                fuel_surcharges: -1
              },
              children: {
                name: childName,
                base_fare: -1,
                total_fare: -1,
                taxes: -1,
                fuel_surcharges: -1
              },
              infants: {
                name: infantName,
                base_fare: -1,
                total_fare: -1,
                taxes: -1,
                fuel_surcharges: -1
              },
            };

            for (var i = 0; i < passengersTypes.length; i++) {
              var type = $(passengersTypes[i]).find('.colFirst').text().trim(),
                  price = $(passengersTypes[i]).find('.colPrice');

              if (type.indexOf('ADULT') !== -1 || type.indexOf('ADULTO') !== -1) {
                prices.adults.base_fare = formatPrice(currency, price.eq(0).text());
                prices.adults.total_fare = formatPrice(currency, price.eq(price.length - 3).text());
                prices.adults.taxes = formatPrice(currency, price.eq(price.length - 4).text());
                if (fuel > 0) {
                  prices.adults.fuel_surcharges = formatPrice(currency, price.eq(price.length - 5).text());
                } else {
                  prices.adults.fuel_surcharges = fuel;
                }
              } else if (type.indexOf('CHILD') !== -1 || type.indexOf('CRIANÇAS') !== -1 || type.indexOf('NIÑOS') !== -1) {
                prices.children.base_fare = formatPrice(currency, price.eq(0).text());
                prices.children.total_fare = formatPrice(currency, price.eq(price.length - 3).text());
                prices.children.taxes = formatPrice(currency, price.eq(price.length - 4).text());
                if (fuel > 0) {
                  prices.children.fuel_surcharges = formatPrice(currency, price.eq(price.length - 5).text());
                } else {
                  prices.children.fuel_surcharges = fuel;
                }
              } else if (type.indexOf('INFANT') !== -1 || type.indexOf('BEBÉS') !== -1 || type.indexOf('INFANTES') !== -1) {
                prices.infants.base_fare = formatPrice(currency, price.eq(0).text());
                prices.infants.total_fare = formatPrice(currency, price.eq(price.length - 3).text());
                prices.infants.taxes = formatPrice(currency, price.eq(price.length - 4).text());
                if (fuel > 0) {
                  prices.infants.fuel_surcharges = formatPrice(currency, price.eq(price.length - 5).text());
                } else {
                  prices.infants.fuel_surcharges = fuel;
                }
              }
            }
            return prices;
          }

          function getJourneyType(stringFromSite) {

            var journeyType = stringFromSite[1] + stringFromSite[2];

            if (journeyType) {
              switch(journeyType) {
                case 'OW':
                  journeyType = 'One Way';
                  break;
                case 'MC':
                  journeyType = 'Multi City';
                  break;
                default:
                  journeyType = 'Round Trip';
              }
            }

            return journeyType;
          }

          function getDatasource() {
            var referrer = document.referrer,
                type;

            if (referrer === 'https://bookings.copaair.com/CMGS/AirFareFamiliesFlexibleForward.do' ||
                referrer === 'http://bookings.copaair.com/CMGS/AirFareFamiliesFlexibleForward.do') {
              type = 'flexible-dates';
            } else {
              type = 'default';
            }

            var datasource = {
                step: 'ibe-summary',
                type: type,
                url: document.URL,
                referrer: referrer
            };
            return datasource;
          }

          function getSiteEditionAndLanguage(langFromSite, editionFromSite) {
            var siteEdition = editionFromSite.replace('CM', '').toLowerCase(),
                language = {};

            siteEdition = langFromSite + '-' + siteEdition;

            language.site_edition = siteEdition;
            language.lang = langFromSite;

            return language;
          }

          function getLocation(journeyType) {
            var location = [],
                oac,
                dac;

            if (journeyType === 'One Way' || journeyType === 'Round Trip') {

              location.push(getAirportCodes(0));

            } else if (journeyType === 'Multi City') {

              var flights = $('.flightLeg');

              flights.each(function(i) {
                location.push(getAirportCodes(i));
              });

            }

            return location;

            function getAirportCodes(elementNumber) {
              var wrapper = $('.flightLeg').eq(elementNumber),
                  flightRows = wrapper.find('tr');

              if (flightRows.length == 2) {
                // handle direct flight
                oac = parseAirportCode(flightRows, 0, '.colDeparture .orig');
                dac = parseAirportCode(flightRows, 0, '.colArrival .dest');
              } else {
                // handle combine flight
                var lastNumber = flightRows.length - 2;
                oac = parseAirportCode(flightRows, 0, '.colDeparture .orig');
                dac = parseAirportCode(flightRows, lastNumber, '.colArrival .dest');
              }

              return {
                user_input_origin_airport_code: oac,
                user_input_destination_airport_code: dac
              };
            }

            function parseAirportCode(row, elementNumber, selector) {
              var ac = $(row[elementNumber]).find(selector).text().trim().split(',')[0]; //
              ac = ac.split(' ');
              ac = ac[ac.length - 1].replace('(','').replace(')','');
              return ac;
            }
          }

          function getCitiesAndCountries(journeyType) {
            var geo = [],
                geoToAdd;

            if (journeyType === 'One Way' || journeyType === 'Round Trip') {
              // We need only first(0) element
              geoToAdd = parseCityAndCountry(0);
              geo.push(geoToAdd);
            } else if (journeyType === 'Multi City') {
              var elements = $('.flightLeg');
              // If we have element then parse it
              for (var i = 0; i < elements.length; i++) {
                geoToAdd = parseCityAndCountry(i);
                geo.push(geoToAdd);
              }
            }

            return geo;

            function parseCityAndCountry(elementNumber) {
              var origin = $('.flightLeg').eq(elementNumber).find('.orig').text().trim(),
                  destination = $('.flightLeg').eq(elementNumber).find('.dest').text().trim();

              if (origin !== '') {
                origin = origin.split(',');
                var originCountryName = origin[origin.length - 1].trim(),
                    originCityName = getOnlyCityName(origin[0]);

                destination = destination.split(',');
                var destinationCountryName = destination[destination.length - 1].trim(),
                    destinationCityName = getOnlyCityName(destination[0]);

                return {
                  origin_city_name: originCityName,
                  origin_country_name: originCountryName,
                  destination_city_name: destinationCityName,
                  destination_country_name: destinationCountryName
                };
              }

            }

            function getOnlyCityName(name) {
              name = name.split(' ');
              delete name[name.length - 1];
              name = name.join(' ').trim();
              return name;
            }
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
     }
 }, 300);
})()
