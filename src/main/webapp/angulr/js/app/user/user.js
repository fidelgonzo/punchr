var app = angular.module('app');

app.controller('UserCtrl', ['$scope', '$http', 'User', '$modal', 'Principal', '$filter',
                    function($scope,   $http,   User,   $modal,   Principal, $filter) {
  
   	 $scope.loadAll = function(){
   	 	User.query(function(result) {

   	 		angular.forEach(result, function(value, key){

   	 		})

        	$scope.users = result;
        });
   	 };

   	 $scope.loadAll();

   	 $scope.changeAdmin = function(user){
   	 	var roles = user.roles;
   	 	if($filter('userRoleIsAdmin')(user.roles)){
   	 		user.roles.splice(user.roles.indexOf("ROLE_ADMIN"), 1);
   	 	}else{
   	 		user.roles.push("ROLE_ADMIN");
   	 	}
   	 	User.update(user, function(){
   	 		$scope.loadAll();
   	 	});
   	 };

   	 $scope.changeManager = function(user){
   	 	var roles = user.roles;
   	 	if($filter('userRoleIsManager')(user.roles)){
   	 		user.roles.splice(user.roles.indexOf("ROLE_MANAGER"), 1);
   	 	}else{
   	 		user.roles.push("ROLE_MANAGER");
   	 	}
   	 	User.update(user, function(){
   	 		$scope.loadAll();
   	 	});
   	 };

   	 $scope.delete = function(user){
   	 	var modalInstance = $modal.open({
	      templateUrl: 'angulr/js/app/user/user.remove.html',
	      controller: 'UserModalInstanceCtrl',
	      size: 'sm',
	      resolve: {
	        user : function () {
	          return user;
	        }
	      }
	    });

	    modalInstance.result.then(function (user) {
	       User.delete({login: user.login},
	        function () {
	            $scope.loadAll();
	        }); 
	    });
   	 };


}]);


//Controller for the modal view: new & edit
app.controller('UserModalInstanceCtrl', ['$scope', '$modalInstance', 'user', function($scope, $modalInstance, user) {

	$scope.user = user;

    $scope.ok = function () {
      if($scope.user)
        $modalInstance.close({login: $scope.user.login});      
    };

    $scope.remove = function(){
      // $modalInstance.
    }

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
}]);
