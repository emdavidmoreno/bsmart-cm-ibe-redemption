define([
  'jquery',
  'angular',
  './controllers/AppController',
], function($jq, angular, AppController) {
  var instance = {};
  // $jq.noConflict( true );

  instance.init = function(config, actionConfig) {
    instance.config = config;
    instance.actionConfig = actionConfig;
    // Init Controller

    showLoader();

    // INFO: We don't gonna do this here because
    // we are doing it at the bs level for user to show it as
    // quickly as posible

    // setupViewPort();
    AppController.init(config, actionConfig);
  };

  function showLoader(){
    if(!$jq('.m-loader').length){
      $jq('body').append('<div class="m-loader"><div class="icon--image"></div></div>');
    }
  }

  // TODO: We must move this function to other service
  function executeInsertNodeCommand(insertNodeCommand, data) {
    var template = insertNodeCommand.template;
    var selector = insertNodeCommand.selector;
    var command = insertNodeCommand.command;
    $jq(template)[command](selector);
  }

  return instance;
});
