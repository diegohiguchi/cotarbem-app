(function () {
    'use strict';
    var controllerId = 'cotacao.solicitacao.fornecedor';

    function cotacaoSolicitacaoFornecedor($rootScope, $location, services, $state, load, $ionicHistory) {
        var vm = this;
        var solicitacao = {};
        var solicitacoesEncerrada = [];
        vm.categoria = angular.fromJson($state.params.categoria);
        vm.solicitacoes = [];

        if (!$rootScope.isAuthenticated)
            $location.path('/app/login');

        vm.voltarPagina = function () {
            $ionicHistory.goBack();
        }

        vm.solicitacaoSelecionada = function (solicitacao) {

            solicitacao = angular.toJson({
                usuarioId: vm.categoria.usuarioId,
                usuarioNome: vm.categoria.usuarioNome,
                usuarioUrlImagem: vm.categoria.usuarioUrlImagem,
                categoriaId: vm.categoria.categoriaId,
                categoriaNome: vm.categoria.categoriaNome,
                solicitacaoId: solicitacao._id,
                solicitacaoUsuarioId: solicitacao.usuarioId,
                solicitacaoTitulo: solicitacao.titulo,
                produtos: solicitacao.produtos,
                dataCadastro: solicitacao.dataCadastro,
                ativo: solicitacao.ativo
            });

            $state.go('app.solicitacaoProduto', { 'solicitacao': solicitacao });
        }

        function obterSolicitacoesPorCategoria(categoriaId) {
            load.showLoadingSpinner();

            services.solicitacaoServices.obterSolicitacoesPorCategoriaId(categoriaId).success(function (response) {
                var solicitacoes = response.data;
                vm.solicitacoes = _.sortBy(_.filter(solicitacoes, { ativo: true }), 'dataCadastro');
                solicitacoesEncerrada = _.filter(solicitacoes, { ativo: false });
            }).error(function (err, statusCode) {
                load.hideLoading();
                load.toggleLoadingWithMessage(err.message);
            }).then(function () {
                services.cotacaoServices.obterListaCotacoesPorUsuarioId(vm.categoria.usuarioId).success(function (response) {
                    var cotacoes = response.data;

                    if (cotacoes != undefined && cotacoes.length > 0) {
                        cotacoes.forEach(function (cotacao) {
                            var solicitacao = _.find(solicitacoesEncerrada, {_id: cotacao.solicitacao.solicitacaoId});   
                            if(solicitacao != undefined)
                                vm.solicitacoes.push(solicitacao);
                        });
                    }
                    load.hideLoading();
                });
            });
        }

        function activate() {
            obterSolicitacoesPorCategoria(vm.categoria.categoriaId)
        }

        activate();
    }

    angular.module('cotarApp').controller(controllerId, ['$rootScope', '$location', 'services', '$state', 'load', '$ionicHistory', cotacaoSolicitacaoFornecedor]);
})();