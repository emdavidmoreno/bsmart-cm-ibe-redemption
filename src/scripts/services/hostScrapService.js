'use strict';

define([], function() {
  function hostScrapService() {
    var hostScrapService = {};
    var LOGIN_NODE_SELECTOR = '#login strong:nth-child(2)';
    var PRIVACY_POLICY_SELECTOR = '#legal .last .customerService';


    hostScrapService.getUserInfo = function() {
      var user;
      var $loginNode = $(LOGIN_NODE_SELECTOR);
      if($loginNode && $loginNode.html()) {
        user = {
          username: '',
          connectMilesNumber: ''
        };
        var value = $loginNode.html();
        value = value.split('&nbsp;');
        user.username = $.trim(value[0]);
        user.connectMilesNumber = $.trim(value[1]);
      }
      return user;
    };

    /**
     * @return {Object}
     *  {Object} Object.langType(en, pt, es)
     *  {String} Object.langType.name
     *  {Boolean} Object.langType.selected
     */
    hostScrapService.getAvailableLanguages = function() {
      let langs = {
         'Português' : 'pt',
         'Español': 'es',
         'English': 'en'
       };

      let avLangs = {};
      $('.languageSelector :not(.delim):not(.wcag-offscreen)')
        .each(function(index, elem) {
          let $el = $(elem);
          if(!$el.is('input')) {
            let text = $el.text().trim()
            let hasWcag = $el.has('.wcag-offscreen')
            if(hasWcag.length) {
              text = text.replace(
                hasWcag.find('.wcag-offscreen').text().trim(),
                '').trim()
            }
            avLangs[langs[text]] = { name: text }
            if( $el.is('span') ) {
              avLangs[langs[text]].selected = true
            }
          }
        });

      return avLangs;
    };

    /**
     * Scrap the necesary menu items, by the moment gonna be hardcoded here
     * @return {[type]} [description]
     */
    hostScrapService.getMenuItems = function() {
      var menuItems = {
          privacyPolicy: {
            link: $(PRIVACY_POLICY_SELECTOR).attr('href'),
            label: $(PRIVACY_POLICY_SELECTOR).text()
          }
      };
      return menuItems;
    };

    hostScrapService.isLoginAvailable = function() {
      return $("#loginLinkFromLoginBlock").length > 0 || $(".linkLogout").length > 0;
    };

    hostScrapService.loginLabel= function() {
      return $("#loginLinkFromLoginBlock").text() || $(".linkLogout").text()
    }

    hostScrapService.openLoginDialog = function(){
      if ($("#loginLinkFromLoginBlock").length > 0) {
        $("#loginLinkFromLoginBlock").click();
      }
      else {
        $(".linkLogout").click();
      }
    };    

    return hostScrapService;
  }

  angular
      .module('responsiveBookingEngine')
      .factory('appHostScrapService', hostScrapService);
});
