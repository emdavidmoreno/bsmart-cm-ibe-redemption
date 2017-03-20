(function() {
  'use strict';

  function hostScrapService() {
    var hostScrapService = {};
    var PASSENGERS_BLOCKS_SELECTOR = '.passengerBlock';
    var PASSENGERS_BLOCKS_INDIVIDUAL_SELECTOR = '.passengerBlock';
    var S_INDEX = '{{index}}';
    var PASSENGER_TYPE_SELECTOR =
      'input[name="travellersInfo[' + S_INDEX + '].travellerType"]';
    var PASSENGER_TITLE_SELECTOR =
      'select[name="travellersInfo[' + S_INDEX + '].title"]';
    var PASSENGER_FIRST_NAME_SELECTOR =
      'input[name="travellersInfo[' + S_INDEX + '].firstName"]';
    var PASSENGER_LAST_NAME_SELECTOR =
      'input[name="travellersInfo[' + S_INDEX + '].lastName"]';

    var PASSENGER_AUTO_FILL_SELECTOR =
      'select[name="travellersInfo[' + S_INDEX + '].profileId"]';

    var PASSENGER_FREQ_FLYER_SELECTOR =
      'select[name="travellersInfo[' + S_INDEX + '].loyaltyMemberships[0]"]';
    var PASSENGER_MEMBERSHIP_SELECTOR =
      'input[name="travellersInfo[' + S_INDEX + '].loyaltyNumbers[0]"]';
    var PASSENGER_SUFFIX_SELECTOR =
      'select[name="travellersInfo[' + S_INDEX + '].suffix"]';

    var PASSENGER_BIRTH_MONTH_DETAIL_SELECTOR =
      'select[name="travellersInfo[' + S_INDEX + '].advancedPassengerDetails(dobMonth)"]';
    var PASSENGER_BIRTH_MONTH_SELECTOR =
      'select[name="travellersInfo[' + S_INDEX + '].travellerBirthMonth"]';
    var PASSENGER_BIRTH_DAY_DETAIL_SELECTOR =
      'select[name="travellersInfo[' + S_INDEX + '].advancedPassengerDetails(dobDay)"]';
    var PASSENGER_BIRTH_DAY_SELECTOR =
      'select[name="travellersInfo[' + S_INDEX + '].travellerBirthDay"]';
    var PASSENGER_BIRTH_YEAR_DETAIL_SELECTOR =
      'select[name="travellersInfo[' + S_INDEX + '].advancedPassengerDetails(dobYear)"]';
    var PASSENGER_BIRTH_YEAR_SELECTOR =
      'select[name="travellersInfo[' + S_INDEX + '].travellerBirthYear"]';

    var PASSENGER_AGE_SELECTOR =
      'select[name="travellersInfo[' + S_INDEX + '].travellerAge"]';
    var PASSENGER_INFO_AREA_SELECTOR =
      '.formInArea .readOnlyValue';
    var PASSENGER_REDRESS_NUMBER_SELECTOR =
      'input[name="travellersInfo[' + S_INDEX + '].advancedPassengerDetails(redressNumber)"]';
    var PASSENGER_GENDER_NAME_SELECTOR =
      'input:radio[name="travellersInfo[' + S_INDEX + '].advancedPassengerDetails(gender)"]';

    var PASSENGER_TAXID_CONTAINER = '#ARGENTIA_TAX_ID-ARGENTIA_TAX_ID_NUMBERS-' + S_INDEX;
    var PASSENGER_TAXID_CODE_SELECT =
      'select[name="travellersInfo[' + S_INDEX + '].taxIdCode_select"]'
    var PASSENGER_TAXID_CODE_LABEL = '#taxId_' + S_INDEX + ' .formLabelElement:first'
    var PASSENGER_TAXID_NUMBER_INPUT =
      'input[name="travellersInfo[' + S_INDEX + '].taxIdNumber"]';
    var PASSENGER_TAXID_NUMBER_LABEL =
      '#taxId_' + S_INDEX + ' .formLabelElement:eq(1)'
    var PASSENGER_TAXID_COUNTRY_SELECT =
      'select[name="travellersInfo[' + S_INDEX + '].taxIdSelectedCountry_select"]';
    var PASSENGER_TAXID_COUNTRY_LABEL =
      '#taxId_' + S_INDEX + ' .formLabelElement:eq(1)'

    var PASSENGER_GENDER_M_SELECTOR =
      PASSENGER_GENDER_NAME_SELECTOR + '[value="M"]';
    var PASSENGER_GENDER_F_SELECTOR =
      PASSENGER_GENDER_NAME_SELECTOR + '[value="F"]';
    var CONTACT_INFORMATION_EMAIL_SELECTOR =
      'input[name="travellersInfo[0].emailAddress"]';
    var CONTACT_INFORMATION_CONFIRM_EMAIL_SELECTOR =
      'input[name="travellersInfo[0].confirmEmail"]';
    var CONTACT_INFORMATION_HOME_TEL_CODE_SELECTOR =
      'input[name="travellersInfo[0].homePhone.phoneNumberCountryCode"]';
    var CONTACT_INFORMATION_HOME_TEL_NUMBER_SELECTOR =
      'input[name="travellersInfo[0].homePhone.phoneNumber"]';
    var CONTACT_INFORMATION_CELL_CODE_SELECTOR =
      'input[name="travellersInfo[0].mobilePhone.phoneNumberCountryCode"]';
    var CONTACT_INFORMATION_CELL_NUMBER_SELECTOR =
      'input[name="travellersInfo[0].mobilePhone.phoneNumber"]';

    var SECURITY_FLIGHT_INFORMATION = '#prefixAPDP_' + S_INDEX;
    console.log("S_INDEX"+S_INDEX);

    /**
     * @param {string} selector
     * @param {int} index
     * @return {string}
     */
    var _replaceIndex = function(selector, index) {
      return selector.replace(S_INDEX, index);
    };
    /**
     * @param {int} index
     * @return {jQuery}
     */
    var _getSingleBlockSelecction = function(index) {
      var $bSelector =
        $(PASSENGERS_BLOCKS_INDIVIDUAL_SELECTOR + (index + 1));
      return $bSelector;
    };

    /**
     * @param {int} index
     * @return {string}
     */
    hostScrapService.getPassengerType = function(index) {
      var $bs = _getSingleBlockSelecction(index);
      var $selectType =
        $bs.find(_replaceIndex(PASSENGER_TYPE_SELECTOR, index));

      return $selectType.closest('td').find('.readOnlyValue').text().trim();
    };

    /**
     * @param {int} index
     * @return {Boolean}
     */
    hostScrapService.needSecureFlightInformation = function(index) {
      return $(_replaceIndex(SECURITY_FLIGHT_INFORMATION, index)).length > 0;
    };

    /**
     * @param {int} index
     * @return {string}
     */
    hostScrapService.getPassengerTitle = function(index) {
      var $bs = _getSingleBlockSelecction(index);
      var $selectTitle =
        $bs.find(_replaceIndex(PASSENGER_TITLE_SELECTOR, index));
      return $selectTitle.val();
    };

    /**
     * @param {int} index
     * @param {Mixed} value
     */
    hostScrapService.setPassengerTitle = function(index,  value) {
      var $bs = _getSingleBlockSelecction(index);
      var $selectTitle =
        $bs.find(_replaceIndex(PASSENGER_TITLE_SELECTOR, index));
      $selectTitle.val(value);
      $selectTitle.change();
    };

    /**
     * @param {int} index
     * @return {Object[]}
     */
    hostScrapService.getAllPassengerTitleOptions = function(index) {
      var titleOptions = [];
      var $bs = _getSingleBlockSelecction(index);
      var $elems =
          $bs.find(
            _replaceIndex(PASSENGER_TITLE_SELECTOR + ' option', index));
      $elems.each(function(index, el) {
        titleOptions.push({
          name: $(el).text(),
          value: $(el).attr('value')
        });
      });
      return titleOptions;
    };

    /**
     * @param {int} index
     * @return {string}
     */
    hostScrapService.getPassengerFirstName = function(index) {
      var $bs = _getSingleBlockSelecction(index);
      var $elem =
          $bs.find(_replaceIndex(PASSENGER_FIRST_NAME_SELECTOR, index));
      return $elem.val();
    };

    /**
     * @param {int} index
     * @param {Mixed} value
     */
    hostScrapService.setPassengerFirstName = function(index,  value) {
      var $bs = _getSingleBlockSelecction(index);
      var $elem =
        $bs.find(_replaceIndex(PASSENGER_FIRST_NAME_SELECTOR, index));
      $elem.val(value);
      $elem.change();
    };

    /**
     * @param {int} index
     * @return {string}
     */
    hostScrapService.getPassengerLastName = function(index) {
      var $bs = _getSingleBlockSelecction(index);
      var $elem =
          $bs.find(_replaceIndex(PASSENGER_LAST_NAME_SELECTOR, index));
      return $elem.val();
    };

    /**
     * @param {int} index
     * @param {Mixed} value
     */
    hostScrapService.setPassengerLastName = function(index,  value) {
      var $bs = _getSingleBlockSelecction(index);
      var $elem =
        $bs.find(_replaceIndex(PASSENGER_LAST_NAME_SELECTOR, index));
      $elem.val(value);
      $elem.change();
    };
    /**
     * @param {int} index
     * @return {string}
     */
    hostScrapService.getPassengerCheckedGender = function(index) {
      var $bs = _getSingleBlockSelecction(index);
      var $elem =
          $bs.find(
            _replaceIndex(PASSENGER_GENDER_NAME_SELECTOR + ':checked', index));
      return $elem.val();
    };

    /**
     * @param {int} index
     * @param {boolean} isMale
     */
    hostScrapService.setPassengerGender = function(index, isMale) {
      var $bs = _getSingleBlockSelecction(index);
      var strSelector = isMale ? PASSENGER_GENDER_M_SELECTOR : PASSENGER_GENDER_F_SELECTOR;
      var $elem = $bs.find(_replaceIndex(strSelector, index));
      $elem.prop('checked', 'checked');
      $elem.change();
    };
    /**
     * @param {int} index
     * @return {string}
     */
    hostScrapService.getPassengerRedressNumber = function(index) {
      var $bs = _getSingleBlockSelecction(index);
      var $elem =
          $bs.find(_replaceIndex(PASSENGER_REDRESS_NUMBER_SELECTOR, index));
      return $elem.val();
    };

    /**
     * @param {int} index
     * @param {Mixed} value
     */
    hostScrapService.setPassengerRedressNumber = function(index,  value) {
      var $bs = _getSingleBlockSelecction(index);
      var $elem =
        $bs.find(_replaceIndex(PASSENGER_REDRESS_NUMBER_SELECTOR, index));
      $elem.val(value);
      $elem.change();
    };

    /**
     * @param {int} index
     * @return {string}
     */
    hostScrapService.getAutoFillSelectedOption = function(index) {
      var $bs = _getSingleBlockSelecction(index);
      var $elem =
          $bs.find(_replaceIndex(PASSENGER_AUTO_FILL_SELECTOR, index));
      return $elem.val();
    };

    /**
     * @param {int} index
     * @param {Mixed} value
     */
    hostScrapService.setAutoFillSelectedOption = function(index,  value) {
      var $bs = _getSingleBlockSelecction(index);
      var $elem =
        $bs.find(_replaceIndex(PASSENGER_AUTO_FILL_SELECTOR, index));
      $elem.val(value.value);
      $elem.change();
    };

    /**
     * @param {int} index
     * @return {Object[]}
     */
    hostScrapService.getAllPassengerAutoFillOptions = function(index) {
      var autoFillOptions = [];
      var $bs = _getSingleBlockSelecction(index);
      var $elems =
          $bs.find(
            _replaceIndex(PASSENGER_AUTO_FILL_SELECTOR + ' option', index));
      $elems.each(function(index, el) {
        autoFillOptions.push({
          name: $(el).text(),
          value: $(el).attr('value')
        });
      });
      return autoFillOptions;
    };

    /**
     * @param {int} index
     * @return {string}
     */
    hostScrapService.getPassengerFreqFlyer = function(index) {
      var $bs = _getSingleBlockSelecction(index);
      var $elem =
          $bs.find(_replaceIndex(PASSENGER_FREQ_FLYER_SELECTOR, index));
      return $elem.val();
    };

    /**
     * @param {int} index
     * @param {Mixed} value
     */
    hostScrapService.setPassengerFreqFlyer = function(index,  value) {
      var $bs = _getSingleBlockSelecction(index);
      var $elem =
        $bs.find(_replaceIndex(PASSENGER_FREQ_FLYER_SELECTOR, index));
      $elem.val(value.value);
      $elem.change();
    };

    /**
     * @param {int} index
     * @return {Object[]}
     */
    hostScrapService.getAllPassengerFreqFlyerOptions = function(index) {
      var freqFlyerOptions = [];
      var $bs = _getSingleBlockSelecction(index);
      var $elems =
          $bs.find(
            _replaceIndex(PASSENGER_FREQ_FLYER_SELECTOR + ' option', index));
      $elems.each(function(index, el) {
        freqFlyerOptions.push({
          name: $(el).text(),
          value: $(el).attr('value')
        });
      });
      return freqFlyerOptions;
    };

    /**
     * @param {int} index
     * @return {string}
     */
    hostScrapService.getPassengerMemberShip = function(index) {
      var $bs = _getSingleBlockSelecction(index);
      var $elem =
          $bs.find(_replaceIndex(PASSENGER_MEMBERSHIP_SELECTOR, index));
      return $elem.val();
    };

    /**
     * @param {int} index
     * @param {Mixed} value
     */
    hostScrapService.setPassengerMemberShip = function(index,  value) {
      var $bs = _getSingleBlockSelecction(index);
      var $elem =
        $bs.find(_replaceIndex(PASSENGER_MEMBERSHIP_SELECTOR, index));
      $elem.val(value);
      $elem.change();
    };

    /**
     * @param {int} index
     * @return {string}
     */
    hostScrapService.getPassengerSuffix = function(index) {
      var $bs = _getSingleBlockSelecction(index);
      var $elem =
        $bs.find(_replaceIndex(PASSENGER_SUFFIX_SELECTOR, index));
      return $elem.val();
    };

    /**
     * @param {int} index
     * @param {Mixed} value
     */
    hostScrapService.setPassengerSuffix = function(index,  value) {
      var $bs = _getSingleBlockSelecction(index);
      var $elem =
        $bs.find(_replaceIndex(PASSENGER_SUFFIX_SELECTOR, index));
      $elem.val(value);
      $elem.change();
    };

    /**
     * @param {int} index
     * @return {Boolean}
     */
    hostScrapService.showBirthDate = function(index) {
      var $bs = _getSingleBlockSelecction(index);
      var $elem =
          $bs.find(_replaceIndex(PASSENGER_BIRTH_MONTH_SELECTOR, index));

      return $elem
        .closest('.formCalendarArea')
        .attr('style')
        .indexOf('display:none') < 0;
    };

    /**
     * @param {int} index
     * @return {Object}
     */
    hostScrapService.getPassengerBirthMonth = function(index) {
      var $bs = _getSingleBlockSelecction(index);
      var $elem =
        $bs.find(_replaceIndex(PASSENGER_BIRTH_MONTH_DETAIL_SELECTOR, index));
      // When there are infants the selector is different
      if($elem.length < 1){
        $elem =
          $bs.find(_replaceIndex(PASSENGER_BIRTH_MONTH_SELECTOR, index));
      }
      return {no: $elem.val()};
    };

    /**
     * @param {int} index
     * @param {Mixed} value
     */
    hostScrapService.setPassengerBirthMonth = function(index,  value) {
      var $bs = _getSingleBlockSelecction(index);
      var $elem =
        $bs.find(_replaceIndex(PASSENGER_BIRTH_MONTH_DETAIL_SELECTOR, index));
      // When there are infants the selector is different
      if($elem.length < 1){
        $elem =
          $bs.find(_replaceIndex(PASSENGER_BIRTH_MONTH_SELECTOR, index));
      }
      $elem.val(value);
      $elem.change();
    };

    /**
     * @param {int} index
     * @return {string}
     */
    hostScrapService.getPassengerBirthDay = function(index) {
      var $bs = _getSingleBlockSelecction(index);
      var $elem =
        $bs.find(_replaceIndex(PASSENGER_BIRTH_DAY_DETAIL_SELECTOR, index));
      // When there are infants the selector is different
      if($elem.length < 1){
        $elem =
          $bs.find(_replaceIndex(PASSENGER_BIRTH_DAY_SELECTOR, index));
      }
      return $elem.val();
    };

    /**
     * @param {int} index
     * @param {Mixed} value
     */
    hostScrapService.setPassengerBirthDay = function(index,  value) {
      var $bs = _getSingleBlockSelecction(index);
      var $elem =
        $bs.find(_replaceIndex(PASSENGER_BIRTH_DAY_DETAIL_SELECTOR, index));
      // When there are infants the selector is different
      if($elem.length < 1){
        $elem =
          $bs.find(_replaceIndex(PASSENGER_BIRTH_DAY_SELECTOR, index));
      }
      $elem.val(value);
      $elem.change();
    };

    /**
     * @param {int} index
     * @return {string}
     */
    hostScrapService.getPassengerBirthYear = function(index) {
      var $bs = _getSingleBlockSelecction(index);
      var $elem =
        $bs.find(_replaceIndex(PASSENGER_BIRTH_YEAR_DETAIL_SELECTOR, index));
      // When there are infants the selector is different
      if($elem.length < 1){
        $elem =
          $bs.find(_replaceIndex(PASSENGER_BIRTH_YEAR_SELECTOR, index));
      }
      return $elem.val();
    };

    /**
     * @param {int} index
     * @param {Mixed} value
     */
    hostScrapService.setPassengerBirthYear = function(index,  value) {
      var $bs = _getSingleBlockSelecction(index);
      var $elem =
        $bs.find(_replaceIndex(PASSENGER_BIRTH_YEAR_DETAIL_SELECTOR, index));
      // When there are infants the selector is different
      if($elem.length < 1) {
        $elem =
          $bs.find(_replaceIndex(PASSENGER_BIRTH_YEAR_SELECTOR, index));
      }
      $elem.val(value);
      $elem.change();
    };

    /**
     * @param {int} index
     * @return {string}
     */
    hostScrapService.getPassengerAge = function(index) {
      var $bs = _getSingleBlockSelecction(index);
      var $elem =
        $bs.find(_replaceIndex(PASSENGER_AGE_SELECTOR, index));
      return $elem.val();
    };

    /**
     * @param {int} index
     * @param {Mixed} value
     */
    hostScrapService.setPassengerAge = function(index,  value) {
      var $bs = _getSingleBlockSelecction(index);
      var $elem =
        $bs.find(_replaceIndex(PASSENGER_AGE_SELECTOR, index));
      $elem.val(value);
      $elem.change();
    };

    /**
     * @param {int} index
     * @return {string}
     */
    hostScrapService.getPassengerInfoArea = function(index) {
      var $bs = _getSingleBlockSelecction(index);
      var $elem =
        $bs.find(PASSENGER_INFO_AREA_SELECTOR);
      return $elem.text().trim();
    };

    // TAX ID CODE ARGENTINA
    /**
     * @param {int} index
     * @return {boolean}
     */
    hostScrapService.existArgentinaTaxID = function(index) {
      var $bs = _getSingleBlockSelecction(index);
      var $elem =
        $bs.find(_replaceIndex(PASSENGER_TAXID_CONTAINER, index));
      return $elem.length > 0;
    }

    /**
     * @param {int} index
     * @return {Object[]}
     */
    hostScrapService.getAllPassengerTaxIDCodeOptions = function(index) {
      var allOptions = [];
      var $bs = _getSingleBlockSelecction(index);
      var $elems =
          $bs.find(
            _replaceIndex(PASSENGER_TAXID_CODE_SELECT + ' option', index));
      $elems.each(function(index, el) {
        allOptions.push({
          name: $(el).text(),
          value: $(el).attr('value')
        });
      });
      return allOptions;
    };

    /**
     * @param {int} index
     * @return {string}
     */
    hostScrapService.getPassengerTaxIDCodeLabel = function(index) {
      var $bs = _getSingleBlockSelecction(index);
      var $selectTitle =
        $bs.find(_replaceIndex(PASSENGER_TAXID_CODE_LABEL, index));
      return $selectTitle.text();
    };

    /**
     * @param {int} index
     * @return {string}
     */
    hostScrapService.getPassengerTaxIDCode = function(index) {
      var $bs = _getSingleBlockSelecction(index);
      var $selectTitle =
        $bs.find(_replaceIndex(PASSENGER_TAXID_CODE_SELECT, index));
      return $selectTitle.val();
    };

    /**
     * @param {int} index
     * @param {Mixed} value
     */
    hostScrapService.setPassengerTaxIDCode = function(index, value) {
      var $bs = _getSingleBlockSelecction(index);
      var $selectTitle =
        $bs.find(_replaceIndex(PASSENGER_TAXID_CODE_SELECT, index));
      $selectTitle.val(value);
      $selectTitle.change();
    };

    /**
     * @param {int} index
     * @return {string}
     */
    hostScrapService.getPassengerTaxIDNumber = function(index) {
      var $bs = _getSingleBlockSelecction(index);
      var $selectTitle =
        $bs.find(_replaceIndex(PASSENGER_TAXID_NUMBER_INPUT, index));
      return $selectTitle.val();
    };

    /**
     * @param {int} index
     * @param {Mixed} value
     */
    hostScrapService.setPassengerTaxIDNumber = function(index,  value) {
      var $bs = _getSingleBlockSelecction(index);
      var $selectTitle =
        $bs.find(_replaceIndex(PASSENGER_TAXID_NUMBER_INPUT, index));
      $selectTitle.val(value);
      $selectTitle.change();
    };

    /**
     * @param {int} index
     * @return {string}
     */
    hostScrapService.getPassengerTaxIDNumberLabel = function(index) {
      var $bs = _getSingleBlockSelecction(index);
      var $selectTitle =
        $bs.find(_replaceIndex(PASSENGER_TAXID_NUMBER_LABEL, index));
      return $selectTitle.text();
    };

    /**
     * @param {int} index
     * @return {string}
     */
    hostScrapService.getPassengerTaxIDCountryLabel = function(index) {
      var $bs = _getSingleBlockSelecction(index);
      var $selectTitle =
        $bs.find(_replaceIndex(PASSENGER_TAXID_COUNTRY_LABEL, index));
      return $selectTitle.text();
    };

    /**
     * @param {int} index
     * @return {Object[]}
     */
    hostScrapService.getAllPassengerTaxIDCountryOptions = function(index) {
      var allOptions = [];
      var $bs = _getSingleBlockSelecction(index);
      var $elems =
          $bs.find(
            _replaceIndex(PASSENGER_TAXID_COUNTRY_SELECT + ' option', index));
      $elems.each(function(index, el) {
        allOptions.push({
          name: $(el).text(),
          value: $(el).attr('value')
        });
      });
      return allOptions;
    };

    /**
     * @param {int} index
     * @return {string}
     */
    hostScrapService.getPassengerTaxIDCountry = function(index) {
      var $bs = _getSingleBlockSelecction(index);
      var $selectTitle =
        $bs.find(_replaceIndex(PASSENGER_TAXID_COUNTRY_SELECT, index));
      return $selectTitle.val();
    };

    /**
     * @param {int} index
     * @param {Mixed} value
     */
    hostScrapService.setPassengerTaxIDCountry = function(index,  value) {
      var $bs = _getSingleBlockSelecction(index);
      var $selectTitle =
        $bs.find(_replaceIndex(PASSENGER_TAXID_COUNTRY_SELECT, index));
      $selectTitle.val(value);
      $selectTitle.change();
    };

    // ----------------------------
    //  CONTACT INFORMATION
    // ----------------------------
    /**
     * @return {string}
     */
    hostScrapService.getContactInformationEmail = function() {
      var $elem = $(CONTACT_INFORMATION_EMAIL_SELECTOR);
      return $elem.val();
    };

    /**
     * @param {Mixed} value
     */
    hostScrapService.setContactInformationEmail = function(value) {
      var $elem = $(CONTACT_INFORMATION_EMAIL_SELECTOR);
      $elem.val(value);
      $elem.change();
    };

    /**
     * @return {string}
     */
    hostScrapService.getContactInformationConfirmEmail = function() {
      var $elem = $(CONTACT_INFORMATION_CONFIRM_EMAIL_SELECTOR);
      return $elem.val();
    };

    /**
     * @param {Mixed} value
     */
    hostScrapService.setContactInformationConfirmEmail = function(value) {
      var $elem = $(CONTACT_INFORMATION_CONFIRM_EMAIL_SELECTOR);
      $elem.val(value);
      $elem.change();
    };

    /**
     * @return {string}
     */
    hostScrapService.getContactInformationHomeTelCode = function() {
      var $elem = $(CONTACT_INFORMATION_HOME_TEL_CODE_SELECTOR);
      return $elem.val();
    };

    /**
     * @param {Mixed} value
     */
    hostScrapService.setContactInformationHomeTelCode = function(value) {
      var $elem = $(CONTACT_INFORMATION_HOME_TEL_CODE_SELECTOR);
      $elem.val(value);
      $elem.change();
    };

    /**
     * @return {string}
     */
    hostScrapService.getContactInformationHomeTelNumber = function() {
      var $elem = $(CONTACT_INFORMATION_HOME_TEL_NUMBER_SELECTOR);
      return $elem.val();
    };

    /**
     * @param {Mixed} value
     */
    hostScrapService.setContactInformationHomeTelNumber = function(value) {
      var $elem = $(CONTACT_INFORMATION_HOME_TEL_NUMBER_SELECTOR);
      $elem.val(value);
      $elem.change();
    };

    /**
     * @return {string}
     */
    hostScrapService.getContactInformationMobileCode = function() {
      var $elem = $(CONTACT_INFORMATION_CELL_CODE_SELECTOR);
      return $elem.val();
    };

    /**
     * @param {Mixed} value
     */
    hostScrapService.setContactInformationMobileCode = function(value) {
      var $elem = $(CONTACT_INFORMATION_CELL_CODE_SELECTOR);
      $elem.val(value);
      $elem.change();
    };

    /**
     * @return {string}
     */
    hostScrapService.getContactInformationMobileNumber = function() {
      var $elem = $(CONTACT_INFORMATION_CELL_NUMBER_SELECTOR);
      return $elem.val();
    };

    /**
     * @param {Mixed} value
     */
    hostScrapService.setContactInformationMobileNumber = function(value) {
      var $elem = $(CONTACT_INFORMATION_CELL_NUMBER_SELECTOR);
      $elem.val(value);
      $elem.change();
    };

    /**
     * @return {jQuery[]}
     */
    hostScrapService.getAllInfoBlocks = function() {
      return $(PASSENGERS_BLOCKS_SELECTOR);
    };

    /**
     * @return {Mixed} If no exist the block return Null; if exist return Object
     *  with {head, body, isHtml} properties
     */
    function __getPassengerDetailsBlockMessage() {
      var $blk1Element = $('.textBlock1 p');
      var msgBlk1 = null;
      if($blk1Element.length) {
         msgBlk1 = {
          head: $('#ftTravellerDetails').text().trim(),
          body: $blk1Element.html().split('<br><br>')[0],
          isHtml: true,
          cssClass: 'm-card--info m-card--read-more',
          contentClass: 'content--no-bottom-padding',
          bodyType: 'read_more',
          openMoreInfo: true
        };
      }
      return msgBlk1;
    }

    /**
     * @return {Mixed} If no exist the block return Null; if exist return Object
     *  with {head, body, isHtml} properties
     */
    function __getPassengerWarningBlockMessage() {
      var $blkElement = $('#warningBlock');
      var $blkElementText = $('#warningBlock .errorBody p');
      var msgBlk1 = null;
      if($blkElement.length && $blkElementText.length > 0) {
         msgBlk1 = {
          head: $blkElement.find('.errorHeader span').text().trim(),
          body: $blkElement.find('.errorBody').text().trim(),
          cssClass: 'm-card--warning',
          contentClass: 'content--no-bottom-padding',
          bodyType: 'read_more'
        };
      }
      return msgBlk1;
    }

    /**
     * @return {Object[]}
     *         {String} object.head
     *         {String} object.body
     */
    hostScrapService.getInfoMessages = function () {
      var SELECTOR_TSA_INFO_BLOCK = '.textBlock.textBlockPrivNote';
      var SELECTOR_TSA_INFO_HEAD_BLOCK = 'p b:nth-child(1)';
      var SELECTOR_TSA_INFO_BODY_BLOCK = 'p:nth-child(n + 2)';

      var messages = [];

      messages.push(__getPassengerWarningBlockMessage());
      messages.push(__getPassengerDetailsBlockMessage());

      var $infoBlock = $(SELECTOR_TSA_INFO_BLOCK);
      $infoBlock.each(function(index, el) {
        var $_blockBody = $('<p>');
        var $el = $(el);

        $el.find(SELECTOR_TSA_INFO_BODY_BLOCK).each(function(i, el) {
          $_blockBody.append($(el));
        });

        var message = {
          head: $el.find(SELECTOR_TSA_INFO_HEAD_BLOCK).text(),
          body: $_blockBody.html(),
          isHtml: true,
          cssClass: 'm-card--warning tsa-privacy-notice'
        };
        messages.push(message);
      });
      return messages;
    };

    hostScrapService.isInactive = function() {
      return $('#fadeOut').is('.inactiveFadeOut');
    };

    hostScrapService.genderExist = function(index){
     var val  = $("#idPassenger"+(index + 1)+"APD_GenderTitle").length;
     return val;
    }

    hostScrapService.dobExist = function(index){
     var val  = $("#idPassenger"+(index + 1)+"APD_DOBTitle").length;
     return val;
    }

    hostScrapService.redressNumberExist = function(index){
     var val  = $("#idPassenger"+(index + 1)+"APD_RedressNumberTitle").length;
     return val;
    }

    return hostScrapService;
  }

  angular
      .module('responsiveBookingEngine')
      .factory('hostScrapService', hostScrapService);
})();
