angular.module('app.controllers', [])

/*
 * WorkAreasCtrl
 */
.controller('workAreasCtrl', function($scope, ProficiencyService, UserService, $state, $stateParams) {
  $scope.user = []
  $scope.profs = []

  var userId = $stateParams.userId
  UserService.get({ userId: userId }).then(function (data) {
    $scope.user = data
    if (data._source.professions) {
      $scope.profs = data._source.professions
    } else {
      ProficiencyService.query({ id: 0 }).$promise.then(function (professions) {
        professions.map(function (d) {
          $scope.profs.push({
            id: d._source.id,
            name: d._source.namn,
            selected: false
          })
        })
      })
    }
  })

  $scope.goToWork = function () {
    return UserService
      .update({
        userId: $stateParams.userId,
        professions: $scope.profs
      })
      .then(function () {
        return $state.go('user.thankYou', { userId: $stateParams.userId })
      })
      .catch(function (error) {
        console.log('error', error)
        alert('Something went wrong!')
      })
  }
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
.controller('thankYouCtrl', function ($scope, UserCountService) {
  $scope.count = UserCountService.get()
})
