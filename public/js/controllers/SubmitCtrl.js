app.controller('SubmitCtrl', function($scope, RecordsFactory) {
  $scope.record = {}; // a new record

  $scope.submitRecord = function(record) {
    RecordsFactory.postNewRecord(record).then(function(recordData) {
      // console.log('RECORDDATA IS', recordData);
      $scope.records.push(recordData[recordData.length - 1]);
      $scope.record = {};
    });
  }
});