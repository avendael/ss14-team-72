'use strict';

angular.module('jukedogeApp')
  .controller(
    'MainCtrl',
    function ($scope, $firebase, $log, firebaseUrl, playlistUrl, peerKey, loginService) {
      var peer = new Peer({key: peerKey});

      $scope.firebase = $firebase(new Firebase(firebaseUrl));

      $scope.logout = function() {
        loginService.logout();
      };

      $scope.playlist = [
        {
          "src":"http://upload.wikimedia.org/wikipedia/en/d/d0/Rick_Astley_-_Never_Gonna_Give_You_Up.ogg",
          "type":"audio/ogg"
        }
      ];

      // Wrap everything in checkLogin because the user must be logged in.
      loginService.checkLogin(function success(user) {
        $scope.userFirebase = $firebase(new Firebase(firebaseUrl + user.uid));
        $scope.playlistFirebase = $firebase(new Firebase(firebaseUrl + user.uid + playlistUrl));

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

        $scope.addSong = function() {
          $scope.playlistFirebase.$add({
            title: 'song ' + Math.floor(Math.random() * 100)
          });
        };

        $scope.updateSong = function(song) {
          song.title = 'favorite song ' + Math.floor(Math.random() * 100);

          $scope.playlistFirebase.$save();
        };

        $scope.removeSong = function(index) {
          $scope.playlistFirebase.$remove($scope.playlistFirebase.$getIndex()[index]);
        };
      });
    });
