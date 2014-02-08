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

var AddSoundcloudTrackCtrl = function($scope, $modalInstance, $log) {
  SC.get('/tracks?filter=public', {limit: 10}, function(tracks) {
    $scope.tracks = tracks;
  });

  $scope.ok = function(index) {
    $modalInstance.close($scope.tracks[index]);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
};

angular.module('mixdogeApp')
  .controller(
    'MainCtrl',
    function ($scope, $firebase, $log, $modal, firebaseUrl, playlistUrl, peerKey,
              loginService, orderByPriorityFilter) {
      $scope.audioPlayer = {
        max: 0,
        position: 0
      };

      var peer = new Peer({key: peerKey});

      $scope.firebase = $firebase(new Firebase(firebaseUrl));

      $scope.logout = function() {
        loginService.logout();
      };

      $scope.playlist = [];

      // Wrap everything in checkLogin because the user must be logged in.
      loginService.checkLogin(function success(user) {
        $scope.userFirebase = $firebase(new Firebase(firebaseUrl + user.uid));
        $scope.playlistFirebase = $firebase(new Firebase(firebaseUrl + user.uid + playlistUrl));

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

        peer.on('open', function(peerId) {
          $log.info('your peer id is ' + peerId);
          $scope.userFirebase.peer_id = peerId;
          $scope.userFirebase.username = user.username;

          $scope.userFirebase.$save('peer_id');
          $scope.userFirebase.$save('username');
        });

        peer.on('error', function(error) {
          $log.info('peer error');
          $log.info(error);
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
            song.src = song.uri + '/stream?client_id=702ac7423535a3cd296fb0c8751a8a26';
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
        $log.info('playlist firebase ' + JSON.stringify($scope.playlistFirebase));
      });
    });
