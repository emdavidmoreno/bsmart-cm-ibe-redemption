'use strict';

define([], function() {
  // ===============================================================
  // Flight Details Bind Impl
  // ===============================================================
  // jshint -W117
  popupFramework.__privWrapFlightDetailsLoadCallback = popupFramework.loadCallBack;
  popupFramework.__privWrapFlightDetailsErrorCallback = popupFramework.errorCallBack;
  /**
   *
   * @param {Mixed} error if null no have error in the request, otherwise contain
   *        the message with error
   * @param {Mixed} value requested
   */
  var __handlerFlightDetails = function(/*error, success*/) {};
  var hostWrapFlightDetails = {};
  /**
   * Set the handler
   *
   * @param {Function} callback
   */
  hostWrapFlightDetails.setHandlerFlightDetails = function(callback) {
    __handlerFlightDetails = callback;
  };

  /**
   *
   * @param {Mixed} config
   * @param {Mixed} response
   */
  function fakeFlightDetailsLoadCallback(/*config, response*/) {
    var args = Array.prototype.slice.call(arguments);
    // execute the original function
    popupFramework.__privWrapFlightDetailsLoadCallback.apply(popupFramework, args);

    var $resp = $(args[1].contentData.UpdateCont);
    var dialogTitle = $('#flightDetailsPopUpDialogTitle').text().trim();

    // check for errors
    var $elmError = $resp.find('.popupBlockError');
    if($elmError.length) {
      __handlerFlightDetails(
        $elmError.find('popupErrorText').text().trim(), null);
      return;
    }

    function options (rootE, rootClassName) {
      return function(thClassName, tdClassName, firstElementExtractorType, secondElementExtractorType) {
        var optText, valueText;
        firstElementExtractorType = firstElementExtractorType || 'text';
        secondElementExtractorType = secondElementExtractorType || 'text';

        if(firstElementExtractorType === 'text') {
          optText = rootE.find(rootClassName + ' ' + thClassName).text().trim();
        } else{
          optText = rootE.find(rootClassName + ' ' + thClassName).html();
        }

        if(secondElementExtractorType === 'text') {
          valueText = rootE.find(rootClassName + ' ' + tdClassName).text().trim();
        } else{
          valueText = rootE.find(rootClassName + ' ' + tdClassName).html();
        }
        return {
          optText: optText,
          valueText: valueText
        };
      };
    }

    var flightInfo = options($resp, '.flightInfo');
    var tripInfo = options($resp, '.tripInfo');

    __handlerFlightDetails(null, {
      dialogTitle: dialogTitle,
      flight: flightInfo('th.colFlight', 'td.colFlight'),
      airLine: flightInfo('th.colAirline', 'td.colAirline'),
      from: flightInfo('th.colFrom', 'td.colFrom'),
      timeTotal: flightInfo('th.colTimeTotal', 'td.colTimeTotal'),
      to: flightInfo('th.colTo', 'td.colTo'),
      timeFlying: flightInfo('th.colTimeFlying', 'td.colTimeFlying'),
      date: flightInfo('th.colDate', 'td.colDate'),
      timeGround: flightInfo('th.colTimeGround', 'td.colTimeGround'),
      equipment: tripInfo('th.colEquip', 'td.colEquip'),
      depart: tripInfo('th.colDepart', 'td.colDepart'),
      arrive: tripInfo('th.colArrive', 'td.colArrive'),
      rating: tripInfo('th.colFlightRating', 'td.colFlightRating', 'text', 'html')
    });
  }

  function fakeFlightDetailsErrorCallback(/*config, httpRequest*/) {
    var args = Array.prototype.slice.call(arguments);
    // execute the original function
    popupFramework.__privWrapFlightDetailsErrorCallback.apply(popupFramework, args);
    __handlerFlightDetails({}, null);
  }

  /**
   * Settig the host function to create the wrap and retrieve the data
   */
  hostWrapFlightDetails.swapToBSFlightDetailsLoadCallback = function() {
    popupFramework.__privWrapFlightDetailsLoadCallback = popupFramework.loadCallBack;
    popupFramework.__privWrapFlightDetailsErrorCallback = popupFramework.errorCallBack;

    popupFramework.loadCallBack = fakeFlightDetailsLoadCallback;
    popupFramework.errorCallBack = fakeFlightDetailsErrorCallback;
  };

  /**
   * Return the original value for host functions
   * popupFramework.loadCallBack and popupFramework.errorCallBack
   */
  hostWrapFlightDetails.swapToOrgFlightDetailsCallbacks = function() {
    popupFramework.loadCallBack = null;
    popupFramework.errorCallBack = null;

    popupFramework.loadCallBack = popupFramework.__privWrapFlightDetailsLoadCallback;
    popupFramework.errorCallBack = popupFramework.__privWrapFlightDetailsErrorCallback;

    popupFramework.__privWrapFlightDetailsLoadCallback = null;
    popupFramework.__privWrapFlightDetailsErrorCallback = null;
    delete popupFramework.__privWrapFlightDetailsLoadCallback;
    delete popupFramework.__privWrapFlightDetailsErrorCallback;
  };

  return hostWrapFlightDetails;
});
