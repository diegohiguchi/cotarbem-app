(function () {
    'use strict';
    var controllerId = 'cotacao.cliente.produto.valor';

    angular.module('cotarApp').controller(controllerId, ['connection', '$timeout', 'autenticacao', '$rootScope', '$location', 'services', '$state', 'load', '$ionicHistory', cotacaoClienteProdutoValor]);

    function cotacaoClienteProdutoValor(connection, $timeout, autenticacao, $rootScope, $location, services, $state, load, $ionicHistory) {
        var vm = this;
        vm.cotacao = angular.fromJson($state.params.cotacao);
        vm.usuario = autenticacao.getUser();

        if (!$rootScope.isAuthenticated)
            $location.path('/app/login');

        vm.voltarPagina = function () {
            $ionicHistory.goBack();
        };

        vm.detalharCotacaoProduto = function (cotacao) {

            cotacao = angular.toJson({
                usuario: { _id: cotacao.usuario._id },
                solicitacao: {_id: vm.cotacao.solicitacao._id},
                produto: cotacao.produto
            });

            $state.go('app.cotacaoClienteProdutoValorDetalhar', { 'cotacao': cotacao });
        };

        function obterCotacoesPorSolicitacaoEProduto(solicitacaoId, produtoId) {
            load.showLoadingSpinner();
            var cotacao = {
                solicitacao: {_id: solicitacaoId},
                produto: {_id: produtoId}
            };

            services.cotacaoServices.obterCotacoesPorSolicitacaoEProduto(cotacao).success(function (response) {
                vm.cotacoes = response;

                load.hideLoading();
            }).error(function (err, statusCode) {
                load.hideLoading();
                load.toggleLoadingWithMessage(err.message);
            });
        }

        // function obterImagem(){
        //     if(vm.cotacao.produto.imagemURL != undefined && vm.cotacao.produto.imagemURL != '')
        //         vm.imagemURL = connection.baseWeb() + "/" + vm.cotacao.produto.imagemURL;
        // }

        function activate() {
            obterCotacoesPorSolicitacaoEProduto(vm.cotacao.solicitacao._id, vm.cotacao.produto._id);
            //obterImagem();
        }

        activate();
    }

})();