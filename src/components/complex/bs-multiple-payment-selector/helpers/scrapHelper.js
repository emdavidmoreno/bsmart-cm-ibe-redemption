define(['jquery'], function($jq) {
  'use strict'
  // selectors
  const BLOCK_SELECTOR =
    '.multiplePaymentBlock .multiplePaymentItem .multiplePaymentItemHeader'
  const BLOCK_CHECK_BOX = '.colCheck input[type="checkbox"]'
  const BLOCK_LOGO = '.colLogo'
  const BLOCK_IMAGES = '.colDescr'

  return {
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
           * Send click for client host
           */
          hOnClick: function() {
            this.jqInput.prop('checked', 'checked')
            this.jqInput.trigger('click')
            this.isSelected = $input.is(':checked')
          },
          /**
           * forceDeselect
           */
          forceDeselect: function() {
            if(this.jqInput.is(':checked')) {
              this.jqInput.trigger('click')
              this.jqInput.prop('checked', false)
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
