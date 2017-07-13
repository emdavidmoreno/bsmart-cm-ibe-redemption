define(['jquery'], ($jq) => {
  'use strict'
  // selectors billing address
  const SELECTOR_PSE_BA_AL1T_LABEL = '#addressLine1Title';
  const SELECTOR_PSE_BA_AL1T_INPUT = $jq('input[id="formOfPayment(BANKTRANSFERS)\\.billingAddress.addressLine1"]').length === 1 ? 'input[id="formOfPayment(BANKTRANSFERS)\\.billingAddress.addressLine1"]': '#commonAddress\\.addressLine1';
    
  const SELECTOR_PSE_BA_AL2T_LABEL = '#addressLine2Title';
  const SELECTOR_PSE_BA_AL2T_INPUT = $jq('input[id="formOfPayment(BANKTRANSFERS)\\.billingAddress\\.addressLine2"]').length === 1 ? 'input[id="formOfPayment(BANKTRANSFERS)\\.billingAddress.addressLine1"]': '#commonAddress\\.addressLine2'; 
    
  const SELECTOR_PSE_BA_CITY_TITLE_LABEL = '#cityTitle'
  const SELECTOR_PSE_BA_CITY_TITLE_INPUT =$jq('input[id="formOfPayment(BANKTRANSFERS)\\.billingAddress\\.city"]').length === 1 ? 'input[id="formOfPayment(BANKTRANSFERS)\\.billingAddress\\.city"]': '#commonAddress\\.city'; 
    
  const SELECTOR_PSE_BA_COUNTRY_TITLE_LABEL = '#countryTitle'
  const SELECTOR_PSE_BA_COUNTRY_TITLE_SELECT = $jq('select[id="formOfPayment(BANKTRANSFERS)\\.billingAddress\\.country"]').length === 1 ? 'select[id="formOfPayment(BANKTRANSFERS)\\.billingAddress\\.country"]':'#commonAddress\\.country';
    

  const SELECTOR_PSE_BA_STATE_TITLE_LABEL = '#stateTitle'
  const SELECTOR_PSE_BA_STATE_TITLE_SELECT = $jq('select[id="formOfPayment(BANKTRANSFERS)\\.billingAddress\\.stateDisplay"]').length === 1 ? 'select[id="formOfPayment(BANKTRANSFERS)\\.billingAddress\\.stateDisplay"]':'#commonAddress\\.stateDisplay';
  
  const SELECTOR_PSE_BA_ZIP_TITLE_LABEL = '#zipTitle'
  const SELECTOR_PSE_BA_ZIP_TITLE_INPUT = $jq('input[id="formOfPayment(BANKTRANSFERS)\\.billingAddress\\.postalCode"]').length === 1 ? 'input[id="formOfPayment(BANKTRANSFERS)\\.billingAddress\\.postalCode"]':'#commonAddress\\.postalCode';
  

  const SELECTOR_BSLIP_FN_LABEL = '#bankTransferFiscalNumberLabel'
  const SELECTOR_BSLIP_FN_INPUT = 'input[id="fiscalNumber-BANKTRANSFERS"]'
  const SELECTOR_BSLIP_CFN_LABEL = '#bankTransferConfirmFiscalNumberLabel'
  const SELECTOR_BSLIP_CFN_INPUT =
    'input[id="confirmFiscalNumber-BANKTRANSFERS"]'

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
          `${SELECTOR_BSLIP_FN_LABEL} span:first`
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
      /**
       * @return {bool}
       */
      isAvailable: () => {
        return ($(SELECTOR_BSLIP_FN_LABEL).length > 0)
      },
    },
    fieldConfirmFiscalNumber: {
      /**
       * @return {String}
       */
      getLabel: () =>
        getSubstringFromText(
          SELECTOR_BSLIP_CFN_LABEL,
          `${SELECTOR_BSLIP_CFN_LABEL} span:first`
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
      /**
       * @return {bool}
       */
      isAvailable: () => {
        return ($(SELECTOR_BSLIP_CFN_LABEL).length > 0)
      },
    },
    fieldCAAdressLine1: {
      /**
       * @return {String}
       */
      getLabel: () =>
        getSubstringFromText(
          SELECTOR_PSE_BA_AL1T_LABEL,
          `${SELECTOR_PSE_BA_AL1T_LABEL} span:first`
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
        $jq(SELECTOR_PSE_BA_AL1T_INPUT).change()
      },
    },
    fieldCAAdressLine2: {
      /**
       * @return {String}
       */
      getLabel: () =>
        getSubstringFromText(
          SELECTOR_PSE_BA_AL2T_LABEL,
          `${SELECTOR_PSE_BA_AL2T_LABEL} span:first`
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
        $jq(SELECTOR_PSE_BA_AL2T_INPUT).change()
      },
    },
    fieldCACityTitle: {
      /**
       * @return {String}
       */
      getLabel: () =>
        getSubstringFromText(
          SELECTOR_PSE_BA_CITY_TITLE_LABEL,
          `${SELECTOR_PSE_BA_CITY_TITLE_LABEL} span:first`
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
        $jq(SELECTOR_PSE_BA_CITY_TITLE_INPUT).change()
      },
    },
    fieldCountryTitle: {
      /**
       * @return {String}
       */
      getLabel: () =>
        getSubstringFromText(
          SELECTOR_PSE_BA_COUNTRY_TITLE_LABEL,
          `${SELECTOR_PSE_BA_COUNTRY_TITLE_LABEL} span:first`
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
        $jq(SELECTOR_PSE_BA_COUNTRY_TITLE_SELECT).change()
      },
    },
    fieldStateTitle: {
      /**
       * @return {String}
       */
      getLabel: () =>
        getSubstringFromText(
          SELECTOR_PSE_BA_STATE_TITLE_LABEL,
          `${SELECTOR_PSE_BA_STATE_TITLE_LABEL} span:first`
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
        $jq(SELECTOR_PSE_BA_STATE_TITLE_SELECT).change()
      },
    },
    fieldCAZipTitle: {
      /**
       * @return {String}
       */
      getLabel: () =>
        getSubstringFromText(
          SELECTOR_PSE_BA_ZIP_TITLE_LABEL,
          `${SELECTOR_PSE_BA_ZIP_TITLE_LABEL} span:first`
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
        $jq(SELECTOR_PSE_BA_ZIP_TITLE_INPUT).change()
      },
    },
  }
})
