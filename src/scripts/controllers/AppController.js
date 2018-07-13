'use strict'

define([
  'jquery',
  'angular',
  '../services/hostUIService',
  '../services/hostScrapService',
  '../services/hostProxyService',
  'angular-translate',
  'tmhDynamicLocale',
], function($, angular, hostUIService, hostScrapService, hostProxyService) {
  let wrapperInstance = {}
  Bs.jq = $
  wrapperInstance.init = function(config, actionConfig) {
    wrapperInstance.config = config
    wrapperInstance.actionConfig = actionConfig
    wrapperInstance.actionVariables = actionConfig.variables[0]
  }

  wrapperInstance.mockShowSessionExpiration = function() {
    popupManager.__showSessionExpiration = popupManager.showSessionExpiration
    popupManager.showSessionExpiration = function() {
      let args = [].slice.call(arguments)
      popupManager.__showSessionExpiration(...args)
      $('#sessionExpirationPopupDialogTitle').parent().remove()
      $('div.dialogFooter').css({'background': '#0162a9'})
      $('#tbSessionExp').find('.textBody div.textBlock').css({'font-size': '14px'})
      $('#sessionExpirationPopupDialog').css({'width': '80vw'})
      if (Bs) {
        $(Bs).trigger('expirationpopupready')
      }
    }

    popupManager.__showSessionInactive = popupManager.showSessionInactive
    popupManager.showSessionInactive = function() {
      let args = [].slice.call(arguments)
      popupManager.__showSessionInactive(...args)
      // predefine session dialog width
      $('#sessionInactivePopupDialogTitle').parent().remove()
      $('div.dialogFooter').css({'background': '#0162a9'})
      $('#tbSessionExp').find('.textBody div.textBlock').css({'font-size': '14px'})
      $('#sessionInactivePopupDialog').css({'width': '80vw'})
    }
  }

  wrapperInstance.mockShowSessionExpiration();
  /**
   * Angular Controller
   * @author devs@everymundo.com
   */
  (function() {
    /**
     *
     * @param {Object} $scope
     * @param {Object} $translate
     * @param {Object} hostUIService
     * @param {Object} hostScrapService
     * @param {Object} hostProxyService
     * @param {Object} tmhDynamicLocale
     *
     * @return {Object}
     */
    function AppController($scope, $translate, hostUIService, hostScrapService,
      hostProxyService, tmhDynamicLocale) {
      let instance = this
      let main = {}

      // -------------------------------------------------------
      // starting code TEST TAG
      // -------------------------------------------------------

      instance.init = function() {
        console.log('AppController init')
        hostUIService.bindUI()
        hostUIService.scrollToTop()
        hostUIService.hideCopaSideAd()
      }

      // This solution is temporal, the best choice is set Babel to support Object entries method and Object values method.
      if (!Object.entries) {
        Object.entries = (x) =>
          Object.keys(x).reduce((y, z) =>
            y.push([z, x[z]]) && y, [])
      }

      if (!Object.values) {
        Object.values = (x) =>
          Object.keys(x).reduce((y, z) =>
            y.push(x[z]) && y, [])
      }

      if (!Object.assign) {
        Object.defineProperty(Object, 'assign', {
          enumerable: false,
          configurable: true,
          writable: true,
          value: function(target) {
            'use strict'
            if (target === undefined || target === null) {
              throw new TypeError('Cannot convert first argument to object')
            }

            let to = Object(target)
            for (let i = 1; i < arguments.length; i++) {
              let nextSource = arguments[i]
              if (nextSource === undefined || nextSource === null) {
                continue
              }
              nextSource = Object(nextSource)

              let keysArray = Object.keys(nextSource)
              for (let nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex++) {
                let nextKey = keysArray[nextIndex]
                let desc = Object.getOwnPropertyDescriptor(nextSource, nextKey)
                if (desc !== undefined && desc.enumerable) {
                  to[nextKey] = nextSource[nextKey]
                }
              }
            }
            return to
          },
        })
      }

      // -------------------------------------------------------
      // binding properties
      // -------------------------------------------------------
      $scope.parentName = 'AppController'
      $scope.showLoading = true
      $scope.showMiniSummary = false
      $scope.showMiniSummaryPrice = 1
      $scope.stepper = {
        steps: [
          {state: 'active'},
          {state: ''},
          {state: ''},
          {state: ''},
          {state: ''},
          {state: ''},
        ],
        goToStep: function(stepIndex) {
          if (stepIndex < 2) {
            $scope.showMiniSummaryPrice = 0
          }
          // The steps before marked as done
          let steps = $scope.stepper.steps
          for (let i = 0; i < steps.length; i++) {
            if (stepIndex === i) {
              $scope.stepper.steps[i].state = 'active'
            } else if (i < stepIndex) {
              $scope.stepper.steps[i].state = 'done'
            } else {
              break
            }
          }
        },
      }

      let model = Farenet2.getResult()

      $scope.isMenuShowed = ()=> hostUIService.isMenuShowed()


      // app manipulation vars

      // -------------------------------------------------------
      // binding functions
      // -------------------------------------------------------
      main = {
        language:
          wrapperInstance.actionVariables.lang || model.geo.language.lang,
        locale: model.geo.language.site_edition,
        logoAltText: hostScrapService.getLogoAltText().trim(),
        languageOptions: hostScrapService.getAvailableLanguages(),
        onChangeLanguage: function() {
          $translate.use(main.language)
          tmhDynamicLocale.set(main.language)
          // we are use here a copa function
          changeLanguage(main.language, location.href) // eslint-disable-line
        },
        miniSummary: {
          user_input_journey_type: model.user_input_journey_type,
          location: model.geo.location,
          passengers: model.passengers,
          departure: model.departure,
          total_price: model.total_price,
          return: model.return,
        },
        user: hostScrapService.getUserInfo(),
        menuItems: hostScrapService.getMenuItems(),
        isLoginAvailable: hostScrapService.isLoginAvailable(),
        loginLabel: hostScrapService.loginLabel(),
        openLoginDialog: hostScrapService.openLoginDialog,
        isMenuOpen: false,
        toggleSideMenu: function() {
          main.isMenuOpen = !main.isMenuOpen
          main.isMenuOpen ? hostUIService.showMenu() : hostUIService.hideMenu()
        },
        isMenuShowed: function() {
          return main.isMenuOpen
        },
      }

      $translate.use(main.language)
      // check if the page locales contain co or mx locale if not the language
      // will pass as locale
      let pageLocale = main.locale
      let containLocales = false;
      [
        'es-co', 'es-mx', 'pt-br', 'en-co', 'en-mx', 'en-br', 'en-ar', 'es-ar',
      ].forEach(function(locale) {
        containLocales =
          containLocales ? containLocales : pageLocale.indexOf(locale) !== -1
      })
      if (!containLocales) {
        pageLocale = main.language
      }

      tmhDynamicLocale.set(pageLocale)

      $scope.main = main

      // we show the loader before initialize the angular controller
      // so we must to do the data binding manually
      $scope.$watch('showLoading', function(showLoading) {
        if (showLoading) {
          hostUIService.showLoader()
        } else {
          hostUIService.hideLoader()
        }
      }, true)

      $scope.showMenu = function() {
        hostUIService.showMenu()
      }

      $scope.hideMenu = function() {
        hostUIService.hideMenu()
      }

      $scope.loadDesktopVersionAction = function() {
        let href = location.href
        if (href.indexOf('#desktop=true') < 0) {
          location.href = location.href + '#desktop=true'
        }
        location.reload(true)
      }

      // -------------------------------------------------------
      // Helpers
      // -------------------------------------------------------

      // - model helpers

      // - visual helpers

      // -------------------------------------------------------
      // listeners
      // -------------------------------------------------------
      instance.init()
      return instance
    }

    AppController.$inject = [
      '$scope',
      '$translate',
      'ApphostUIService',
      'appHostScrapService',
      'hostProxyService',
      'tmhDynamicLocale',
    ]

    angular
      .module('responsiveBookingEngine')
      .controller('AppController', AppController)
  })({})

  return wrapperInstance
})
