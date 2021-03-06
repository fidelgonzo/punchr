// lazyload config

angular.module('app')
    /**
   * jQuery plugin config use ui-jq directive , config the js and css files that required
   * key: function name of the jQuery plugin
   * value: array of the css js file located
   */
  .constant('JQ_CONFIG', {
      moment:         [   '../bower_components/moment/moment.js'],
      TouchSpin:      [   '../bower_components/bootstrap-touchspin/dist/jquery.bootstrap-touchspin.min.js',
                          '../bower_components/bootstrap-touchspin/dist/jquery.bootstrap-touchspin.min.css'],
      fullcalendar:   [   '../bower_components/moment/moment.js',
                          '../bower_components/fullcalendar/dist/fullcalendar.min.js',
                          '../bower_components/fullcalendar/dist/fullcalendar.css',
                          '../bower_components/fullcalendar/dist/fullcalendar.theme.css'],
      plot:           [   '../bower_components/flot/jquery.flot.js',
                          '../bower_components/flot/jquery.flot.pie.js', 
                          '../bower_components/flot/jquery.flot.resize.js',
                          '../bower_components/flot.tooltip/js/jquery.flot.tooltip.js',
                          '../bower_components/flot.orderbars/js/jquery.flot.orderBars.js',
                          '../bower_components/flot-spline/js/jquery.flot.spline.js']
    }
  );

