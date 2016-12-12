(function() {
  'use strict';

  function hostScrapService(){
    var hostScrapService = {};
    var SELECTOR_CONFIRMATION_LABEL = '.colNumText div';
    var SELECTOR_CONFIRMATION_MESSAGE = '#reserved_and_held';
    var SELECTOR_CONFIRMATION_NUMBER = '.colConfirmNum div';
	var SELECTOR_PASSENGERS_INFO = '.passengerInfoBlock .bodyBlock tr.rowFirst';
	var SELECTOR_PASSENGERS_INFO_NAME = 'td.colName div';

    var SELECTOR_INFO_BLOCK = '.mediaInfoBlock';
    var SELECTOR_INFO_HEAD_BLOCK = '.headBlock span';
    var SELECTOR_INFO_BODY_BLOCK = '.bodyBlock .bodyText';
    var SELECTOR_PROCCED_TO_PAY = '#radiogr1-row1';
    var SELECTOR_RESERVE_AND_HOLD = '#radiogr1-row2';
    var SELECTOR_CONTACT_INFO = '#fbConfirmationEmail .textBlock p';
    var SELECTOR_CONTACT_ITINERARY_COPY_LABEL = '#fbConfirmationEmail .formBlock .formDescArea .formDescElement';
    var SELECTOR_CONTACT_ITINERARY_COPY_VALUE = '#fbConfirmationEmail .formBlock #emailAddressId';
    var SELECTOR_CONTINUE_BUTTON_HREF = '#pgButtonNewSearch';


    /**
     * @return {Object[]}
     *         {String} object.head
     *         {String} object.body
     */
    hostScrapService.getMessages = function () {
      var $infoBlocks = $(SELECTOR_INFO_BLOCK);
      var messages = [];

      $infoBlocks.each(function(index, el) {
        var $el = $(el);
        var message = {
          head: $el.find(SELECTOR_INFO_HEAD_BLOCK).text(),
          body: $el.find(SELECTOR_INFO_BODY_BLOCK).text().trim()
        };
        messages.push(message);
      });

      return messages;
    };

	hostScrapService.getConfirmationLabel = function(){
		return $(SELECTOR_CONFIRMATION_LABEL).text().trim();
	};

	hostScrapService.getConfirmationMessage = function(){
		return $(SELECTOR_CONFIRMATION_MESSAGE).text().trim();
	};

    hostScrapService.getConfirmationNumber = function(){
		return $(SELECTOR_CONFIRMATION_NUMBER).text().trim();
    };

    hostScrapService.getPassengersInfo = function(){
    	var passengers_info = [];
    	var passengerInfoNodes = $(SELECTOR_PASSENGERS_INFO);
    	$(passengerInfoNodes).each(function(index, value){
    		var name = $(this).find(SELECTOR_PASSENGERS_INFO_NAME).text().trim();
    		passengers_info.push(
    			{
    				name: name
    			}
    		);
    	});
    	return passengers_info;
    };

    hostScrapService.getContinueButtonHref = function(){
		return $(SELECTOR_CONTINUE_BUTTON_HREF).attr('href');
    };

    hostScrapService.getContactInfo = function(){
    	var text = $(SELECTOR_CONTACT_INFO).text().trim();
    	var email = $(SELECTOR_CONTACT_INFO).find('b').text().trim();
    	var itinerary_copy_label = $(SELECTOR_CONTACT_ITINERARY_COPY_LABEL).text().trim();
    	var itinerary_copy_email = $(SELECTOR_CONTACT_ITINERARY_COPY_VALUE).text().trim();

    	text = text.replace(email, '');
    	var contact_info = {
    		text: text,
    		email: email,
    		itinerary_copy_label: itinerary_copy_label,
			itinerary_copy_email: itinerary_copy_email
    	}
		return contact_info;
    };

    hostScrapService.setItineraryCopyEmail = function(value){
      $(SELECTOR_CONTACT_ITINERARY_COPY_VALUE).val(value);
      $(SELECTOR_CONTACT_ITINERARY_COPY_VALUE).change();
    }

    hostScrapService.getCardChargedMessage = function(){
      var message;
      var SELECTOR_CARD_CHARGED_MESSAGE = '.generalTotalPrice .colLabel';
      if($(SELECTOR_CARD_CHARGED_MESSAGE).length > 0 ){
        if($(SELECTOR_CARD_CHARGED_MESSAGE).text().trim().length > 8){
          message  = $(SELECTOR_CARD_CHARGED_MESSAGE).text().trim();
        }
      }
      return message;
    }

    hostScrapService.getCardChargedAmount = function(){
      var message;
      var SELECTOR_CARD_CHARGED_AMOUNT = '.generalTotalPrice .money';
      if($(SELECTOR_CARD_CHARGED_AMOUNT).length > 0){
        message  = $(SELECTOR_CARD_CHARGED_AMOUNT).text().trim();
      }
      return message;
    }

    hostScrapService.getThanksMessage = function(){
      var message;
      var SELECTOR_THANKS_MESSAGE = '.tripStatusArea p';
      if($(SELECTOR_THANKS_MESSAGE).length > 0){
      	message  = $(SELECTOR_THANKS_MESSAGE).text().trim();
      }
      return message;
    }
    return hostScrapService;
  }

  angular
      .module('responsiveBookingEngine')
      .factory('hostScrapService', hostScrapService);
})();
