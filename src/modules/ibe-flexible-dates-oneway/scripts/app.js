define([
  'jquery',
  'angular',
  './controllers/FlexibleDatesOneWayController',
], function($, angular, FlexibleDatesOneWayController) {
  let instance = {}

  instance.init = function(config, actionConfig) {
    instance.config = config
    instance.actionConfig = actionConfig
    // Init Controller
    FlexibleDatesOneWayController.init(config, actionConfig)

    // Insert controller
    executeInsertNodeCommand(config.insertNodeCommand, {})
  }

  /**
   * TODO: We must move this function to other service
   *
   * @param {Object} insertNodeCommand
   * @param {Object} data
   */
  function executeInsertNodeCommand(insertNodeCommand, data) {
    let template = insertNodeCommand.template
    let selector = insertNodeCommand.selector
    let command = insertNodeCommand.command
    $(template)[command](selector)
  }

  return instance
})
