
## Farenet JSON

```javascript
//******************************************
// GUIDELINES:
//******************************************

//-------------------------------------------
// The key names should use underscore notation:
//   journey_type => Good
//   journeyType => Bad
//-------------------------------------------

//-------------------------------------------
// The fields with the "user_input" prefix
// can modify the search results
//-------------------------------------------

//-------------------------------------------
// Special values:
//   -1 => the value does not exist
//   -2 => Too many
//-------------------------------------------

//******************************************
// JSON
//******************************************

{
    version: 2.1.0
    airline:{
        id: 'copaair',
        code: 'cm'
    },
    // unique indentifier which contain
    datasource: {
        step: 'ibe-search',
        type: 'default | redemption | flexible-dates',
        url: 'something.com?name=pepe&&other=34'
    }
    passengers:{
        user_input_adults: 2,
        user_input_children: 0,
        user_input_infants: 1,
    },

    user_input_journey_type: 'Round Trip',
    total_price: {
        cash: 9999 |-1,
        miles: 9999 | -1,
        taxes: 234, | -1
        currency:$,
        currency_code:USD,
    }
    // With the airport code we have that but
    // Remember that we cannot access to the core
    // dictionary right now in the client side ;)
    geo:{
            location:[
                {
                    user_input_origin_airport_code: BBB,
                    user_input_destination_airport_code: AAA,
                }
            ],
            language:{
                site_edition: 'en-us',
                lang: 'en',
            }
     },
    departure :[
        {
            user_input_travel_class: 'Economy Promo',
            user_input_date: 2016-03-20,
            dates : [
                {
                    date: '2016-03-20',
                    lowest_price: 4545,
                    selected: 1,
                    flights: [
                        {
                             info: {
                                departure_time: 20:40,
                                arrival_time: 18:40,
                                duration: 960,
                                flight_list: [
                                    'EY 51(Etihad Airways)',
                                    'EY 431 (Etihad Airways)'
                                ],
                                classes: [
                                    {
                                        name: 'Economy Promo |  Economy Extra | Economy Flex | Bussines Promo',
                                        price: {
                                            cash: 9999,
                                            miles: -1,
                                        },
                                        seat: -2
                                    }
                                ],
                            }
                        }
                    ]
                }
            ]
        }
    ],
    return :[
        {
            user_input_travel_class: 'Economy Promo',
            user_input_date: 2016-03-20,
            dates : [
                {
                    date: '2016-03-20',
                    lowest_price: 4545,
                    selected: 1,
                    flights: [
                        {
                             info: {
                                departure_time: 20:40,
                                arrival_time: 18:40,
                                duration: 960,
                                flight_list: [
                                    'EY 51(Etihad Airways)',
                                    'EY 431 (Etihad Airways)'
                                ],
                                classes: [
                                    {
                                        name: 'Economy Promo |  Economy Extra | Economy Flex | Bussines Promo',
                                        price: {
                                            cash: 9999,
                                            miles: 0,
                                        },
                                        seat: -2
                                    },
                                ],
                            }
                        },
                    ]
                }
            ]
        }
    ],
    extra_info: {
        device_category: 'mobile | desktop | tablet',
        [
            {
                origin_city_name: Miami,
                origin_country_name: United States,
                destination_city_name: Miami,
                destination_country_name: United States
            }
        ]
    }
}
```

## Host UI


### Submited data


