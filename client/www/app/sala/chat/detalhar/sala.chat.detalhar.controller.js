(function () {
    'use strict';
    var controllerId = 'sala.chat.detalhar';

    angular.module('cotarApp').controller(controllerId, ['connection', '$scope', '$ionicPopup', '$ionicModal',
        'autenticacao', '$rootScope', '$location', 'services', '$state', 'load', '$ionicHistory', salaChatDetalhar]);

    function salaChatDetalhar(connection, $scope, $ionicPopup, $ionicModal, autenticacao,
        $rootScope, $location, services, $state, load, $ionicHistory) {
        var vm = this;
        var sala = {};
        var avaliacao = {} || '';
        vm.usuarioLogado = autenticacao.getUser();
        vm.cotacaoDetalhes = angular.fromJson($state.params.cotacao);

        if (!$rootScope.isAuthenticated)
            $location.path('/app/login');

        vm.voltarPagina = function () {
            $ionicHistory.goBack();
        }

        // function obterImagem() {
        //     if (vm.cotacao.produto.imagemURL != undefined && vm.cotacao.produto.imagemURL != '')
        //         vm.imagemURL = connection.baseWeb() + "/" + vm.cotacao.produto.imagemURL;
        // }

        function obterCotacaoProduto(cotacao) {
            load.showLoadingSpinner();
            services.cotacaoServices.obterCotacaoPorSolicitacaoEUsuario(cotacao).success(function (response) {
                var cotacao = response;
                vm.cotacao = _.find(cotacao.produtos, function (cotacao) {
                    return cotacao.produto._id == vm.cotacaoDetalhes.produto._id
                });

                //obterImagem();

                load.hideLoading();
            }).error(function (err, statusCode) {
                load.hideLoading();
                load.toggleLoadingWithMessage(err.message);
            });
        }

        function activate() {
            obterCotacaoProduto(vm.cotacaoDetalhes);
        }

        activate();
    }

})();