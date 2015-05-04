'use strict';

angular.module('app')
    .factory('Sessions', ['$resource', function ($resource) {
        return $resource('api/account/sessions/:series', {}, {
            'getAll': { method: 'GET', isArray: true}
        });
    }]);



