/*global require*/
define([], function() {
  var instance = {};
  var config = {
    // describe the element which gonna contain the module
    insertNodeCommand: {
      selector: 'body',
      command: 'appendTo',
      template: @@bsmart-cm-ibe-redemption-ibe-search-result__template
    },
    stylesFilesPath: [
    '//@@HOST/app/modules/bsmart-cm-ibe-redemption/modules/' +
      'ibe-search-result/styles/@@FILE_PATH--app--css/modules/bsmart-cm-ibe-redemption/modules/ibe-search-result/styles/index.css',
    ]
  };
  instance.getConfig = function() {
    return config;
  };
  return instance;
});
