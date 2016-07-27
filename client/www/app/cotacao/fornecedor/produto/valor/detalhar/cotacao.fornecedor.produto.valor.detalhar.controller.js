(function () {
    'use strict';
    var controllerId = 'cotacao.fornecedor.produto.valor.detalhar';

    angular.module('cotarApp').controller(controllerId, ['$timeout', 'autenticacao', '$rootScope', '$location', 'services', '$state', 'load', '$ionicHistory', cotacaoFornecedorProdutoValorDetalhar]);

    function cotacaoFornecedorProdutoValorDetalhar($timeout, autenticacao, $rootScope, $location, services, $state, load, $ionicHistory) {
        var vm = this;
        var produto = {};
        vm.cotacao = angular.fromJson($state.params.cotacao);
        vm.usuario = autenticacao.getUser();

        if (!$rootScope.isAuthenticated)
            $location.path('/app/login');

        vm.voltarPagina = function () {
            $ionicHistory.goBack();
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

        function activate() {
            obterCotacoesPorSolicitacaoEProduto(vm.cotacao.solicitacao._id, vm.cotacao.produto._id);
        }

        activate();
    }

})();