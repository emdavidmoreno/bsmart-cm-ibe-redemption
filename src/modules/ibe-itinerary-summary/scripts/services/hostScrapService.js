(function () {
  'use strict';

  function hostScrapService() {
    var hostScrapService = {};
    var SELECTOR_INFO_BLOCK = '.mediaInfoBlock';
    var SELECTOR_INFO_HEAD_BLOCK = '.headBlock span';
    var SELECTOR_INFO_BODY_BLOCK = '.bodyBlock .bodyText';
    var SELECTOR_PROCCED_TO_PAY = '#radiogr1-row1';
    var SELECTOR_PROCCED_TO_PAY_HEAD = '.c2 label';
    var SELECTOR_PROCCED_TO_PAY_DESC = '.optionText label[for="radiogr1-f1-row1"]';
    var SELECTOR_RESERVE_AND_HOLD = '#radiogr1-row2';
    var SELECTOR_RESERVE_AND_HOLD_HEAD = '.c2 label';
    var SELECTOR_RESERVE_AND_HOLD_DESC = '.optionText label[for="radiogr1-f1-row2"]';
    var SELECTOR_INSURANCE_ICON = '.blockInsuranceCrossSell .colIcon div';

    function isLocalStorageNameSupported() {
      var testKey = 'test', storage = window.localStorage;
      try {
        storage.setItem(testKey, '1');
        storage.removeItem(testKey);
        return true;
      } catch (error) {
        return false;
      }
    };

    /**
     * @return {Object[]}
     *         {String} object.head
     *         {String} object.body
     */
    hostScrapService.getMessages = function () {
      var $infoBlocks = $('.disclaimerList li');
      var messages = [];

      $infoBlocks.each(function (index, el) {
        var $el = $(el);
        var message = {
          head: $(SELECTOR_INFO_HEAD_BLOCK).text(),
          body: $el.text().trim()
        };
        messages.push(message);
      });

      return messages;
    };

    hostScrapService.showPaymentProcced = function () {
      var selector = SELECTOR_PROCCED_TO_PAY + ',' + SELECTOR_RESERVE_AND_HOLD;
      return $(selector).length > 0;
    };


    hostScrapService.getPaymentVisibility = function () {
      var visibility = $('#PROCEED_OPTIONS').css('display');
      if (visibility == 'block')
        return true;
      return false;
    };

    // PAYMENTS
    hostScrapService.isPaymentProccedToPaySelected = function () {
      return $(SELECTOR_PROCCED_TO_PAY + ' input[type=radio]').is(':checked');
    };

    hostScrapService.selectPaymentProceedToPay = function () {

      var $el = $(SELECTOR_PROCCED_TO_PAY + ' input[type=radio]');
      $el.prop('checked', 'checked');
      // global function to select Book
      // jshint -W117
      setSelectedValue('BOOK');
      if (isLocalStorageNameSupported())
        sessionStorage.setItem('reserveoptionchecked', false);


    };

    hostScrapService.selectPaymentReserveAndHoldOption = function () {

      var $el = $(SELECTOR_RESERVE_AND_HOLD + ' input[type=radio]');
      $el.prop('checked', 'checked');

      // global function to select reserve and hold
      // jshint -W117
      setSelectedValue('RESERVE_AND_HOLD');
      if (isLocalStorageNameSupported())
        sessionStorage.setItem('reserveoptionchecked', true);
    };

    /**
     * Extract payment procced info for host
     *
     * @return {Object}
     *    {Object} Object.toPay {head: string, desc: string}
     *    {Object} Object.reserveAndHold {head: string, desc: string}
     */
    hostScrapService.getPaymentProceedInfo = function () {
      return {
        toPay: {
          head: $(SELECTOR_PROCCED_TO_PAY + ' ' + SELECTOR_PROCCED_TO_PAY_HEAD).text().trim(),
          desc: $(SELECTOR_PROCCED_TO_PAY + ' ' + SELECTOR_PROCCED_TO_PAY_DESC).html()
        },
        reserveAndHold: {
          head: $(SELECTOR_RESERVE_AND_HOLD + ' ' + SELECTOR_RESERVE_AND_HOLD_HEAD).text().trim(),
          desc: $(SELECTOR_RESERVE_AND_HOLD + ' ' + SELECTOR_RESERVE_AND_HOLD_DESC).html()
        }
      };
    };

    /**
     * @return {Boolean}
     */
    hostScrapService.isInsuranceVisisble = function () {
      return $('.insuranceCrossSell').length > 0;
    }

    /**
     * Insurance Icon
     * @return {HTML}
     */
    hostScrapService.insuranceIcon = function () {
      return $(SELECTOR_INSURANCE_ICON).html()
    }

    /**
     * Wait for the insurance box an execute the callback
     */
    hostScrapService.waitForInsuranceBox = function (cb) {
      var timer = window.setInterval(function () {
        if (hostScrapService.isInsuranceVisisble()) {
          window.clearInterval(timer);
          cb();
        }
      }, 800);
    }

    /**
     * @return {Object}
     *         {String} Object.head
     *         {Object} Object.textAccept
     *         {String} Object.textAccept.text
     *         {String} Object.textAccept.link
     *         {String} Object.textAccept.linkText
     *         {String} Object.linkText
     */
    hostScrapService.getTravelInsuranceDisplay = function () {
      var SELECTOR_HEADER = '.blockInsuranceCrossSell .componentHeader h2';
      var $elementHeader = $(SELECTOR_HEADER);

      if ($elementHeader.length === 0) {
        return {};
      }

      var SELECTOR_LABEL_LAST_OPTION = '.blockInsuranceCrossSell .componentBody .label:last label';
      var SELECTOR_LABEL_FIRST_OPTION = '.blockInsuranceCrossSell .componentBody .label:first label';
      var $option = $(SELECTOR_LABEL_FIRST_OPTION);

      var accept = {
        text: $option.text().split('\n')[0],
        link: $option.find('a').attr('href'),
        linkText: $option.find('a').text().trim()
          .replace($option.find('a span.wcag-offscreen').text(), '').trim()
      };

      return {
        head: $(SELECTOR_HEADER).text().trim(),
        textAccept: accept,
        textNoAccept: $(SELECTOR_LABEL_LAST_OPTION).text().trim()
      };
    };

    hostScrapService.getTravelInsuranceAccept = function () {
      var SELECTOR = '#insurancePurchase00';
      return $(SELECTOR).prop('checked');
    };

    hostScrapService.setTravelInsuranceAccept = function () {
      var SELECTOR = '#insurancePurchase00';
      $(SELECTOR).prop('checked', 'checked');
      $(SELECTOR).click();
    };

    hostScrapService.getTravelInsuranceNotAccept = function () {
      var SELECTOR = '#insurancePurchase00';
      return $(SELECTOR).prop('checked');
    };

    hostScrapService.setTravelInsuranceNotAccept = function () {
      var SELECTOR = '#insurancePurchaseNo';
      $(SELECTOR).prop('checked', 'checked');
      $(SELECTOR).click();
    };

    return hostScrapService;
  }
  angular
    .module('responsiveBookingEngine')
    .factory('hostScrapService', hostScrapService);
})();
