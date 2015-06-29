'use strict';

angular.module('app')
    .controller('MainController', function ($scope, Principal) {
        Principal.identity().then(function(account) {
            $scope.account = account;
            $scope.isAuthenticated = Principal.isAuthenticated;
            $scope.account.isAdmin = Principal.isInRole("ROLE_ADMIN");
            $scope.account.isManager = Principal.isInRole("ROLE_MANAGER");
        });

    });
