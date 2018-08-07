/*global require*/
define([], function() {
  var instance = {};
  var config = {
    // describe the element which gonna contain the module
    insertNodeCommand: {
      selector: 'body',
      command: 'appendTo',
      template: @@bsmart-cm-ibe-redemption-ibe-payment__template
    },
    stylesFilesPath: [
    '//@@HOST/app/modules/bsmart-cm-ibe-redemption/modules/' +
      'ibe-payment/styles/@@FILE_PATH--app--css/modules/bsmart-cm-ibe-redemption/modules/ibe-payment/styles/index.css',
    ]
  };
  instance.getConfig = function() {
    return config;
  };
  return instance;
});
