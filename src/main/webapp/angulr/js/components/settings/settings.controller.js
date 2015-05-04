'use strict';

angular.module('app')
    .controller('SettingsController', function ($scope, Principal, Auth) {
        $scope.success = null;
        $scope.error = null;
        Principal.identity().then(function(account) {
            $scope.settingsAccount = account;

            if($scope.settingsAccount.preferredFrom == null){
                var d = new Date();
                d.setHours( 9 );
                d.setMinutes( 0 );
                $scope.settingsAccount.preferredFrom = d;
                var d2 = new Date();
                d2.setHours( 17 );
                d2.setMinutes( 0 );                 
                $scope.settingsAccount.preferredTo = d2;
            }
        });

        $scope.save = function () {
            Auth.updateAccount($scope.settingsAccount).then(function() {
                $scope.error = null;
                $scope.success = 'OK';
                Principal.identity().then(function(account) {
                    $scope.settingsAccount = account;
                });
            }).catch(function() {
                $scope.success = null;
                $scope.error = 'ERROR';
            });
        };
    });
