'use strict';

angular.module('mixdogeApp')
  .controller(
    'MainCtrl',
    function ($scope, $firebase, $log, firebaseUrl, playlistUrl, peerKey, loginService, orderByPriorityFilter) {
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

          if (!!orderedPlaylist) {
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

        $scope.playSong = function(index) {
          $scope.audioPlayer.play(index);
        };

        $scope.addSong = function() {
          var song = {
            title: 'Predictable notype' + Math.floor(Math.random() * 100),
            artist: 'Korn',
            src: 'http://upload.wikimedia.org/wikipedia/en/7/79/Korn_-_Predictable_%28demo%29.ogg',
            media: ''
          };

          $scope.playlistFirebase.$add(song);
          $scope.playlist.push(song);
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
