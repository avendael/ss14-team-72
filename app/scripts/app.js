'use strict';

angular.module('mixdogeApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'firebase',
  'ui.bootstrap',
  'audioPlayer',
  'ngProgress'
])
  .config(function($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/login/?', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl'
      })
      .when('/user/:userKey/?', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/user/?', {
        templateUrl: 'views/user.html',
        controller: 'UserCtrl'
      })
      .otherwise({
        templateUrl: '404.html'
      });
  })
  .run(function($rootScope, $log, loginService) {
    $rootScope.$on('$firebaseSimpleLogin:logout', function(event) {
      loginService.redirectToLogin();
    });
    $rootScope.$on('$routeChangeSuccess', function() {
      dogeOn = false;
    });
  })
  .run(function($rootScope, $log, ngProgress) {
    $rootScope.$on('audioplayer:play', function(event) {
      ngProgress.complete();
    });
    $rootScope.$on('audioplayer:pause', function(event) {
      if (ngProgress.status() > 0) ngProgress.complete();
    });
  })
  .run(function(soundcloudId) {
    SC.initialize({
      client_id: soundcloudId
    });
  });

var dogeOn = false;
var prefixes = ['very', 'much', 'so'];

function getWords(s) {
  var words = [];
  s.toLowerCase().replace(/[^a-z]/g, ' ').split(' ').forEach(function(w) {
    w = w.trim();
    if (w.length) {
      words.push(w);
    }
  });
  return words;
}

function randChoice(a) {
  return a[Math.floor(Math.random() * a.length)];
}

function randColor() {
  var rgb = [];
  for (var i = 0; i < 3; i++) {
    rgb.push((128 + Math.floor(Math.random() * 128)).toString(16));
  }
  return '#' + rgb.join('');
}

function doge(words, start) {
  if (start) {
    dogeOn = true;
  }
  setTimeout(function() {
    var text = '';
    if (Math.random() > 0.05) {
      if (Math.random() > 0.6) {
        text = randChoice(prefixes) + ' ';
      }
      text += randChoice(words);
    } else {
      text = 'wow';
    }
    var span = document.createElement('span');
    span.className = 'doge-text fadeOut animated';
    span.innerText = text;
    span.style.left = Math.floor(Math.random() * window.innerWidth) + 'px';
    span.style.top = (50 + Math.floor(Math.random() * (window.innerHeight - 100))) + 'px';
    span.style.fontSize = (8 + Math.random() * 20) + 'px';
    span.style.color = randColor();
    $(span).one('animationend webkitAnimationEnd MSAnimationEnd oAnimationEnd', function() {
      $(this).remove();
    });
    document.body.appendChild(span);
    if (dogeOn) {
      doge(words);
    }
  }, Math.random() * 250);
}
