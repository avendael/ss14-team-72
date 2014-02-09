'use strict';
var AddSongUrlCtrl = function($scope, $modalInstance) {
  $scope.song = {};
  $scope.ok = function() {
    $modalInstance.close($scope.song);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
};

var AddSoundcloudTrackCtrl = function($scope, $modalInstance, $log, $timeout) {
  $scope.currentPage = 0;
  $scope.tracks = [];

  var getTracks = function() {
    SC.get('/tracks?filter=public',
           {offset: $scope.currentPage * 10, limit: 10},
           function(tracks) {
             $scope.$apply(function() {
               $scope.tracks = tracks;
             });
           });
  };

  $scope.$watch('currentPage', function() {
    getTracks();
  });

  $scope.setPage = function(page) {
    $scope.currentPage = page;
  };

  $scope.ok = function(index) {
    $modalInstance.close($scope.tracks[index]);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };

  getTracks();
};

angular.module('mixdogeApp')
  .controller(
    'MainCtrl',
    function ($scope, $firebase, $log, $modal, firebaseUrl, playlistUrl,
              loginService, soundcloudId, orderByPriorityFilter) {
      $scope.audioPlayer = {
        max: 0,
        position: 0
      };

      $scope.firebase = $firebase(new Firebase(firebaseUrl));

      $scope.logout = function() {
        loginService.logout();
      };

      $scope.playlist = [];

      // Wrap everything in checkLogin because the user must be logged in.
      loginService.checkLogin(function success(user) {
        $scope.userFirebase = $firebase(new Firebase(firebaseUrl + user.uid));
        $scope.playlistFirebase = $firebase(new Firebase(firebaseUrl + user.uid + playlistUrl));
        $scope.userFirebase.username = user.username;

        $scope.userFirebase.$save('username');
        $scope.$watchCollection('playlistFirebase', function() {
          $log.info('song ' + JSON.stringify($scope.playlistFirebase['-JFF_rl9VumGy21nXeoV']));

          // Innefficient, yes, but if I use [] or simply reassign, it won't work
          $scope.playlist.splice(0, $scope.playlist.length);
          var orderedPlaylist = orderByPriorityFilter($scope.playlistFirebase);

          if (!!orderedPlaylist && !!orderedPlaylist.forEach) {
            orderedPlaylist.forEach(function(element) {
              $scope.playlist.push(element);
            });
          }
        });

        $scope.openAddSongUrl = function() {
          var modalInstance = $modal.open({
            templateUrl: 'add-song.html',
            controller: AddSongUrlCtrl
          });

          modalInstance.result.then(function(song) {
            $scope.addSong(song);
          }, function() {
            $log.info('Modal dismissed at: ' + new Date());
          });
        };

        $scope.openAddSoundcloudTrack = function() {
          var modalInstance = $modal.open({
            templateUrl: 'add-soundcloud.html',
            controller: AddSoundcloudTrackCtrl
          });

          modalInstance.result.then(function(song) {
            song.src = song.uri + '/stream?client_id=' + soundcloudId;
            $scope.addSong(song);
          }, function() {
            $log.info('Modal dismissed at: ' + new Date());
          });
        };

        $scope.playSong = function(index) {
          $scope.audioPlayer.play(index);
        };

        $scope.addSong = function(song) {
          $scope.playlistFirebase.$add(song);
          // $scope.playlist.push(song);
        };

        $scope.updateSong = function(song) {
          $log.info(song);
          song.title = 'favorite song ' + Math.floor(Math.random() * 100);

          $scope.playlistFirebase.$save();
        };

        $scope.removeSong = function(index) {
          $scope.playlistFirebase.$remove($scope.playlistFirebase.$getIndex()[index]);
        };


        $scope.$watch('audioPlayer.currentTime',  function(newVal, oldVal) {
            if (Math.abs(newVal - $scope.audioPlayer.duration) <= 1 && oldVal > 0) {
                if ($scope.audioPlayer.currentTrack + 1 >= $scope.audioPlayer.tracks) {
                    $scope.playSong(0);
                } else {
                    $scope.audioPlayer.next(true);
                }
            }  
        });
     
        $log.info('playlist firebase ' + JSON.stringify($scope.playlistFirebase));
      });
    });
