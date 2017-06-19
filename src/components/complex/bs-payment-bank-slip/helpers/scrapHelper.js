define(['jquery'], ($jq) => {
  'use strict'
  // selectors bank
  const SELECTOR_BSLIP_FN_LABEL = '#boletoBancarioFiscalNumberLabel'
  const SELECTOR_BSLIP_FN_INPUT = 'input[id="fiscalNumber-BOLETOBANCARIO"]'
  const SELECTOR_BSLIP_CFN_LABEL = '#boletoBancarioConfirmFiscalNumberLabel'
  const SELECTOR_BSLIP_CFN_INPUT =
    'input[id="confirmFiscalNumber-BOLETOBANCARIO"]'
  // selectors billing address
  const SELECTOR_BSLIP_BA_AL1T_LABEL =
    '.multiplePaymentItem-BB #addressLine1Title'
  const SELECTOR_BSLIP_BA_AL1T_INPUT =
    'input[id="formOfPayment(BOLETOBANCARIO).billingAddress.addressLine1"]'
  const SELECTOR_BSLIP_BA_AL2T_LABEL =
    '.multiplePaymentItem-BB #addressLine2Title'
  const SELECTOR_BSLIP_BA_AL2T_INPUT =
    'input[id="formOfPayment(BOLETOBANCARIO).billingAddress.addressLine2"]'
  const SELECTOR_BSLIP_BA_CITY_TITLE_LABEL =
    '.multiplePaymentItem-BB #cityTitle'
  const SELECTOR_BSLIP_BA_CITY_TITLE_INPUT =
    'input[id="formOfPayment(BOLETOBANCARIO).billingAddress.city"]'
  const SELECTOR_BSLIP_BA_COUNTRY_TITLE_LABEL =
    '.multiplePaymentItem-BB #countryTitle'
  const SELECTOR_BSLIP_BA_COUNTRY_TITLE_SELECT =
    'select[id="formOfPayment(BOLETOBANCARIO).billingAddress.country"]'

  const SELECTOR_BSLIP_BA_STATE_TITLE_LABEL =
    '.multiplePaymentItem-BB #stateTitle'
  const SELECTOR_BSLIP_BA_STATE_TITLE_SELECT =
    'select[id="formOfPayment(BOLETOBANCARIO).billingAddress.stateDisplay"]'

  const SELECTOR_BSLIP_BA_ZIP_TITLE_LABEL =
    '.multiplePaymentItem-BB #zipTitle'
  const SELECTOR_BSLIP_BA_ZIP_TITLE_INPUT =
    'input[id="formOfPayment(BOLETOBANCARIO).billingAddress.postalCode"]'

  /**
   * Return options array form the selector select
   *
   * @param {String} selector
   * @return {Array.<Object>}
   */
  const getSelectInputOptions = (selector) => {
    let options = []
    let $elems = $(`${selector} option`)
    $elems.each(function(index, el) {
      options.push({
        name: $(el).text(),
        value: $(el).attr('value'),
        selected: $(el).is(':selected'),
      })
    })
    return options
  }
  /**
   *
   * @param {String} textSelector
   * @param {String} partSelector
   *
   * @return {String}
   */
  const getSubstringFromText = (textSelector, partSelector) => {
    const text = $(textSelector).text().trim()
    if(!partSelector)
      return text
    return text.replace($(partSelector).text().trim(), '').trim()
  }

  return {
    fieldFiscalNumber: {
      /**
       * @return {String}
       */
      getLabel: () =>
        getSubstringFromText(
          SELECTOR_BSLIP_FN_LABEL,
          `${SELECTOR_BSLIP_FN_LABEL} span`
        ),
      /**
       * @return {String}
       */
      getValue: () =>
        $jq(SELECTOR_BSLIP_FN_INPUT).val(),
      /**
       * @param {String} value
       */
      setValue: (value) => {
        $jq(SELECTOR_BSLIP_FN_INPUT).val(value)
        $jq(SELECTOR_BSLIP_FN_INPUT).change()
      },
    },
    fieldConfirmFiscalNumber: {
      /**
       * @return {String}
       */
      getLabel: () =>
        getSubstringFromText(
          SELECTOR_BSLIP_CFN_LABEL,
          `${SELECTOR_BSLIP_CFN_LABEL} span`
        ),
      /**
       * @return {String}
       */
      getValue: () =>
        $jq(SELECTOR_BSLIP_CFN_INPUT).val(),
      /**
       * @param {String} value
       */
      setValue: (value) => {
        $jq(SELECTOR_BSLIP_CFN_INPUT).val(value)
        $jq(SELECTOR_BSLIP_CFN_INPUT).change()
      },
    },
    fieldCAAdressLine1: {
      /**
       * @return {String}
       */
      getLabel: () =>
        getSubstringFromText(
          SELECTOR_BSLIP_BA_AL1T_LABEL,
          `${SELECTOR_BSLIP_BA_AL1T_LABEL} span`
        ),
      /**
       * @return {String}
       */
      getValue: () =>
        $jq(SELECTOR_BSLIP_BA_AL1T_INPUT).val(),
      /**
       * @param {String} value
       */
      setValue: (value) => {
        $jq(SELECTOR_BSLIP_BA_AL1T_INPUT).val(value)
        $jq(SELECTOR_BSLIP_BA_AL1T_INPUT).change()
      },
    },
    fieldCAAdressLine2: {
      /**
       * @return {String}
       */
      getLabel: () =>
        getSubstringFromText(
          SELECTOR_BSLIP_BA_AL2T_LABEL
        ),
      /**
       * @return {String}
       */
      getValue: () =>
        $jq(SELECTOR_BSLIP_BA_AL2T_INPUT).val(),
      /**
       * @param {String} value
       */
      setValue: (value) => {
        $jq(SELECTOR_BSLIP_BA_AL2T_INPUT).val(value)
        $jq(SELECTOR_BSLIP_BA_AL2T_INPUT).change()
      },
    },
    fieldCACityTitle: {
      /**
       * @return {String}
       */
      getLabel: () =>
        getSubstringFromText(
          SELECTOR_BSLIP_BA_CITY_TITLE_LABEL,
          `${SELECTOR_BSLIP_BA_CITY_TITLE_LABEL} span`
        ),
      /**
       * @return {String}
       */
      getValue: () =>
        $jq(SELECTOR_BSLIP_BA_CITY_TITLE_INPUT).val(),
      /**
       * @param {String} value
       */
      setValue: (value) => {
        $jq(SELECTOR_BSLIP_BA_CITY_TITLE_INPUT).val(value)
        $jq(SELECTOR_BSLIP_BA_CITY_TITLE_INPUT).change()
      },
    },
    fieldCountryTitle: {
      /**
       * @return {String}
       */
      getLabel: () =>
        getSubstringFromText(
          SELECTOR_BSLIP_BA_COUNTRY_TITLE_LABEL,
          `${SELECTOR_BSLIP_BA_COUNTRY_TITLE_LABEL} span`
        ),
      /**
       * @return {String}
       */
      getValue: () =>
        $jq(SELECTOR_BSLIP_BA_COUNTRY_TITLE_SELECT).val(),
      /**
       * @return {Array.<Object>}
       */
      getSelectOptions: () =>
        getSelectInputOptions(SELECTOR_BSLIP_BA_COUNTRY_TITLE_SELECT),
      /**
       * @param {String} value
       */
      setValue: (value) => {
        $jq(SELECTOR_BSLIP_BA_COUNTRY_TITLE_SELECT).val(value)
        $jq(SELECTOR_BSLIP_BA_COUNTRY_TITLE_SELECT).change()
      },
    },
    fieldStateTitle: {
      /**
       * @return {String}
       */
      getLabel: () =>
        getSubstringFromText(
          SELECTOR_BSLIP_BA_STATE_TITLE_LABEL,
          `${SELECTOR_BSLIP_BA_STATE_TITLE_LABEL} span`
        ),
      /**
       * @return {String}
       */
      getValue: () =>
        $jq(SELECTOR_BSLIP_BA_STATE_TITLE_SELECT).val(),
      /**
       * @return {Array.<Object>}
       */
      getSelectOptions: () =>
        getSelectInputOptions(SELECTOR_BSLIP_BA_STATE_TITLE_SELECT),
      /**
       * @param {String} value
       */
      setValue: (value) => {
        $jq(SELECTOR_BSLIP_BA_STATE_TITLE_SELECT).val(value)
        $jq(SELECTOR_BSLIP_BA_STATE_TITLE_SELECT).change()
      },
    },
    fieldCAZipTitle: {
      /**
       * @return {String}
       */
      getLabel: () =>
        getSubstringFromText(
          SELECTOR_BSLIP_BA_ZIP_TITLE_LABEL,
          `${SELECTOR_BSLIP_BA_ZIP_TITLE_LABEL} span`
        ),
      /**
       * @return {String}
       */
      getValue: () =>
        $jq(SELECTOR_BSLIP_BA_ZIP_TITLE_INPUT).val(),
      /**
       * @param {String} value
       */
      setValue: (value) => {
        $jq(SELECTOR_BSLIP_BA_ZIP_TITLE_INPUT).val(value)
        $jq(SELECTOR_BSLIP_BA_ZIP_TITLE_INPUT).change()
      },
    },
  }
})
