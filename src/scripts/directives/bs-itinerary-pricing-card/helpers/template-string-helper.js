/* eslint-disable max-len */
'use strict'

define([], function() {
  return {
    templatePerPassenger:
      `<section>
        <div
          data-ng-repeat="(key, passenger_type) in ui.total_price_per_passenger_type">
          <div
            class="m-card m-card--flat m-card--bordered m-card--primary margin-bottom-sm"
            data-ng-if="passenger_type.total_fare > 0"
          >
            <div class="content price-passenger-breakdown" ng-cloak>
              <h3 class="title">
                {{passenger_type.name}}
                <span class="pull-right">
                  x{{ui.passengers["user_input_" + key]}}
                </span>
              </h3>
              <p>
                <strong>
                  {{ "LABEL_BASE_PRICE" | translate }} :
                </strong>
                <span class="pull-right">
                  {{ passenger_type.base_fare | number:2  }}
                </span>
              </p>
              <p>
                <strong>
                  {{ "LABEL_TAXES" | translate }}
                </strong>
                <span class="pull-right">
                  {{ passenger_type.taxes | number:2}}
                </span>
              </p>
              <p data-ng-if="passenger_type.fuel_surcharges >= 0">
                <strong>
                  {{ "LABEL_FUEL_SUBCHARGES" | translate }} :
                </strong>
                <span class="pull-right">
                  {{ passenger_type.fuel_surcharges | number:2 }}
                </span>
              </p>
              <p data-ng-if="ui.insurance.head && ui.insurance.body">
                <strong>
                  {{ui.insurance.head}}
                </strong>
                <span class="pull-right">
                  {{ ui.insurance.price_per_passenger | number:2 }}
                </span>
              </p>
            </div>
            <header class="title">
              <h4 class="title-text">
                {{ "LABEL_TOTAL_FARE" | translate }}
                <strong class="title-text--right">
                  {{ui.total_price.currency_code}} {{ (passenger_type.total_fare * ui.passengers["user_input_" + key] ) + ui.insurance.price_per_passenger | number:2 }}
                </strong>
              </h4>
            </header>
          </div>
        </div>
      </section>`,
    template:
      `<section data-ng-if="ui.total_price.taxes >= 0 && ui.total_price.fuel_surcharges >= 0">
        <div class="m-card m-card--warning">
          <div class="content price-summary" ng-cloak>
            <p>
              <strong>
                {{ "LABEL_BASE_PRICE" | translate }} :
              </strong>
              <span class="pull-right">
                {{ ui.total_price.base_fare | number:2  }}
              </span>
            </p>
            <p class="price-discount" data-ng-repeat="discount in ui.discounts">
              <span>
                {{ discount.name }}:
              </span>
              <span class="pull-right">
                -{{ discount.price | number:2  }}
              </span>
            </p>
            <p data-ng-if="ui.total_price.taxes >= 0">
              <strong>
                {{ "LABEL_TAXES" | translate }}
              </strong>
              <span class="pull-right">
                {{ ui.total_price.taxes | number:2}}
              </span>
            </p>
            <p data-ng-if="ui.total_price.fuel_surcharges >= 0">
              <strong>
                {{ "LABEL_FUEL_SUBCHARGES" | translate }} :
              </strong>
              <span class="pull-right">
                {{ ui.total_price.fuel_surcharges | number:2 }}
              </span>
            </p>
            <p data-ng-if="ui.showPriceInsurance === true">
              <strong>
                {{ui.insurance.head}}
              </strong>
              <span class="pull-right" data-ng-if="ui.insurance.body.price">
                {{ ui.insurance.body.price | number:2 }}
              </span>
              <span class="pull-right" data-ng-if="ui.insurance.price">
                {{ ui.insurance.price | number:2 }}
              </span>
            </p>
          </div>
          <header class="title">
            <h4 class="title-text">
              {{ "LABEL_TOTAL" | translate }}
              <strong class="title-text--right">
                {{ui.total_price.currency_code}} {{ ui.total_price.cash | number:2 }}
              </strong>
            </h4>
          </header>
        </div>
      </section>`,
  }
})
