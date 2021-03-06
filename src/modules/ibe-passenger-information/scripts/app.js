'use strict';

define([
  'jquery',
  'angular',
  'lodash',
  './controllers/PassengerInformationController',
], function($, angular, _, PassengerInformationController) {
  var instance = {};

  instance.init = function(config, actionConfig) {
    instance.config = config;
    instance.actionConfig = actionConfig;
    // Init Controller
    PassengerInformationController.init(config, actionConfig);

    // Insert controller
    executeInsertNodeCommand(config.insertNodeCommand, {});
  };

  // TODO: We must move this function to other service
  function executeInsertNodeCommand(insertNodeCommand, data) {
    var template = insertNodeCommand.template;
    var selector = insertNodeCommand.selector;
    var command = insertNodeCommand.command;
    $(template)[command](selector);
  }

  return instance;
});
