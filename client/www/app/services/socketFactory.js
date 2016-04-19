angular.module('cotarApp').factory('socket', ['socketFactory', 'connection', function(socketFactory, connection){
   var myIoSocket = io.connect(connection.base());
   //var myIoSocket = io.connect('http://cotar-bem.herokuapp.com');

   mySocket = socketFactory({
      ioSocket: myIoSocket
   });

   return mySocket;
}]);