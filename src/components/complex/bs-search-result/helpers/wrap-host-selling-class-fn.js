'use strict'
define([], function() {
  /**
   *
   * @param {Mixed} [error] if null no have error in the request,
   *        otherwise contain
   *        the message with error
   * @param {Mixed} [value] requested
   */
  let handlerSellingClassCb = function(/* error, value */) {}

  let hostWrapSellingClassFn = {}

  /**
   * Set selling class handler
   *
   * @param {Function} callback
   */
  hostWrapSellingClassFn.setHandlerSellingClass = function(callback) {
    handlerSellingClassCb = callback
  }

  /* eslint-disable no-underscore-dangle */
  let __fillFareRuleTabCallback = fillFareRuleTabCallback
  let __fillFareRuleTabCallbackError = fillFareRuleTabCallbackError

  /**
   * Wrap of the original function for retrieve the required data
   *
   * @param {Mixed} response
   * @param {Mixed} options
   */
  let wrapFillFareRuleTabCallback = function(...args) {
    let content
    let response = args[0]
    eval('content=' + response)
    // execute the original function
    __fillFareRuleTabCallback(...args)

    try {
      handlerSellingClassCb(null, content.contentData.UpdateCont)
    } catch(e) {
      handlerSellingClassCb(e, null)
    }
  }

  /**
   * Wrap of the original function for retrieve the required data
   */
  let wrapFillFareRuleTabCallbackError = function(...args) {
    // execute the original function
    __fillFareRuleTabCallbackError(...args)
    handlerSellingClassCb({}, null)
  }

  /**
   * Settig the host function to create the wrap and retrieve the data
   */
  hostWrapSellingClassFn.swapToBSFillFareRuleTabCallback = function() {
    __fillFareRuleTabCallback = fillFareRuleTabCallback
    __fillFareRuleTabCallbackError = fillFareRuleTabCallbackError

    fillFareRuleTabCallback = wrapFillFareRuleTabCallback
    fillFareRuleTabCallbackError = wrapFillFareRuleTabCallbackError
  }

  /**
   * Return to original value for host functions fillFareRuleTabCallback and
   * fillFareRuleTabCallbackError
   */
  hostWrapSellingClassFn.swapToOrgFillFareRuleTabCallback = function() {
    fillFareRuleTabCallback = __fillFareRuleTabCallback
    fillFareRuleTabCallbackError = __fillFareRuleTabCallbackError

    __fillFareRuleTabCallback = null
    __fillFareRuleTabCallbackError = null
  }

  return hostWrapSellingClassFn
})
