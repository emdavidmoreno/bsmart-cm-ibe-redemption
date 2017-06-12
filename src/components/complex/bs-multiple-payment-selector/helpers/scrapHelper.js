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
        const $block = $(block)
        const $input = $block.find(BLOCK_CHECK_BOX)
        const $logo = $block.find(BLOCK_LOGO)
        const $descr = $block.find(BLOCK_IMAGES)
        const re = /.*\(([A-Zaz_]+)\).*/

        blocks.push({
          jqInput: $input,
          type: $input.attr('name').match(re)[1],
          isSelected: $input.is(':checked'),
          selectFn: function() {
            this.jqInput[0].click()
          },
          forceDeselect: function() {
            if(this.jqInput.is(':checked')) {
              this.jqInput[0].click()
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
