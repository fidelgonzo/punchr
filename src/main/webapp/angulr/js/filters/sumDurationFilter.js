'use strict';

angular.module('app').filter('sumDurationFilter', function() {
    return function(input) {
    	var duration = 0;
    	angular.forEach(input, function(obj){
    		duration += obj.time;
    	});
    	return moment({seconds : duration});
    }
  });

angular.module('app').filter('sumDistanceFilter', function() {
    return function(input) {
    	var distance = 0;
    	angular.forEach(input, function(obj){
    		distance += obj.distance;
    	});
    	return distance;
    }
  });

angular.module('app').filter('sumAverageFilter', function() {
    return function(input) {
    	var distance = 0;
    	var duration = 0;
    	angular.forEach(input, function(obj){
    		distance += obj.distance;
    		duration += obj.time;
    	});
    	return distance / (duration / 3600);
    }
  });