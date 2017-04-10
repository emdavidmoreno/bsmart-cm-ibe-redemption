'use strict'

// add new properties to the angular configuration
require.config({
  context: 'bs1.0.0',
  paths: {
    'angular': './lib/angular/angular.min',
    'jquery': './lib/jquery/jquery.min',
    'lodash': './lib/lodash/lodash.min',
    'angular-translate': './lib/angular/angular-translate.min',
    'tmhDynamicLocale': './lib/angular/tmhDynamicLocale.min',
    'loadModuleService': './_core/services/loadModuleService',
    'statsService': './_core/services/statsService',
  },
  shim: {
    'angular': {
      exports: 'angular',
    },
    'jquery': {
      exports: '$jq',
    },
    'lodash': {
      exports: '_',
    },
    'angular-translate': ['angular'],
    'tmhDynamicLocale': ['angular'],
  },
})

/* global require*/
define([
  'require',
  'angular',
  './config',
  'loadModuleService',
  './helpers/angular-config',
  'angular-translate',
  'tmhDynamicLocale',
  'statsService',
], function(require, angular, Config, loadModuleService, angularConfig,
  translateHelper, dinamicLocaleHelper, statsService) {
  let instance = {}
  console.log('cargo el inits')

  instance.init = function(actionConfig) {
    // -----------------------------------------------------------
    // Load the AppController here
    // -----------------------------------------------------------

    // Loading the main angular module
    // TODO: Move the translations to other places
    angular.module('responsiveBookingEngine',
      ['pascalprecht.translate', 'tmh.dynamicLocale'])
      .config(angularConfig)

    require(['./app'], function(App) {
      // load main app
      App.init(Config.getConfig(), actionConfig)

      // conditional loading of submodules
      actionConfig.mainFilePath =
        getSubmodulePathByUrl(actionConfig.variables[0].url, actionConfig)

      // if there are not modules just stop loading this action
      if (actionConfig.mainFilePath) {
        // load submodule
        loadModuleService.loadModule(
          actionConfig, {}, function(moduleInstance, ruleConfig) {
            // TODO: Initialize sub-modules here
            moduleInstance.init(ruleConfig)
            let contextData = Farenet2.getResult() || {}
            statsService.ruleTriggered(contextData, ruleConfig)
          }, 1)
      }
    })
  }
  /**
   * getSubmodulePathByUrl
   *
   * @param {String} url
   * @param {Object} actionConfig
   * @return {Object}
   */
  function getSubmodulePathByUrl(url, actionConfig) {
    let modulePath = ''
    let subModulePath

    url = getUrl(url)

    // TODO: We must find a nice way to do this

    if (url === '/CMGS/AirSearchExternalForward.do' ||
      url === '/CMGS/ApplicationStartAction.do') {
      // ibe-external-booking-mask

      subModulePath = 'modules/ibe-external-booking-mask/'
    } else if (url === '/CMGS/AirFareFamiliesForward.do' ||
      url === '/CMGS/AirAvailabilitySearchForward.do' ||
      url === '/CMGS/AirLowFareSearchExternal.do' ||
      url === '/CMGS/AirFareFamiliesFlexibleForward.do') {
      // ibe-search-result

      subModulePath = 'modules/ibe-search-result/'
    } else if (url === '/CMGS/ItinerarySummary.do') {
      // ibe-itinerary-summary

      subModulePath = 'modules/ibe-itinerary-summary/'
    } else if (url === '/CMGS/TravelersDetailsForwardAction.do') {
      // ibe-passenger-information

      subModulePath = 'modules/ibe-passenger-information/'
    } else if (url === '/CMGS/PaymentForward.do') {
      // ibe-payment-confirmation

      subModulePath = 'modules/ibe-payment/'
    } else if (url === '/CMGS/ConfirmationForward.do') {
      // ibe-confirmation-hold

      subModulePath = 'modules/ibe-confirmation-hold/'
    } else if(url === '/CMGS/AirFullFareForward.do') {
      subModulePath = 'modules/ibe-flexible-dates/'
    }


    return modulePath + subModulePath
  }

  /**
   * Used to get a formated url part
   * Return a formated url without the protocol or query part
   * @author devs@everymundo.com
   * @param  {string} url Url to parse
   * @return {string}     Url return
   */
  function getUrl(url) {
    // We are NOT using the Rexg aproach, just window.location.pathname
    let regex = /https?:\/\/(.*?)(\?|$)/im
    // eslint-disable-next-line
    regex = /^((http[s]?|ftp):\/)?\/?([^:\/\s]+)((\/\w+)*\/)([\w\-\.]+[^#?\s]+)(.*)?(#[\w\-]+)?$/

    let match = regex.exec(url)
    let matchedText
    if (match !== null) {
      // matchedText = match[6];
    } else {
      matchedText = ''
    }

    // TODO: we need to go back to the Regex again
    matchedText = window.location.pathname
    return matchedText
  }

  return instance
})
