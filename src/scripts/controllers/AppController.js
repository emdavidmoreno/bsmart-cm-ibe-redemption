'use strict';

define([
  'jquery',
  'angular',
  '../services/hostUIService',
  '../services/hostScrapService',
  '../services/hostProxyService',
  'angular-translate',
  'tmhDynamicLocale'
], function($, angular, hostUIService, hostScrapService, hostProxyService) {
  var wrapperInstance = {};
  Bs.jq = $;
  wrapperInstance.init = function(config, actionConfig) {
    wrapperInstance.config = config;
    wrapperInstance.actionConfig = actionConfig;
    wrapperInstance.actionVariables = actionConfig.variables[0];
  };

  wrapperInstance.mockShowSessionExpiration = function() {
    popupManager.__showSessionExpiration = popupManager.showSessionExpiration;
    popupManager.showSessionExpiration = function() {
      var args = [].slice.call(arguments);
      popupManager.__showSessionExpiration.apply(popupManager, args);
      $("#sessionExpirationPopupDialogTitle").parent().remove();
      $("div.dialogFooter").css({'background' : '#0162a9' });
      $("#tbSessionExp").find(".textBody div.textBlock").css({'font-size': '14px'}) 
      $("#sessionExpirationPopupDialog").css({'width': '80vw'});
      if(Bs){
          $(Bs).trigger('expirationpopupready');
       }  
    };

    popupManager.__showSessionInactive = popupManager.showSessionInactive;
    popupManager.showSessionInactive = function() {
      var args = [].slice.call(arguments);
      popupManager.__showSessionInactive.apply(popupManager, args);
      // predefine session dialog width
      $("#sessionInactivePopupDialogTitle").parent().remove();
      $("div.dialogFooter").css({'background' : '#0162a9' });
      $("#tbSessionExp").find(".textBody div.textBlock").css({'font-size': '14px'}); 
      $("#sessionInactivePopupDialog").css({'width': '80vw'});
    };
  };

  wrapperInstance.mockShowSessionExpiration();
  /**
   * Angular Controller
   * @author devs@everymundo.com
   */
  (function() {
    function AppController($scope, $translate, hostUIService, hostScrapService,
      hostProxyService, tmhDynamicLocale) {

      var instance = this;
      var main = {};

      //-------------------------------------------------------
      // starting code
      //-------------------------------------------------------

      instance.init = function() {
        console.log('AppController init');
        hostUIService.bindUI();
      };

      //-------------------------------------------------------
      // binding properties
      //-------------------------------------------------------
      $scope.parentName = 'AppController';
      $scope.showLoading = true;
      $scope.showMiniSummary = false;
      $scope.showMiniSummaryPrice = 1;
      $scope.stepper = {
        steps: [
          { state: 'active' },
          { state: '' },
          { state: '' },
          { state: '' },
          { state: '' },
          { state: '' }
        ],
        goToStep: function(stepIndex) {
          if(stepIndex < 2){
            $scope.showMiniSummaryPrice = 0;
          }
          //The steps before marked as done
          var steps = $scope.stepper.steps;
          for (var i = 0; i < steps.length; i++) {
            if(stepIndex === i) {
              $scope.stepper.steps[i].state = 'active';
            } else if(i < stepIndex ){
              $scope.stepper.steps[i].state = 'done';
            } else{
              break;
            }
          }
        }
      };
      console.log("LLEGO AQUI");
      var model = Farenet2.getResult();
    
      // app manipulation vars

      //-------------------------------------------------------
      // binding functions
      //-------------------------------------------------------
      main = {
        language: wrapperInstance.actionVariables.lang || model.geo.language.lang,
        locale: model.geo.language.site_edition,
        languageOptions: hostScrapService.getAvailableLanguages(),
        onChangeLanguage: function() {
          $translate.use(main.language);
          tmhDynamicLocale.set(main.language);
          // we are use here a copa function
          changeLanguage(main.language, location.href);
        },
        miniSummary: {
          user_input_journey_type: model.user_input_journey_type,
          location: model.geo.location,
          passengers: model.passengers,
          count_passengers:hostUIService.sumPositiveNumbers(model.passengers.user_input_adults, model.passengers.user_input_children, model.passengers.user_input_infants),
          departure: model.departure,
          total_price: model.total_price,
          return: model.return,
        },
        user: hostScrapService.getUserInfo(),
        menuItems: hostScrapService.getMenuItems(),
        isLoginAvailable: hostScrapService.isLoginAvailable(),
        loginLabel: hostScrapService.loginLabel(),
        openLoginDialog: hostScrapService.openLoginDialog,
      };

      $translate.use(main.language);
      // check if the page locales contain co or mx locale if not the language
      // will pass as locale
      var pageLocale = main.locale;
      var containLocales = false;
      [
        'es-co', 'es-mx', 'pt-br', 'en-co', 'en-mx', 'en-br', 'en-ar', 'es-ar'
      ].forEach(function(locale) {
        containLocales = containLocales ?  containLocales : pageLocale.indexOf(locale) !== -1;
      })
      if (!containLocales) {
        pageLocale = main.language
      }

      tmhDynamicLocale.set(pageLocale);

      $scope.main = main;

      // we show the loader before initialize the angular controller
      // so we must to do the data binding manually
      $scope.$watch('showLoading', function(showLoading) {
        if(showLoading){
          hostUIService.showLoader();
        } else {
          hostUIService.hideLoader();
        }
      }, true);

      $scope.showMenu = function(){
        hostUIService.showMenu();
       
      };

      $scope.hideMenu = function(){
        hostUIService.hideMenu();
      };

      $scope.loadDesktopVersionAction = function(){
        var href = location.href;
        if(href.indexOf('#desktop=true') < 0){
          location.href = location.href + '#desktop=true';
        }
        location.reload(true);
      };

      //-------------------------------------------------------
      // Helpers
      //-------------------------------------------------------

      // - model helpers

      // - visual helpers

      //-------------------------------------------------------
      // listeners
      //-------------------------------------------------------
      instance.init();
      return instance;
    }

    AppController.$inject = [
      '$scope',
      '$translate',
      'ApphostUIService',
      'appHostScrapService',
      'hostProxyService',
      'tmhDynamicLocale'
    ];

    angular
        .module('responsiveBookingEngine')
        .controller('AppController', AppController);
  })({});

  return wrapperInstance;
});
