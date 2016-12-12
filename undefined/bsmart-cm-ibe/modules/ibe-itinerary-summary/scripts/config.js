/*global require*/
define([], function() {
  var instance = {};
  var config = {
    // describe the element which gonna contain the module
    insertNodeCommand: {
      selector: 'body',
      command: 'appendTo',
      template: '\n<div id="booksmart">\n  <div class="l-book-smart">\n    <div data-ng-controller="AppController" class="m-book-smart">\n      <nav class="m-top-bar brand-bar"><a rel="nofollow" href="https://www.copaair.com/" class="logo"><img src="//smart-prepro.securitytrfx.com/app/modules/bsmart-cm-ibe/assets/images/logo.png" alt="Logo" class="logo--image"/></a><i class="menu"></i></nav>\n      <div class="m-sidebar-menu">\n        <div class="accordion"><a href="https://www.copaair.com/" class="accordion-item-title-without-icon">{{ \'LABEL_HOME\' | translate }}</a></div>\n        <div class="accordion">\n          <h3 data-ng-click="" class="accordion-item-title">{{ \'LABEL_LANGUAGE\' | translate }} ({{main.languageOptions[main.language].name}})<i class="icon-action"></i></h3>\n          <div class="accordion-item-content">\n            <select data-ng-model="main.language" data-ng-change="main.onChangeLanguage()" data-ng-options="key as value.name for (key, value) in main.languageOptions"></select>\n          </div>\n        </div>\n        <div class="accordion"><a href="http://www.copaair.com/sites/cc/en/informacion-de-viaje/pages/condiciones-generales-de-equipaje.aspx" target="_blank" class="accordion-item-title-without-icon">{{ \'LABEL_BAGAGGE_POLICE\' | translate }}</a></div>\n        <div class="accordion"><a href="https://www.copaair.com/sites/cc/en/informacion-de-viaje/pages/cargo-equipaje-socios-codigo-compartido.aspx" target="_blank" class="accordion-item-title-without-icon">{{ \'LABEL_PARTNER_BAGAGGE_POLICE\' | translate }}</a></div>\n        <div class="accordion"><a href="{{main.menuItems.privacyPolicy.link}}" target="_blank" class="accordion-item-title">{{ main.menuItems.privacyPolicy.label }}<i class="icon-action"></i></a></div>\n        <div class="accordion">\n          <h3 data-ng-click="loadDesktopVersionAction()" class="accordion-item-title">{{ \'LABEL_DESKTOP_VERSION\' | translate }}<i class="icon-action"></i></h3>\n        </div>\n      </div>\n      <div class="m-sidebar-menu-wrapper"></div>\n      <div ng-cloak="ng-cloak" class="l-mini-summary">\n        <div ng-if="showMiniSummary" class="l-mini-summary-top"><span>{{main.miniSummary.location[0].user_input_origin_airport_code}}</span><i class="direction-going"></i><span>{{main.miniSummary.location[0].user_input_destination_airport_code}}</span><span data-ng-if="main.miniSummary.user_input_journey_type === \'Round Trip\'" class="journey-type">{{ \'LABEL_ROUND_TRIP\' | translate }}</span><span data-ng-if="main.miniSummary.user_input_journey_type === \'One Way\'" class="journey-type">{{ \'LABEL_ONE_WAY\' | translate }}</span><span data-ng-if="main.miniSummary.user_input_journey_type === \'Multi City\'" class="journey-type">{{ \'LABEL_MULTI_CITY\' | translate }}</span></div>\n        <div ng-if="showMiniSummary" class="l-mini-summary-bottom"><span>{{main.miniSummary.departure[0].user_input_date| date:\'MMMM d\'}}</span><span ng-if="main.miniSummary.return[0]"> - {{main.miniSummary.return[0].user_input_date| date:\'MMMM d\'}}</span><span ng-if="main.miniSummary.user_input_journey_type == \'Multi City\'"> - {{main.miniSummary.departure[main.miniSummary.departure.length - 1].user_input_date| date:\'MMMM d\'}}</span><span> | {{main.miniSummary.passengers.user_input_adults + main.miniSummary.passengers.user_input_children + main.miniSummary.passengers.user_input_infants}}</span><i class="passengers"></i></div>\n        <div ng-if="showMiniSummary &amp;&amp; showMiniSummaryPrice" class="price">{{main.miniSummary.total_price.currency_code}} {{ (main.miniSummary.total_price.cash) | number:2 }}</div>\n        <div ng-if="!showMiniSummary" class="message"><i class="icon--checked"></i>{{ \'LABEL_BOOK_YOUR_TRIP\' | translate }}</div>\n        <div ng-if="showMiniSummary &amp;&amp; !showMiniSummaryPrice &amp;&amp; main.selectedChooseCurrency  &amp;&amp; main.chooseCurrency.length &gt; 0" class="currency">\n          <select data-ng-model="main.selectedChooseCurrency" data-ng-change="main.onChangeChooseCurrency(main.selectedChooseCurrency)" data-ng-options="option.shortName  for option in main.chooseCurrency track by option.value" class="select--safari-friendly--white"></select>\n        </div>\n      </div>\n      <ul ng-if="showMiniSummary" class="l-stepper">\n        <li ng-repeat="step in stepper.steps" ng-class="{\'active\': step.state == \'active\', \'done\': step.state == \'done\'}"></li>\n      </ul>\n      <section ng-if="main.user" class="m-card login">\n        <div class="content">\n          <p>{{ \'LABEL_WELCOME\' | translate }},<strong> {{main.user.username}}</strong> {{main.user.connectMilesNumber}}</p>\n        </div>\n      </section>\n      <div class="l-body">\n        <div ng-controller="ItinerarySummaryController" class="m-itinerary-summary">\n          <div ng-cloak="ng-cloak" class="l-messages">\n            <div data-ng-repeat="message in []" data-ng-class="{error: message.type == \'error\'}" class="m-message">\n              <p>{{message.content}}</p>\n            </div>\n          </div>\n          <section>\n            <h3>{{\'LABEL_ITINERARY_SUMMARY\'| translate}}</h3>\n            <div>\n              <header class="title">\n                <h4 class="title-text"></h4>\n              </header>\n              <div data-ng-repeat="location in ui.locations" class="content">\n                <div data-ng-if="ui.user_input_journey_type==\'Multi City\'" ng-cloak="ng-cloak" class="m-header"><strong>{{$index + 1}}</strong><span>\n                    {{location.extra_info.geo.origin_city_name}}\n                    ({{location.user_input_origin_airport_code}})\n                    - {{location.extra_info.geo.destination_city_name}}\n                    ({{location.user_input_destination_airport_code}})</span></div>\n                <div>\n                  <div data-ng-class="{\'itinerary-summary--no-dividers\': ui.user_input_journey_type != \'Multi City\'}" ng-cloak="ng-cloak" class="m-itinerary-summary">\n                    <div data-ng-repeat="flight in location.departure.dates[0].flights" class="itinerary-summary-flight itinerary-summary-flight--departure">\n                      <div class="title">\n                        <div data-ng-if="ui.user_input_journey_type != \'Multi City\'" class="title-text title-text--primary">{{ \'LABEL_FLIGHT_OUTBOUND\' | translate }}</div>\n                        <div class="title-text title-text--fareclass pull-right {{location.departure.availableClasses[0].cssClass}}">{{ flight.info.classes[0].name }}<span data-ng-click="flight.info.classes[0].sellingClass.onclick();ui.sellingClass.isDeparture=true" class="text--linkify">({{flight.info.classes[0].sellingClass.text}})</span></div>\n                      </div>\n                      <div class="flight-list-title">{{location.departure.dates[0].date | date:\'MMMM d, y\'}}</div>\n                      <div data-ng-repeat="flightItem in flight">\n                        <div data-ng-repeat="flight_list_item in flightItem.flight_list" class="flight-list">\n                          <div class="flight">\n                            <div class="l-flight-detail">\n                              <div class="flight-detail flight-detail--origin"><span class="location">{{flight_list_item.origin_airport_code}}</span><span class="time"> {{flight_list_item.departure_time | simpledate}}<sup data-ng-repeat="dec in flight_list_item.disclaimer" data-ng-if="dec.field == \'departure_time\'">{{location.disclaimer_mapping[dec.id].symbol}}</sup></span></div><i class="flight-direction"></i><span data-ng-if="flight_list_item.duration &amp;&amp; flight_list_item.duration &gt;= 0" class="flight-duration--center">{{flight_list_item.duration | duration}}</span>\n                              <div class="flight-detail flight-detail--destination"><span class="location">{{flight_list_item.destination_airport_code}}</span><span class="time"> {{flight_list_item.arrival_time | simpledate}}<sup data-ng-repeat="dec in flight_list_item.disclaimer" data-ng-if="dec.field == \'arrival_time\'">{{location.disclaimer_mapping[dec.id].symbol}}</sup></span></div>\n                            </div>\n                            <div data-ng-click="flight_list_item.onclick()" class="flight-number text-primary">{{flight_list_item.number}}<sup data-ng-repeat="dec in flight_list_item.disclaimer" data-ng-if="dec.field == \'flight_number\'">{{ui.disclaimer_mapping[dec.id].symbol}}</sup></div>\n                          </div>\n                          <div data-ng-repeat="disc in flight_list_item.disclaimer | unique: \'id\'" class="declaimer"><sup>{{ui.disclaimer_mapping[disc.id].symbol}}</sup>{{ui.disclaimer_mapping[disc.id].text}}</div><br/>\n                        </div>\n                      </div>\n                    </div>\n                    <div data-ng-repeat="flight in location.return.dates[0].flights" class="itinerary-summary-flight itinerary-summary-flight--return">\n                      <div class="title">\n                        <div data-ng-if="ui.user_input_journey_type==\'Round Trip\'" class="title-text title-text--primary">{{ \'LABEL_FLIGHT_INBOUND\' | translate }}</div>\n                        <div class="title-text title-text--fareclass pull-right {{location.return.availableClasses[0].cssClass}}">{{flight.info.classes[0].name}}<span data-ng-click="flight.info.classes[0].sellingClass.onclick();ui.sellingClass.isDeparture=false" class="text--linkify">({{flight.info.classes[0].sellingClass.text}})</span></div>\n                      </div>\n                      <div class="flight-list-title">{{location.return.dates[0].date | date:\'MMMM d, y\'}}</div>\n                      <div data-ng-repeat="flightItem in flight">\n                        <div data-ng-repeat="flight_list_item in flightItem.flight_list" class="flight-list">\n                          <div class="flight">\n                            <div class="l-flight-detail">\n                              <div class="flight-detail flight-detail--origin"><span class="location">{{flight_list_item.origin_airport_code}}</span><span class="time"> {{flight_list_item.departure_time | simpledate}}<sup data-ng-repeat="dec in flight_list_item.disclaimer" data-ng-if="dec.field == \'departure_time\'">{{location.disclaimer_mapping[dec.id].symbol}}</sup></span></div><i class="flight-direction"></i><span data-ng-if="flight_list_item.duration &amp;&amp; flight_list_item.duration &gt;= 0" class="flight-duration--center">{{flight_list_item.duration | duration}}</span>\n                              <div class="flight-detail flight-detail--destination"><span class="location">{{flight_list_item.destination_airport_code}}</span><span class="time"> {{flight_list_item.arrival_time | simpledate}}<sup data-ng-repeat="dec in flight_list_item.disclaimer" data-ng-if="dec.field == \'arrival_time\'">{{location.disclaimer_mapping[dec.id].symbol}}</sup></span></div>\n                            </div>\n                            <div data-ng-click="flight_list_item.onclick()" class="flight-number text-primary">{{flight_list_item.number}}<sup data-ng-repeat="dec in flight_list_item.disclaimer" data-ng-if="dec.field == \'flight_number\'">{{ui.disclaimer_mapping[dec.id].symbol}}</sup></div>\n                          </div>\n                          <div data-ng-repeat="dec in flight_list_item.disclaimer | unique: \'id\'" class="declaimer"><sup>{{ui.disclaimer_mapping[dec.id].symbol}}</sup>{{ui.disclaimer_mapping[dec.id].text}}</div><br/>\n                        </div>\n                      </div>\n                    </div>\n                  </div>\n                </div>\n                <div data-jqui-dialog="data-jqui-dialog" data-bs-open-dialog="{{ui.sellingClass.openDialog}}" data-bs-close-from-inner="ui.sellingClass.openDialog" class="dialog-container">\n                  <div class="m-selling-class-dialog">\n                    <div class="m-dialog-head"><span data-ng-if="ui.sellingClass.isDeparture">{{location.departure.selectedClassIndex.name}}</span><span data-ng-click="ui.sellingClass.openDialog=false" class="close">X</span><span data-ng-if="!ui.sellingClass.isDeparture">{{location.return.selectedClassIndex.name}}</span></div>\n                    <div class="m-dialog-body">\n                      <div data-ng-if="ui.sellingClass.isLoading" class="m-loader m-loader--dialog-internal">\n                        <div class="icon--pure-css"></div>\n                      </div>\n                      <div data-ng-if="!ui.sellingClass.isLoading" data-ng-bind-html="ui.sellingClass.html"></div>\n                    </div>\n                  </div>\n                </div>\n                <div data-jqui-dialog="data-jqui-dialog" data-bs-open-dialog="{{ui.flightDetails.openDialog}}" data-bs-close-from-inner="ui.flightDetails.openDialog" class="dialog-container">\n                  <div class="m-flight-details-dialog">\n                    <div class="m-dialog-head"><span>{{ui.flightDetails.data.dialogTitle}}</span><span data-ng-click="ui.flightDetails.openDialog=false" class="close">X</span></div>\n                    <div class="m-dialog-body">\n                      <div data-ng-if="ui.flightDetails.isLoading" class="m-loader m-loader--dialog-internal">\n                        <div class="icon--pure-css">Loading</div>\n                      </div>\n                      <table data-ng-if="ui.flightDetails.data.flight">\n                        <tbody>\n                          <tr>\n                            <td>{{ui.flightDetails.data.flight.optText}}</td>\n                            <td>{{ui.flightDetails.data.flight.valueText}}</td>\n                          </tr>\n                          <tr>\n                            <td>{{ui.flightDetails.data.airLine.optText}}</td>\n                            <td>{{ui.flightDetails.data.airLine.valueText}}</td>\n                          </tr>\n                          <tr>\n                            <td>{{ui.flightDetails.data.from.optText}}</td>\n                            <td>{{ui.flightDetails.data.from.valueText}}</td>\n                          </tr>\n                          <tr>\n                            <td>{{ui.flightDetails.data.timeTotal.optText}}</td>\n                            <td>{{ui.flightDetails.data.timeTotal.valueText}}</td>\n                          </tr>\n                          <tr>\n                            <td>{{ui.flightDetails.data.to.optText}}</td>\n                            <td>{{ui.flightDetails.data.to.valueText}}</td>\n                          </tr>\n                          <tr>\n                            <td>{{ui.flightDetails.data.timeFlying.optText}}</td>\n                            <td>{{ui.flightDetails.data.timeFlying.valueText}}</td>\n                          </tr>\n                          <tr>\n                            <td>{{ui.flightDetails.data.date.optText}}</td>\n                            <td>{{ui.flightDetails.data.date.valueText}}</td>\n                          </tr>\n                          <tr>\n                            <td>{{ui.flightDetails.data.equipment.optText}}</td>\n                            <td>{{ui.flightDetails.data.equipment.valueText}}</td>\n                          </tr>\n                          <tr>\n                            <td>{{ui.flightDetails.data.depart.optText}}</td>\n                            <td>{{ui.flightDetails.data.depart.valueText}}</td>\n                          </tr>\n                          <tr>\n                            <td>{{ui.flightDetails.data.timeGround.optText}}</td>\n                            <td>{{ui.flightDetails.data.timeGround.valueText}}</td>\n                          </tr>\n                          <tr>\n                            <td>{{ui.flightDetails.data.arrive.optText}}</td>\n                            <td>{{ui.flightDetails.data.arrive.valueText}}</td>\n                          </tr>\n                          <tr data-ng-if="ui.flightDetails.data.rating.optText">\n                            <td>{{ui.flightDetails.data.rating.optText}}</td>\n                            <td ng-bind-html="ui.flightDetails.data.rating.valueText | sanitize"></td>\n                          </tr>\n                        </tbody>\n                      </table>\n                    </div>\n                  </div>\n                </div>\n              </div>\n            </div>\n          </section>\n          <div data-bs-itinerary-pricing-card-per-passenger="data-bs-itinerary-pricing-card-per-passenger" data-ui="ui"></div>\n          <div data-bs-itinerary-pricing-card="data-bs-itinerary-pricing-card" data-ui="ui"></div>\n          <section data-ng-if="ui.tavelInsurance &amp;&amp; ui.tavelInsurance.display.head" class="m-insurance">\n            <h2>{{ui.tavelInsurance.display.head}}</h2>\n            <div data-ng-bind-html="ui.insuranceIcon | sanitize" class="insurance-icon"></div>\n            <div class="m-card">\n              <div class="content">\n                <div class="m-insurance-option">\n                  <input type="radio" value="1" name="InsurancePurchaseBS" data-ng-model="ui.tavelInsurance.accept" data-ng-change="ui.tavelInsurance.setAccept()"/>\n                  <label>{{ui.tavelInsurance.display.textAccept.text}}<a href="{{ui.tavelInsurance.display.textAccept.link}}" target="_blank">{{ui.tavelInsurance.display.textAccept.linkText}}</a></label>\n                </div>\n                <div class="m-insurance-option">\n                  <input type="radio" value="0" name="InsurancePurchaseBS" data-ng-model="ui.tavelInsurance.accept" data-ng-change="ui.tavelInsurance.setNoAccept()"/>\n                  <label>{{ui.tavelInsurance.display.textNoAccept}}</label>\n                </div>\n              </div>\n              <div data-ng-if="ui.insurancePrice &gt; 0" class="content">\n                <div class="price">{{ ui.insurance.totalPriceMerch | number:2 }}</div>\n              </div>\n            </div>\n          </section>\n          <section data-ng-if="ui.showPayment &amp;&amp; ui.payment.info.toPay.head != \'\' &amp;&amp; ui.payment.info.reserveAndHold.head != \'\'">\n            <h2>{{ \'LABEL_CHOOSE_PAYMENT_TYPE\' | translate }}</h2>\n            <div class="m-card">\n              <div class="content">\n                <div>\n                  <label>\n                    <input type="radio" value="1" name="paymentType" checked="checked" data-ng-model="ui.payment.name" data-ng-change="ui.selectPaymentProceedToPay()"/>{{ ui.payment.info.toPay.head }}\n                  </label>\n                  <div data-ng-if="ui.payment.name == &quot;1&quot;" class="m-panel choose-payment-type--pay">\n                    <div data-ng-bind-html="ui.payment.info.toPay.desc | sanitize" class="content content--border-bottom content--border-dashed content--small-vertical-padding margin-bottom-sm margin-top-sm"></div>\n                  </div>\n                </div>\n                <div>\n                  <label>\n                    <input type="radio" value="0" name="paymentType" data-ng-model="ui.payment.name" data-ng-change="ui.selectPaymentReserveAndHold()"/>{{ ui.payment.info.reserveAndHold.head }}\n                  </label>\n                  <div data-ng-if="ui.payment.name == &quot;0&quot;" class="m-panel">\n                    <div data-ng-bind-html="ui.payment.info.reserveAndHold.desc | sanitize" class="content content--border-bottom content--border-dashed content--small-vertical-padding margin-bottom-sm margin-top-sm"></div>\n                  </div>\n                </div>\n              </div>\n            </div>\n          </section>\n          <section>\n            <div data-ng-repeat="message in ui.messages" ng-cloak="ng-cloak" class="m-card m-card--muted">\n              <header class="title">\n                <h4 class="title-text title-text--normal"><i class="title-icon"></i>{{message.head}}</h4>\n              </header>\n              <div class="content"><span>{{message.body}}</span></div>\n            </div>\n          </section>\n          <div ng-show="ui.showContinueButton" class="l-action">\n            <button type="button" data-ng-click="continueButtonAction()">{{ \'LABEL_CONTINUE\' | translate }}</button>\n          </div>\n        </div>\n      </div>\n      <footer><img src="//smart-prepro.securitytrfx.com/app/modules/bsmart-cm-ibe/assets/images/star-alliance.png" alt="Logo" class="logo--image"/></footer>\n    </div>\n  </div>\n</div>'
    },
    stylesFilesPath: [
    '//smart-prepro.securitytrfx.com/app/modules/bsmart-cm-ibe/modules/' +
      'ibe-itinerary-summary/styles/index.bb8346a862891e8e.css',
    ]
  };
  instance.getConfig = function() {
    return config;
  };
  return instance;
});
