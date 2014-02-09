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
    function ($scope, $firebase, $modal, $routeParams, $log, firebaseUrl, playlistUrl,
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
        var uid = $routeParams.userKey || user.uid  || 'guest';

        if (uid === user.uid) {
          $scope.userFirebase = $firebase(new Firebase(firebaseUrl + uid));
          $scope.userFirebase.username = user.username || 'guest';
          $scope.userFirebase.$save('username');
        } else {
          $scope.disallowAdding = true;
        }

        $scope.playlistFirebase = $firebase(new Firebase(firebaseUrl + uid + playlistUrl));

        $scope.$watchCollection('playlistFirebase', function() {
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
            song.type = "audio/ogg";
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
          song.title = 'favorite song ' + Math.floor(Math.random() * 100);

          $scope.playlistFirebase.$save();
        };

        $scope.removeSong = function(index) {
          $scope.playlistFirebase.$remove($scope.playlistFirebase.$getIndex()[index]);
        };


        $scope.$watch('audioPlayer.currentTime',  function(newVal, oldVal) {
          if (Math.abs(newVal - $scope.audioPlayer.duration) <= 1 && oldVal > 0) {
            if ($scope.audioPlayer.currentTrack + 1 > $scope.audioPlayer.tracks) {
              // $scope.playSong(0);
              $scope.audioPlayer.load($scope.playlist[0], true);
            } else {
              $scope.audioPlayer.next(true);
            }
          }
        });

        $scope.$on('audioplayer:play', function() {
          var song = $scope.playlist[$scope.audioPlayer.currentTrack - 1];
          var words = getWords(song.tag_list);
          words = words.concat(getWords(song.title));
          words = words.concat(getWords(song.genre));
          doge(words, true);
        });

        $scope.$on('audioplayer:pause', function() {
          dogeOn = false;
        });

      });
    });
