define([], function() {
  'use strict';
    function hostUIService(){
      var hostUIService = {};

      hostUIService.setupHostUI = function() {
        console.log('hostUIService.setupHostUI');
      };

      hostUIService.appendHTML = function(html){
        $('.m-book-smart').append(html);
      }

      hostUIService.bindUI = function(html){
        $('.m-top-bar i.menu').click(function(){
          hostUIService.showMenu();
        });
        $('.m-sidebar-menu').click(function(event) {
          event.stopPropagation();
        });
        $('.accordion-item-title').click(function(event) {
          var $currentAccordion = $(this).closest('.accordion');

          if($currentAccordion.hasClass('accordion--expanded')){
            $currentAccordion.removeClass('accordion--expanded');
          } else {
            $('.accordion.accordion--expanded').removeClass('accordion--expanded');
            $currentAccordion.addClass('accordion--expanded');
          }

        });
      }

      hostUIService.showMenu = function(){
        $('.m-sidebar-menu').css('left', 0);
        $('.m-sidebar-menu-wrapper').show(200);//css('display', 'block');
        $('.m-sidebar-menu-wrapper').one('click',function() {
          hostUIService.hideMenu();
        });
      }

      hostUIService.hideMenu = function(){
        $('.m-sidebar-menu').css('left', '-100%');
        $('.m-sidebar-menu-wrapper').hide();//.css('display', 'none');
      }

      hostUIService.showLoader = function(){
        $('.m-loader').show();
      }

      hostUIService.hideLoader = function(){
        $('.m-loader').hide();
      }

      return hostUIService;
    }
    angular
        .module('responsiveBookingEngine')
        .factory('ApphostUIService', hostUIService);
});
