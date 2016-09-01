(function () {
    'use strict';
    var controllerId = 'home';

    angular.module('cotarApp').controller(controllerId, ['socket', '$scope', 'connection', 'load', '$rootScope', '$location', 'autenticacao',
        'services', '$cordovaBadge', home]);

    function home(socket, $scope, connection, load, $rootScope, $location, autenticacao, services, $cordovaBadge) {
        socket.connect();
        var vm = this;

        if (!$rootScope.isAuthenticated)
            $location.path('/app/login');

        // function obterQuantidadeNotificacoesIcone(quantidade) {
        //     $cordovaBadge.promptForPermission();
        //     $cordovaBadge.hasPermission().then(function (result) {
        //         $cordovaBadge.set(quantidade);
        //     }, function (error) {
        //         console.log(error);
        //     });
        // }

        function mostrarPassoAPasso() {
            if(localStorage.passoAPasso == undefined){
                vm.passoDescricao = "Bem vindo ao Cotar Bem! Cliente crie aqui a sua cotação.";
                vm.passoAtivo = true;
                localStorage.passoAPasso = false;
            }
        }

        function adicionarNotificacao(data) {
            vm.notificacao.push(data);
            //obterQuantidadeNotificacoesIcone(vm.notificacao.length);
        }

        socket.on('envia-solicitacao', function (data) {
            obterUltimaSolicitacaoPorSubSegmentos(vm.usuario.subSegmentos);
            adicionarNotificacao(data);
        });

        socket.on('envia-cotacao-encerrada', function (data) {
            adicionarNotificacao(data);
        });

        socket.on('notificacao-chat-cliente', function (data) {
            adicionarNotificacao(data);
        });

        socket.on('notificacao-chat-fornecedor', function (data) {
            adicionarNotificacao(data);
        });

        function vincularSocket() {
            if (vm.usuario.cliente)
                socket.emit('adiciona-usuario', vm.usuario);

            if (vm.usuario.fornecedor)
                socket.emit('carrega-subSegmentos', vm.usuario.subSegmentos);
        }

        function obterUsuario() {
            vm.usuario = autenticacao.getUser();
            vm.usuario.profileImageURL = connection.baseWeb() + '/' + vm.usuario.profileImageURL;
            vm.usuario.cliente = _.contains(vm.usuario.roles, 'cliente');
            vm.usuario.fornecedor = _.contains(vm.usuario.roles, 'fornecedor');

        }

        function obterNotificacoes(usuarioId) {
            load.showLoadingSpinner();
            services.notificacaoServices.obterNotificacoesEmAbertoPorUsuarioId(usuarioId).success(function (response) {
                vm.notificacao = response;

                //obterQuantidadeNotificacoesIcone(vm.notificacao.length);
            }).error(function (err, statusCode) {
                load.hideLoading();
                load.toggleLoadingWithMessage(err.message);
            });
        }

        function obterUltimaSolicitacaoPorSubSegmentos(subSegmentos) {
            services.solicitacaoServices.obterUltimaSolicitacaoPorSubSegmentos(subSegmentos).success(function (response) {
                vm.solicitacaoFornecedor = response;
                load.hideLoading();
            }).error(function (err, statusCode) {
                load.hideLoading();
                load.toggleLoadingWithMessage(err.message);
            });
        }

        function obterSolicitacao(usuario) {
            if (vm.usuario.cliente) {
                services.solicitacaoServices.obterUltimaSolicitacaoPorUsuarioId(usuario._id).success(function (response) {
                    vm.solicitacaoCliente = response;
                    load.hideLoading();
                }).error(function (err, statusCode) {
                    load.hideLoading();
                    load.toggleLoadingWithMessage(err.message);
                });
            }

            if (vm.usuario.fornecedor) {
                obterUltimaSolicitacaoPorSubSegmentos(usuario.subSegmentos);
            }
        }

        function activate() {
            obterUsuario();
            mostrarPassoAPasso();
            obterNotificacoes(vm.usuario._id);
            vincularSocket();
            obterSolicitacao(vm.usuario);
        }

        activate();
    }

})();