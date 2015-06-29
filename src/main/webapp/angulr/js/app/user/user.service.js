'use strict';

angular.module('app')
    .factory('User', function ($resource) {
        return $resource('api/accounts', {}, {
            'query': { method: 'GET', isArray: true},
            'get': {
                method: 'GET',
                transformResponse: function (data) {
                    data = angular.fromJson(data);
                    data.date = new Date(data.date);
                    data.created = new Date(data.created);
                    return data;
                }
            },
            'update': { method:'POST' },
            'delete': { method:'DELETE', params: {login: '@login'}}
        });
    });
