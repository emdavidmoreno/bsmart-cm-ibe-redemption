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
      var langs = {
         'Português' : 'pt',
         'Español': 'es',
         'English': 'en'
       };

      var avLangs = {};
      $('.languageSelector :not(.delim)').each(function(index, elem) {
        var $el = $(elem);
        var text = $el.text().trim();
        avLangs[langs[text]] = { name: text };
        if( $el.is('span') ) {
          avLangs[langs[text]].selected = true;
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


    return hostScrapService;
  }

  angular
      .module('responsiveBookingEngine')
      .factory('appHostScrapService', hostScrapService);
});
