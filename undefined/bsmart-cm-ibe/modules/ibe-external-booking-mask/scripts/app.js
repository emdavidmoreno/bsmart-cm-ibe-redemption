define([
  'jquery',
  'angular',
  './controllers/ExternalBookingController',
], function($jq, angular, ExternalBookingController) {
  var instance = {};

  instance.init = function(config, actionConfig) {
    instance.config = config;
    instance.actionConfig = actionConfig;

    // taking the data

    // procces it


    // init the UI


    // Init Controller
    ExternalBookingController.init(config, actionConfig);

    // Insert the node
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
