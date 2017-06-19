define(['jquery'], function($jq) {
  'use strict'
  // selectors
  const BLOCK_SELECTOR =
    '.multiplePaymentBlock .multiplePaymentItem .multiplePaymentItemHeader'
  const BLOCK_CHECK_BOX = '.colCheck input[type="checkbox"]'
  const BLOCK_LOGO = '.colLogo'
  const BLOCK_IMAGES = '.colDescr'

  /**
   * Wrapper for callbackClickCheckBox function
   *
   * @param {Function} clb
   */
  const bindCallbackClickCheckBox = (clb) => {
    const orgFn = multiplePaymentView.callbackClickCheckBox
    /**
     *
     * @param {Array.<Any>} args
     */
    let mockFn = function(...args) {
      orgFn.call(multiplePaymentView, ...args)
      clb()
    }
    multiplePaymentView.callbackClickCheckBox =
      mockFn.bind(multiplePaymentView)
  }

  return {
    /**
     * @param {Function} clb
     */
    bindFunctions: function(clb) {
      bindCallbackClickCheckBox(clb)
    },
    /**
     * @return {Array.<Object>}
     */
    getPaymentBlocks: function() {
      let blocks = []
      $jq(BLOCK_SELECTOR).each((index, block) => {
        const $block = $jq(block)
        let $input = $block.find(BLOCK_CHECK_BOX)
        const $logo = $block.find(BLOCK_LOGO)
        const $descr = $block.find(BLOCK_IMAGES)
        const re = /.*\(([A-Zaz_]+)\).*/
        blocks.push({
          jqInput: $input,
          type: $input.attr('name').match(re)[1],
          isSelected: $input.is(':checked') || false,
          /**
           * Check if the input checkbox is checked
           * @return {bool}
           */
          checkIsSelected: function() {
            this.isSelected = this.jqInput.is(':checked') || false
            return this.isSelected
          },
          /**
           * Send click for client host
           */
          click: function() {
            this.jqInput.trigger('click')
          },
          /**
           * forceDeselect
           */
          forceDeselect: function() {
            if(this.jqInput.is(':checked')) {
              this.jqInput.trigger('click')
              this.isSelected = $input.is(':checked')
            }
          },
          logoHtml: $logo.html(),
          descrHtml: $descr.html(),
        })
      })
      return blocks
    },
  }
})
