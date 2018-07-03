/* eslint-disable max-len,no-invalid-this */
(function() {
  'use strict'
  /**
   * hostScrapService
   *
   * @return {Object}
   */
  function hostScrapService() {
    let hostScrapService = {}
    let SELECTOR_CONFIRMATION_LABEL = '.colNumText div'
    let SELECTOR_CONFIRMATION_MESSAGE = '#reserved_and_held'
    let SELECTOR_CONFIRMATION_NUMBER = '.colConfirmNum div'
    let SELECTOR_PASSENGERS_INFO = '.passengerInfoBlock .bodyBlock tr.rowFirst'
    let SELECTOR_PASSENGERS_INFO_NAME = 'td.colName div'

    let SELECTOR_INFO_BLOCK = '.mediaInfoBlock'
    let SELECTOR_INFO_HEAD_BLOCK = '.headBlock span'
    let SELECTOR_INFO_BODY_BLOCK = '.bodyBlock .bodyText'
    let SELECTOR_CONTACT_INFO = '#fbConfirmationEmail .textBlock p'
    let SELECTOR_CONTACT_ITINERARY_COPY_LABEL = '#fbConfirmationEmail .formBlock .formDescArea .formDescElement'
    let SELECTOR_CONTACT_ITINERARY_COPY_VALUE = '#fbConfirmationEmail .formBlock #emailAddressId'
    let SELECTOR_CONTINUE_BUTTON_HREF = '#pgButtonNewSearch'


    /**
     * @return {Object[]}
     *         {String} object.head
     *         {String} object.body
     */
    hostScrapService.getMessages = function() {
      let $infoBlocks = $('.disclaimerList li').length? $('.disclaimerList li') : $(SELECTOR_INFO_BLOCK);
      let messages = []

      $infoBlocks.each(function(index, el) {
        let $el = $(el)
        let message = {
          head: $(SELECTOR_INFO_HEAD_BLOCK).text(),
          body: $el.text().trim()
        }
        messages.push(message)
      })

      return messages
    }

    hostScrapService.getConfirmationLabel = function() {
      return $(SELECTOR_CONFIRMATION_LABEL).text().trim()
    }

    hostScrapService.getConfirmationMessage = function() {
      return $(SELECTOR_CONFIRMATION_MESSAGE).text().trim()
    }

    hostScrapService.getConfirmationNumber = function() {
      return $(SELECTOR_CONFIRMATION_NUMBER).text().trim()
    }

    hostScrapService.getPassengersInfo = function() {
      let passengersInfo = []
      let passengerInfoNodes = $(SELECTOR_PASSENGERS_INFO)
      $(passengerInfoNodes).each(function(index, value) {
        let name = $(this).find(SELECTOR_PASSENGERS_INFO_NAME).text().trim()
        passengersInfo.push(
          {
            name: name,
          }
        )
      })
      return passengersInfo
    }

    hostScrapService.getContinueButtonHref = function() {
      return $(SELECTOR_CONTINUE_BUTTON_HREF).attr('href')
    }

    hostScrapService.getContactInfo = function() {
      let text = $(SELECTOR_CONTACT_INFO).text().trim()
      let email = $(SELECTOR_CONTACT_INFO).find('b').text().trim()
      let itineraryCopyLabel = $(SELECTOR_CONTACT_ITINERARY_COPY_LABEL).text().trim()
      let itineraryCopyEmail = $(SELECTOR_CONTACT_ITINERARY_COPY_VALUE).text().trim()

      text = text.replace(email, '')
      let contactInfo = {
        text: text,
        email: email,
        itinerary_copy_label: itineraryCopyLabel,
        itinerary_copy_email: itineraryCopyEmail,
      }
      return contactInfo
    }

    hostScrapService.setItineraryCopyEmail = function(value) {
      $(SELECTOR_CONTACT_ITINERARY_COPY_VALUE).val(value)
      $(SELECTOR_CONTACT_ITINERARY_COPY_VALUE).change()
    }

    hostScrapService.getCardChargedMessage = function() {
      let message
      let SELECTOR_CARD_CHARGED_MESSAGE = '.generalTotalPrice .colLabel'
      if($(SELECTOR_CARD_CHARGED_MESSAGE).length > 0 ) {
        if($(SELECTOR_CARD_CHARGED_MESSAGE).text().trim().length > 8) {
          message = $(SELECTOR_CARD_CHARGED_MESSAGE).text().trim()
        }
      }
      return message
    }

    hostScrapService.getCardChargedAmount = function() {
      let message
      let SELECTOR_CARD_CHARGED_AMOUNT = '.generalTotalPrice .money'
      if($(SELECTOR_CARD_CHARGED_AMOUNT).length > 0) {
        message = $(SELECTOR_CARD_CHARGED_AMOUNT).text().trim()
      }
      return message
    }

    hostScrapService.getThanksMessage = function() {
      let message
      let SELECTOR_THANKS_MESSAGE = '.tripStatusArea p'
      if($(SELECTOR_THANKS_MESSAGE).length > 0) {
        message = $(SELECTOR_THANKS_MESSAGE).text().trim()
      }
      return message
    }

    hostScrapService.getErrorFlyingFocusTarget = function() {
      const SELECTOR_BASE = '.errorBlockType2.flying-focus_target'
      const SELECTOR = `${SELECTOR_BASE} .errorBody .errorText`
      const SELECTOR_TITLE = `${SELECTOR_BASE} .errorHeader`
      return {
        isAvalable: $(SELECTOR_BASE).length > 0,
        title: $(SELECTOR_TITLE).text().trim(),
        message: $(SELECTOR).html(),
      }
    }
    return hostScrapService
  }

  angular
      .module('responsiveBookingEngine')
      .factory('hostScrapService', hostScrapService)
})()
