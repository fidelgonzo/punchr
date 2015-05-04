'use strict';

angular.module('app')
    .factory('Account', function Account($resource) {
        return $resource('api/account', {}, {
            'get': { method: 'GET', params: {}, isArray: false,
                interceptor: {
                    response: function(response) {
                        // expose response
                        return response;
                    }
                }
            }
        });
    });

angular.module('app')
    .factory('Activate', function ($resource) {
        return $resource('api/activate', {}, {
            'get': { method: 'GET', params: {}, isArray: false}
        });
    });





angular.module('app')
    .factory('Password', function ($resource) {
        return $resource('api/account/change_password', {}, {
        });
    });


angular.module('app')
    .factory('Register', function ($resource) {
        return $resource('api/register', {}, {
        });
    });





angular.module('app')
    .factory('Sessions', function ($resource) {
        return $resource('api/account/sessions/:series', {}, {
            'getAll': { method: 'GET', isArray: true}
        });
    });



