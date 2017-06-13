define(['jquery'], ($jq) => {
  'use strict'
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
  }
})
