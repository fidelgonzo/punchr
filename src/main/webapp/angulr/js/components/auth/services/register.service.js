'use strict';

angular.module('app')
    .factory('Register', ['$resource', function ($resource) {
        return $resource('api/register', {}, {
        });
    }]);


