angular.module('cotarApp').factory('socket', ['socketFactory', 'connection', function(socketFactory, connection){
   var myIoSocket = io.connect(connection.baseWeb());

   mySocket = socketFactory({
      ioSocket: myIoSocket
   });

   return mySocket;
}]);

// 'use strict';

// // Create the Socket.io wrapper service
// angular.module('cotarApp').service('Socket', ['$state', '$timeout', 'connection',
//   function ($state, $timeout, connection) {
//     // Connect to Socket.io server
//     this.connect = function () {
//       // Connect only when authenticated
//     //   if (Authentication.user) {
//         this.socket = io(connection.baseWeb());
//     //   }
//     };
//     this.connect();

//     // Wrap the Socket.io 'on' method
//     this.on = function (eventName, callback) {
//       if (this.socket) {
//         this.socket.on(eventName, function (data) {
//           $timeout(function () {
//             callback(data);
//           });
//         });
//       }
//     };

//     // Wrap the Socket.io 'emit' method
//     this.emit = function (eventName, data) {
//       if (this.socket) {
//         this.socket.emit(eventName, data);
//       }
//     };

//     // Wrap the Socket.io 'removeListener' method
//     this.removeListener = function (eventName) {
//       if (this.socket) {
//         this.socket.removeListener(eventName);
//       }
//     };
//   }
// ]);
