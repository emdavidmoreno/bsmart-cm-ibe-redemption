/* eslint-disable max-len,no-invalid-this */
(function() {
  'use strict'
  /**
   * @return {Object}
   */
  function hostScrapService() {
    let hostScrapService = {}
    let REVIEW_ITINERARY_DISCLAIMER_SELECTOR = '.reviewItineraryDisclaimer'

    let FB_BILLING_INFO_MESSAGE_SELECTOR = '#fbBillingInfo .textBlock'

    let TB_TERMS_CONDITIONS_MESSAGE_SELECTOR =
      '#tbTermsConditions .textBody .textBlock p'

    let TB_TERMS_CONDITIONS_LINKS_SELECTOR =
      '#tbTermsConditions .textBody .linksBlock'

    let TB_TERMS_CONDITIONS_LABEL_SELECTOR =
      '#tbTermsConditions label[for="acceptTermsAndConditionsCheckBox"]'
    let TB_TERMS_CONDITIONS_CHECKBOX_SELECTOR =
      '#acceptTermsAndConditionsCheckBox'

    let SAVE_CHECKBOX_SELECTOR = '#savePaymentCardCheckBox'

    let HAZARDOUS_MATERIALS_AGREEMENT_MESSAGE_SELECTOR =
      '.hazardousMaterialsAgreement .textBlock'
    let HAZARDOUS_MATERIALS_AGREEMENT_LABEL_SELECTOR =
      '.hazardousMaterialsAgreement label[for="acceptHazardousMaterialsCheckBox"]'
    let HAZARDOUS_MATERIALS_CHECKBOX_SELECTOR =
      '#acceptHazardousMaterialsCheckBox'

    let PAYMENT_CREDITCARD_POS_ELECTOR =
      'input[type="checkbox"][name="formOfPayment(CREDITCARD_POS).selected"]'
    let PAYMENT_BANKTRANSFERS_ELECTOR =
      'input[type="checkbox"][name="formOfPayment(BANKTRANSFERS).selected"]'

    let SELECTOR_CREDIT_CARDS_SAVED = '#paymentMethod'

    let SELECTOR_SAVED_CREDIT_CARD_LABEL = '#idSavedCardsLabel'

    let SELECTOR_EDIT_CARD_OPTIONS = '#paymentCardRow .creditCardMaintenanceLinks a'

    let SELECTOR_IF_USER_IS_LOGIN = '#login strong'

    let agreements = {
      TERMS_CONDITIONS: '[name=acceptTermsAndConditions]',
      HAZARDOUS_MATERIALS: '[name=acceptHazardousMaterials]',
      CREDIT_CARD: '[name=savePaymentCard]',
    }
    /**
     * @param {String} agreeType field that you need value, the value of this
     *    param is key in object agreeTypes
     * @return {String}
     */
    hostScrapService.getAgreementsValueByInput = function(agreeType) {
      if (!agreements.hasOwnProperty(agreeType)) {
        return null
      }
      let $elem = $(agreements[agreeType])
      console.log(agreements[agreeType])
      console.log($elem.val())
      return $elem.val()
    }

    hostScrapService.isCreditCardsSaved = function() {
      return $(SELECTOR_CREDIT_CARDS_SAVED).length
    }
    hostScrapService.ifExistEditOption = function() {
      return $(SELECTOR_EDIT_CARD_OPTIONS).length
    }

    hostScrapService.acceptHazardousMaterials = function() {
      // updateHazardousMaterials();
      $(HAZARDOUS_MATERIALS_CHECKBOX_SELECTOR).click()
    }

    hostScrapService.ifUserIsLogged = function() {
      // updateHazardousMaterials();
      return $(SELECTOR_IF_USER_IS_LOGIN).length
    }

    hostScrapService.acceptTermsAndConditions = function() {
      // updateTermsAndConditions();
      $(TB_TERMS_CONDITIONS_CHECKBOX_SELECTOR).click()
    }

    hostScrapService.checkedSaveCreditCard = function() {
      $(SAVE_CHECKBOX_SELECTOR).click()
    }


    // $('input[type=text][name="formOfPayment(CREDITCARD_POS).documentNumber"]').closest('#rowDocumentNumber').is(':visible')
    let SELECTOR_ROW_DOCUMENT_NUMBER = '#rowDocumentNumber'
    let SELECTOR_ROW_INSTALLMENTS = '#rowInstallments'
    let SELECTOR_ROW_DOCUMENT_ID = '#documentIdRow'

    // ----------------------------------------------------------
    let creditCardSelectors = {
      SAVED_CARD_SELECT: 'select[name="paymentMethod"]',
      CARD_TYPE: 'select[name="formOfPayment(CREDITCARD_POS).type"]',
      CARD_ISSUING_COUNTRY_SELECT: 'select[name="formOfPayment(CREDITCARD_POS).issuingCountrySelect"]',
      CARD_CURRENCY_SELECT: 'select[name="formOfPayment(CREDITCARD_POS).currencySelect"]',
      CARDHOLDER_NAME: 'input[type=text][name="formOfPayment(CREDITCARD_POS).cardHolderName"]',
      CARD_NUMBER: 'input[type=text][name="ccn"]',
      CARD_NUMBER_INPUT: 'input[name="formOfPayment(CREDITCARD_POS).number"]',
      ED_EXPIRATION_MONTH: 'select[name="formOfPayment(CREDITCARD_POS).expirationMonth"]',
      ED_EXPIRATION_YEAR: 'select[name="formOfPayment(CREDITCARD_POS).expirationYear"]',
      SECURITY_CODE: 'input[type=text][name="cvv"]',
      SECURITY_CODE_INPUT: 'input[name="formOfPayment(CREDITCARD_POS).securityCode"]',
      CARDHOLDER_PHONE_CC:
      'input[type=text][name="formOfPayment(CREDITCARD_POS).cardHolderPhone.phoneNumberCountryCode"]',
      CARDHOLDER_PHONE_NUMBER: 'input[type=text][name="formOfPayment(CREDITCARD_POS).cardHolderPhone.phoneNumber"]',
      CARDHOLDER_EMAIL: 'input[type=text][name="formOfPayment(CREDITCARD_POS).cardHolderEmail"]',
      BA_ADDRESS_LINE_1: 'input[type=text][name="formOfPayment(CREDITCARD_POS).billingAddress.addressLine1"]',
      BA_ADDRESS_LINE_2: 'input[type=text][name="formOfPayment(CREDITCARD_POS).billingAddress.addressLine2"]',
      BA_CITY: 'input[type=text][name="formOfPayment(CREDITCARD_POS).billingAddress.city"]',
      BA_COUNTRY: 'select[name="formOfPayment(CREDITCARD_POS).billingAddress.country"]',
      BA_STATE_DISPLAY: 'select[name="formOfPayment(CREDITCARD_POS).billingAddress.stateDisplay"]',
      BA_POSTAL_CODE: 'input[type=text][name="formOfPayment(CREDITCARD_POS).billingAddress.postalCode"]',
      INSTALLMENTS: 'select[name="formOfPayment(CREDITCARD_POS).installmentsSelect"]',
      DOCUMENT_NUMBER: 'input[type=text][name="formOfPayment(CREDITCARD_POS).documentNumber"]',
      DOCUMENT_ID: 'input[type=text][name="formOfPayment(CREDITCARD_POS).documentId"]',
    }

    let hiddenInputs = {
      BA_STATE_DISPLAY: 'formOfPayment(CREDITCARD_POS).billingAddress.state',
      CARD_NUMBER: 'formOfPayment(CREDITCARD_POS).number',
      SECURITY_CODE: 'formOfPayment(CREDITCARD_POS).securityCode',
      CARD_ISSUING_COUNTRY_SELECT: 'formOfPayment(CREDITCARD_POS).issuingCountry',
      CARD_CURRENCY_SELECT: 'formOfPayment(CREDITCARD_POS).currency',
    }

    // ----------------------------------------------------------
    let banktransferSelectors = {
      BA_ADDRESS_1: 'input[type=text][name="commonAddress.addressLine1"]',
      BA_ADDRESS_2: 'input[type=text][name="commonAddress.addressLine2"]',
      BA_CITY: 'input[type=text][name="commonAddress.city"]',
      BA_COUNTRY: 'select[name="commonAddress.country"]',
      BA_STATE: 'select[name="commonAddress.stateDisplay"]',
      BA_POSTAL_CODE: 'input[type=text][name="commonAddress.postalCode"]',
    }

    let PAYMENT_CARD_LABEL = '#savePaymentCardLabel'

    // -----------------------------
    /**
     * Return the text value of the Disclaimer
     * @return {string}
     */
    hostScrapService.getReviewItineraryDisclaimer = function() {
      let $bs = $(REVIEW_ITINERARY_DISCLAIMER_SELECTOR)
      return $bs.html()
    }

    /**
     * Return the text value of the Billing Info
     * @return {string}
     */
    hostScrapService.getfbBillingInfoMessage = function() {
      let $bs = $(FB_BILLING_INFO_MESSAGE_SELECTOR)
      let html = $bs.html()
      html = replaceAll(html, '<br>', '<br><br>')
      return html
    }

    /**
     * Return the text value of the TermsConditions
     * @return {string}
     */
    hostScrapService.getTbTermsConditionsMessage = function() {
      let $bs = $(TB_TERMS_CONDITIONS_MESSAGE_SELECTOR)
      let $links = $(TB_TERMS_CONDITIONS_LINKS_SELECTOR)
      return $bs.html() + '<p class="inline-links-container">' + $links.html() + '</p>'
    }

    /**
     * Return the text value of the TermsConditions
     * @return {string}
     */
    hostScrapService.getTbTermsConditionsLabel = function() {
      let $bs = $(TB_TERMS_CONDITIONS_LABEL_SELECTOR)
      return $bs.html()
    }

    /**
     * Return the text value of the TermsConditions
     * @return {string}
     */
    hostScrapService.getHazardousMaterialsAgreementMessage = function() {
      let $bs = $(HAZARDOUS_MATERIALS_AGREEMENT_MESSAGE_SELECTOR)
      return $bs.html()
    }

    /**
     * Return the text value of the TermsConditions
     * @return {string}
     */
    hostScrapService.getHazardousMaterialsAgreementLabel = function() {
      let $bs = $(HAZARDOUS_MATERIALS_AGREEMENT_LABEL_SELECTOR)
      return $bs.html()
    }

    /**
     * Return true if payment credit card pos is active
     * @return {boolean}
     */
    hostScrapService.isPaymentCreditCardPosChecked = function() {
      let $elem = $(PAYMENT_CREDITCARD_POS_ELECTOR)
      return $elem.is(':checked')
    }

    hostScrapService.getSaveCreditCardLabel = function() {
      let $elem = $(PAYMENT_CARD_LABEL)
      return $elem.html()
    }

    /**
     * Return true if payment credit card pos is active
     * @return {boolean}
     */
    hostScrapService.isPaymentBankTransferChecked = function() {
      let $elem = $(PAYMENT_BANKTRANSFERS_ELECTOR)
      return $elem.is(':checked')
    }

    /**
     * Toggle credit card activation
     */
    hostScrapService.togglePaymentCreditCardPos = function() {
      let $elem = $(PAYMENT_CREDITCARD_POS_ELECTOR)
      if (!$elem.is(':checked')) {
        $elem.prop('checked', 'checked')
        multiplePaymentView.onClickCheckBox($elem, 'CREDITCARD', 'CREDITCARD_POS')
      }
    }

    /**
     * Toggle bank transfer activation
     */
    hostScrapService.togglePaymentBankTransfer = function() {
      let $elem = $(PAYMENT_BANKTRANSFERS_ELECTOR)
      if (!$elem.is(':checked')) {
        $elem.prop('checked', 'checked')
      } else {
        $elem.prop('checked', false)
      }
      multiplePaymentView.onClickCheckBox(this, 'BANKTRANSFERS', 'BANKTRANSFERS')
    }
    /**
     * @param {String} string
     * @param {String} search
     * @param {String} replacement
     * @return {String}
     */
    function replaceAll(string, search, replacement) {
      let target = string
      return target.replace(new RegExp(search, 'g'), replacement)
    }

    // ------------------------ CREDITCARD -----------------
    let ccInputTypes = {
      SAVED_CARD_SELECT: 'SAVED_CARD_SELECT',
      CARD_TYPE: 'CARD_TYPE',
      CARD_ISSUING_COUNTRY_SELECT: 'CARD_ISSUING_COUNTRY_SELECT',
      CARD_CURRENCY_SELECT: 'CARD_CURRENCY_SELECT',
      CARDHOLDER_NAME: 'CARDHOLDER_NAME',
      CARD_NUMBER: 'CARD_NUMBER',
      CARD_NUMBER_INPUT: 'CARD_NUMBER_INPUT',
      ED_EXPIRATION_MONTH: 'ED_EXPIRATION_MONTH',
      ED_EXPIRATION_YEAR: 'ED_EXPIRATION_YEAR',
      SECURITY_CODE: 'SECURITY_CODE',
      SECURITY_CODE_INPUT: 'SECURITY_CODE_INPUT',
      CARDHOLDER_PHONE_CC: 'CARDHOLDER_PHONE_CC',
      CARDHOLDER_PHONE_NUMBER: 'CARDHOLDER_PHONE_NUMBER',
      CARDHOLDER_EMAIL: 'CARDHOLDER_EMAIL',
      BA_ADDRESS_LINE_1: 'BA_ADDRESS_LINE_1',
      BA_ADDRESS_LINE_2: 'BA_ADDRESS_LINE_2',
      BA_CITY: 'BA_CITY',
      BA_COUNTRY: 'BA_COUNTRY',
      BA_STATE_DISPLAY: 'BA_STATE_DISPLAY',
      BA_POSTAL_CODE: 'BA_POSTAL_CODE',
      INSTALLMENTS: 'INSTALLMENTS',
      DOCUMENT_NUMBER: 'DOCUMENT_NUMBER',
      DOCUMENT_ID: 'DOCUMENT_ID',
    }

    /**
     * @return {Object} this object contain the selectors index for looking
     *    fields
     */
    hostScrapService.getCreditCardInputsSelectorsType = function() {
      return ccInputTypes
    }

    hostScrapService.getCreditCardLabel = function() {
      return $(SELECTOR_SAVED_CREDIT_CARD_LABEL).text().trim()
    }

    /**
     * @param {String} ccInputType field that you need value, the value of this
     *    param is key in object ccInputTypes
     * @return {String}
     */
    hostScrapService.getCreditCardValueByInput = function(ccInputType) {
      if (!creditCardSelectors.hasOwnProperty(ccInputType)) {
        return null
      }
      let $elem = $(creditCardSelectors[ccInputType])
      return $elem.val()
    }

    /**
     * @param {String} ccInputType field that you need value, the value of this
     *    param is key in object ccInputTypes
     * @param {String} value to set the Input
     */
    hostScrapService.setCreditCardValueByInput = function(ccInputType, value) {
      if (!creditCardSelectors.hasOwnProperty(ccInputType)) {
        return
      }
      let $elem = $(creditCardSelectors[ccInputType])
      $elem.val(value)
      $elem.change()
    }

    /**
     * @param {String} ccInputType field that you need value, the value of this
     *    param is key in object ccInputTypes
     * @return {Array}
     */
    hostScrapService.getCreditCardSelectOptionsByInput = function(ccInputType) {
      let options = []
      if (!creditCardSelectors.hasOwnProperty(ccInputType) &&
        ccInputType.startsWith('select[')) {
        return options
      }


      let $elems = $(creditCardSelectors[ccInputType] + ' option')


      let s = false
      $elems.each(function(index, el) {
        if ($(el).is(':selected') === true) {
          s = true
          console.log($(el).text())
        } else {
          s = false
        }
        let optionItem = {name: $(el).text(), value: $(el).attr('value'), selected: s}
        options.push(optionItem)
      })

      // options.sort(function (x, y) {
      //   return (x.selected === y.selected) ? 0 : x.selected ? -1 : 1;
      // });

      return options
    }

    hostScrapService.getCreditCardSelectedOptionValue = function(ccInputType) {
      console.log(creditCardSelectors[ccInputType])
      let value = $(creditCardSelectors[ccInputType] + ' ' + ' option:selected').text().trim()
      return value
    }
    /**
     * @param {String} selectorValue
     * @return {Object[]}
     */
    function extractNameValueFromSelector(selectorValue) {
      let strNamePattern = '[name="'
      let closeNamePatter = '"]'
      let namePos = selectorValue.indexOf(strNamePattern)
      let closeNamePos = selectorValue.lastIndexOf(closeNamePatter)

      if ((namePos === -1 || closeNamePos === -1) && namePos < closeNamePos) {
        return ''
      }
      namePos += strNamePattern.length
      return selectorValue.slice(namePos, closeNamePos)
    }

    /**
     * @param {String} fieldAttr
     * @return {String} Return types by fieldAttr
     */
    hostScrapService.getTypeByFieldAttrName = function(fieldAttr) {
      let key = ''
      let ccsValue = ''
      // eslint-disable-next-line
      for (let it in creditCardSelectors) {
        ccsValue = extractNameValueFromSelector(creditCardSelectors[it])
        if (ccsValue === fieldAttr) {
          key = it
          break
        }
      }

      if (key === '') {
        // eslint-disable-next-line
        for (let iH in hiddenInputs) {
          ccsValue = hiddenInputs[iH]
          if (ccsValue === fieldAttr) {
            key = iH
            break
          }
        }
      }

      if (key === '') {
        // eslint-disable-next-line
        for (let itA in agreements) {
          ccsValue = agreements[itA]
          if (ccsValue.indexOf(fieldAttr) !== -1) {
            key = itA
            break
          }
        }
      }

      return key
    }

    /**
     * @return {Boolean} True if the rowDocumentNumber is visible
     */
    hostScrapService.isVisibleRootDoument = function() {
      let isVisible = false
      // isVisible = $(SELECTOR_ROW_DOCUMENT_NUMBER).is(':visible');
      if ($(SELECTOR_ROW_DOCUMENT_NUMBER).length > 0 && $(SELECTOR_ROW_DOCUMENT_NUMBER).css('display') !== 'none') {
        isVisible = true
      }
      return isVisible
    }

    /**
     * @return {Boolean} True if the rowDocumentNumber is visible
     */
    hostScrapService.isVisibleRootDocumentId = function() {
      let isVisible = false
      // isVisible = $(SELECTOR_ROW_DOCUMENT_ID).is(':visible');
      if ($(SELECTOR_ROW_DOCUMENT_ID).length > 0 && $(SELECTOR_ROW_DOCUMENT_ID).css('display') !== 'none') {
        isVisible = true
      }
      return isVisible
    }

    /**
     * @return {Boolean} True if the rowInstallments is visible
     */
    hostScrapService.isVisibleRootInstallments = function() {
      let isVisible = false
      // isVisible = $(SELECTOR_ROW_INSTALLMENTS).is(':visible');
      if ($(SELECTOR_ROW_INSTALLMENTS).length > 0 && $(SELECTOR_ROW_INSTALLMENTS).css('display') !== 'none') {
        isVisible = true
      }
      return isVisible
    }

    /**
     * Check if copa site wite the error tag above the input
     *
     * @param {String} inputType input with error
     * @param {String} message message sended by the backend
     * @return {String | null}
     */
    hostScrapService.checkCopaError = function(inputType, message) {
      let $errorElemn = $('[name="' + inputType + '"]').closest('tr').prev()
      let msg = message
      if ($errorElemn.length > 0 && $errorElemn.is('.errorNoticeOuter')) {
        msg = $errorElemn.find('.errorNotice span').text().trim()
      }
      return msg
    }

    // ------------------------ BANKTRANSFERS -----------------
    let btInputTypes = {
      BA_ADDRESS_1: 'BA_ADDRESS_1',
      BA_ADDRESS_2: 'BA_ADDRESS_2',
      BA_CITY: 'BA_CITY',
      BA_COUNTRY: 'BA_COUNTRY',
      BA_STATE: 'BA_STATE',
      BA_POSTAL_CODE: 'BA_POSTAL_CODE',
    }

    /**
     * @return {Object} this object contain the selectors index for looking
     *    fields
     */
    hostScrapService.getBankTransferInputsSelectorsType = function() {
      return btInputTypes
    }

    /**
     * @param {String} btInputType field that you need value, the value of this
     *    param is key in object btInputTypes
     * @return {String}
     */
    hostScrapService.getBankTransferValueByInput = function(btInputType) {
      if (!banktransferSelectors.hasOwnProperty(btInputType)) {
        return null
      }
      let $elem = $(banktransferSelectors[btInputType])
      return $elem.val()
    }

    /**
     * @param {String} btInputType field that you need value, the value of this
     *    param is key in object btInputTypes
     * @param {String} value to set the Input
     */
    hostScrapService.setBankTransferValueByInput = function(btInputType, value) {
      if (!banktransferSelectors.hasOwnProperty(btInputType)) {
        return
      }
      let $elem = $(banktransferSelectors[btInputType])
      $elem.val(value)
      $elem.change()
    }

    /**
     * @param {String} btInputType field that you need value, the value of this
     *    param is key in object btInputTypes
     * @return {Array}
     */
    hostScrapService.getBankTransferSelectOptionsByInput = function(btInputType) {
      let options = []
      if (!banktransferSelectors.hasOwnProperty(btInputType) &&
        btInputType.startsWith('select[')) {
        return options
      }

      let $elems = $(banktransferSelectors[btInputType] + ' option')
      $elems.each(function(index, el) {
        options.push({
          name: $(el).text(),
          value: $(el).attr('value'),
        })
      })
      return options
    }

    // ------------------------ PASSENGER INFO -----------------
    let SELECTOR_PASSENGERS_INFO = '.travelerDetailsBody table tbody tr'
    let SELECTOR_PASSENGERS_INFO_NAME = 'td:nth-child(1) div'
    let SELECTOR_PASSENGERS_INFO_TYPE = 'td:nth-child(2) div'
    let SELECTOR_PASSENGERS_INFO_BIRTHDATE = 'td:nth-child(3) div'
    let SELECTOR_PASSENGERS_INFO_FREQUENT_FLYER_NUMBER = 'td:nth-child(4) div'

    hostScrapService.getPassengersInfo = function() {
      let passengersInfo = []
      let passengerInfoNodes = $(SELECTOR_PASSENGERS_INFO)
      $(passengerInfoNodes).each(function(index, value) {
        let name = $(this).find(SELECTOR_PASSENGERS_INFO_NAME).text().trim()
        let type = $(this).find(SELECTOR_PASSENGERS_INFO_TYPE).text().trim()
        let birthdate = $(this).find(SELECTOR_PASSENGERS_INFO_BIRTHDATE).text().trim()
        let frequentFlyerNumber = $(this).find(SELECTOR_PASSENGERS_INFO_FREQUENT_FLYER_NUMBER).text().trim()

        passengersInfo.push(
          {
            name: name,
            type: type,
            birthdate: birthdate,
            frequent_flyer_number: frequentFlyerNumber,
          }
        )
      })
      return passengersInfo
    }

    // ----------------------- Card images --------------------
    let SELECTOR_CREDIT_CARDS_IMAGES = '.creditCardsArea'

    hostScrapService.getCardImages = function() {
      let $node = $(SELECTOR_CREDIT_CARDS_IMAGES)
      if ($node.length < 1) {
        $node = $($('.multiplePaymentItemHeader .colDescr div')[0])
        if ($node) {
          return $node.html()
        }
      } else {
        return $node.html()
      }
    }


    return hostScrapService
  }

  angular
    .module('responsiveBookingEngine')
    .factory('hostScrapService', hostScrapService)
})()
