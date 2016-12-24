angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('deviceListController', function($scope, $http, appConfiguration) {

  $scope.deviceList = [];

  $scope.toggleDevice = function(deviceId, isOnline) {
    $http.get(`${appConfiguration.apiUrl}/set/${deviceId}/${isOnline}`).success(result => {}).error((data, status) => {});
  };

  var requestConfig = {
    method: 'GET',
    url: "" + appConfiguration.apiUrl + "/list",
    headers: {
      //"Authorization": "Basic bG9zZXI6cGFzc3dvcmQ=",
      //"Referer": "http://192.168.0.1/userRpm/AccessCtrlAccessRulesRpm.htm?Page=1",
      //"Referer": "http://192.168.1.78/userRpm/AccessCtrlAccessRulesRpm.htm?Page=1",
      //"Upgrade-Insecure-Requests": "1",
      //"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.80 Safari/537.36"
    }
  };

  $http.get(requestConfig.url, requestConfig)
  .success(result => {
    $scope.deviceList = eval(result);    
  })
  .error((error, status) => {
    // TODO: display some error message
  });
});
