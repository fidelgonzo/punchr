'use strict';

angular.module('app')
    .factory('Timesheet', function ($resource) {
        return $resource('api/timesheets/:id', {}, {
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
            'update': { method:'PUT' }
        });
    });
