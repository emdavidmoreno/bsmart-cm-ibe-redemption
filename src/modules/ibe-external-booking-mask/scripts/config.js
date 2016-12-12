/*global require*/
define([], function() {
  var instance = {};
  var config = {
    // describe the element which gonna contain the module
    insertNodeCommand: {
      selector: 'body',
      command: 'appendTo',
      template: @@bsmart-cm-ibe-ibe-external-booking-mask__template,
    },
    stylesFilesPath: [
    '//@@HOST/app/modules/bsmart-cm-ibe/modules/' +
      'ibe-external-booking-mask/styles/@@FILE_PATH--app--css/modules/bsmart-cm-ibe/modules/ibe-external-booking-mask/styles/index.css'
    ]
  };
  instance.getConfig = function() {
    return config;
  };
  return instance;
});
