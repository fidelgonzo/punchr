'use strict';

angular.module('app').filter('dateRange', function(){

    return function(input, startDate, endDate, query) {
    	if(startDate == undefined)
    		startDate = new Date(1970,0,0);
    	// else if(startDate instanceof 'Moment'){
    		// startDate = startDate._d;
    	// }
        // console.log(typeof startDate);

    	if(endDate == undefined)
    		endDate = new Date(3000,0,0);
    	else if(endDate.hasOwnProperty('_d')){
    		endDate._d.setHours(23);
    		endDate._d.setMinutes(59);
    	}else{
            endDate.setHours(23);
            endDate.setMinutes(59);
        }
    	if(query == undefined)
    		query = "";

    	var out = [];

       angular.forEach(input, function(obj){
       		var date = new Date(obj.date);
	        if(date >= startDate && date <= endDate && obj.title.toLowerCase().indexOf(query.toLowerCase())>-1)   {
	            out.push(obj);
	        }
       });

       return out;

    };
});