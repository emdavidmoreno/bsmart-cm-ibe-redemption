module.exports = {
    getRequireConfig: function () {
        return {
            options: {
                baseUrl: '<%= package.directories.deploy %>/app/modules/bsmart-cm-ibe',
                paths: {
                    jquery: 'empty:',
                    angular: 'empty:',
                    lodash: './lib/lodash/lodash.min',
                    contextDataService: 'empty:',
                    loadModuleService: 'empty:',
                    compatibilityService: 'empty:',
                    statsService: 'empty:',
                    assetsLoaderService: 'empty:',
                    booksmartService: 'empty:',
                    ruleService: 'empty:',
                    'angular-translate': './lib/angular/angular-translate.min',
                    tmhDynamicLocale: './lib/angular/tmhDynamicLocale.min'
                },
                optimize: 'uglify2',
                uglify2: {
                    drop_console: true,
                    compress: {
                        drop_console: true
                    }
                },
                shim: {},
                include: [
                    './modules/ibe-passenger-information/scripts/init',
                    './modules/ibe-passenger-information/scripts/app'
                ],
                out: '<%= package.directories.deploy %>/app/modules/bsmart-cm-ibe/modules/ibe-passenger-information/module.dist.js',
                error: function (done, err) {
                    console.log(err);
                    done();
                }
            }
        }
    }
}
