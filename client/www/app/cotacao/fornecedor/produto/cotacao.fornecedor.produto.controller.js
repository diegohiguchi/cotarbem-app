(function () {
    'use strict';
    var controllerId = 'cotacao.fornecedor.produto';

    angular.module('cotarApp').controller(controllerId, ['$timeout', 'autenticacao', '$rootScope', '$location', 'services', '$state', 'load', '$ionicHistory', cotacaoFornecedorProduto]);

    function cotacaoFornecedorProduto($timeout, autenticacao, $rootScope, $location, services, $state, load, $ionicHistory) {
        var vm = this;
        var produto = {};
        //var solicitacaoId = $state.params.solicitacaoId != undefined ? $state.params.solicitacaoId : $state.params.id;
        var solicitacao = angular.fromJson($state.params.solicitacao);
        var categoria = {};
        vm.usuario = autenticacao.getUser();

        // function obterCotacoesClientePorSolicitacaoId(solicitacaoId) {
        //     load.showLoadingSpinner();
        //     services.cotacaoServices.obterListaPorSolicitacaoId(solicitacaoId).success(function (response) {
        //         vm.solicitacoes = response.data;
        //         load.hideLoading();
        //     }).error(function (err, statusCode) {
        //         load.hideLoading();
        //         load.toggleLoadingWithMessage(err.message);
        //     });
        // }

        // function obterCotacoes(tipoUsuario) {
        //     if (tipoUsuario.nome === 'Cliente')
        //         obterCotacoesClientePorSolicitacaoId(vm.solicitacao.solicitacaoId != undefined ? vm.solicitacao.solicitacaoId : vm.solicitacao._id);
        // }

        function obterSolicitacao(solicitacaoId) {
            load.showLoadingSpinner();
            services.solicitacaoServices.obterPorId(solicitacaoId).success(function (response) {
                vm.solicitacao = response;
                load.hideLoading();
            }).error(function (err, statusCode) {
                load.hideLoading();
                load.toggleLoadingWithMessage(err.message);
            });

            // if (solicitacao == undefined) {
            //     var solicitacaoId = $state.params.id;
            //     load.showLoadingSpinner();
            //     services.solicitacaoServices.obterPorId(solicitacaoId).success(function (response) {
            //         vm.solicitacao = response.data;
            //     }).then(function () {
            //         services.categoriaServices.obterPorId(vm.solicitacao.categoriaId).success(function (response) {
            //             categoria = response.data;
            //             obterCotacoes(vm.usuario.tipoUsuario);
            //             load.hideLoading();
            //         });
            //     });
            // } else {
            //     vm.solicitacao = solicitacao;
            //     obterCotacoes(vm.usuario.tipoUsuario);
            // }
        }

        if (!$rootScope.isAuthenticated)
            $location.path('/app/login');

        vm.voltarPagina = function () {
            $ionicHistory.goBack();
        };

        vm.produtoSelecionado = function (produto) {

            // produto = angular.toJson({
            //     usuarioId: vm.usuario._id,
            //     usuarioNome: vm.usuario.nome,
            //     categoriaId: vm.solicitacao.categoriaId,
            //     categoriaNome: vm.solicitacao.categoriaNome != undefined ? vm.solicitacao.categoriaNome : categoria.nome,
            //     solicitacaoId: vm.solicitacao.solicitacaoId != undefined ? vm.solicitacao.solicitacaoId : vm.solicitacao._id,
            //     solicitacaoTitulo: vm.solicitacao.solicitacaoTitulo != undefined ? vm.solicitacao.solicitacaoTitulo : vm.solicitacao.titulo,
            //     solicitacaoUsuarioId: vm.solicitacao.solicitacaoUsuarioId != undefined ? vm.solicitacao.solicitacaoUsuarioId : vm.solicitacao.usuarioId,
            //     dataCadastro: vm.solicitacao.dataCadastro,
            //     ativo: vm.solicitacao.ativo,
            //     produto: produto
            // });

            produto = angular.toJson({
                _id: produto._id,
                solicitacao: { _id: vm.solicitacao._id }
            });

            $state.go('app.cotacaoFornecedorProdutoValor', { 'produto': produto });
        };

        // vm.produtoSelecionado = function (produto) {

        //     produto = angular.toJson({
        //         usuarioId: vm.usuario._id,
        //         usuarioNome: vm.usuario.nome,
        //         categoriaId: vm.solicitacao.categoriaId,
        //         categoriaNome: vm.solicitacao.categoriaNome != undefined ? vm.solicitacao.categoriaNome : categoria.nome,
        //         solicitacaoId: vm.solicitacao.solicitacaoId != undefined ? vm.solicitacao.solicitacaoId : vm.solicitacao._id,
        //         solicitacaoTitulo: vm.solicitacao.solicitacaoTitulo != undefined ? vm.solicitacao.solicitacaoTitulo : vm.solicitacao.titulo,
        //         solicitacaoUsuarioId: vm.solicitacao.solicitacaoUsuarioId != undefined ? vm.solicitacao.solicitacaoUsuarioId : vm.solicitacao.usuarioId,
        //         dataCadastro: vm.solicitacao.dataCadastro,
        //         ativo: vm.solicitacao.ativo,
        //         produto: produto
        //     });

        //     $state.go('app.solicitacaoProdutoLeilao', { 'produto': produto });
        // };

        // vm.detalharProduto = function (produto) {
        //     var usuarioVencedor = _.sortBy(produto.lances, 'valor')[0];
        //     produto = angular.toJson({
        //         usuarioId: usuarioVencedor.usuarioId,
        //         usuarioNome: usuarioVencedor.usuarioNome,
        //         solicitacaoTitulo: vm.solicitacao.solicitacaoTitulo != undefined ? vm.solicitacao.solicitacaoTitulo : vm.solicitacao.titulo,
        //         categoriaId: vm.solicitacao.categoriaId,
        //         categoriaNome: vm.solicitacao.categoriaNome != undefined ? vm.solicitacao.categoriaNome : categoria.nome,
        //         solicitacaoId: vm.solicitacao.solicitacaoId != undefined ? vm.solicitacao.solicitacaoId : vm.solicitacao._id,
        //         dataCadastro: vm.solicitacao.dataCadastro,
        //         ativo: vm.solicitacao.ativo,
        //         produto: produto
        //     });

        //     $state.go('app.solicitacaoProdutoDetalhar', { 'produto': produto });
        // };

        function activate() {
            obterSolicitacao(solicitacao._id);
        }

        activate();
    }

})();