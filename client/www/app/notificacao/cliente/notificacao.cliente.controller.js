(function () {
    'use strict';
    var controllerId = 'notificacao.cliente';

    function cotacaoNotificacaoCliente(autenticacao, $rootScope, services, $state, load, $ionicHistory) {
        var vm = this;
        vm.mensagens = [];

        vm.voltarPagina = function () {
            $ionicHistory.goBack();
        }

        function obterMensagensPorUsuarioId(usuarioId) {
            load.showLoadingSpinner();
            services.notificacaoServices.obterPorUsuarioId(usuarioId).success(function (response) {
                vm.mensagens = response.data;
            }).error(function (err, statusCode) {
                load.hideLoading();
                load.toggleLoadingWithMessage(err.message);
            }).then(function () {
                if (vm.mensagens.length > 0) {
                    services.notificacaoServices.editarListaPorUsuarioId(usuarioId).success(function (reponse) {
                        load.hideLoading();
                    });
                } else
                    load.hideLoading();
            });
        }

        function obterUsuarioLogado() {
            vm.usuario = autenticacao.getUser();
        }

        function activate() {
            obterUsuarioLogado();
            obterMensagensPorUsuarioId(vm.usuario._id);
        }

        activate();
    }

    angular.module('cotarApp').controller(controllerId, ['autenticacao', '$rootScope', 'services', '$state', 'load', '$ionicHistory', cotacaoNotificacaoCliente]);
})();