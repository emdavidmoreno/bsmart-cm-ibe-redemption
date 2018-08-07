module.exports = {
    getRequireConfig: function () {
        return {
                options: {
                    baseUrl: '<%= package.directories.deploy %>/app/modules/bsmart-cm-ibe-redemption',
                    paths: {
                        jquery: 'empty:',
                        angular: './lib/angular/angular.min',
                        lodash: './lib/lodash/lodash.min',
                        contextDataService: 'empty:',
                        compatibilityService: 'empty:',
                        loadModuleService: 'empty:',
                        assetsLoaderService: 'empty:',
                        statsService: 'empty:',
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
                    shim: {
                        angular: {
                            exports: 'angular'
                        },
                        'angular-translate': ['angular'],
                        tmhDynamicLocale: ['angular']
                    },
                    include: [
                        'angular',
                        './scripts/config',
                        './scripts/init',
                        './scripts/app'
                    ],
                    out: '<%= package.directories.deploy %>/app/modules/bsmart-cm-ibe-redemption/module.dist.js',
                    error: function (done, err) {
                        console.log(err);
                        done();
                    }
                }
            }
    }
}