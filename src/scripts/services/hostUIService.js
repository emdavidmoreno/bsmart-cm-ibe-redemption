define([], function () {
  'use strict';
  function hostUIService() {
    var hostUIService = {};

    hostUIService.setupHostUI = function () {
      console.log('hostUIService.setupHostUI');
    };

    hostUIService.appendHTML = function (html) {
      $('.m-book-smart').append(html);
    }

    hostUIService.bindUI = function (html) {
      // $('.m-top-bar i.menu').on('click keypress', function () {
      //   //hostUIService.showMenu();
      // });
      $('.m-sidebar-menu').click(function (event) {
        event.stopPropagation();
      });
      $('.accordion-item-title').click(function (event) {
        var $currentAccordion = $(this).closest('.accordion');

        if ($currentAccordion.hasClass('accordion--expanded')) {
          $currentAccordion.removeClass('accordion--expanded');
        } else {
          $('.accordion.accordion--expanded').removeClass('accordion--expanded');
          $currentAccordion.addClass('accordion--expanded');
        }

      });
    }

    hostUIService.showMenu = function () {
      $('.m-sidebar-menu').css('left', 0);
      $('.m-sidebar-menu-wrapper').show(200);//css('display', 'block');
      $('.m-sidebar-menu-wrapper').one('click', function () {
        hostUIService.hideMenu();
      });
    }

    hostUIService.hideMenu = function () {
      $('.m-sidebar-menu').css('left', '-100%');
      $('.m-sidebar-menu-wrapper').hide();//.css('display', 'none');
    }

    hostUIService.isMenuShowed = function(){
      return this.isMenuShowed;
    }

    hostUIService.showLoader = function () {
      $('.m-loader').show();
    }

    hostUIService.hideLoader = function () {
      $('.m-loader').hide();
    }


    hostUIService.sumPositiveNumbers = function () {
      var sum = 0;
      for (var i = 0; i < arguments.length; i++) {
        if (arguments[i] != -1)
          sum += arguments[i];
      }
      return sum;
    }

    hostUIService.scrollToTop = function () {
     scrollTo(0, 0);

    }

    hostUIService.hideCopaSideAd = function () {
      if($(".QSISlider").length)
         $(".QSISlider").remove();
       
    }


    return hostUIService;
  }
  angular
    .module('responsiveBookingEngine')
    .factory('ApphostUIService', hostUIService);
});
