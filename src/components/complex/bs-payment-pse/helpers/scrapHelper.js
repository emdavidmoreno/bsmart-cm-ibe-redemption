define(['jquery'], ($jq) => {
  'use strict'
  // selectors bank
  const SELECTOR_PSE_CUSTOMER_TYPE_LABEL = '#pagosPSECustomerTypeLabel'
  const SELECTOR_PSE_CUSTOMER_TYPE_SELECT = 'select[id="pagosPSE.customerType"]'
  const SELECTOR_PSE_BFN_LABEL = '#pagosPSEBuyerFullNameLabel'
  const SELECTOR_PSE_BFN_INPUT = 'input[id="pagosPSE.buyerFullName"]'
  const SELECTOR_PSE_DOCUMENT_TYPE_LABEL = '#pagosPSEDocumentTypeLabel'
  const SELECTOR_PSE_DOCUMENT_TYPE_SELECT = 'select[id="pagosPSE.documentType"]'
  const SELECTOR_PSE_DN_LABEL = '#pagosPSEDocumentNumberLabel'
  const SELECTOR_PSE_DN_INPUT = 'input[id="pagosPSE.documentNumber"]'
  const SELECTOR_PSE_BANK_ID_LABEL = '#pagosPSEBankLabel'
  const SELECTOR_PSE_BANK_ID_SELECT = 'select[id="pagosPSE.bankId"]'
  // selectors billing address
  const SELECTOR_PSE_BA_AL1T_LABEL = '#addressLine1Title'
  const SELECTOR_PSE_BA_AL1T_INPUT = 'input[id="commonAddress.addressLine1"]'
  const SELECTOR_PSE_BA_AL2T_LABEL = '#addressLine2Title'
  const SELECTOR_PSE_BA_AL2T_INPUT = 'input[id="commonAddress.addressLine2"]'
  const SELECTOR_PSE_BA_CITY_TITLE_LABEL = '#cityTitle'
  const SELECTOR_PSE_BA_CITY_TITLE_INPUT = 'input[id="commonAddress.city"]'
  const SELECTOR_PSE_BA_COUNTRY_TITLE_LABEL = '#countryTitle'
  const SELECTOR_PSE_BA_COUNTRY_TITLE_SELECT =
    'select[id="commonAddress.country"]'

  const SELECTOR_PSE_BA_STATE_TITLE_LABEL = '#stateTitle'
  const SELECTOR_PSE_BA_STATE_TITLE_SELECT =
    'select[id="commonAddress.stateDisplay"]'

  const SELECTOR_PSE_BA_ZIP_TITLE_LABEL = '#zipTitle'
  const SELECTOR_PSE_BA_ZIP_TITLE_INPUT = 'input[id="commonAddress.postalCode"]'
  const SELECTOR_PSE_BA_PHONE_LABEL = '#idBuyerPhone_commonAddressPhone'
  const SELECTOR_PSE_BA_PHONE_CODE_INPUT =
    'input[id="commonAddress.phoneCountryCode"]'

  const SELECTOR_PSE_BA_PHONE_INPUT =
    'input[id="commonAddress.phone"]'

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
    fieldCustomerType: {
      /**
       * @return {String}
       */
      getLabel: () =>
        getSubstringFromText(
          SELECTOR_PSE_CUSTOMER_TYPE_LABEL,
          `${SELECTOR_PSE_CUSTOMER_TYPE_LABEL} span`
        ),
      /**
       * @return {String}
       */
      getValue: () =>
        $jq(SELECTOR_PSE_DOCUMENT_TYPE_SELECT).val(),
      /**
       * @return {Array.<Object>}
       */
      getSelectOptions: () =>
        getSelectInputOptions(SELECTOR_PSE_CUSTOMER_TYPE_SELECT),
      /**
       * @param {String} value
       */
      setValue: (value) => {
        $jq(SELECTOR_PSE_CUSTOMER_TYPE_SELECT).val(value)
      },
    },
    fieldBuyerFullName: {
      /**
       * @return {String}
       */
      getLabel: () =>
        getSubstringFromText(
          SELECTOR_PSE_BFN_LABEL,
          `${SELECTOR_PSE_BFN_LABEL} span`
        ),
      /**
       * @return {String}
       */
      getValue: () =>
        $jq(SELECTOR_PSE_BFN_INPUT).val(),
      /**
       * @param {String} value
       */
      setValue: (value) => {
        $jq(SELECTOR_PSE_BFN_INPUT).val(value)
      },
    },
    fieldDocumentType: {
      /**
       * @return {String}
       */
      getLabel: () =>
        getSubstringFromText(
          SELECTOR_PSE_DOCUMENT_TYPE_LABEL,
          `${SELECTOR_PSE_DOCUMENT_TYPE_LABEL} span`
        ),
      /**
       * @return {String}
       */
      getValue: () =>
        $jq(SELECTOR_PSE_DOCUMENT_TYPE_SELECT).val(),
      /**
       * @return {Array.<Object>}
       */
      getSelectOptions: () =>
        getSelectInputOptions(SELECTOR_PSE_DOCUMENT_TYPE_SELECT),
      /**
       * @param {String} value
       */
      setValue: (value) => {
        $jq(SELECTOR_PSE_DOCUMENT_TYPE_SELECT).val(value)
      },
    },
    fieldDocumentNumber: {
      /**
       * @return {String}
       */
      getLabel: () =>
        getSubstringFromText(
          SELECTOR_PSE_DN_LABEL,
          `${SELECTOR_PSE_DN_LABEL} span`
        ),
      /**
       * @return {String}
       */
      getValue: () =>
        $jq(SELECTOR_PSE_DN_INPUT).val(),
      /**
       * @param {String} value
       */
      setValue: (value) => {
        $jq(SELECTOR_PSE_DN_INPUT).val(value)
      },
    },
    fieldBankID: {
      /**
       * @return {String}
       */
      getLabel: () =>
        getSubstringFromText(
          SELECTOR_PSE_BANK_ID_LABEL,
          `${SELECTOR_PSE_BANK_ID_LABEL} span`
        ),
      /**
       * @return {String}
       */
      getValue: () =>
        $jq(SELECTOR_PSE_BANK_ID_SELECT).val(),
      /**
       * @return {Array.<Object>}
       */
      getSelectOptions: () =>
        getSelectInputOptions(SELECTOR_PSE_BANK_ID_SELECT),
      /**
       * @param {String} value
       */
      setValue: (value) => {
        $jq(SELECTOR_PSE_BANK_ID_SELECT).val(value)
      },
    },
    fieldCAAdressLine1: {
      /**
       * @return {String}
       */
      getLabel: () =>
        getSubstringFromText(
          SELECTOR_PSE_BA_AL1T_LABEL,
          `${SELECTOR_PSE_BA_AL1T_LABEL} span`
        ),
      /**
       * @return {String}
       */
      getValue: () =>
        $jq(SELECTOR_PSE_BA_AL1T_INPUT).val(),
      /**
       * @param {String} value
       */
      setValue: (value) => {
        $jq(SELECTOR_PSE_BA_AL1T_INPUT).val(value)
      },
    },
    fieldCAAdressLine2: {
      /**
       * @return {String}
       */
      getLabel: () =>
        getSubstringFromText(
          SELECTOR_PSE_BA_AL2T_LABEL
        ),
      /**
       * @return {String}
       */
      getValue: () =>
        $jq(SELECTOR_PSE_BA_AL2T_INPUT).val(),
      /**
       * @param {String} value
       */
      setValue: (value) => {
        $jq(SELECTOR_PSE_BA_AL2T_INPUT).val(value)
      },
    },
    fieldCACityTitle: {
      /**
       * @return {String}
       */
      getLabel: () =>
        getSubstringFromText(
          SELECTOR_PSE_BA_CITY_TITLE_LABEL,
          `${SELECTOR_PSE_BA_CITY_TITLE_LABEL} span`
        ),
      /**
       * @return {String}
       */
      getValue: () =>
        $jq(SELECTOR_PSE_BA_CITY_TITLE_INPUT).val(),
      /**
       * @param {String} value
       */
      setValue: (value) => {
        $jq(SELECTOR_PSE_BA_CITY_TITLE_INPUT).val(value)
      },
    },
    fieldCountryTitle: {
      /**
       * @return {String}
       */
      getLabel: () =>
        getSubstringFromText(
          SELECTOR_PSE_BA_COUNTRY_TITLE_LABEL,
          `${SELECTOR_PSE_BA_COUNTRY_TITLE_LABEL} span`
        ),
      /**
       * @return {String}
       */
      getValue: () =>
        $jq(SELECTOR_PSE_BA_COUNTRY_TITLE_SELECT).val(),
      /**
       * @return {Array.<Object>}
       */
      getSelectOptions: () =>
        getSelectInputOptions(SELECTOR_PSE_BA_COUNTRY_TITLE_SELECT),
      /**
       * @param {String} value
       */
      setValue: (value) => {
        $jq(SELECTOR_PSE_BA_COUNTRY_TITLE_SELECT).val(value)
      },
    },
    fieldStateTitle: {
      /**
       * @return {String}
       */
      getLabel: () =>
        getSubstringFromText(
          SELECTOR_PSE_BA_STATE_TITLE_LABEL
        ),
      /**
       * @return {String}
       */
      getValue: () =>
        $jq(SELECTOR_PSE_BA_STATE_TITLE_SELECT).val(),
      /**
       * @return {Array.<Object>}
       */
      getSelectOptions: () =>
        getSelectInputOptions(SELECTOR_PSE_BA_STATE_TITLE_SELECT),
      /**
       * @param {String} value
       */
      setValue: (value) => {
        $jq(SELECTOR_PSE_BA_STATE_TITLE_SELECT).val(value)
      },
    },
    fieldCAZipTitle: {
      /**
       * @return {String}
       */
      getLabel: () =>
        getSubstringFromText(
          SELECTOR_PSE_BA_ZIP_TITLE_LABEL
        ),
      /**
       * @return {String}
       */
      getValue: () =>
        $jq(SELECTOR_PSE_BA_ZIP_TITLE_INPUT).val(),
      /**
       * @param {String} value
       */
      setValue: (value) => {
        $jq(SELECTOR_PSE_BA_ZIP_TITLE_INPUT).val(value)
      },
    },
    fieldCAPhone: {
      /**
       * @return {String}
       */
      getLabel: () =>
        getSubstringFromText(
          SELECTOR_PSE_BA_PHONE_LABEL,
          `${SELECTOR_PSE_BA_PHONE_LABEL} span`
        ),
      /**
       * @return {String}
       */
      getCodeValue: () =>
        $jq(SELECTOR_PSE_BA_PHONE_CODE_INPUT).val(),
      /**
       * @param {String} value
       */
      setCodeValue: (value) => {
        $jq(SELECTOR_PSE_BA_PHONE_CODE_INPUT).val(value)
      },
      /**
       * @return {String}
       */
      getValue: () =>
        $jq(SELECTOR_PSE_BA_PHONE_INPUT).val(),
      /**
       * @param {String} value
       */
      setValue: (value) => {
        $jq(SELECTOR_PSE_BA_AL1T_INPUT).val(value)
      },
    },
  }
})
