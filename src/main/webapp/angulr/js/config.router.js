'use strict';

/**
 * Config for the router
 */
 angular.module('app')
 .run(
  [          '$rootScope', '$state', '$stateParams', 'Auth', 'Principal',
  function (  $rootScope,   $state,   $stateParams,   Auth,   Principal) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;        

          // Check Auth
          if (Principal.isIdentityResolved()) {
            Auth.authorize();
          }
        }
  ])
 .config(
  [          '$stateProvider', '$urlRouterProvider', 'JQ_CONFIG', '$httpProvider',
  function (  $stateProvider,   $urlRouterProvider,   JQ_CONFIG,   $httpProvider) {

        //enable CSRF
        $httpProvider.defaults.xsrfCookieName = 'CSRF-TOKEN';
        $httpProvider.defaults.xsrfHeaderName = 'X-CSRF-TOKEN';

        var rootUrl = "angulr/";

        //Intercept URLs only API calls
        $httpProvider.interceptors.push(function ($q) {
         return {
           'request': function (config) {

            if(config.url.substring(0,3)== "api"){
              var now = new Date();
              // config.url = "http://localhost:8080/"+config.url+"?cacheBuster="+now.getTime();
              config.url = config.url+"?cacheBuster="+now.getTime();
              config.xsrfCookieName = 'CSRF-TOKEN';
              config.xsrfHeaderName = 'X-CSRF-TOKEN';
            }
            return config || $q.when(config);
          }
        }
      });

      $urlRouterProvider
        .otherwise('/apps/sheet');
      $stateProvider       

              // LOGIN STUFF
              .state('access', {
                url: '/access',
                template: '<div ui-view class="fade-in-right-big smooth"></div>'
              })
              .state('access.signin', {
                url: '/signin',
                templateUrl: rootUrl+'templates/page_signin.html',
                resolve: {
                  deps: ['uiLoad',
                  function( uiLoad ){
                    return uiLoad.load( [rootUrl+'js/controllers/signin.js'] );
                  }]
                }
              })
              .state('access.signup', {
                url: '/signup',
                templateUrl: rootUrl+'templates/page_signup.html',
                resolve: {
                  deps: ['uiLoad',
                  function( uiLoad ){
                    return uiLoad.load( [rootUrl+'js/controllers/signup.js'] );
                  }]
                }
              })

              //work sheet
              .state('apps', {
                abstract: true,
                url: '/apps',
                controller: 'MainController',
                templateUrl: rootUrl+'templates/layout.html',
                resolve:{
                    authorize: ['Auth',
                      function (Auth) {
                        return Auth.authorize();
                      }
                    ]
                }
              })
              .state('apps.sheet', {
                url: '/sheet',
                templateUrl: rootUrl+'templates/apps_note.html',
                resolve: {
                  deps: ['uiLoad',
                  function( uiLoad ){
                    return uiLoad.load( [
                      rootUrl+'js/app/note/note.js', 
                      rootUrl+'js/app/note/timesheet.service.js',
                      rootUrl+'js/filters/sumDurationFilter.js',
                      rootUrl+'js/filters/dateRangeFilter.js',
                     JQ_CONFIG.moment] );
                  }]
                }
              })    
              .state('apps.settings', {
                url: '/settings',
                templateUrl: rootUrl+'js/components/settings/settings.html',
                controller: 'SettingsController',
                resolve: {
                  deps: ['uiLoad',
                  function( uiLoad ){
                    return uiLoad.load( [rootUrl+'js/components/settings/settings.controller.js',
                     JQ_CONFIG.moment] );
                  }]
                }
              });
            }
          ]
        );
