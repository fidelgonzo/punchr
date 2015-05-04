'use strict';

angular.module('app')
    .factory('Password', ['$resource', function ($resource) {
        return $resource('api/account/change_password', {}, {
        });
    }]);
