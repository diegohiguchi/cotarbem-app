/*
(function () {
    'use strict';
    var controllerId = 'sala.usuario';

    function salaUsuario($scope, $location, services, load, $state, socket, $timeout, $ionicScrollDelegate) {
        socket.connect();
        var vm = this;
        var sala = angular.fromJson($state.params.salaUsuario);
        var viewScroll = $ionicScrollDelegate.$getByHandle('userMessageScroll');
        vm.users = [];
        vm.messages = [];

        function adicionarUsuarioNaSala(nome) {
            if (nome != null) {
                socket.emit('add-user', {usuarioId: sala.usuarioId, username: sala.usuarioNome})
            }
        }

        function criarSala(sala) {
            socket.emit('change channel', sala);
        }

        vm.enviarMensagem = function (msg) {
            if (msg != null && msg != '')
                socket.emit('message', {salaId: sala.id, message: msg})
            vm.mensagem = '';
        }

        function quebrarString(data) {
            var usuario = data.message.split("/", 1).shift();
            var usuarioId = usuario.split(" ", 1).shift();
            var usuarioNome = usuario.slice(usuarioId.split("").length + 1);
            var mensagem = data.message.slice((usuario.split("").length + 1));
            var horario = mensagem.split("/").pop();
            mensagem = mensagem.split("/", 1).shift();

            return {
                usuario: usuario,
                usuarioId: usuarioId,
                usuarioNome: usuarioNome,
                mensagem: mensagem,
                horario: horario
            }
        }

        //socket.on('connect',function() {
        socket.emit('request-users', {});

        socket.on('users', function (data) {
            vm.users = data.users;
        });

        socket.on('message', function (data) {
            vm.messages.push(data);
        });

        socket.on('message-redis', function (data) {
            var dados = quebrarString(data);

            vm.messages.push({message: dados.mensagem, usuarioId: dados.usuarioId, usuarioNome: dados.usuarioNome, horario: dados.horario});
        });

        socket.on('add-user', function (data) {
            console.log(vm.users.indexOf(data.usuarioId));
            if (vm.users.indexOf(data.usuarioId) == -1) {
                vm.users.push(data.usuarioId);
                //vm.messages.push({username: data.username, message: 'entrou na sala'});
                vm.quantidadeUsuarios = vm.users.length;
                console.log(vm.users);
                console.log(vm.quantidadeUsuarios);
            }
        });

        socket.on('change channel', function (sala) {
            vm.messages.push({message: 'Bem vindo a ' + sala.nome});
        });

        //});

        /!*socket.on('remove-user', function (data) {
         console.log('Removido ' + data.usuarioId);
         vm.users.splice(users.indexOf(data.usuarioId), 1);
         //vm.messages.push({username: data.username, message: 'saiu da sala'});
         });*!/

        /!*$scope.$on('$location', function (event) {
         socket.disconnect(true);
         });
         *!/
        function activate() {
            vm.users = [];
            vm.sala = sala;
            vm.usuario = sala;
            adicionarUsuarioNaSala(sala);
            criarSala(sala);
        }

        activate();
    }

    angular.module('cotarApp').controller(controllerId, ['$scope', '$location', 'services', 'load', '$state', 'socket', '$timeout', '$ionicScrollDelegate', salaUsuario]);

})
();*/
