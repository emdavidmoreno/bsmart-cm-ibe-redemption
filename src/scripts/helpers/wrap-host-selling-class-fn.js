'use strict';

define([], function() {
  /**
   *
   * @param {Mixed} error if null no have error in the request, otherwise contain
   *        the message with error
   * @param {Mixed} value requested
   */
  var __handlerSellingClass = function(/* error, value */) {};

  var hostWrapSellingClassFn = {};

  /**
   * Set selling class handler
   *
   * @param {Function} callback
   */
  hostWrapSellingClassFn.setHandlerSellingClass = function(callback) {
    __handlerSellingClass = callback;
  };

  // jshint -W117
  var __fillFareRuleTabCallback = fillFareRuleTabCallback ;
  var __fillFareRuleTabCallbackError = fillFareRuleTabCallbackError;

  /**
   * Wrap of the original function for retrieve the required data
   *
   * @param {Mixed} response
   * @param {Mixed} options
   */
  var wrapFillFareRuleTabCallback = function(response /*, options*/) {
    var content;
    eval("content=" + response);

    var args = [].slice.call(arguments);
    // execute the original function
    __fillFareRuleTabCallback.apply(null, args);

    try {
      __handlerSellingClass(null, content.contentData.UpdateCont);
    } catch(e) {
      __handlerSellingClass(e, null);
    }
  };

  /**
   * Wrap of the original function for retrieve the required data
   */
   var wrapFillFareRuleTabCallbackError = function() {

    var args = Array.prototype.slice.call(arguments);
    // execute the original function
    __fillFareRuleTabCallbackError.apply(null, args);

    __handlerSellingClass({}, null);
  };

  /**
   * Settig the host function to create the wrap and retrieve the data
   */
  hostWrapSellingClassFn.swapToBSFillFareRuleTabCallback = function() {
    __fillFareRuleTabCallback = fillFareRuleTabCallback;
    __fillFareRuleTabCallbackError = fillFareRuleTabCallbackError;

    fillFareRuleTabCallback = wrapFillFareRuleTabCallback;
    fillFareRuleTabCallbackError = wrapFillFareRuleTabCallbackError;
  };

  /**
   * Return to original value for host functions fillFareRuleTabCallback and
   * fillFareRuleTabCallbackError
   */
  hostWrapSellingClassFn.swapToOrgFillFareRuleTabCallback = function() {
    fillFareRuleTabCallback = __fillFareRuleTabCallback;
    fillFareRuleTabCallbackError = __fillFareRuleTabCallbackError;

    __fillFareRuleTabCallback = null;
    __fillFareRuleTabCallbackError = null;
  };

  return hostWrapSellingClassFn;
});
