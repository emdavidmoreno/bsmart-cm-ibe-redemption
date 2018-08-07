define([], function() {
  'use strict';

  var instance = {};
  var config = {
    // describe the element which gonna contain the module
    insertNodeCommand: {
      selector: 'body',
      command: 'appendTo',
      template: ''
    },
    stylesFilesPath: [
    '//@@HOST/app/modules/copa-responsive-booking/styles/@@FILE_PATH--app--css/modules/bsmart-cm-ibe-redemption/styles/index.css'
    ]
  };
  instance.getConfig = function() {
    return config;
  };
  return instance;
});
