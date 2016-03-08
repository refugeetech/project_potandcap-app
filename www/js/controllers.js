angular.module('app.controllers', [])

/*
 * PhoneCtrl
 */
.controller('phoneCtrl', function($scope, $state, UserService, AuthService) {
  'use strict'

  $scope.phoneNumber = ''

  $scope.login = function (phoneNumber) {
    return UserService
      .create(phoneNumber)
      .then(function (userId) {
        return $state.go('user', { userId })
      })
      .catch(function (error) {
        console.log(error)
      })
  }

  $scope.linkedIn = function () {
    AuthService.linkedIn()
  }
})

/*
 * UserProfileCtrl
 */
.controller('userProfileCtrl', function ($scope, UserService, $state, $stateParams, cities) {
  $scope.user = {}
  $scope.cities = cities

  $scope.updateProfile = function (user) {
    user.userId = $stateParams.userId

    return UserService
      .update(user)
      .then(function () {
        return $state.go('user.workAreas', { userId: user.userId })
      })
      .catch(function (error) {
        alert(error)
      })
  }
})

/*
 * WorkAreasCtrl
 */
.controller('workAreasCtrl', function($scope, ProficiencyService, UserService, $state, $stateParams) {
  $scope.user = []
  $scope.branches = []

  $scope.selectBranch = function (branchId) {
    if ($scope.branches.indexOf(branchId) > -1) {
      $scope.branches.splice($scope.branches.indexOf(branchId))
    }
    else {
      $scope.branches.push(branchId)
    }
  }

  $scope.goToWork = function () {
    return UserService
      .update({
        userId: $stateParams.userId,
        branches: $scope.branches
      })
      .then(function () {
        return $state.go('user.work', { userId: $stateParams.userId })
      })
      .catch(function (error) {
        console.log('error', error)
        alert('Something went wrong!')
      })
  }

  ProficiencyService.query({ id: 0 }).$promise.then(function (data) {
    $scope.profs = data
  })
})

/*
 * WorkCtrl
 */
.controller('workCtrl', function($scope, $state, $stateParams, UserService, ProficiencyService) {
  $scope.profs = {}
  $scope.user = {}
  $scope.selectedProfs = []

  $scope.selectedBranches = []

  var userId = $stateParams.userId
  UserService.get({ userId: userId }).then(function (data) {
    $scope.user = data
    $scope.selectedBranches = data._source.branches
  })

  $scope.isSelected = function (branch) {
    return $scope.selectedBranches.indexOf(branch._source.id) > -1
  }

  $scope.setProfsFromApi = function (parentId) {
    $scope.profs = ProficiencyService.query({ id: parentId }).$promise.then(function (data) {
      $scope.profs[parentId] = data
    })
  }

  $scope.selectProf = function (profId) {
    if ($scope.selectedProfs.indexOf(profId) > -1) {
      $scope.selectedProfs.splice($scope.selectedProfs.indexOf(profId))
    }
    else {
      $scope.selectedProfs.push(profId)
    }
  }

  $scope.save = function () {
    return UserService
      .update({
        userId: $stateParams.userId,
        selectedProfs: $scope.selectedProfs
      })
      .then(function () {
        return $state.go('user.thankYou', { userId: $stateParams.userId })
      })
      .catch(function (error) {
        console.log('error', error)
        alert('Something went wrong!')
      })
  }

  // Load top level from API.
  $scope.setProfsFromApi(0)

  $scope.$watch('selectedBranches', function (sb) {
    sb.map(function (b) {
      $scope.setProfsFromApi(b)
    })
  })
})

/*
 * ThankUCtrl
 */
.controller('thankYouCtrl', function($scope) {

})
