'use strict';

describe('Controllers Tests', function () {

    beforeEach(module('app'));

    var $scope, $httpBackend, q, Auth;

    // define the mock Auth service
    beforeEach(function() {
        Auth = {
            changePassword: function() {}
        };
    });

    beforeEach(inject(function ($rootScope, $controller, $q, $injector) {
        $scope = $rootScope.$new();
        q = $q;
        $httpBackend = $injector.get('$httpBackend');
        $controller('SignupFormController', {$scope: $scope, Auth: Auth});
    }));

    describe('SignupFormController', function () {
        it('should show error if passwords do not match', function () {
            //GIVEN
            $scope.password = 'password1';
            $scope.confirmPassword = 'password2';
            //WHEN
            $scope.register();
            //THEN
            expect($scope.doNotMatch).toBe('ERROR');
        });       
    });
});
