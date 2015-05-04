'use strict';

/* Controllers */
  // signin controller
app.controller('SigninFormController', ['$scope','$rootScope', '$http', '$state','Auth', function($scope, $rootScope, $http, $state, Auth) {
    $scope.user = {};
    $scope.authError = null;
    $scope.login = function() {
      Auth.login({
                username: $scope.user.email,
                password: $scope.user.password,
                rememberMe: $scope.rememberMe
            }).then(function () {
                $scope.authenticationError = false;
                if ($rootScope.previousStateName === 'register') {
                    
                } else {
                    // $rootScope.back();
                }
                $state.go('apps.sheet');
            }).catch(function () {
                $scope.authenticationError = true;
                $scope.authError = 'Wrong user/pass';
            });    
    };
  }]
);