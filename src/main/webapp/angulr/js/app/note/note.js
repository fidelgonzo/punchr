var app = angular.module('app');

app.controller('NoteCtrl', ['$scope', '$http', 'Timesheet', '$modal', 'Principal', '$filter',
                    function($scope,   $http,   Timesheet,   $modal,   Principal, $filter) {
  

  $scope.colors = ['primary', 'info', 'success', 'warning', 'danger', 'dark'];

  Principal.identity().then(function(account) {
    $scope.account = account;
  });

  //Load all Timesheets for this user
  $scope.loadAll = function(){
      Timesheet.query(function(result) {
        $scope.timesheets = result;

        $scope.account.workedThisMonth = 0;
        var thisMonth = moment().month();

        $scope.grouped = {};

        angular.forEach($scope.timesheets, function(timesheet, key) {
          var time = $scope.getMinutesFromDate(timesheet.date);
          if(
              (time  > $scope.getMinutesFromDate($scope.account.preferredFrom) 
              && time < $scope.getMinutesFromDate($scope.account.preferredTo))
            ||
              (time + timesheet.duration * 60 > $scope.getMinutesFromDate($scope.account.preferredFrom)
              && time + timesheet.duration * 60 < $scope.getMinutesFromDate($scope.account.preferredTo)
              )
            ||
              (time  < $scope.getMinutesFromDate($scope.account.preferredFrom)
              && time + timesheet.duration * 60 > $scope.getMinutesFromDate($scope.account.preferredTo)
              )
            )
            timesheet.color = 'danger';
          else
            timesheet.color = 'success';

          //Add worked this month hours
          if(thisMonth == moment(timesheet.date).month()){
            $scope.account.workedThisMonth+= timesheet.duration;
          }
         


        });

        $scope.account.workedThisMonthPercentage = $scope.account.workedThisMonth / 160 * 100;

        $scope.note = $scope.timesheets[0];
        $scope.timesheets[0].selected = true;
    });  
  }

  //Minutes Helper function
  $scope.getMinutesFromDate = function(milis){
    var date = new Date(milis);
    return date.getHours()*60 + date.getMinutes();
  }

  $scope.loadAll();

  //Add new timesheet
   $scope.open = function (size) {
      var modalInstance = $modal.open({
        templateUrl: 'angulr/js/app/note/timesheet.new.html',
        controller: 'TimesheetModalInstanceCtrl',
        size: size,
        resolve: {
          timesheet : function () {
            return null;
          }
        }
      });

      modalInstance.result.then(function (result) {
         var note = {
          title: result.title,
          // color: $scope.colors[Math.floor((Math.random()*3))],
          date: result.date,
          duration: result.duration
          };
          // $scope.timesheets.push(note);
          // $scope.selectNote(note);

          Timesheet.update(note,
               function () {
                    $scope.loadAll();
                    $scope.clear();
                });

      }, function () {
        // $log.info('Modal dismissed at: ' + new Date());
      });
  };

//Edit timesheet
  $scope.edit = function(timesheet){
    var modalInstance = $modal.open({
      templateUrl: 'angulr/js/app/note/timesheet.new.html',
      controller: 'TimesheetModalInstanceCtrl',
      size: 'sm',
      resolve: {
        timesheet : function () {
          return timesheet;
        },
        edit : function () {
          return true;
        }
      }
    });

    modalInstance.result.then(function (timesheet) {
       Timesheet.update(timesheet,
         function () {
              $scope.loadAll();
              $scope.clear();
          });
    });
  };

  //Delete timesheet
  $scope.delete = function (timesheet) {
    var modalInstance = $modal.open({
      templateUrl: 'angulr/js/app/note/timesheet.remove.html',
      controller: 'TimesheetModalInstanceCtrl',
      size: 'sm',
      resolve: {
        timesheet : function () {
          return timesheet;
        }
      }
    });

    modalInstance.result.then(function (timesheet) {
       Timesheet.delete({id: timesheet.id},
        function () {
            $scope.loadAll();
            $scope.clear();
        }); 
    });
  };

  $scope.selectNote = function(note){
    angular.forEach($scope.timesheets, function(note) {
      note.selected = false;
    });
    $scope.note = note;
    $scope.dt = note.date;
    $scope.note.durationh = note.duration / 60;
    $scope.note.selected = true;
  }

  $scope.filterDates = function(){
    // var date1;
     $scope.filtered = $filter('dateRange')($scope.timesheets, $scope.startDate, $scope.endDate );
  }

  $scope.changeFilter = function(type){
    if(type == undefined) {
      $scope.startDate = null;
      $scope.endDate = null;
    }else if(type == 'month') {
      $scope.startDate = moment().date(1).hour(0).minute(0);
      $scope.endDate = moment().date(31).hour(23).minute(59);
    }else if(type == 'week') {
      $scope.startDate = moment().day(1).hour(0).minute(0);
      $scope.endDate = moment().day(7).hour(23).minute(59);
    }
  }

  $scope.export = function () {
    var modalInstance = $modal.open({
      templateUrl: 'angulr/js/app/note/timesheet.export.html',
      controller: 'TimesheetModalExportInstanceCtrl',
      size: 'xl',
      resolve: {
        timesheets : function () {
          return $scope.filteredTimesheets;
        },
        startDate : function () {return $scope.startDate;},
        endDate : function () {return $scope.endDate;}
      }
    });

    modalInstance.result.then(function (timesheet) {
       Timesheet.delete({id: timesheet.id},
        function () {
            $scope.loadAll();
            $scope.clear();
        }); 
    });
  }

  $scope.clear = function () {
    $scope.dt = null;
    $scope.timesheet = {date: null, title: null, duration: null, created: null, id: null};
  };


}]);

//Controller for the modal view: new & edit
app.controller('TimesheetModalInstanceCtrl', ['$scope', '$modalInstance', 'timesheet', function($scope, $modalInstance, timesheet) {

    if(timesheet == null){
      $scope.date = new Date();
      $scope.duration = 1.0;
      $scope.title = "New timesheet";
    }else{
      $scope.date = timesheet.date;
      $scope.duration = timesheet.duration;
      $scope.title = timesheet.title;
      $scope.timesheet = timesheet;
    }
    
    $scope.ok = function () {
      if($scope.timesheet)
        $modalInstance.close({date: $scope.date, duration: $scope.duration, title: $scope.title, id: $scope.timesheet.id});
      else
        $modalInstance.close({date: $scope.date, duration: $scope.duration, title: $scope.title, id: 0});
    };

    $scope.remove = function(){
      // $modalInstance.
    }

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
}]);


app.controller('TimesheetModalExportInstanceCtrl', ['$scope', '$modalInstance', 'timesheets', '$filter','startDate','endDate',
  function($scope, $modalInstance, timesheets, $filter, startDate, endDate) {
  $scope.startDate = startDate;
  $scope.endDate = endDate;
  $scope.grouped = {};

  angular.forEach(timesheets, function(timesheet) {
    var dateKey = moment(timesheet.date).format('YYYY-MM-DD');
    if($scope.grouped[dateKey] == undefined)
      $scope.grouped[dateKey] = [];
    $scope.grouped[dateKey].push(timesheet);
  });

  
    // if(startDate <= moment(dateKey) && endDate >= moment(dateKey)){
      // if($scope.grouped[dateKey] == undefined)
              // $scope.grouped[dateKey] = [];
      // $scope.grouped[dateKey].push(timesheet);
    // }
  // });
}]);

 