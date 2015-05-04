'use strict';

angular.module('app')
    .factory('Activate', ['$resource', function ($resource) {
        return $resource('api/activate', {}, {
            'get': { method: 'GET', params: {}, isArray: false}
        });
    }]);


