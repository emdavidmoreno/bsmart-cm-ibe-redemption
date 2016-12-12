(function(){
  var timer = setInterval(function() {
    if (typeof window.jQuery !== 'undefined') {
       clearInterval(timer);

       // We are not triggering a Farenet if there are a Farenet already there
       if(!window.Farenet){
        window.Farenet = (function() {
          'use strict';

          /*
            Private variables
          */
          var instance = {},
              $ = window.jQuery;

          /*
            Public API
          */
          instance.sendFlag = 1;

          instance.getResult = function() {
            var result = instance.parse();
            return result;
          };

          instance.parseAndSend = function() {
            var result = instance.parse();

            if (instance.sendFlag == 1 && result && (typeof result === 'object')) { // for test turn off sendFlag to don't send JSON
              //sendData(result);
            sendDataToDataCore(result);
              $(window).trigger('parse:completed', {
                page: 'flight_selection',
                result: result
              });
              instance.sendFlag = 0;
            }
          };

          instance.parse = function() {
            try {
              var result = getResult();
              // force to turn on verbose everytime
              // you need it
              instance.verbose = 0;
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
              result = JSON.stringify(result);
          
          if(result != ""){
                $.support.cors = true;

                 var url = 'https://farenet.securitytrfx.com/booking_stats/farenet/collect/cm';
                //  var url = 'https://www.securitytrfx.com/booking_stats/oneway/script';
                

                 $.ajax({type: 'POST', url: url, data:result, script:true, cache:false, dataType: 'text',
                    success: function(data) { 
                        console.log('Response from our server: ' +data);
                        },
                    error: function(data) {
                        
                        console.log('There was an error!');
                    }
            
                 });
                
            }

          }
          function sendDataToDataCore(result) {
          // TODO uncomment to send data to server  add ajax POST
            result = JSON.stringify(result);
            if(result != ""){
                    $.support.cors = true;

                     var url = 'https://datacore-write.securitytrfx.com/w/em_farenet2/1/C0P4BR0W53R';
                    //  var url = 'https://www.securitytrfx.com/booking_stats/oneway/script';
                    
            
                     $.ajax({type: 'POST', url: url, data:result, script:true, cache:false, dataType: 'text',
                        headers: {authorization: '40jn178dumy40JN178DVO240jn178dqhs40JN178DQSO'},
                        success: function(data) { 
                            console.log('Response from our server: ' +data);
                            },
                        error: function(data) {
                            
                            console.log('There was an error!');
                        }
                
                     });
                    
                }
          }

          function getResult() {
            var JSON_VERSION = '2.1.0',
                AIRLINE = {
                  id: 'flights.copaair.com',
                  code: 'cm'
                },
                datasource = getDatasource(),
                passengers = getPassengers(),
                user_input_journey_type = getJourneyType(),
                total_price,
                disclaimer = getDisclaimers(),
                geo = {},
                extra_info = {},
                departure,
                discounts = [],
                result;

            // 'currentLang' & 'current_PoS' are taken from Global Scope of 'Flight Selection' page
            geo.language = getSiteEditionAndLanguage(currentLang, current_PoS);
            geo.location = getLocation(user_input_journey_type);

            extra_info.geo = getCitiesAndCountries(user_input_journey_type);
            extra_info.device_category = getDeviceCategory();
            extra_info.script_filename = 'cp_v2.6';

            if (user_input_journey_type !== 'Multi City') {
              total_price = getTotalPrice(geo.language.lang);
              discounts = getDiscounts(total_price.currency_code);
            } else {
              total_price = {
                  cash: -3,
                  miles: -3,
                  taxes: -3,
                  currency: -3,
                  currency_code: -3,
                  fuel_surcharges: -3
              };
            }

            departure = getDeparture(user_input_journey_type, datasource.type, total_price.currency_code);

            result = {
              version: JSON_VERSION,
              airline: AIRLINE,
              datasource: datasource,
              passengers: passengers,
              user_input_journey_type: user_input_journey_type,
              total_price: total_price,
              discounts: discounts,
              geo: geo,
              departure: departure,
              disclaimer_mapping: disclaimer,
              extra_info: extra_info
            };

            if (user_input_journey_type === 'One Way') {
              if (result.departure[0].dates[0].lowest_price === -1) {
                result.total_price.cash = -1;
              }
            } else if (user_input_journey_type === 'Round Trip') {
              result.return = getReturn(datasource.type, total_price.currency_code);
              if (result.return[0].dates[0].lowest_price === -1 || result.departure[0].dates[0].lowest_price === -1) {
                result.total_price.cash = -1;
              }
            } else if (user_input_journey_type === 'Multi City') {
              for (var i = 0; i < departure.length; i++) {
                if (result.departure[i].user_input_travel_class === -1) {
                  return;
                }
              }
            } else {
              return;
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

          function getDatasource() {
            var flexibleDates = $('input[name=flexibleSearch]').val(),
                type;

            if (flexibleDates === 'true') {
              type = 'flexible-dates';
            } else {
              type = 'default';
            }

            var datasource = {
                step: 'ibe-flight-selection',
                type: type,
                url: document.URL,
                referrer:document.referrer
            };
            return datasource;
          }

          function getPassengers() {
            var adults = $('select[name="guestTypes[0].amount"]').val(),
                children = $('select[name="guestTypes[1].amount"]').val(),
                infants = $('select[name="guestTypes[2].amount"]').val(),
                passengers = {
                  user_input_adults: +adults,
                  user_input_children: +children,
                  user_input_infants: +infants
                };

            return passengers;
          }

          function getJourneyType() {
            var journeyType = $('input[name=tripType]').val();

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

          function getTotalPrice(lang) {
            var totalPrice = $('#airSelection_SummaryBot_Bottom_totalPrice span').text().split(' '),
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
              if (nameOfRow.indexOf(fuelSurchargesStr) !== 0) {
                fuelSurchargesRow = row;
                fuelSurcharges = $(fuelSurchargesRow).find('.money').last();
              }
            });

            if (fuelSurcharges) {
              fuelSurcharges = formatPrice(currencyCode, fuelSurcharges.eq(0).text().trim().split(' ')[1]);
            } else {
              fuelSurcharges = -1;
            }

            if (cash) {
              cash = formatPrice(currencyCode, cash);
            } else {
              cash = -1;
            }

            if (taxes) {
              taxes = formatPrice(currencyCode, taxes);
            } else {
              taxes = -1;
            }

            currency = selectCurrency(currencyCode);

            totalPrice = {
                cash: cash || -1,
                miles: miles,
                taxes: taxes || -1,
                currency: currency || -1,
                currency_code: currencyCode || -1,
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

          function getLocation(journeyType) {
            var location = [];

            if (journeyType === 'One Way' || journeyType === 'Round Trip') {
              location.push({
                user_input_origin_airport_code: $('input[name="outboundOption.originLocationCode"]').val(),
                user_input_destination_airport_code: $('input[name="outboundOption.destinationLocationCode"]').val()
              });
            } else if (journeyType === 'Multi City') {
              // 5 is maximum of multi city
              for (var i = 0; i < 5; i++) {
                var oac = $('input[name="multiCityOptions[' + i + '].originLocationCode"]').val(),
                    dac = $('input[name="multiCityOptions[' + i + '].destinationLocationCode"]').val();

                if (oac !== '') {
                  location.push({
                    user_input_origin_airport_code: oac,
                    user_input_destination_airport_code: dac
                  });
                } else {
                  break;
                }
              }
            }

            return location;
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

          function getCitiesAndCountries(journeyType) {
            var geo = [],
                geoToAdd;

            if (journeyType === 'One Way' || journeyType === 'Round Trip') {
              geoToAdd = parseCityAndCountry('#headBlock_0');
              geo.push(geoToAdd);
            } else if (journeyType === 'Multi City') {
              // 5 is maximum of multi city
              for (var i = 0; i < 5; i++) {
                var selector = '#availabilityLeg_' + i + ' .headBlock',
                    element = $(selector)[0];
                // If we have element then parse it
                if (element) {
                  geoToAdd = parseCityAndCountry(selector);
                  geo.push(geoToAdd);
                }
              }
            }
            return geo;

            function parseCityAndCountry(selector) {
              var wrapper = $(selector).text().trim().split('-'),
                  origin = wrapper[0],
                  destination = wrapper[1],
                  originCountryName,
                  originCityName,
                  destinationCountryName,
                  destinationCityName;

              if (origin) {
                origin = origin.split(',');
                originCountryName = origin[origin.length - 1].trim();
                originCityName = getOnlyCityName(origin[0]);
              } else {
                originCountryName = -1;
                originCityName = -1;
              }

              if (destination) {
                destination = destination.split(',');
                destinationCountryName = destination[destination.length - 1].trim();
                destinationCityName = getOnlyCityName(destination[0]);
              } else {
                destinationCountryName = -1;
                destinationCityName = -1;
              }

              return {
                origin_city_name: originCityName,
                origin_country_name: originCountryName,
                destination_city_name: destinationCityName,
                destination_country_name: destinationCountryName
              };
            }
            function getOnlyCityName(name) {
              name = name.split(' ');
              delete name[name.length - 1];
              name = name.join(' ').trim();
              return name;
            }
          }

          function getReturn(datesType, currency) {
            var returnInfo = [];
            returnInfo.push(getFlightInfo(datesType, currency, 'input[name="inboundOption.departureDate"]', '#AIR_SEARCH_RESULT_CONTEXT_ID1'));
            return returnInfo;
          }

          function getDeparture(journeyType, datesType, currency) {
            var departure = [];

            if (journeyType === 'One Way' || journeyType === 'Round Trip') {

              departure.push(getFlightInfo(datesType, currency, 'input[name="outboundOption.departureDate"]', '#AIR_SEARCH_RESULT_CONTEXT_ID0'));

            } else if (journeyType === 'Multi City') {
              // 5 is maximum of multi city
              for (var i = 0; i < 5; i++) {
                var flightWrapper = $('#availabilityLeg_' + i)[0],
                    departureToAdd = {};

                if (flightWrapper) {
                  var inputTravelClass, // = $('input[name=cabinClass]').val()
                      farenetTravelClass,
                      inputDepartureDate = getAndFormatDate('input[name="multiCityOptions[' + i + '].departureDate"]');

                  departureToAdd.user_input_date = inputDepartureDate;

                  departureToAdd.dates = [];
                  departureToAdd.dates.push({
                    date: inputDepartureDate,
                    lowest_price: -3,
                    selected: 1,
                    flights: []
                  });

                  departureToAdd.dates[0].flights = getMultiCityDepartureFlights(flightWrapper);

                  if (departureToAdd.dates[0].flights.length !== 0) {
                    inputTravelClass = departureToAdd.dates[0].flights[0].info.classes[0].name;

                    if (inputTravelClass === 'Economy Promo' || inputTravelClass === 'Economy Extra' || inputTravelClass === 'Economy Flex' || inputTravelClass === 'Economy Class') {
                      farenetTravelClass = 'Economy';
                    } else if (inputTravelClass === 'Business Promo' || inputTravelClass === 'Business Flex') {
                      farenetTravelClass = 'Business';
                    }
                  }

                  departureToAdd.user_input_travel_class = inputTravelClass || -1;
                  departureToAdd.farenet_travel_class = farenetTravelClass || -1;
                  departure.push(departureToAdd);
                }
              }
            }
            return departure;
          }

          function getDurationBetweenInMinutes(from, to) {
            var baseDate = new Date(),
                dateFrom = new Date(baseDate),
                dateTo = new Date(baseDate),
                splittedFrom = from.split(':'),
                splittedTo = to.split(':'),
                ONE_MINUTE = 1000 * 60;

            dateFrom.setHours(splittedFrom[0]);
            dateFrom.setMinutes(splittedFrom[1]);

            dateTo.setHours(splittedTo[0]);
            dateTo.setMinutes(splittedTo[1]);

            if (dateTo < dateFrom) {
              dateTo.setDate(dateTo.getDate() + 1);
            }

            // console.log('__input__');
            // console.log(from);
            // console.log(to);
            // console.log('__middle__');
            // console.log(dateFrom);
            // console.log(dateTo);
            // console.log('__output__');
            // console.log((dateTo - dateFrom) / ONE_MINUTE);

            return (dateTo - dateFrom) / ONE_MINUTE;
          }

          function getInfoFromSimpleMultiCityRow(row) {
            var departureTime = get24Time(row, '.colDeparture .time'),
                arrivalTime = get24Time(row, '.colArrival .time'),
                flightNumber = $(row).find('.colFlight .flightNum a').text(),
                flightNumberHtmlNode = $(row).find('.colFlight a'),
                duration = -3, // getDurationBetweenInMinutes(departureTime, arrivalTime),
                className = $(row).find('.colDetails .cabin').text(),
                acs = $(row).find('.colArrival span'),
                disclaimerDepTime = $(row).find('.colDeparture div span').last().text().trim(),
                disclaimerArrTime = $(row).find('.colArrival div span').last().text().trim(),
                oac,
                dac,
                flightList = [],
                classes = [],
                disclaimer = [];


            // disclaimerNum = $(row).find('.colFlight sup'),
            // if (disclaimerNum.length > 0) {
            //   disclaimerArr.push({
            //     id: disclaimerNum.text()
            //   });
            // }

            if (disclaimerDepTime.indexOf('+') !== -1) {
              disclaimer.push({
                id: disclaimerDepTime,
                field: 'departure_time'
              });
            }

            if (disclaimerArrTime.indexOf('+') !== -1) {
              disclaimer.push({
                id: disclaimerArrTime,
                field: 'arrival_time'
              });
            }

            acs = acs.eq(acs.length - 2).text().split('-');
            oac = acs[0];
            dac = acs[1];

            var flight = {
              number: flightNumber,
              departure_time: departureTime,
              arrival_time: arrivalTime,
              duration: duration,
              origin_airport_code: oac,
              destination_airport_code: dac,
              disclaimer: disclaimer
            };

            if (instance.verbose) {
              flight.flightNumberHtmlNode = flightNumberHtmlNode;
            }

            flightList.push(flight);

            var classesItem = {
              name: className,
              price: {
                cash: -3,
                miles: -1
              },
              seat: -1
            };

            if(instance.verbose){
              classesItem.htmlNode = $(row);
            }

            classes.push(classesItem);

            var flightToAdd = {
              info: {
                departure_time: departureTime,
                arrival_time: arrivalTime,
                duration: duration,
                flight_list: flightList,
                classes: classes
              }
            };
            return flightToAdd;
          }

          function getMultiCityDepartureFlights(wrap) {
            var flights = [],
                tempData;

            var flightRow = $(wrap).find('.flightLeg');

            if (flightRow.length !== 0) {

              flightRow.each(function() {
                var currentFlight = $(this),
                    combineFlights = currentFlight.find('tr');

                if (combineFlights.length > 1) {
                  // handle combine flight, work with combineFlights (several rows)
                  var flightToAdd = getInfoFromSimpleMultiCityRow(combineFlights[0]);

                  // Need to add flights from middle rows
                  // and arrivalTime and flights from last row
                  for (var i = 1; i < combineFlights.length; i++) {
                    if (i === combineFlights.length - 1) {

                      tempData = getInfoFromSimpleMultiCityRow(combineFlights[i]);
                      flightToAdd.info.arrival_time = tempData.info.arrival_time;
                      //flightToAdd.info.duration += tempData.info.duration;
                      flightToAdd.info.flight_list.push(tempData.info.flight_list[0]);

                    } else {

                      tempData = getInfoFromSimpleMultiCityRow(combineFlights[i]);
                      //flightToAdd.info.duration += tempData.info.duration;
                      flightToAdd.info.flight_list.push(tempData.info.flight_list[0]);

                    }
                  }
                  flights.push(flightToAdd);
                } else {
                  // handle direct flight, work with currentFlight[0]
                  flights.push(getInfoFromSimpleMultiCityRow(currentFlight[0]));
                }
              });
            }
            return flights;
          }

          /**
           * @param {jQuery} tbodyTd
           * @return {Object}
              {String} Object.headTitle
              {String} Object.promoClassName
           */
          function getColHeadDisplayInfo(tbodyTd) {
            // extract class names and split by space
            var classNames = tbodyTd.attr('class').split(' ');
            // remove class colCostNotAvail of the list
            var costNAPos = classNames.indexOf('colCostNotAvail');
            if(costNAPos >= 0) {
              classNames = [].concat.call([],
                classNames.slice(0, costNAPos),
                classNames.slice(costNAPos + 1)
              );
            }

            var costNAPos = classNames.indexOf('colCostDisabled');
            if(costNAPos >= 0) {
              classNames = [].concat.call([],
                classNames.slice(0, costNAPos),
                classNames.slice(costNAPos + 1)
              );
            }

            // remove class colCostNotAvail of the list
            var costNAPos = classNames.indexOf('colCostSelected');
            if(costNAPos >= 0) {
              classNames = [].concat.call([],
                classNames.slice(0, costNAPos),
                classNames.slice(costNAPos + 1)
              );
            }

            // obtain the middle classes
            var classIntermediates = classNames;

            // e.g: ["colCost", "colCost1", "colCost_CM_PROMOEXEC", "colCostSelected"]
            // the first class and the last we erease, and join again with a dot
            var classNamesStr = '.' + classIntermediates.join('.');
            // extract the text of col head
            var activeCostHeadTitle = tbodyTd.closest('table')
              .find('thead ' + classNamesStr + ' a')
              .text().trim();
            // extract the promo class name
            var promoClassName = classIntermediates[classIntermediates.length - 1];

            return {
              headTitle: activeCostHeadTitle,
              promoClassName: promoClassName
            };
          }

          function getFlightInfo(datesType, currency, dateSelector, flightWrapperSelector) {
            var activeCost = $(flightWrapperSelector + ' .colCost[rowspan]'), //inputTravelClass = $('input[name=cabinClass]').val(),
                inputDepartureDate,
                dates = [],
                date = '',
                lowestPrice,
                selected = 0,
                flights = [],
                inputTravelClass,
                farenetTravelClass,
                promoClassName;

            activeCost.each(function(index, value){
              if(!$(value).hasClass('colCostNotAvail')){
                activeCost = $(value);
                return false;
              }
            });

            var colInfoNames = getColHeadDisplayInfo(activeCost);
            inputTravelClass = colInfoNames.headTitle;
            promoClassName = colInfoNames.promoClassName;

            if (promoClassName === 'colCost_CM_PROMO' ||
              promoClassName === 'colCost_CM_ECONOMY' ||
              promoClassName === 'colCost_CM_ECOFLEX') {
              farenetTravelClass = 'Economy';
            } else if (promoClassName === 'colCost_CM_PROMOEXEC' ||
              promoClassName === 'colCost_CM_EXECUTIVE') {
              farenetTravelClass = 'Business';
            }

            inputDepartureDate = getAndFormatDate(dateSelector);

            if (datesType === 'default') {
              // We have only 1 date inputed by user because of 'default' datesType
              date = inputDepartureDate;
              selected = 1;

              // Select all not combined(direct) flights
              var $directFlights = $(flightWrapperSelector + ' .rowOdd').not('.combineRows, .connectedRow'); // for return #AIR_SEARCH_RESULT_CONTEXT_ID1
              $directFlights = $directFlights.add($(flightWrapperSelector + ' .rowEven').not('.combineRows, .connectedRow'));

              if ($directFlights.length !== 0) {
                // Get info from direct flights
                $directFlights.each(function() {
                  var flight = getInfoFromSimpleRow(this, currency);
                  flights.push(flight);
                });
              }

              // Select all combined flights
              var $combineFlights = $(flightWrapperSelector + ' .combineRows').not('.connectedRow');

              if ($combineFlights.length !== 0) {
                // Get info from combined flights
                $combineFlights.each(function() {
                  var currentItem = $(this),
                      combineFlight = [];
                  combineFlight.push(this);

                  if (currentItem.next().hasClass('connectedRow') && currentItem.next().hasClass('combineRows')) {
                    // Work with flight which consist of more than 2 flights
                    var connectedFlights;
                    if (currentItem.hasClass('rowOdd')) {
                      connectedFlights = currentItem.nextUntil('.rowEven');
                      connectedFlights.each(function() {
                        combineFlight.push(this);
                      });

                    } else if (currentItem.hasClass('rowEven')) {
                      connectedFlights = currentItem.nextUntil('.rowOdd');
                      connectedFlights.each(function() {
                        combineFlight.push(this);
                      });
                    }
                  } else {
                    // Work with flight of 2 flights
                    combineFlight.push(currentItem.next()[0]);
                  }
                  // Add flight to final output 'flights' array
                  var flight = getInfoFromCombineFlight(combineFlight, currency);
                  flights.push(flight);
                });
              }

              // Select all prices (<tr> without classes)
              var $prices = $(flightWrapperSelector + ' tbody tr').not('[class]');
              lowestPrice = getLowestPrice($prices, currency);

              var newDate = {
                date: date,
                lowest_price: lowestPrice || -1,
                selected: selected,
                flights: flights
              };
              dates.push(newDate);

            } else if (datesType === 'flexible-dates') {
              // TODO: in the next scope
              console.log('flexible-dates is not handled');
            }

            var result = {
              user_input_travel_class: inputTravelClass || -1,
              farenet_travel_class: farenetTravelClass || -1,
              user_input_date: inputDepartureDate,
              dates: dates
            };

            return result;
          }

          function getInfoFromCombineFlight(rowArray, currency) {
            var flight = getInfoFromSimpleRow(rowArray[0], currency);

            // After getting info from main/first row (rowArray[0]) we need to add 'flight_list' from other elements
            // and set 'duration' and 'arrival_time' from last element
            for (var i = 1; i < rowArray.length; i++) {
              var tempData;

              if (i === rowArray.length - 1) {
                tempData = getInfoFromSimpleRow(rowArray[i], currency);
                flight.info.arrival_time = tempData.info.arrival_time;

                flight.info.flight_list.push(tempData.info.flight_list[0]);

                // Get total duration from last row
                var totalTime = $(rowArray[i]).find('.totalTime').text().trim().split(' ');
                flight.info.duration = parseInt(totalTime[1]) * 60 + parseInt(totalTime[2]);

              } else {

                tempData = getInfoFromSimpleRow(rowArray[i], currency);
                flight.info.flight_list.push(tempData.info.flight_list[0]);

              }
            }

            return flight;
          }

          function getInfoFromSimpleRow(row, currency) {
            var departureTime = get24Time(row, '.colDepart'),
                arrivalTime = get24Time(row, '.colArrive'),
                duration = $(row).find('.colDuration').text().trim().split(' '),
                flightNumberHtmlNode = $(row).find('.colFlight a'),
                flightNumber = flightNumberHtmlNode.text().trim(),
                acs = $(row).find('.colAirports span'),
                oac = acs.eq(0).text(),
                dac = acs.eq(1).text(),
                disclaimerNum = $(row).find('.colFlight sup'),
                disclaimerDepTime = $(row).find('.colDepart span').clone().children().remove().end().html(),
                disclaimerArrTime = $(row).find('.colArrive span').clone().children().remove().end().html(),
                disclaimer = [];

            duration = parseInt(duration[0]) * 60 + parseInt(duration[1]); // to minutes

            if (disclaimerDepTime) {
              disclaimer.push({
                id: disclaimerDepTime.trim(),
                field: 'departure_time'
              });
            }

            if (disclaimerArrTime) {
              disclaimer.push({
                id: disclaimerArrTime.trim(),
                field: 'arrival_time'
              });
            }

            if (disclaimerNum.length > 0) {
              disclaimer.push({
                id: disclaimerNum.text(),
                field: 'flight_number'
              });
            }

            var flight = {
              number: flightNumber,
              departure_time: departureTime,
              arrival_time: arrivalTime,
              duration: duration,
              origin_airport_code: oac,
              destination_airport_code: dac,
              disclaimer: disclaimer
            };

            if (instance.verbose) {
              flight.flightNumberHtmlNode = flightNumberHtmlNode;
            }

            var flightList = [];
            flightList.push(flight);

            var classes = [],
                $classes = $(row).find('.colCost1, .colCost2, .colCost3, .colCost4, .colCost5');

            $classes.each(function(i, tdCCol) {
              var name = '',
                  price = {
                    cash: -1,
                    miles: -1,
                    cash_after_discount: -1,
                  },
                  seat = -1;

              name = getColHeadDisplayInfo($(tdCCol)).headTitle;

              var currentClass = $(this);
              if (!currentClass.hasClass('colCostNotAvail')) {
                currentClass = currentClass.text().trim().split('\n');

                // currentClass[0] - string with price
                price.cash = formatPrice(currency, currentClass[0]);

                if ($(this).find('.newPrice').length > 0) {
                  price.cash_after_discount = formatPrice(currency, currentClass[1].trim());
                }

                seat = currentClass[currentClass.length - 1].trim().split(' ')[0];
                if (isNaN(seat)) {
                  seat = -2;
                } else {
                  seat = +seat;
                }
              }

              var newClass = {
                name: name,
                price: price,
                seat: seat
              };

              // stores the specific price node
              // TODO: We should find a mechanism for it
              // because it's out of the farenet scope
              // but we cannot travel the DOM again
              if (instance.verbose) {
                newClass.htmlNode = $(this);
              }

              classes.push(newClass);
            });

            var newFlight = {
              info: {
                departure_time: departureTime,
                arrival_time: arrivalTime,
                duration: duration,
                flight_list: flightList,
                classes: classes
              }
            };
            return newFlight;
          }

          function get24Time(row, selector) {
            var receivedTime = $(row).find(selector).text().trim(),
                resultTime;

            if (receivedTime.indexOf('+') !== -1 && receivedTime.indexOf('M') === -1) {
              resultTime = receivedTime.split('+')[0];
            } else if (receivedTime.indexOf('M') !== -1) {
                if (receivedTime.indexOf('+') !== -1) {
                  receivedTime = receivedTime.split('+')[0];
                }

                receivedTime = receivedTime.split(' ');
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
            } else {
              resultTime = receivedTime;
            }
            return resultTime;
          }

          function getAndFormatDate(selector) {
            var date = $(selector).val().split('/');
            date = date[2] + '-' + date[0] + '-' + date[1];
            return date;
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

          function getLowestPrice($prices, currency) {
            var lowestPrice = 0;

            $prices.each(function() {
              var currentPrice = $(this);
              currentPrice = currentPrice.text().trim().split('\n');
              currentPrice = formatPrice(currency, currentPrice[0]);

              if (lowestPrice === 0) {
                lowestPrice = currentPrice;
              } else {
                if (currentPrice < lowestPrice) {
                  lowestPrice = currentPrice;
                }
              }
            });

            return lowestPrice;
          }

         })();
       }

     }
 }, 300);
})()