```
//
- "searchContext=AIR_SEARCH_ADVANCED

- tripType=RT

- redemption=false

- outboundOption.originLocationName=Miami%2C%20US%20MIA
- outboundOption.originLocationCode=MIA
- outboundOption.originLocationType=A
- outboundOption.departureDate=04%2F13%2F2016
- outboundOption.departureMonth=4
- outboundOption.departureDay=13
- outboundOption.departureYear=2016
- outboundOption.departureTime=NA
- outboundOption.destinationLocationName=Panama%2C%20PA%20PTY
- outboundOption.destinationLocationCode=PTY
- outboundOption.destinationLocationType=A

- inboundOption.departureDate=05%2F18%2F2016
- inboundOption.departureMonth=5
- inboundOption.departureDay=18
- inboundOption.departureYear=2016
- inboundOption.departureTime=NA
- inboundOption.originLocationCode=PTY
- inboundOption.originLocationType=A
- inboundOption.destinationLocationCode=MIA
- inboundOption.destinationLocationType=A

- multiCityOptions[0].originLocationName=Miami%2C%20US%20MIA
- multiCityOptions[0].originLocationCode=MIA
- multiCityOptions[0].originLocationType=A
- multiCityOptions[0].destinationLocationName=Panama%2C%20PA%20PTY
- multiCityOptions[0].destinationLocationCode=PTY
- multiCityOptions[0].destinationLocationType=A
- multiCityOptions[0].departureDate=04%2F13%2F2016
- multiCityOptions[0].departureMonth=
- multiCityOptions[0].departureDay=
- multiCityOptions[0].departureYear=
- multiCityFirstLeg=
- multiCityOptions[0].departureTime=NA

- multiCityOptions[1].originLocationName=Panama%2C%20PA%20PTY
- multiCityOptions[1].originLocationCode=PTY
- multiCityOptions[1].originLocationType=A
- multiCityOptions[1].destinationLocationName=Miami%2C%20US%20MIA
- multiCityOptions[1].destinationLocationCode=MIA
- multiCityOptions[1].destinationLocationType=A
- multiCityOptions[1].departureDate=05%2F18%2F2016
- multiCityOptions[1].departureMonth=
- multiCityOptions[1].departureDay=
- multiCityOptions[1].departureYear=
- multiCityOptions[1].departureTime=NA

- multiCityOptions[2].originLocationName=
- multiCityOptions[2].originLocationCode=
- multiCityOptions[2].originLocationType=
- multiCityOptions[2].destinationLocationName=
- multiCityOptions[2].destinationLocationCode=
- multiCityOptions[2].destinationLocationType=
- multiCityOptions[2].departureDate=
- multiCityOptions[2].departureMonth=
- multiCityOptions[2].departureDay=
- multiCityOptions[2].departureYear=
- multiCityOptions[2].departureTime=NA

- multiCityOptions[3].originLocationName=
- multiCityOptions[3].originLocationCode=
- multiCityOptions[3].originLocationType=
- multiCityOptions[3].destinationLocationName=
- multiCityOptions[3].destinationLocationCode=
- multiCityOptions[3].destinationLocationType=
- multiCityOptions[3].departureDate=
- multiCityOptions[3].departureMonth=
- multiCityOptions[3].departureDay=
- multiCityOptions[3].departureYear=
- multiCityOptions[3].departureTime=NA

- multiCityOptions[4].originLocationName=
- multiCityOptions[4].originLocationCode=
- multiCityOptions[4].originLocationType=
- multiCityOptions[4].destinationLocationName=
- multiCityOptions[4].destinationLocationCode=
- multiCityOptions[4].destinationLocationType=
- multiCityOptions[4].departureDate=
- multiCityOptions[4].departureMonth=
- multiCityOptions[4].departureDay=
- multiCityOptions[4].departureYear=
- multiCityOptions[4].departureTime=NA

- flexibleSearch=false
- guestTypes[0].amount=1
- guestTypes[0].type=ADT
- guestTypes[1].amount=0
- guestTypes[1].type=CNN
- guestTypes[2].amount=0
- guestTypes[2].type=INF

- showUMNRInstructions=true
- cabinClass=Economy
- directFlightsOnly=false
- coupon=
- searchType=FARE
- moneyToMilesRatio=
- urlHome=
- urlLogoff=
- urlRedemption=
- roundTripFaresFlag=false
- vsessionid="
```

## Selectors

```javascript

// IMPORTANT: The changes to roundtrip are also reflected in multicity to

// Guests
$("#AirFlightSearchForm select[name='guestTypes[0].amount']").val(4);
$("#AirFlightSearchForm select[name='guestTypes[1].amount']").val(2);
$("#AirFlightSearchForm select[name='guestTypes[2].amount']").val(0);

// Cabin class
$("#AirFlightSearchForm input[name='cabinClass").val();

// Trip type
$("#AirFlightSearchForm input[name='tripType").val();

// Round trip and one way

$("#AirFlightSearchForm input[name='outboundOption.originLocationName']").val('Miami, US MIA');
$("#AirFlightSearchForm input[name='outboundOption.originLocationCode']").val('MIA');
$("#AirFlightSearchForm input[name='outboundOption.originLocationType']").val('A');

$("#AirFlightSearchForm input[name='outboundOption.destinationLocationName']").val('Panama, PA PTY');
$("#AirFlightSearchForm input[name='outboundOption.destinationLocationCode']").val('PTY');
$("#AirFlightSearchForm input[name='outboundOption.destinationLocationType']").val('A');

$("#AirFlightSearchForm input[id='departureDate1']").val('04/13/2016');
$("#AirFlightSearchForm input[id='departureDate2']").val('05/18/2016');

// Multicity



```

## Copa functions to fillout the data

-  copa.js https://bookings.copaair.com/CMGS/js/air_search_common.js?version=201602081216

