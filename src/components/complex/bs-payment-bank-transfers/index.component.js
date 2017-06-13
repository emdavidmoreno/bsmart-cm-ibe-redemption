/**
 * Angular component
 */
define(['./helpers/scrapHelper'], function(helper) {
  'use strict'
  /**
   * FlexibleDatesPrices Controller
   *
   * @param {Object} [$scope]
   * @param {Object} [$element]
   * @param {Object} [$attrs]
   * @param {Object} [$timeout]
   * @param {Function} [$filter]
   */
  function PaymentBankTransfers(
    $scope, $element, $attrs, $timeout, $filter
    ) {
    let ctrl = this
    /**
     * @param {Object} states
     */
    /*
    const updateStates = (states) => {
      ctrl.updateStates({states})
    }
    */
    /**
     * Init component
     */
    ctrl.$onInit = function() {
      setupUI()
    }

    /**
     * Post link
     */
    ctrl.$postLink = function() {

    }

    /**
     *
     * @param {Object} field
     * @return {Object}
     */
    function buildSelectValue(field) {
      const v = field.options.filter((opt) =>
        opt.selected === true
      )
      let value = field.value
      if(v.length > 0) {
        value = v[0]
      }
      return value
    }
    /**
     *
     * @param {Function} fnHandler
     * @return {Function}
     */
    function decoratorSelectOnChange(fnHandler) {
      return (data) => {
        fnHandler(data.value)
      }
    }

    /**
     * Setup
     */
    function setupUI() {
      ctrl.fieldAL1 = {
        label: helper.fieldCAAdressLine1.getLabel(),
        value: helper.fieldCAAdressLine1.getValue(),
        hOnChange: helper.fieldCAAdressLine1.setValue,
      }

      ctrl.fieldAL2 = {
        label: helper.fieldCAAdressLine2.getLabel(),
        value: helper.fieldCAAdressLine2.getValue(),
        hOnChange: helper.fieldCAAdressLine2.setValue,
      }

      ctrl.fieldCityTitle = {
        label: helper.fieldCACityTitle.getLabel(),
        value: helper.fieldCACityTitle.getValue(),
        hOnChange: helper.fieldCACityTitle.setValue,
      }

      ctrl.fieldCountryTitle = {
        label: helper.fieldCountryTitle.getLabel(),
        value: helper.fieldCountryTitle.getValue(),
        options: helper.fieldCountryTitle.getSelectOptions(),
        hOnChange: decoratorSelectOnChange(
          helper.fieldCountryTitle.setValue
        ),
      }
      ctrl.fieldCountryTitle.value =
        buildSelectValue(ctrl.fieldCountryTitle)

      ctrl.fieldStateTitle = {
        label: helper.fieldStateTitle.getLabel(),
        value: helper.fieldStateTitle.getValue(),
        options: helper.fieldStateTitle.getSelectOptions(),
        hOnChange: decoratorSelectOnChange(
          helper.fieldStateTitle.setValue
        ),
      }
      ctrl.fieldStateTitle.value =
        buildSelectValue(ctrl.fieldStateTitle)

      ctrl.fieldZT = {
        label: helper.fieldCAZipTitle.getLabel(),
        value: helper.fieldCAZipTitle.getValue(),
        hOnChange: helper.fieldCAZipTitle.setValue,
      }

      ctrl.fieldPhone = {
        label: helper.fieldCAPhone.getLabel(),
        codeValue: helper.fieldCAPhone.getCodeValue(),
        value: helper.fieldCAPhone.getValue(),
        hOnChange: helper.fieldCAPhone.setValue,
        hOnchangeCode: helper.fieldCAPhone.setCodeValue,
      }
      console.log(ctrl)
    }
  }

  PaymentBankTransfers.$inject = [
    '$scope', '$element', '$attrs', '$timeout', '$filter',
  ]

  return {
    bindings: {
      // view states
      states: '<',
      // update global states
      updateStates: '&',
      // UI Model
      ui: '<',
    },
    /* eslint-disable max-len */
    template:
      `<section>
        <div class="m-card">
          <header class="title">
            <h4 class="title-text">
              {{'LABEL_BILLING_ADDRESS' | translate}}
            </h4>
          </header>
          <div class="content">
            <div class="form-group md"
              data-ng-class="{'show-field-error': ui.partialErrors.baAddressLine1 }">
              <label class="col-sm-2 control-label field-required">
                {{$ctrl.fieldAL1.label}}
              </label>
              <div class="col-sm-10">
                <input class="md form-control" type="text" placeholder=""
                  data-ng-model="$ctrl.fieldAL1.value"
                  data-ng-change="$ctrl.fieldAL1.hOnChange($ctrl.fieldAL1.value)" />
                <span class="text-message">
                  {{ ui.partialErrors.baAddressLine1 }}
                </span>
              </div>
            </div>
            <div class="form-group md"
              data-ng-class="{'show-field-error': ui.partialErrors.baAddressLine2 }">
              <label class="col-sm-2 control-label">
                {{$ctrl.fieldAL2.label}}
              </label>
              <div class="col-sm-10">
                <input class="md form-control" type="text" placeholder=""
                  data-ng-model="$ctrl.fieldAL2.value"
                  data-ng-change="$ctrl.fieldAL2.hOnChange($ctrl.fieldAL2.value)" />
                <span class="text-message">
                  {{ ui.partialErrors.baAddressLine2 }}
                </span>
              </div>
            </div>
            <div class="form-group md"
              data-ng-class="{'show-field-error': ui.partialErrors.baCity }">
              <label class="col-sm-2 control-label field-required">
                {{$ctrl.fieldCityTitle.label}}
              </label>
              <div class="col-sm-10">
                <input class="md form-control" type="text" placeholder=""
                  data-ng-model="$ctrl.fieldCityTitle.value"
                  data-ng-change="$ctrl.fieldCityTitle.hOnChange($ctrl.fieldCityTitle.value)" />
                <span class="text-message">
                  {{ ui.partialErrors.baCity }}
                </span>
              </div>
            </div>
            <div class="form-group md"
              data-ng-class="{'show-field-error': ui.partialErrors.baCountry }">
              <label class="col-sm-2 control-label field-required">
                {{$ctrl.fieldCountryTitle.label}}
              </label>
              <div class="col-sm-10">
                <select class="md form-control"
                  data-ng-model="$ctrl.fieldCountryTitle.value"
                  data-ng-change="$ctrl.fieldCountryTitle.hOnChange($ctrl.fieldCountryTitle.value)"
                  data-ng-options="option.name for option in $ctrl.fieldCountryTitle.options track by option.value">
                </select>
                <span class="text-message"
                  {{ ui.partialErrors.baCountry }}
                </span>
              </div>
            </div>
            <div class="form-group md"
              data-ng-class="{'show-field-error': ui.partialErrors.baStateDisplay }"
              data-ng-if="$ctrl.fieldStateTitle.options.length > 1">
              <label class="col-sm-2 control-label">
                {{$ctrl.fieldStateTitle.label}}
              </label>
              <div class="col-sm-10">
                <select class="md form-control"
                  data-ng-model="$ctrl.fieldStateTitle.value"
                  data-ng-change="$ctrl.fieldStateTitle.hOnChange($ctrl.fieldStateTitle.value)"
                  data-ng-options="option.name for option in $ctrl.fieldStateTitle.options track by option.value">
                </select>
                <span class="text-message"
                  {{ ui.partialErrors.baStateDisplay }}
                </span>
              </div>
            </div>
            <div class="form-group md"
              data-ng-class="{'show-field-error': ui.partialErrors.baPostalCode }">
              <label class="col-sm-2 control-label field-required">
                {{$ctrl.fieldZT.label}}
              </label>
              <div class="col-sm-10">
                <input class="md form-control" type="text" placeholder=""
                  data-ng-model="$ctrl.fieldZT.value"
                  data-ng-change="$ctrl.fieldZT.hOnChange($ctrl.fieldZT.value)" />
                <span class="text-message">
                  {{ ui.partialErrors.baPostalCode }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>`,
    controller: PaymentBankTransfers,
  }
})
