(function () {
    'use strict';
    var controllerId = 'notificacao';

    angular.module('cotarApp').controller(controllerId, ['$timeout', 'autenticacao', '$rootScope', 'services', '$state', 'load', '$ionicHistory', notificacao]);

    function notificacao($timeout, autenticacao, $rootScope, services, $state, load, $ionicHistory) {
        var vm = this;
        vm.usuario = autenticacao.getUser();
        vm.mensagens = [];
        vm.mostraNotificacaoCliente = true;

        vm.voltarPagina = function () {
            $ionicHistory.goBack();
        }

        function redirecionarSala(sala) {
            sala = angular.toJson({
                solicitacao: sala.solicitacao,
                produto: sala.produto,
                user: sala.user,
                menuSala: true
            });

            $state.go('app.salaChat', { 'sala': sala })
        }

        vm.notificacaoClienteSelecionada = function (notificacao) {
            if (notificacao.solicitacao) {
                var solicitacao = angular.toJson({ _id: notificacao.solicitacao._id });

                $state.go('app.cotacaoClienteProduto', { 'solicitacao': solicitacao });
            } else if (notificacao.sala) {
                redirecionarSala(notificacao.sala);
            }
        }

        vm.notificacaoFornecedorSelecionada = function (notificacao) {
            if (notificacao.solicitacao) {
                var solicitacao = angular.toJson({ _id: notificacao.solicitacao._id });
                $state.go('app.cotacaoFornecedorProduto', { 'solicitacao': solicitacao });
            } else if (notificacao.sala) {
                redirecionarSala(notificacao.sala);
            }
        }

        function editarNotificacoesPorUsuario(mensagens) {
            //var notificacoesNaoLidas = _.filter(vm.mensagens, { ativo: true });
            var notificacoesNaoLidas = _.filter(mensagens, { ativo: true });

            if (notificacoesNaoLidas.length > 0) {
                notificacoesNaoLidas = _.pluck(notificacoesNaoLidas, '_id');

                services.notificacaoServices.editarLista(notificacoesNaoLidas).success(function (reponse) {
                    load.hideLoading();
                });
            } else
                load.hideLoading();
        }

        $timeout(function () {
            vm.mostrarNotificacao = function (tipoUsuario) {
                if (vm.verificarTipoUsuario(tipoUsuario)) {
                    vm.mostraNotificacaoTipoUsuario = null;
                } else {
                    vm.mostraNotificacaoTipoUsuario = tipoUsuario;

                    if (tipoUsuario == 'cliente')
                        editarNotificacoesPorUsuario(vm.mensagensCliente);
                    else
                        editarNotificacoesPorUsuario(vm.mensagensFornecedor);
                }
            };
        }, 0);

        vm.verificarTipoUsuario = function (tipoUsuario) {
            return vm.mostraNotificacaoTipoUsuario === tipoUsuario;
        };

        function obterMensagensPorUsuarioId(usuarioId) {
            load.showLoadingSpinner();
            services.notificacaoServices.obterPorUsuarioId(usuarioId).success(function (response) {
                vm.mensagens = response;

                if (vm.mensagens != undefined) {
                    vm.mensagensCliente = _.filter(vm.mensagens, function (item) {
                        return item.assunto.split('-')[0].trim() == 'Cliente'
                    });
                    vm.mensagensFornecedor = _.filter(vm.mensagens, function (item) {
                        return item.assunto.split('-')[0].trim() == 'Fornecedor'
                    });
                }
            }).error(function (err, statusCode) {
                load.hideLoading();
                load.toggleLoadingWithMessage(err.message);
            }).then(function () {
                load.hideLoading();

                $timeout(function () {
                    vm.mostrarNotificacao('cliente');
                }, 0);
                //editarNotificacoesPorUsuario();
            });
        }

        function obterUsuario() {
            vm.usuario = autenticacao.getUser();
            vm.usuario.cliente = _.contains(vm.usuario.roles, 'cliente');
            vm.usuario.fornecedor = _.contains(vm.usuario.roles, 'fornecedor');
        }

        function activate() {
            obterUsuario();
            obterMensagensPorUsuarioId(vm.usuario._id);
        }

        activate();
    }
})();