'use strict';

define([
  'lodash',
  '../../../../scripts/helpers/wrap-host-selling-class-fn',
  '../../../../scripts/helpers/wrap-host-popup-framework-callback'
], function(_, sellingClass, popupFrameworkCallbak) {
    function hostUIService() {
      var hostUIService = {};

      var HOST_CARD_NUMBER_SELECTOR = 'iframe[name="formOfPayment(CREDITCARD_POS).numberDisplay"]';
          var HOST_SECURITY_CODE_SELECTOR = 'iframe[name="formOfPayment(CREDITCARD_POS).securityCodeDisplay"]';

      var BOOKSMART_CARD_NUMBER_SELECTOR = '.js-card-number';
          var  BOOKSMART_SECURITY_CODE_SELECTOR = '.js-security-code';

      /**
       * Allow sync the iframe mask with the booksmart interface
       *
       * - card-number
       * - security-code
       *
       * That was a nightmare because those fields are iframe we cannot
       * just pass the data to it, What we did was take the fields trought
       * css and put it in front of our interface.
       *
       * - Mark the field as focused
       * - Fix the scroll issue with the iframe
       *
       * @return {[type]} [description]
       */
      hostUIService.syncIframeFields = function() {
        var $hostCardNumberNode = $(HOST_CARD_NUMBER_SELECTOR).parent();
        var $hostSecurityCodeNode = $(HOST_SECURITY_CODE_SELECTOR).parent();
        //TODO: We must do a big refactoring here

        // basic styles
        $hostCardNumberNode.addClass('positionable-iframe-container card-number');
        $hostSecurityCodeNode.addClass('positionable-iframe-container security-code');

        if($hostCardNumberNode.children('.iframe-mask--layer').length < 1){
          // to listen the click event, bacause we cannot listen events inside an iframe
          $hostCardNumberNode.prepend('<div class="iframe-mask iframe-mask--layer">0000-0000-0000-0000</div>');
          // gonna be a layer to hide the iframe borders
          $hostCardNumberNode.prepend('<div class="iframe-mask iframe-mask--right"></div>');
          $hostCardNumberNode.prepend('<div class="iframe-mask iframe-mask--top"></div>');
          $hostCardNumberNode.prepend('<div class="iframe-mask iframe-mask--left"></div>');

          // to listen the click event, bacause we cannot listen events inside an iframe
          $hostSecurityCodeNode.prepend('<div class="iframe-mask iframe-mask--layer">000</div>');
          // gonna be a layer to hide the iframe borders
          $hostSecurityCodeNode.prepend('<div class="iframe-mask iframe-mask--right"></div>');
          $hostSecurityCodeNode.prepend('<div class="iframe-mask iframe-mask--top"></div>');
          $hostSecurityCodeNode.prepend('<div class="iframe-mask iframe-mask--left"></div>');

          // modify the display none of the host interface, because if not we
          // cannot show the iframe
          hostUIService.showHostInterface();

          // sync the position of the iframe fields
          hostUIService.syncPosition();

          // create a listener to allow perform tasks about
          // hide the layer and mark the field as focused
          $('.card-number .iframe-mask--layer').click( function(){
            $('.iframe-mask--layer').show();
            $(this).hide();
            $(this).css('opacity', 0);
            $('.form-control--focused').removeClass('form-control--focused');
            $(BOOKSMART_CARD_NUMBER_SELECTOR).find('input')
              .addClass('form-control--focused');

            var currentScroll = $(window).scrollTop();
            $(window).one('scroll', function(/*e*/) {
              window.scrollTo(0, currentScroll);
            });

            $('.card-number iframe')[0].contentWindow.focus();
          });

          // create a listener to allow perform tasks about
          // hide the layer and mark the field as focused
          $('.security-code .iframe-mask--layer').click( function(){
            $('.iframe-mask--layer').show();
            $(this).hide();
            $(this).css('opacity', 0);
            $('.form-control--focused').removeClass('form-control--focused');
            $(BOOKSMART_SECURITY_CODE_SELECTOR).find('input')
              .addClass('form-control--focused');
            $('.security-code iframe')[0].contentWindow.focus();
          });

          // when focus in other field disable the focused state
          $('.form-control.md').focus(function(){
            $('.form-control--focused')
              .removeClass('form-control--focused');
            $(this).addClass('form-control--focused');
            $('.iframe-mask--layer').show();
          });
        }

        hostUIService.syncPosition();
      };

      /**
       * Sync the position of the field elements
       * @return {[type]} [description]
       */
      hostUIService.syncPosition = function(){
        var $hostCardNumberNode = $(HOST_CARD_NUMBER_SELECTOR).parent();
        var $hostSecurityCodeNode = $(HOST_SECURITY_CODE_SELECTOR).parent();

        // position
        positionMe($(BOOKSMART_CARD_NUMBER_SELECTOR).find('input'),
         $hostCardNumberNode);

        positionMe($(BOOKSMART_SECURITY_CODE_SELECTOR).find('input'),
         $hostSecurityCodeNode);
         $($('.iframe-mask.iframe-mask--layer')[0]).hide();
      };

      hostUIService.showHostInterface = function() {
        $('table.layoutMain').css('visibility', 'hidden');
        $('table.layoutMain').css('display', 'inline-block');

        var lastScrollLeft = 0;
        $(window).scroll(function() {
            var documentScrollLeft = $(document).scrollLeft();
            if (lastScrollLeft != documentScrollLeft) {
                lastScrollLeft = documentScrollLeft;
                if(lastScrollLeft > 0){
                  $(document).scrollLeft(0);
                }
            }
        });

        // TODO: Fix Safari 'overflow-x', 'hidden' bug
        // we are using the scroll tricky
        // $('body').css('position', 'relative');
        // $('body').css('overflow-x', 'hidden');
        // $('body').css('-webkit-overflow-scrolling', 'touch');

        if(!hostUIService.isWidthSettingUp){
          var $tableElements = $('table.layoutMain *');
          var maxWidth = $(window).width();
          var tableElementsSize = $tableElements.length;
          hostUIService.isWidthSettingUp = 1;
        } else{
        }
      };

      hostUIService.hideHostInterface = function() {
        $('table.layoutMain').css('display', 'none');
      };

      hostUIService.focusToCardNumberIframe = function(){
        $('.card-number iframe')[0].contentWindow.focus();
      }

      hostUIService.focusToSecurityCodeIframe = function(){
        $('.security-code iframe')[0].contentWindow.focus();
      }

      /**
       * Calculate and update the position of the iframe fields
       * @param  {[type]} $target            Input that we gonna take as base
       * @param  {[type]} $positionMeElement Element to position
       */
      function positionMe ($target, $positionMeElement) {
        //$target.after($positionMeElement);
        var offset = $target.offset();
        var height = $target.height();
        var width = $target.width();
        offset.top = offset.top + 12;
        offset.left = offset.left + 2;
        $positionMeElement.offset(offset);
      }

      hostUIService = _.assign(hostUIService, sellingClass, popupFrameworkCallbak);

      return hostUIService;
    }

    hostUIService.$inject = [];
    return hostUIService;
});
