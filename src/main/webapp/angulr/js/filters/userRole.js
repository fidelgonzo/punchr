'use strict';

angular.module('app').filter('userRole', function(){
	return function(input) {
    	var roles;
    	angular.forEach(input, function(obj){    		
    		if(obj == "ROLE_USER"){
    			roles.ROLE_USER = true;
    		}else if(obj == "ROLE_ADMIN"){
    			roles.ROLE_ADMIN = true;
    		}else if(obj == "ROLE_MANAGER"){
    			roles.ROLE_MANAGER = true;
    		}
    	});
    	return roles;
    }
});

angular.module('app').filter('userRoleIsAdmin', function(){
	return function(input) {
    	var found = false;
    	angular.forEach(input, function(obj){    		
    		if(obj == "ROLE_ADMIN"){
    			found = true;
    			return;
    		}
    	});
    	return found;
    }
});

angular.module('app').filter('userRoleIsManager', function(){
	return function(input) {
    	var found = false;
    	angular.forEach(input, function(obj){    		
    		if(obj == "ROLE_MANAGER"){
    			found = true;
    			return;
    		}
    	});
    	return found;
    }
});