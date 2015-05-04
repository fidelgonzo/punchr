'use strict';

angular.module('app').filter('sumDurationFilter', function() {
    return function(input) {
    	var duration = 0;
    	angular.forEach(input, function(obj){
    		duration += obj.duration;
    	});
    	return duration;
    }
  });