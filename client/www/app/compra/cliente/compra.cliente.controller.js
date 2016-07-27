(function () {
    'use strict';
    var controllerId = 'compra.cliente';

    angular.module('cotarApp').controller(controllerId, ['$timeout', 'connection', '$scope', '$ionicPopup', '$ionicModal',
        'autenticacao', '$rootScope', '$location', 'services', '$state', 'load', '$ionicHistory', compraCliente]);

    function compraCliente($timeout, connection, $scope, $ionicPopup, $ionicModal, autenticacao,
        $rootScope, $location, services, $state, load, $ionicHistory) {
        var vm = this;
        var sala = {};
        var avaliacao = {} || '';
        vm.usuarioLogado = autenticacao.getUser();
        vm.mostraDescricao = false;
        var usuarioId = $state.params.usuarioId;

        if (!$rootScope.isAuthenticated)
            $location.path('/app/login');

        vm.voltarPagina = function () {
            $ionicHistory.goBack();
        }

        vm.ampliarImagem = function (animation) {
            $ionicModal.fromTemplateUrl('imagem.html', {
                scope: $scope,
                animation: 'animated ' + animation,
            }).then(function (modal) {
                vm.modalImagem = modal;
                vm.modalImagem.show();
                vm.fecharImagem = function () {
                    vm.modalImagem.hide();
                }
            });
            /*vm.modalImagem.show();*/
        }

        function obterUsuario(usuarioId) {
            load.showLoadingSpinner();
            services.usuarioServices.obterPorId(usuarioId).success(function (response) {
                vm.usuario = response;
                //vm.usuario.profileImageURL = connection.baseWeb() + '/' + vm.usuario.profileImageURL;
                load.hideLoading();
            }).error(function (err, statusCode) {
                load.hideLoading();
                load.toggleLoadingWithMessage(err.message);
            });
        }

        function activate() {
            obterUsuario(usuarioId);
        }

        activate();
    }

})();