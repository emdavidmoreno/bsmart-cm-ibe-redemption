define([
  'jquery',
  'angular',
  './controllers/ConfirmationHoldController',
], function($, angular, ConfirmationHoldController) {
  var instance = {};

  instance.init = function(config, actionConfig) {
    instance.config = config;
    instance.actionConfig = actionConfig;
    // Init Controller
    ConfirmationHoldController.init(config, actionConfig);

    // Insert controller
    executeInsertNodeCommand(config.insertNodeCommand, {});
  };

  function setupViewPort() {
  }

  function setupHostUI(){
  }

  // TODO: We must move this function to other service
  function executeInsertNodeCommand(insertNodeCommand, data) {
    var template = insertNodeCommand.template;
    var selector = insertNodeCommand.selector;
    var command = insertNodeCommand.command;
    $(template)[command](selector);
  }

  return instance;
});