```javascript

// these vars are a summary of the vars below

var out_OLN = getElementValue('outboundOption.originLocationName');
var out_OLC = form.elements['outboundOption.originLocationCode'].value;
var out_OLT = document.getElementById('outboundOption.originLocationType').value;

var out_DLN = getElementValue('outboundOption.destinationLocationName');
var out_DLC = form.elements['outboundOption.destinationLocationCode'].value;
var out_DLT = document.getElementById('outboundOption.destinationLocationType').value;

var DD1 = document.getElementById('departureDate1').value;
var DD2 = document.getElementById('departureDate2').value;

// test case 1
// Try to book something without filling just variables

// MIA - PANAMA - 03/13/2016
// MIA - PANAMA - 05/18/2016
// 2 adults
// 1 children
// Economy

var form = document.getElementById("AirFlightSearchForm");

form.elements['outboundOption.originLocationName'].value = 'Miami, US MIA';
form.elements['outboundOption.originLocationCode'].value = 'MIA';
form.elements['outboundOption.originLocationType'].value = 'A';


form.elements['outboundOption.destinationLocationName'].value = 'Panama, PA PTY';
form.elements['outboundOption.destinationLocationCode'].value = 'PTY';
form.elements['outboundOption.destinationLocationType'].value = 'A';

form.elements['departureDate1'].value = '04/13/2016';
form.elements['departureDate2'].value = '05/18/2016';

//Guests

// adults
form.elements['guestTypes[0].amount'].value = 2;

// children
form.elements['guestTypes[1].amount'].value = 1;

// infants
form.elements['guestTypes[2].amount'].value = 0;

// Business
form.elements['cabinClass'].value = 'Economy' ;

// functions

function fillFromMC(formName)
{
  var form = checkFormName(formName);
  var mc0_OLN = getElementValue('multiCityOptions[0].originLocationName');
  var mc0_OLC = form.elements['multiCityOptions[0].originLocationCode'].value;
  var mc0_OLT = document.getElementById('multiCityOptions[0].originLocationType').value;

  var mc0_DLN = getElementValue('multiCityOptions[0].destinationLocationName');
  var mc0_DLC = form.elements['multiCityOptions[0].destinationLocationCode'].value;
  var mc0_DLT = document.getElementById('multiCityOptions[0].destinationLocationType').value;

  var mc0_DD = document.getElementById('mc_departureDate0').value;
  var mc1_DD = document.getElementById('mc_departureDate1').value;

  //if(isEmpty(document.getElementById('outboundOption.originLocationName').value))
  {
    // there is no location name if location entry format is dropdown
    setElementValue('outboundOption.originLocationName', mc0_OLN);
    form.elements['outboundOption.originLocationCode'].value = mc0_OLC;
    document.getElementById('outboundOption.originLocationType').value = mc0_OLT;
  }
  //if(isEmpty(document.getElementById('departureDate1').value))
  {
    document.getElementById('departureDate1').value = mc0_DD;
  }

  //if(isEmpty(document.getElementById('outboundOption.destinationLocationName').value))
  {
    // there is no location name if location entry format is dropdown
    setElementValue('outboundOption.destinationLocationName', mc0_DLN);
    form.elements['outboundOption.destinationLocationCode'].value = mc0_DLC;
    document.getElementById('outboundOption.destinationLocationType').value = mc0_DLT;
  }
  //if(isEmpty(document.getElementById('departureDate2').value))
  {
    document.getElementById('departureDate2').value = mc1_DD;
  }
}

function fillFromRT(form)
{
  var out_OLN = getElementValue('outboundOption.originLocationName');
  var out_OLC = form.elements['outboundOption.originLocationCode'].value;
  var out_OLT = document.getElementById('outboundOption.originLocationType').value;

  var out_DLN = getElementValue('outboundOption.destinationLocationName');
  var out_DLC = form.elements['outboundOption.destinationLocationCode'].value;
  var out_DLT = document.getElementById('outboundOption.destinationLocationType').value;

  var DD1 = document.getElementById('departureDate1').value;
  var DD2 = document.getElementById('departureDate2').value;

  //if(isEmpty(document.getElementById('multiCityOptions[0].originLocationName').value))
  if (out_OLC) {
    // there is no location name if location entry format is dropdown
    setElementValue('multiCityOptions[0].originLocationName', out_OLN);
    form.elements['multiCityOptions[0].originLocationCode'].value = out_OLC;
    document.getElementById('multiCityOptions[0].originLocationType').value = out_OLT;
  }
  //if(isEmpty(document.getElementById('mc_departureDate0').value))
  if (DD1) {
    document.getElementById('mc_departureDate0').value = DD1;
  }

  //if(isEmpty(document.getElementById('multiCityOptions[0].destinationLocationName').value))
  if (out_DLC) {
    // there is no location name if location entry format is dropdown
    setElementValue('multiCityOptions[0].destinationLocationName', out_DLN);
    form.elements['multiCityOptions[0].destinationLocationCode'].value = out_DLC;
    document.getElementById('multiCityOptions[0].destinationLocationType').value = out_DLT;
  }
  if(!isEmpty(DD2)) {
    document.getElementById('mc_departureDate1').value = DD2;

    // there is no location name if location entry format is dropdown
    setElementValue('multiCityOptions[1].originLocationName', out_DLN);
    form.elements['multiCityOptions[1].originLocationCode'].value = out_DLC;
    document.getElementById('multiCityOptions[1].originLocationType').value = out_DLT;

    // there is no location name if location entry format is dropdown
    setElementValue('multiCityOptions[1].destinationLocationName', out_OLN);
    form.elements['multiCityOptions[1].destinationLocationCode'].value = out_OLC;
    document.getElementById('multiCityOptions[1].destinationLocationType').value = out_OLT;
  }
}


```

