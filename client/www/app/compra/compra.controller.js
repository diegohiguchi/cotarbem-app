(function () {
    'use strict';
    var controllerId = 'compra';

    angular.module('cotarApp').controller(controllerId, ['$timeout', 'autenticacao', '$rootScope', 'services', '$state', 'load', '$ionicHistory', compra]);

    function compra($timeout, autenticacao, $rootScope, services, $state, load, $ionicHistory) {
        var vm = this;
        vm.usuario = autenticacao.getUser();
        vm.mensagens = [];
        vm.mostraNotificacaoCliente = true;

        vm.voltarPagina = function () {
            $ionicHistory.goBack();
        }

        vm.compraClienteSelecionada = function (compra) {
            var usuarioId = compra.fornecedor._id;
            $state.go('app.compraCliente', { 'usuarioId': usuarioId })
        };

        vm.compraFornecedorSelecionada = function (compra) {
            var usuarioId = compra.user._id;
            $state.go('app.compraFornecedor', { 'usuarioId': usuarioId })
        };


        vm.mostrarNotificacao = function (tipoUsuario) {
            if (vm.verificarTipoUsuario(tipoUsuario))
                vm.mostraNotificacaoTipoUsuario = null;
            else
                vm.mostraNotificacaoTipoUsuario = tipoUsuario;
        };

        vm.verificarTipoUsuario = function (tipoUsuario) {
            return vm.mostraNotificacaoTipoUsuario === tipoUsuario;
        };

        function obterComprasPorUsuarioId(usuarioId) {
            if (vm.usuario.cliente) {
                load.showLoadingSpinner();
                services.compraServices.obterPorUsuarioId(usuarioId).success(function (response) {
                    vm.comprasCliente = response;
                }).error(function (err, statusCode) {
                    load.hideLoading();
                    load.toggleLoadingWithMessage(err.message);
                }).then(function () {
                    load.hideLoading();
                });
            }

            if (vm.usuario.fornecedor) {
                load.showLoadingSpinner();
                services.compraServices.obterPorFornecedorId(usuarioId).success(function (response) {
                    vm.comprasFornecedor = response;
                }).error(function (err, statusCode) {
                    load.hideLoading();
                    load.toggleLoadingWithMessage(err.message);
                }).then(function () {
                    load.hideLoading();
                });
            }
        }

        function obterUsuario() {
            vm.usuario = autenticacao.getUser();
            vm.usuario.cliente = _.contains(vm.usuario.roles, 'cliente');
            vm.usuario.fornecedor = _.contains(vm.usuario.roles, 'fornecedor');
        }

        function activate() {
            obterUsuario();
            obterComprasPorUsuarioId(vm.usuario._id);
        }

        activate();
    }
})();