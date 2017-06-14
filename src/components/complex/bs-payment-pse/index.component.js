/**
 * Angular component
 */
define(['./helpers/scrapHelper'], function(helper) {
  'use strict'
  /**
   * PaymentPse Controller
   *
   * @param {Object} [$scope]
   * @param {Object} [$element]
   * @param {Object} [$attrs]
   * @param {Object} [$timeout]
   * @param {Function} [$filter]
   */
  function PaymentPseController(
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

    $scope.$on('view-validation:partialErrors', (ev, vErrors) => {
      ctrl.vErrors = vErrors
    })

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
      ctrl.fieldCT = {
        label: helper.fieldCustomerType.getLabel(),
        value: helper.fieldCustomerType.getValue(),
        options: helper.fieldCustomerType.getSelectOptions(),
        hOnChange: decoratorSelectOnChange(
          helper.fieldCustomerType.setValue
        ),
      }
      ctrl.fieldCT.value =
        buildSelectValue(ctrl.fieldCT)

      ctrl.fieldBFN = {
        label: helper.fieldBuyerFullName.getLabel(),
        value: helper.fieldBuyerFullName.getValue(),
        hOnChange: helper.fieldBuyerFullName.setValue,
      }


      ctrl.fieldDT = {
        label: helper.fieldDocumentType.getLabel(),
        value: helper.fieldDocumentType.getValue(),
        options: helper.fieldDocumentType.getSelectOptions(),
        hOnChange: decoratorSelectOnChange(
          helper.fieldDocumentType.setValue
        ),
      }
      ctrl.fieldDT.value =
        buildSelectValue(ctrl.fieldDT)

      ctrl.fieldDN = {
        label: helper.fieldDocumentNumber.getLabel(),
        value: helper.fieldDocumentNumber.getValue(),
        hOnChange: helper.fieldDocumentNumber.setValue,
      }

      ctrl.fieldBID = {
        label: helper.fieldBankID.getLabel(),
        value: helper.fieldBankID.getValue(),
        options: helper.fieldBankID.getSelectOptions(),
        hOnChange: decoratorSelectOnChange(
          helper.fieldBankID.setValue
        ),
      }
      ctrl.fieldBID.value =
        buildSelectValue(ctrl.fieldBID)

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
    }
  }

  PaymentPseController.$inject = [
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
              {{'LABEL_DEBIT_CARD_ISSUE_COLOMBIA' | translate}}
            </h4>
          </header>
          <div class="content">
            <div class="form-group md"
              data-ng-class="{'show-field-error': $ctrl.vErrors.customerType }">
              <label class="col-sm-2 control-label field-required">
                {{$ctrl.fieldCT.label}}
              </label>
              <div class="col-sm-10">
                <select class="md form-control"
                  data-ng-model="$ctrl.fieldCT.value"
                  data-ng-change="$ctrl.fieldCT.hOnChange($ctrl.fieldCT.value)"
                  data-ng-options="option.name for option in $ctrl.fieldCT.options track by option.value">
                </select>
                <span class="text-message">
                  {{ $ctrl.vErrors.customerType }}
                </span>
              </div>
            </div>
            <div class="form-group md"
              data-ng-class="{'show-field-error': $ctrl.vErrors.buyerFullName }">
              <label class="col-sm-2 control-label field-required">
                {{$ctrl.fieldBFN.label}}
              </label>
              <div class="col-sm-10">
                <input class="md form-control" type="text" placeholder=""
                  data-ng-model="$ctrl.fieldBFN.value"
                  data-ng-change="$ctrl.fieldBFN.hOnChange($ctrl.fieldBFN.value)" />
                <span class="text-message">
                  {{ $ctrl.vErrors.buyerFullName }}
                </span>
              </div>
            </div>
            <div class="form-group md"
              data-ng-class="{'show-field-error': $ctrl.vErrors.documentType }">
              <label class="col-sm-2 control-label field-required">
                {{$ctrl.fieldDT.label}}
              </label>
              <div class="col-sm-10">
                <select class="md form-control"
                  data-ng-model="$ctrl.fieldDT.value"
                  data-ng-change="$ctrl.fieldDT.hOnChange($ctrl.fieldDT.value)"
                  data-ng-options="option.name for option in $ctrl.fieldDT.options track by option.value">
                </select>
                <span class="text-message"
                  {{ $ctrl.vErrors.documentType }}
                </span>
              </div>
            </div>
            <div class="form-group md"
              data-ng-class="{'show-field-error':  $ctrl.vErrors.documentNumber }">
              <label class="col-sm-2 control-label field-required">
                {{$ctrl.fieldDN.label}}
              </label>
              <div class="col-sm-10">
                <input class="md form-control" type="text" placeholder=""
                  data-ng-model="$ctrl.fieldDN.value"
                  data-ng-change="$ctrl.fieldDN.hOnChange($ctrl.fieldDN.value)" />
                <span class="text-message">
                  {{ $ctrl.vErrors.documentNumber }}
                </span>
              </div>
            </div>
            <div class="form-group md"
              data-ng-class="{'show-field-error': $ctrl.vErrors.bankId }">
              <label class="col-sm-2 control-label field-required">
                {{$ctrl.fieldBID.label}}
              </label>
              <div class="col-sm-10">
                <select class="md form-control"
                  data-ng-model="$ctrl.fieldBID.value"
                  data-ng-change="$ctrl.fieldBID.hOnChange($ctrl.fieldBID.value)"
                  data-ng-options="option.name for option in $ctrl.fieldBID.options track by option.value">
                </select>
                <span class="text-message"
                  {{ $ctrl.vErrors.bankId }}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div class="m-card">
          <header class="title">
            <h4 class="title-text">
              {{'LABEL_BILLING_ADDRESS' | translate}}
            </h4>
          </header>
          <div class="content">
            <div class="form-group md"
              data-ng-class="{'show-field-error': $ctrl.vErrors.addressLine1 }">
              <label class="col-sm-2 control-label field-required">
                {{$ctrl.fieldAL1.label}}
              </label>
              <div class="col-sm-10">
                <input class="md form-control" type="text" placeholder=""
                  data-ng-model="$ctrl.fieldAL1.value"
                  data-ng-change="$ctrl.fieldAL1.hOnChange($ctrl.fieldAL1.value)" />
                <span class="text-message">
                  {{ $ctrl.vErrors.addressLine1 }}
                </span>
              </div>
            </div>
            <div class="form-group md">
              <label class="col-sm-2 control-label">
                {{$ctrl.fieldAL2.label}}
              </label>
              <div class="col-sm-10">
                <input class="md form-control" type="text" placeholder=""
                  data-ng-model="$ctrl.fieldAL2.value"
                  data-ng-change="$ctrl.fieldAL2.hOnChange($ctrl.fieldAL2.value)" />
              </div>
            </div>
            <div class="form-group md"
              data-ng-class="{'show-field-error': $ctrl.vErrors.city }">
              <label class="col-sm-2 control-label field-required">
                {{$ctrl.fieldCityTitle.label}}
              </label>
              <div class="col-sm-10">
                <input class="md form-control" type="text" placeholder=""
                  data-ng-model="$ctrl.fieldCityTitle.value"
                  data-ng-change="$ctrl.fieldCityTitle.hOnChange($ctrl.fieldCityTitle.value)" />
                <span class="text-message">
                  {{ $ctrl.vErrors.city }}
                </span>
              </div>
            </div>
            <div class="form-group md"
              data-ng-class="{'show-field-error': $ctrl.vErrors.country }">
              <label class="col-sm-2 control-label field-required">
                {{$ctrl.fieldCountryTitle.label}}
              </label>
              <div class="col-sm-10">
                <select class="md form-control"
                  data-ng-model="$ctrl.fieldCountryTitle.value"
                  data-ng-change="$ctrl.fieldCountryTitle.hOnChange($ctrl.fieldCountryTitle.value)"
                  data-ng-options="option.name for option in $ctrl.fieldCountryTitle.options track by option.value">
                </select>
                <span class="text-message">
                  {{ $ctrl.vErrors.country }}
                </span>
              </div>
            </div>
            <div class="form-group md"
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
              </div>
            </div>
            <div class="form-group md"
              data-ng-class="{'show-field-error': $ctrl.vErrors.postalCode }">
              <label class="col-sm-2 control-label">
                {{$ctrl.fieldZT.label}}
              </label>
              <div class="col-sm-10">
                <input class="md form-control" type="text" placeholder=""
                  data-ng-model="$ctrl.fieldZT.value"
                  data-ng-change="$ctrl.fieldZT.hOnChange($ctrl.fieldZT.value)" />
                <span class="text-message">
                  {{ $ctrl.vErrors.postalCode }}
                </span>
              </div>
            </div>
            <div class="form-group md"
              data-ng-class="{'show-field-error': $ctrl.vErrors.phoneCountryCode || $ctrl.vErrors.phone }">
              <label  class="col-sm-2 control-label control-label--block field-required">
                {{$ctrl.fieldPhone.label}}
              </label>
              <div  class="col-sm-3 phone-country-code">
                <input class="md form-control"
                  type='tel' placeholder=''
                  data-ng-model="$ctrl.fieldPhone.codeValue"
                  data-ng-change="$ctrl.fieldPhone.hOnchangeCode($ctrl.fieldPhone.codeValue)" />
              </div>
              <div class="col-sm-9 phone-number">
                <input class="md form-control" type='tel' placeholder=''
                  data-ng-model="$ctrl.fieldPhone.value"
                  data-ng-change="$ctrl.fieldPhone.hOnChange($ctrl.fieldPhone.value)" />
              </div>
              <span class="text-message">
                {{ $ctrl.vErrors.phone }}
              </span>
              <span class="text-message">
                {{ $ctrl.vErrors.phoneCountryCode }}
              </span>
            </div>
          </div>
        </div>
      </section>`,
    controller: PaymentPseController,
  }
})
