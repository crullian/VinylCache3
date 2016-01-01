app.controller('MainController', function($scope, RecordsFactory) {
  $scope.showRecords = false;
  RecordsFactory.getRecords().then(function(data) {
    $scope.records = data;
    $scope.showRecords = true;
  });
});