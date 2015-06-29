'use strict';

// signup controller
app.controller('SignupFormController', ['$scope', '$http', '$state', '$timeout', 'Auth', 
    function(                           $scope,   $http,    $state,   $timeout,   Auth) {
    $scope.success = null;
    $scope.error = null;
    $scope.doNotMatch = null;
    $scope.errorUserExists = null;
    $scope.registerAccount = {};
    $timeout(function (){angular.element('[ng-model="user.name"]').focus();});

    $scope.register = function () {
            if ($scope.registerAccount.password !== $scope.confirmPassword) {
                $scope.doNotMatch = 'ERROR';
            } else {
                $scope.registerAccount.langKey = 'en';
                $scope.doNotMatch = null;
                $scope.error = null;
                $scope.errorUserExists = null;
                $scope.errorEmailExists = null;
                $scope.registerAccount.login = $scope.registerAccount.login.toLowerCase();

                Auth.createAccount($scope.registerAccount).then(function () {
                    $scope.success = 'OK';
                    $state.go('apps.sheet');
                }).catch(function (response) {
                    $scope.success = null;
                    if (response.status === 400 && response.data === 'login already in use') {
                        $scope.errorUserExists = 'ERROR';
                        $scope.authError = response.data;
                    } else if (response.status === 400 && response.data === 'e-mail address already in use') {
                        $scope.errorEmailExists = 'ERROR';
                        $scope.authError = response.data;
                    } else if (response.status === 406 ) {
                        $scope.errorEmailExists = 'ERROR';
                        $scope.authError = response.data;
                    } else {
                        $scope.error = 'ERROR';
                        $scope.authError = "Error: "+response.data;
                    }
                });
            }
        };

  }])
 ;