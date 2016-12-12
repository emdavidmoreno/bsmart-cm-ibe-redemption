define([
  'jquery',
  'angular',
  './controllers/PaymentController',
], function($, angular, PaymentController) {
  var instance = {};
  $.noConflict( true );
  instance.init = function(config, actionConfig) {
    instance.config = config;
    instance.actionConfig = actionConfig;
    // Init Controller
    PaymentController.init(config, actionConfig);

    setupHostUI();
    // Insert controller
    executeInsertNodeCommand(config.insertNodeCommand, {});
  };

  function setupViewPort() {
  }

  function setupHostUI(){
    $('#popupShimOuter').css('display', 'none');
    $('#reviewItineraryPopupLoadedContentOuter').css('display', 'none');
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
