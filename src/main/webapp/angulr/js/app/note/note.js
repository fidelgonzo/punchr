var app = angular.module('app');

app.controller('NoteCtrl', ['$scope', '$http', 'Timesheet', '$modal', 'Principal', '$filter',
                    function($scope,   $http,   Timesheet,   $modal,   Principal, $filter) {
  

  $scope.colors = ['primary', 'info', 'success', 'warning', 'danger', 'dark'];

  Principal.identity().then(function(account) {
    $scope.account = account;
    $scope.loadAll();
  });

  //Load all Timesheets for this user
  $scope.loadAll = function(){
    if($scope.account.isManager)
      Timesheet.query({ id: 'all' }, onLoad);  
    else
      Timesheet.query(onLoad);  
  }

  function onLoad(result){
    $scope.timesheets = result;

    $scope.account.workedThisMonth = 0;
    var thisMonth = moment().month();

    $scope.grouped = {};

    //Get Max first for progress bar
    var maxDistance = 0;
    var maxAverage = 0;

    angular.forEach($scope.timesheets, function(timesheet, key) {
      var time = $scope.getMinutesFromDate(timesheet.date);
      timesheet.color = 'success';          
      timesheet.durationh = time * 60;
      timesheet.time = $scope.getSecondsFromDate(timesheet.duration);
      maxDistance = Math.max(maxDistance, timesheet.distance);
      maxAverage = Math.max(maxAverage, timesheet.distance / (timesheet.time / 3600));

      //Add worked this month hours
      if(thisMonth == moment(timesheet.date).month()){
        $scope.account.workedThisMonth+= (timesheet.time / 3600);
      }
    });

    $scope.maxDistance = maxDistance;
    $scope.maxAverage = maxAverage;
    $scope.account.workedThisMonth = Math.trunc($scope.account.workedThisMonth, 2);
    $scope.account.workedThisMonthPercentage = $scope.account.workedThisMonth / 12 * 100;

    $scope.note = $scope.timesheets[0];
    if($scope.timesheets.length > 0)
      $scope.timesheets[0].selected = true;
  }

  //Minutes Helper function
  $scope.getMinutesFromDate = function(milis){
    var date = new Date(milis);
    return date.getHours()*60 + date.getMinutes();
  }
  //Seconds Helper function
  $scope.getSecondsFromDate = function(milis){
    var date = new Date(milis);
    return date.getHours()*3600 + date.getMinutes()*60 + date.getSeconds();
  }
 

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
            duration: result.duration,
            distance: result.distance
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
    // $scope.note.durationh = note.duration / 60;
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

  $scope.hover = function(timesheet){
    timesheet.hover = !timesheet.hover;
  }


}]);

//Controller for the modal view: new & edit
app.controller('TimesheetModalInstanceCtrl', ['$scope', '$modalInstance', 'timesheet', function($scope, $modalInstance, timesheet) {

    if(timesheet == null){
      $scope.date = new Date();
      var time = new Date();
      time.setHours(0);
      time.setMinutes(0);
      time.setSeconds(0);
      $scope.duration = time;
      $scope.title = "New timesheet";
      $scope.distance = 0;
    }else{
      $scope.date = timesheet.date;
      $scope.duration = timesheet.duration;
      $scope.title = timesheet.title;
      $scope.timesheet = timesheet;
      $scope.distance = timesheet.distance;
      $scope.userId = timesheet.userId;
    }
    
    $scope.ok = function () {
      if($scope.timesheet)
        $modalInstance.close({date: $scope.date, duration: $scope.duration, title: $scope.title, id: $scope.timesheet.id, distance: $scope.distance, userId: $scope.userId});
      else
        $modalInstance.close({date: $scope.date, duration: $scope.duration, title: $scope.title, id: 0, distance: $scope.distance, userId: $scope.userId});
    };

    $scope.remove = function(){
      // $modalInstance.
    }

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };

    $scope.open = function($event) {
      $event.preventDefault();
      $event.stopPropagation();

      $scope.opened = true;
    };

    $scope.dateOptions = {
      formatYear: 'yy',
      startingDay: 1
    };

    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[0];
}]);


app.controller('TimesheetModalExportInstanceCtrl', ['$scope', '$modalInstance', 'timesheets', '$filter','startDate','endDate',
  function($scope, $modalInstance, timesheets, $filter, startDate, endDate) {
  $scope.startDate = startDate;
  $scope.endDate = endDate;
  $scope.grouped = {};
  // $scope.d = [ [1,6.5],[4,8],[5,7.5],[2,6.5],[3,7],[6,7],[7,6.8],[8,7],[9,7.2],[10,7],[11,6.8],[12,7] ];
  // $scope.d2 = [ [0,7],[1,6.5],[2,12.5],[3,7],[4,9],[5,6],[6,11],[7,6.5],[8,8],[9,7] ];

  angular.forEach(timesheets, function(timesheet) {
    var dateKey = moment(timesheet.date).format('WW');
    if($scope.grouped[dateKey] == undefined){
      $scope.grouped[dateKey] = [];
    }
    $scope.grouped[dateKey].push(timesheet);
  });

  var weeks = [];

  $scope.d = [];
  $scope.d2 = [];

  angular.forEach($scope.grouped, function(array, key) {
    var week = {};
    week.number = key;
    week.distance = $filter('sumDistanceFilter')(array);
    $scope.d.push([key, week.distance]);
    week.average = $filter('sumAverageFilter')(array);
    $scope.d2.push([key, week.average]);
    weeks.push(week);
  });

  $scope.weeks = weeks;

}]);

 