define([], function () {
  'use strict';
  function hostUIService() {
    var hostUIService = {};

    const requestAnimationFrame = (() => {
      let prefix = ['ms', 'moz', 'webkit', 'o']
      for (let i = 0, limit = prefix.length; i < limit && !window.requestAnimationFrame; ++i) {
        window.requestAnimationFrame = window[prefix[i] + 'RequestAnimationFrame']
      }

      if (!window.requestAnimationFrame) {
        let lastTime = 0

        window.requestAnimationFrame = (callback) => {
          const now = new Date().getTime()
          const ttc = Math.max(0, 16 - now - lastTime)
          const timer = window.setTimeout(() => callback(now + ttc), ttc)

          lastTime = now + ttc

          return timer
        }
      }

      return window.requestAnimationFrame.bind(window)
    })()

    const cancelAnimationFrame = (() => {
      let prefix = ['ms', 'moz', 'webkit', 'o']
      for (let i = 0, limit = prefix.length; i < limit && !window.cancelAnimationFrame; ++i) {
        window.cancelAnimationFrame =
          window[prefix[i] + 'CancelAnimationFrame'] || window[prefix[i] + 'CancelRequestAnimationFrame']
      }

      if (!window.cancelAnimationFrame) {
        window.cancelAnimationFrame = (timer) => {
          window.clearTimeout(timer)
        }
      }

      return window.cancelAnimationFrame.bind(window)
    })()

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


    hostUIService.waitingWhile = function(condition) {
      let req
      let dfd = $.Deferred()
      let that = window
      /**
       * step
       */
      function step() {
        let c = condition()
        if (c) {
            console.log('buscando a nemo', condition)
            req = window.requestAnimationFrame(step.bind(that, condition))          
        } else {
          cancelAnimationFrame(req)
          dfd.resolve()
        }
      }
      step()
      return dfd.promise()
    }

    hostUIService.interceptAjaxCalls = function(urlContaining, interceptorFunc){

      // checking params. Then can't be null or undefined
      if(!urlContaining || typeof urlContaining == 'undefined')
        return ;
      if(!interceptorFunc || typeof interceptorFunc == 'undefined')
        return ;  

      //saving original open function
      var open = window.XMLHttpRequest.prototype.open;
      //initialiting responses array
      window.__responses = [];
      //assing new open function with interceptor
      window.XMLHttpRequest.prototype.open = function (method, url, async, user, pass) {
          this.addEventListener("readystatechange", function() {
            
            //Request contains "urlContaining" and is ready
            if (this.readyState === 4 && url.indexOf(urlContaining) > -1) {

              // add response to the array of responses
              window.__responses.push({
                responseText: this.responseText,
                readyState: this.readyState,
                url: url,
                method: method
              });

              //call the interceptor function 
              interceptorFunc.call(arguments)

            }
          }, false);
        open.apply(this, arguments);
      };     
    }


    return hostUIService;
  }
  angular
    .module('responsiveBookingEngine')
    .factory('ApphostUIService', hostUIService);
});
