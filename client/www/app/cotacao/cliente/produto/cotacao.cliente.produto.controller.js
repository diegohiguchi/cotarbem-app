(function () {
    'use strict';
    var controllerId = 'cotacao.cliente.produto';

    angular.module('cotarApp').controller(controllerId, ['$timeout', 'autenticacao', '$rootScope', '$location', 'services', '$state', 'load', '$ionicHistory', cotacaoClienteProduto]);

    function cotacaoClienteProduto($timeout, autenticacao, $rootScope, $location, services, $state, load, $ionicHistory) {
        var vm = this;
        //var solicitacaoId = $state.params.solicitacaoId != undefined ? $state.params.solicitacaoId : $state.params.id;
        var solicitacao = angular.fromJson($state.params.solicitacao);
        var cotacao = {};
        var produto = {};
        vm.usuario = autenticacao.getUser();

        function obterSolicitacao(solicitacaoId) {
            load.showLoadingSpinner();
            services.solicitacaoServices.obterPorId(solicitacaoId).success(function (response) {
                vm.solicitacao = response;
                load.hideLoading();
            }).error(function (err, statusCode) {
                load.hideLoading();
                load.toggleLoadingWithMessage(err.message);
            });
        }

        if (!$rootScope.isAuthenticated)
            $location.path('/app/login');

        vm.voltarPagina = function () {
            $ionicHistory.goBack();
        };

        vm.produtoSelecionado = function (produto) {

            cotacao = angular.toJson({
                produto: produto,
                solicitacao: {_id: vm.solicitacao._id}
            });

            $state.go('app.cotacaoClienteProdutoValor', { 'cotacao': cotacao });
        };

        function activate() {
            obterSolicitacao(solicitacao._id);
        }

        activate();
    }

})();