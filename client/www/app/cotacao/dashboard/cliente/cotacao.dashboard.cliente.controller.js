(function () {
    'use strict';
    var controllerId = 'cotacao.dashboard.cliente';

    function cotacaoDashboardCliente(socket, $cordovaBadge, services, autenticacao, load, $state, $window) {
        socket.connect();
        var vm = this;
        var categoria = {};
        vm.notificacao = [];

        function obterQuantidadeNotificacoesIcone(quantidade) {
            if (ionic.Platform.platform() != "win32") {
                $cordovaBadge.promptForPermission();
                $cordovaBadge.hasPermission().then(function (result) {
                    $cordovaBadge.set(quantidade);
                }, function (error) {
                    console.log(error);
                });
            }
        }

        function adicionarNotificacao(data) {
            vm.notificacao.push(data);
            obterQuantidadeNotificacoesIcone(vm.notificacao.length);
        }

        socket.on('envia-cotacao-encerrada', function (data) {
            adicionarNotificacao(data);
        });

        socket.on('notificacao-chat-cliente', function (data) {
            adicionarNotificacao(data);
        });

        function obterSolicitacoesPorUsuario(usuarioId) {
            load.showLoadingSpinner();
            services.solicitacaoServices.obterSolicitacoesAtivasExcetoUltimaSolicitacaoPorUsuarioId(usuarioId).success(function (response) {
                vm.solicitacoes = response.data;
            }).error(function (err, statusCode) {
                load.hideLoading();
                load.toggleLoadingWithMessage(err.message);
            }).then(function () {
                services.dashboardServices.obterListaPorUsuarioId(usuarioId).success(function (response) {
                    vm.ultimaSolicitacao = response.data;
                    load.hideLoading();
                });
            });
        }

        function obterNotificacoes(usuarioId) {
            services.notificacaoServices.obterNotificacoesEmAbertoPorUsuarioId(usuarioId).success(function (response) {
                vm.notificacao = response.data;

                obterQuantidadeNotificacoesIcone(vm.notificacao.length);
            });
        }

        function obterUsuario() {
            vm.usuario = autenticacao.getUser();
            socket.emit('adiciona-usuario', vm.usuario);
        }

        function activate() {
            obterUsuario();
            obterSolicitacoesPorUsuario(vm.usuario._id);
            obterNotificacoes(vm.usuario._id);
        }

        vm.categoriaSelecionada = function (categoriaNome) {
            load.showLoadingSpinner();
            services.categoriaServices.obterPorNome(categoriaNome).success(function (response) {
                if (response.data != undefined) {
                    categoria = angular.toJson({
                        usuarioId: vm.usuario._id,
                        usuarioNome: vm.usuario.nome,
                        usuarioUrlImagem: vm.usuario.urlImagem,
                        categoriaId: response.data._id,
                        categoriaNome: response.data.nome
                    });

                    $state.go('app.solicitacaoCliente', { 'categoria': categoria });
                }
                load.hideLoading();
            }).error(function (err, statusCode) {
                load.hideLoading();
                load.toggleLoadingWithMessage(err.message);
            });
        }

        activate();
    }

    angular.module('cotarApp').controller(controllerId, ['socket', '$cordovaBadge', 'services', 'autenticacao', 'load', '$state', '$window', cotacaoDashboardCliente]);

})();