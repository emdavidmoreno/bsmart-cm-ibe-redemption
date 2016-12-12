/*global require*/
define([], function() {
  var instance = {};
  var config = {
    // describe the element which gonna contain the module
    insertNodeCommand: {
      selector: 'body',
      command: 'appendTo',
      template: '\n<div id="booksmart">\n  <div class="l-book-smart">\n    <div data-ng-controller="AppController" class="m-book-smart">\n      <nav class="m-top-bar brand-bar"><a rel="nofollow" href="https://www.copaair.com/" class="logo"><img src="//smart-prepro.securitytrfx.com/app/modules/bsmart-cm-ibe/assets/images/logo.png" alt="Logo" class="logo--image"/></a><i class="menu"></i></nav>\n      <div class="m-sidebar-menu">\n        <div class="accordion"><a href="https://www.copaair.com/" class="accordion-item-title-without-icon">{{ \'LABEL_HOME\' | translate }}</a></div>\n        <div class="accordion">\n          <h3 data-ng-click="" class="accordion-item-title">{{ \'LABEL_LANGUAGE\' | translate }} ({{main.languageOptions[main.language].name}})<i class="icon-action"></i></h3>\n          <div class="accordion-item-content">\n            <select data-ng-model="main.language" data-ng-change="main.onChangeLanguage()" data-ng-options="key as value.name for (key, value) in main.languageOptions"></select>\n          </div>\n        </div>\n        <div class="accordion"><a href="http://www.copaair.com/sites/cc/en/informacion-de-viaje/pages/condiciones-generales-de-equipaje.aspx" target="_blank" class="accordion-item-title-without-icon">{{ \'LABEL_BAGAGGE_POLICE\' | translate }}</a></div>\n        <div class="accordion"><a href="https://www.copaair.com/sites/cc/en/informacion-de-viaje/pages/cargo-equipaje-socios-codigo-compartido.aspx" target="_blank" class="accordion-item-title-without-icon">{{ \'LABEL_PARTNER_BAGAGGE_POLICE\' | translate }}</a></div>\n        <div class="accordion"><a href="{{main.menuItems.privacyPolicy.link}}" target="_blank" class="accordion-item-title">{{ main.menuItems.privacyPolicy.label }}<i class="icon-action"></i></a></div>\n        <div class="accordion">\n          <h3 data-ng-click="loadDesktopVersionAction()" class="accordion-item-title">{{ \'LABEL_DESKTOP_VERSION\' | translate }}<i class="icon-action"></i></h3>\n        </div>\n      </div>\n      <div class="m-sidebar-menu-wrapper"></div>\n      <div ng-cloak="ng-cloak" class="l-mini-summary">\n        <div ng-if="showMiniSummary" class="l-mini-summary-top"><span>{{main.miniSummary.location[0].user_input_origin_airport_code}}</span><i class="direction-going"></i><span>{{main.miniSummary.location[0].user_input_destination_airport_code}}</span><span data-ng-if="main.miniSummary.user_input_journey_type === \'Round Trip\'" class="journey-type">{{ \'LABEL_ROUND_TRIP\' | translate }}</span><span data-ng-if="main.miniSummary.user_input_journey_type === \'One Way\'" class="journey-type">{{ \'LABEL_ONE_WAY\' | translate }}</span><span data-ng-if="main.miniSummary.user_input_journey_type === \'Multi City\'" class="journey-type">{{ \'LABEL_MULTI_CITY\' | translate }}</span></div>\n        <div ng-if="showMiniSummary" class="l-mini-summary-bottom"><span>{{main.miniSummary.departure[0].user_input_date| date:\'MMMM d\'}}</span><span ng-if="main.miniSummary.return[0]"> - {{main.miniSummary.return[0].user_input_date| date:\'MMMM d\'}}</span><span ng-if="main.miniSummary.user_input_journey_type == \'Multi City\'"> - {{main.miniSummary.departure[main.miniSummary.departure.length - 1].user_input_date| date:\'MMMM d\'}}</span><span> | {{main.miniSummary.passengers.user_input_adults + main.miniSummary.passengers.user_input_children + main.miniSummary.passengers.user_input_infants}}</span><i class="passengers"></i></div>\n        <div ng-if="showMiniSummary &amp;&amp; showMiniSummaryPrice" class="price">{{main.miniSummary.total_price.currency_code}} {{ (main.miniSummary.total_price.cash) | number:2 }}</div>\n        <div ng-if="!showMiniSummary" class="message"><i class="icon--checked"></i>{{ \'LABEL_BOOK_YOUR_TRIP\' | translate }}</div>\n        <div ng-if="showMiniSummary &amp;&amp; !showMiniSummaryPrice &amp;&amp; main.selectedChooseCurrency  &amp;&amp; main.chooseCurrency.length &gt; 0" class="currency">\n          <select data-ng-model="main.selectedChooseCurrency" data-ng-change="main.onChangeChooseCurrency(main.selectedChooseCurrency)" data-ng-options="option.shortName  for option in main.chooseCurrency track by option.value" class="select--safari-friendly--white"></select>\n        </div>\n      </div>\n      <ul ng-if="showMiniSummary" class="l-stepper">\n        <li ng-repeat="step in stepper.steps" ng-class="{\'active\': step.state == \'active\', \'done\': step.state == \'done\'}"></li>\n      </ul>\n      <section ng-if="main.user" class="m-card login">\n        <div class="content">\n          <p>{{ \'LABEL_WELCOME\' | translate }},<strong> {{main.user.username}}</strong> {{main.user.connectMilesNumber}}</p>\n        </div>\n      </section>\n      <div class="l-body">\n        <div data-ng-controller="SearchResultController" class="m-search-results">\n          <div ng-cloak="ng-cloak" class="l-messages">\n            <div data-ng-repeat="message in ui.messages" data-ng-class="{error: message.type == \'error\'}" class="m-message"><i></i>\n              <p>{{message.content}}</p>\n            </div>\n          </div>\n          <section data-ng-repeat="location in ui.locations" data-ng-class="{\'done\': location.done}" class="m-flight-selection">\n            <div data-ng-if="ui.user_input_journey_type==\'Multi City\'" ng-cloak="ng-cloak" class="m-header"><strong>{{$index + 1}}</strong><span>\n                {{location.extra_info.geo.origin_city_name}}\n                ({{location.user_input_origin_airport_code}})\n                - {{location.extra_info.geo.destination_city_name}}\n                ({{location.user_input_destination_airport_code}})</span></div>\n            <div data-ng-show="location.departure.summary.show || !location.departure.selectingValueForFirstTime" ng-cloak="ng-cloak" class="m-itinerary-summary">\n              <h4 class="title"></h4>\n              <div data-ng-show="location.departure.summary.show" class="itinerary-summary-flight itinerary-summary-flight--departure">\n                <div class="title">\n                  <div data-ng-if="ui.user_input_journey_type==\'Round Trip\'" class="title-text title-text--primary">{{ \'LABEL_FLIGHT_OUTBOUND\' | translate }}</div><span data-ng-click="closeDepartureLocationSummaryAction(location)" class="close-text">{{ \'LABEL_SUMMARY_CLOSE_TITLE\' | translate }}</span>\n                </div>\n                <div class="flight-list-title">{{location.departure.dates[0].date | date:\'MMMM d, y\'}}</div>\n                <div data-ng-repeat="flight in location.departure.summary.flight_list" class="flight-list">\n                  <div class="flight">\n                    <div class="l-flight-detail">\n                      <div class="flight-detail flight-detail--origin"><span class="location">{{flight.origin_airport_code}}</span><span class="time"> {{flight.departure_time | simpledate}}<sup data-ng-repeat="dec in flight.disclaimer" data-ng-if="dec.field == \'departure_time\'">{{location.disclaimer_mapping[dec.id].symbol}}</sup></span></div><i class="flight-direction"></i><span data-ng-if="flight.duration &amp;&amp; flight.duration &gt;= 0" class="flight-duration--center">{{flight.duration | duration}}</span>\n                      <div class="flight-detail flight-detail--destination"><span class="location">{{flight.destination_airport_code}}</span><span class="time"> {{flight.arrival_time | simpledate}}<sup data-ng-repeat="dec in flight.disclaimer" data-ng-if="dec.field == \'arrival_time\'">{{location.disclaimer_mapping[dec.id].symbol}}</sup></span></div>\n                    </div>\n                    <div data-ng-click="flight.numberEvent()" class="flight-number text--linkify">{{flight.number}}<sup data-ng-repeat="dec in flight.disclaimer" data-ng-if="dec.field == \'flight_number\'">{{location.disclaimer_mapping[dec.id].symbol}}</sup>\n                      <div data-jqui-dialog="data-jqui-dialog" data-bs-open-dialog="{{ui.flightDetails.openDialog}}" data-bs-close-from-inner="ui.flightDetails.openDialog" class="dialog-container">\n                        <div class="m-flight-details-dialog">\n                          <div class="m-dialog-head"><span>{{ui.flightDetails.data.dialogTitle}}</span><span data-ng-click="ui.flightDetails.openDialog=false" class="close">X</span></div>\n                          <div class="m-dialog-body">\n                            <div data-ng-if="ui.flightDetails.isLoading" class="m-loader m-loader--dialog-internal">\n                              <div class="icon--pure-css">Loading</div>\n                            </div>\n                            <table data-ng-if="ui.flightDetails.data.flight">\n                              <tbody>\n                                <tr>\n                                  <td>{{ui.flightDetails.data.flight.optText}}</td>\n                                  <td>{{ui.flightDetails.data.flight.valueText}}</td>\n                                </tr>\n                                <tr>\n                                  <td>{{ui.flightDetails.data.airLine.optText}}</td>\n                                  <td>{{ui.flightDetails.data.airLine.valueText}}</td>\n                                </tr>\n                                <tr>\n                                  <td>{{ui.flightDetails.data.from.optText}}</td>\n                                  <td>{{ui.flightDetails.data.from.valueText}}</td>\n                                </tr>\n                                <tr>\n                                  <td>{{ui.flightDetails.data.timeTotal.optText}}</td>\n                                  <td>{{ui.flightDetails.data.timeTotal.valueText}}</td>\n                                </tr>\n                                <tr>\n                                  <td>{{ui.flightDetails.data.to.optText}}</td>\n                                  <td>{{ui.flightDetails.data.to.valueText}}</td>\n                                </tr>\n                                <tr>\n                                  <td>{{ui.flightDetails.data.timeFlying.optText}}</td>\n                                  <td>{{ui.flightDetails.data.timeFlying.valueText}}</td>\n                                </tr>\n                                <tr>\n                                  <td>{{ui.flightDetails.data.date.optText}}</td>\n                                  <td>{{ui.flightDetails.data.date.valueText}}</td>\n                                </tr>\n                                <tr>\n                                  <td>{{ui.flightDetails.data.equipment.optText}}</td>\n                                  <td>{{ui.flightDetails.data.equipment.valueText}}</td>\n                                </tr>\n                                <tr>\n                                  <td>{{ui.flightDetails.data.depart.optText}}</td>\n                                  <td>{{ui.flightDetails.data.depart.valueText}}</td>\n                                </tr>\n                                <tr>\n                                  <td>{{ui.flightDetails.data.timeGround.optText}}</td>\n                                  <td>{{ui.flightDetails.data.timeGround.valueText}}</td>\n                                </tr>\n                                <tr>\n                                  <td>{{ui.flightDetails.data.arrive.optText}}</td>\n                                  <td>{{ui.flightDetails.data.arrive.valueText}}</td>\n                                </tr>\n                                <tr data-ng-if="ui.flightDetails.data.rating.optText">\n                                  <td>{{ui.flightDetails.data.rating.optText}}</td>\n                                  <td ng-bind-html="ui.flightDetails.data.rating.valueText | sanitize"></td>\n                                </tr>\n                              </tbody>\n                            </table>\n                          </div>\n                        </div>\n                      </div>\n                    </div>\n                  </div>\n                  <div data-ng-repeat="dec in flight.disclaimer | unique: \'id\'" class="declaimer"><sup>{{location.disclaimer_mapping[dec.id].symbol}}</sup>{{location.disclaimer_mapping[dec.id].text}}</div><br/>\n                </div>\n                <div data-ng-if="location.departure.summary.price &gt;= 0" class="price"><span data-ng-if="ui.total_price.currency_code &gt;= 0">{{ui.total_price.currency_code}}</span><strong data-ng-if="location.departure.summary.cash_after_discount &gt; 0" class="cash--after-discount"> {{location.departure.summary.cash_after_discount | number:2 }}</strong><strong data-ng-class="{\'price--deleted\': location.departure.summary.cash_after_discount &gt; 0}" data-ng-if="location.departure.summary.price &gt; -1" class="cash"> {{location.departure.summary.price | number:2 }}</strong></div>\n              </div>\n            </div>\n            <div class="m-flights">\n              <div data-ng-show="location.departure.show" ng-cloak="ng-cloak" class="m-departure">\n                <div class="m-flight-options">\n                  <h4 class="doit"><i></i><span data-ng-if="ui.user_input_journey_type==\'Multi City\'">{{ \'LABEL_FLIGHT_DOIT_FLIGHT\' | translate }}</span><span data-ng-if="ui.user_input_journey_type!=\'Multi City\'">{{ \'LABEL_FLIGHT_DOIT_OUTBOUND\' | translate }}</span></h4>\n                  <div>\n                    <h4 class="{{location.departure.selectedClassIndex.cssClass}}"><span>{{location.departure.dates[0].date | date:\'fullDate\'}}</span>\n                      <button data-ng-if="ui.user_input_journey_type!=\'Multi City\'" data-ng-click="ui.clickBtnSelectFlightClass(true)" class="m-select-flight-class {{location.departure.selectedClassIndex.cssClass}}">{{location.departure.selectedClassIndex.name}}</button>\n                    </h4>\n                    <div data-jqui-dialog="data-jqui-dialog" data-bs-open-dialog="{{ui.departureDialogIsOpen}}" data-bs-close-from-inner="ui.departureDialogIsOpen" class="dialog-container">\n                      <div data-ng-repeat="option in location.departure.availableClasses track by option.name" data-ng-class="{\'m-dialog-item-disabled\': option.cheapestPrice === \'N/A\', \'m-dialog-item-selected\': option.selected}" class="m-dialog-item">\n                        <div class="m-item-col-left {{option.cssClass}}"><span data-ng-click="option.showDesc=!option.showDesc"><i class="icon--info-circled"></i></span></div>\n                        <div data-ng-click="ui.onSelectFlightClass(option, true, location)" class="m-item-col-right"><span class="m-item-name">{{option.name}}</span><span class="m-item-price"><strong data-ng-if="option.cash_after_discount &gt; 0" class="cash--after-discount"> {{option.cash_after_discount | number:2 }}</strong><strong data-ng-class="{\'price--deleted\': option.cash_after_discount &gt; 0}" data-ng-if="option.cheapestPrice &gt; -1" class="cash"> {{option.cheapestPrice | number:2 }}</strong></span>\n                          <ul data-ng-if="option.showDesc" class="m-item-descriptions">\n                            <li data-ng-repeat="liDesc in option.desc">{{liDesc}}</li>\n                          </ul>\n                        </div>\n                      </div>\n                    </div>\n                    <div data-ng-if="location.departure.dates[0].flights.length &lt; 1" class="m-available-fligths">\n                      <div>{{ \'LABEL_NOT_AVAILABLE_FLIGTHS_IN_SELECTED_DATE\' | translate }}</div>\n                    </div>\n                    <div data-ng-repeat="flight in location.departure.dates[0].flights" data-ng-class="{\'non-available\': flight.info.classes[location.departure.selectedClassIndex.id].price.cash == -1}" class="m-available-fligths">\n                      <div data-ng-click="selectFlightAction(flight, location, \'departure\', $parent.$index, $event)">\n                        <div class="flight-time">\n                          <div data-ng-repeat="fInfo in flight.info.flight_list"><span class="departing"><strong class="time"> {{fInfo.departure_time | simpledate}}</strong><span class="location">{{fInfo.origin_airport_code}}</span></span><i class="direction-going"></i><span class="returning"><strong class="time"> {{flight.info.arrival_time | simpledate}}</strong><span class="location">{{fInfo.destination_airport_code}}</span></span>\n                            <div class="declaimer"><span data-ng-repeat="dec in fInfo.disclaimer" data-ng-if="dec.field == \'flight_number\'">{{location.disclaimer_mapping[dec.id].text}}</span></div><br/>\n                          </div><span data-ng-if="flight.info.flight_list.length &gt; 1" class="stops">{{flight.info.flight_list.length - 1}} {{ \'LABEL_FLIGHT_STOPS\' | translate }}</span><span data-ng-if="flight.info.flight_list.length &lt;= 1" class="stops">{{ \'LABEL_FLIGHT_NO_STOPS\' | translate }}</span>\n                          <div data-ng-if="flight.info.duration &amp;&amp; flight.info.duration &gt;= 0" class="flight-duration">\n                             -\n                             {{flight.info.duration | duration}}\n                          </div>\n                        </div>\n                        <div class="flight-price"><strong data-ng-if="flight.info.classes[location.departure.selectedClassIndex.id].price.cash_after_discount &gt; 0" class="cash--after-discount">{{flight.info.classes[location.departure.selectedClassIndex.id].price.cash_after_discount | number:2 }}</strong><strong data-ng-class="{\'price--deleted\': flight.info.classes[location.departure.selectedClassIndex.id].price.cash_after_discount &gt; 0}" data-ng-if="flight.info.classes[location.departure.selectedClassIndex.id].price.cash &gt; -1" class="cash">{{flight.info.classes[location.departure.selectedClassIndex.id].price.cash | number:2 }}</strong><strong data-ng-if="flight.info.classes[location.departure.selectedClassIndex.id].price.cash == -1">N/A</strong></div>\n                        <div data-ng-if="flight.info.classes[location.departure.selectedClassIndex.id].price.cash &gt;= 0" class="flight-selling-class"><span>(<a data-ng-click="flight.info.classes[location.departure.selectedClassIndex.id].sellingClass.click($event); ui.sellingClass.isDeparture=true">{{flight.info.classes[location.departure.selectedClassIndex.id].sellingClass.text}}</a>)</span></div>\n                        <div data-jqui-dialog="data-jqui-dialog" data-bs-open-dialog="{{ui.sellingClass.openDialog}}" data-bs-close-from-inner="ui.sellingClass.openDialog" class="dialog-container">\n                          <div class="m-selling-class-dialog">\n                            <div class="m-dialog-head"><span data-ng-if="ui.sellingClass.isDeparture">{{location.departure.selectedClassIndex.name}}</span><span data-ng-click="ui.sellingClass.openDialog=false" class="close">X</span><span data-ng-if="!ui.sellingClass.isDeparture">{{location.return.selectedClassIndex.name}}</span></div>\n                            <div class="m-dialog-body">\n                              <div data-ng-if="ui.sellingClass.isLoading" class="m-loader m-loader--dialog-internal">\n                                <div class="icon--pure-css"></div>\n                              </div>\n                              <div data-ng-if="!ui.sellingClass.isLoading" data-ng-bind-html="ui.sellingClass.html"></div>\n                            </div>\n                          </div>\n                        </div>\n                      </div>\n                    </div>\n                  </div>\n                </div>\n              </div>\n            </div>\n            <div data-ng-show="location.departure.summary.show || !location.departure.selectingValueForFirstTime" ng-cloak="ng-cloak" class="m-itinerary-summary">\n              <h4 class="title"></h4>\n              <div data-ng-show="location.return.summary.show" class="itinerary-summary-flight itinerary-summary-flight--return">\n                <div class="title">\n                  <div data-ng-if="ui.user_input_journey_type==\'Round Trip\'" class="title-text title-text--primary">{{ \'LABEL_FLIGHT_INBOUND\' | translate }}</div><span data-ng-click="closeReturnLocationSummaryAction(location)" class="close-text">{{ \'LABEL_SUMMARY_CLOSE_TITLE\' | translate }}</span>\n                </div>\n                <div class="flight-list-title">{{location.return.dates[0].date | date:\'MMMM d, y\'}}</div>\n                <div data-ng-repeat="flight in location.return.summary.flight_list" class="flight-list">\n                  <div class="flight">\n                    <div class="l-flight-detail">\n                      <div class="flight-detail flight-detail--origin"><span class="location">{{flight.origin_airport_code}}</span><span class="time"> {{flight.departure_time |simpledate}}<sup data-ng-repeat="dec in flight.disclaimer" data-ng-if="dec.field == \'departure_time\'">{{location.disclaimer_mapping[dec.id].symbol}}</sup></span></div><i class="flight-direction"></i><span data-ng-if="flight.duration &amp;&amp; flight.duration &gt;= 0" class="flight-duration--center">{{flight.duration | duration}}</span>\n                      <div class="flight-detail flight-detail--destination"><span class="location">{{flight.destination_airport_code}}</span><span class="time"> {{flight.arrival_time | simpledate}}<sup data-ng-repeat="dec in flight.disclaimer" data-ng-if="dec.field == \'arrival_time\'">{{location.disclaimer_mapping[dec.id].symbol}}</sup></span></div>\n                    </div>\n                    <div data-ng-click="flight.numberEvent()" class="flight-number text--linkify">{{flight.number}}<sup data-ng-repeat="dec in flight.disclaimer" data-ng-if="dec.field == \'flight_number\'">{{location.disclaimer_mapping[dec.id].symbol}}</sup></div>\n                  </div>\n                  <div data-ng-repeat="dec in flight.disclaimer | unique: \'id\'" class="declaimer"><sup>{{location.disclaimer_mapping[dec.id].symbol}}</sup>{{location.disclaimer_mapping[dec.id].text}}</div><br/>\n                </div>\n                <div data-ng-if="location.return.summary.price &gt;= 0" class="price"><span data-ng-if="ui.total_price.currency_code &gt;= 0">{{ui.total_price.currency_code}}</span><strong data-ng-if="location.return.summary.cash_after_discount &gt; 0" class="cash--after-discount"> {{location.return.summary.cash_after_discount}}</strong><strong data-ng-class="{\'price--deleted\': location.return.summary.cash_after_discount &gt; 0}" data-ng-if="location.return.summary.price &gt; -1" class="cash"> {{location.return.summary.price | number:2 }}</strong></div>\n              </div>\n            </div>\n            <div class="m-flights">\n              <div data-ng-if="location.return" data-ng-show="location.return.show" ng-cloak="ng-cloak" class="m-return">\n                <div class="m-flight-options m-inbound-flight-options">\n                  <h4 class="doit"><i></i><span>{{ \'LABEL_FLIGHT_DOIT_INBOUND\' | translate }}</span></h4>\n                  <h4 class="{{location.return.selectedClassIndex.cssClass}}"><span>{{location.return.dates[0].date | date:\'fullDate\'}}</span>\n                    <button data-ng-if="ui.user_input_journey_type!=\'Multi City\'" data-ng-click="ui.clickBtnSelectFlightClass(false)" class="m-select-flight-class {{location.return.selectedClassIndex.cssClass}}">{{location.return.selectedClassIndex.name}}</button>\n                  </h4>\n                  <div data-jqui-dialog="data-jqui-dialog" data-bs-open-dialog="{{ui.returnDialogIsOpen}}" data-bs-close-from-inner="ui.returnDialogIsOpen" class="dialog-container">\n                    <div data-ng-repeat="option in location.return.availableClasses track by option.name" data-ng-class="{\'m-dialog-item-disabled\': option.cheapestPrice === \'N/A\', \'m-dialog-item-selected\': option.name === location.return.selectedClassIndex.name}" class="m-dialog-item">\n                      <div class="m-item-col-left {{option.cssClass}}"><span data-ng-click="option.showDesc=!option.showDesc"><i class="icon--info-circled"></i></span></div>\n                      <div data-ng-click="ui.onSelectFlightClass(option, false, location)" class="m-item-col-right"><span class="m-item-name">{{option.name}}</span><span class="m-item-price"><strong data-ng-if="option.cash_after_discount &gt; 0" class="cash--after-discount"> {{option.cash_after_discount | number:2 }}</strong><strong data-ng-class="{\'price--deleted\': option.cash_after_discount &gt; 0}" data-ng-if="option.cheapestPrice &gt; -1" class="cash"> {{option.cheapestPrice | number:2 }}</strong></span>\n                        <ul data-ng-if="option.showDesc" class="m-item-descriptions">\n                          <li ng-repeat="liDesc in option.desc">{{liDesc}}</li>\n                        </ul>\n                      </div>\n                    </div>\n                  </div>\n                  <div data-ng-if="location.return.dates[0].flights.length &lt; 1" class="m-available-fligths">\n                    <div>{{ \'LABEL_NOT_AVAILABLE_FLIGTHS_IN_SELECTED_DATE\' | translate }}</div>\n                  </div>\n                  <div data-ng-repeat="flight in location.return.dates[0].flights" data-ng-class="{\'non-available\': flight.info.classes[location.return.selectedClassIndex.id].price.cash == -1}" data-ng-if="location.return.dates[0].flights.length &gt; 0" class="m-available-fligths">\n                    <div data-ng-click="selectFlightAction(flight, location, \'return\', $parent.$index, $event)">\n                      <div class="flight-time">\n                        <div data-ng-repeat="fInfo in flight.info.flight_list"><span class="departing"><strong class="time"> {{fInfo.departure_time |simpledate}}</strong><span class="location">{{fInfo.origin_airport_code}}</span></span><i class="direction-going"></i><span class="returning"><strong class="time"> {{fInfo.arrival_time |simpledate}}</strong><span class="location">{{fInfo.destination_airport_code}}</span></span>\n                          <div class="declaimer"><span data-ng-repeat="dec in fInfo.disclaimer" data-ng-if="dec.field == \'flight_number\'">{{location.disclaimer_mapping[dec.id].text}}</span></div><br/>\n                        </div><span data-ng-if="flight.info.flight_list.length &gt; 1" class="stops">{{flight.info.flight_list.length - 1}} {{ \'LABEL_FLIGHT_STOPS\' | translate }}</span><span data-ng-if="flight.info.flight_list.length &lt;= 1" class="stops">{{ \'LABEL_FLIGHT_NO_STOPS\' | translate }}</span>\n                        <div data-ng-if="flight.info.duration &amp;&amp; flight.info.duration &gt;= 0" class="flight-duration">  - {{flight.info.duration | duration}}</div>\n                      </div>\n                      <div class="flight-price"><strong data-ng-if="flight.info.classes[location.return.selectedClassIndex.id].price.cash_after_discount &gt; 0" class="cash--after-discount">{{flight.info.classes[location.return.selectedClassIndex.id].price.cash_after_discount | number:2 }}</strong><strong data-ng-class="{\'price--deleted\': flight.info.classes[location.return.selectedClassIndex.id].price.cash_after_discount &gt; 0}" data-ng-if="flight.info.classes[location.return.selectedClassIndex.id].price.cash &gt; -1" class="cash">{{flight.info.classes[location.return.selectedClassIndex.id].price.cash | number:2 }}</strong><strong data-ng-if="flight.info.classes[location.return.selectedClassIndex.id].price.cash == -1">N/A</strong></div>\n                    </div>\n                    <div data-ng-if="flight.info.classes[location.return.selectedClassIndex.id].price.cash &gt;= 0" class="flight-selling-class"><span>(<a data-ng-click="flight.info.classes[location.return.selectedClassIndex.id].sellingClass.click($event); ui.sellingClass.isDeparture=false">{{flight.info.classes[location.return.selectedClassIndex.id].sellingClass.text}}</a>)</span></div>\n                    <div data-jqui-dialog="data-jqui-dialog" data-bs-open-dialog="{{ui.sellingClass.openDialog}}" data-bs-close-from-inner="ui.sellingClass.openDialog" class="dialog-container">\n                      <div class="m-selling-class-dialog">\n                        <div class="m-dialog-head"><span data-ng-if="ui.sellingClass.isDeparture">{{location.departure.selectedClassIndex.name}}</span><span data-ng-click="ui.sellingClass.openDialog=false" class="close">X</span><span data-ng-if="!ui.sellingClass.isDeparture">{{location.return.selectedClassIndex.name}}</span></div>\n                        <div class="m-dialog-body">\n                          <div data-ng-if="ui.sellingClass.isLoading" class="m-loader m-loader--dialog-internal">\n                            <div class="icon--pure-css"></div>\n                          </div>\n                          <div data-ng-if="!ui.sellingClass.isLoading" data-ng-bind-html="ui.sellingClass.html"></div>\n                        </div>\n                      </div>\n                    </div>\n                  </div>\n                </div>\n              </div>\n            </div>\n          </section>\n          <section>\n            <div data-ng-repeat="message in ui.mediaInfoMessages" ng-cloak="ng-cloak" class="m-card m-card--muted">\n              <header class="title">\n                <h4 class="title-text title-text--normal"><i class="title-icon"></i>{{message.head}}</h4>\n              </header>\n              <div class="content"><span>{{message.body}}</span></div>\n            </div>\n          </section>\n          <div data-ng-show="ui.showContinueButton" ng-cloak="ng-cloak" class="l-action">\n            <button type="button" data-ng-click="continueButtonAction()"> {{ \'LABEL_CONTINUE\' | translate }}</button>\n          </div>\n        </div>\n      </div>\n      <footer><img src="//smart-prepro.securitytrfx.com/app/modules/bsmart-cm-ibe/assets/images/star-alliance.png" alt="Logo" class="logo--image"/></footer>\n    </div>\n  </div>\n</div>'
    },
    stylesFilesPath: [
    '//smart-prepro.securitytrfx.com/app/modules/bsmart-cm-ibe/modules/' +
      'ibe-search-result/styles/index.2ff53cfb74742aec.css',
    ]
  };
  instance.getConfig = function() {
    return config;
  };
  return instance;
});
