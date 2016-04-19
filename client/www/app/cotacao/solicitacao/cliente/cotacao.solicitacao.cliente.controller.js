(function () {
    'use strict';
    var controllerId = 'cotacao.solicitacao.cliente';

    function cotacaoSolicitacaoCliente($scope, $ionicModal, autenticacao, $rootScope, $location, services, $state, load, $timeout, $cordovaCamera, $ionicPopup, $ionicHistory) {
        var vm = this;
        var solicitacao = {};
        vm.categoria = angular.fromJson($state.params.categoria);

        if (!$rootScope.isAuthenticated)
            $location.path('/app/login');

        function obterSolicitacoesPorUsuario(usuarioId, categoriaId) {
            load.showLoadingSpinner();

            var solicitacao = { usuarioId: usuarioId, categoriaId: categoriaId }

            services.solicitacaoServices.obterSolicitacoesPorUsuarioECategoria(solicitacao).success(function (response) {
                var solicitacoes = _.sortBy(response.data, 'identificador');
                vm.solicitacoes = solicitacoes.reverse();
            }).error(function (err, statusCode) {
                load.hideLoading();
                load.toggleLoadingWithMessage(err.message);
            }).then(function () {
                load.hideLoading();
            });
        }

        vm.voltarPagina = function () {
            $ionicHistory.goBack();
        }

        vm.solicitacaoCadastro = function () {

            solicitacao = angular.toJson({
                usuarioId: vm.categoria.usuarioId,
                categoriaId: vm.categoria.categoriaId,
                categoriaNome: vm.categoria.categoriaNome
            });

            $state.go('app.cotacaoSolicitacaoClienteCadastro', { 'solicitacao': solicitacao });
        }
        
        vm.solicitacaoSelecionada = function (solicitacao) {
            
            if(solicitacao.ativo)
                return vm.showAlert('Cotação em andamento...', solicitacao);

            solicitacao = angular.toJson({
                usuarioId: vm.categoria.usuarioId,
                usuarioNome: vm.categoria.usuarioNome,
                usuarioUrlImagem: vm.categoria.usuarioUrlImagem,
                categoriaId: vm.categoria.categoriaId,
                categoriaNome: vm.categoria.categoriaNome,
                solicitacaoId: solicitacao._id,
                solicitacaoTitulo: solicitacao.titulo,
                produtos: solicitacao.produtos,
                dataCadastro: solicitacao.dataCadastro,
                ativo: solicitacao.ativo
            });

            $state.go('app.solicitacaoProduto', { 'solicitacao': solicitacao });
        }
        
        
            
       vm.showAlert = function (mensagem, solicitacao) {
            var alertPopup = $ionicPopup.alert({
                title: "<i class='fa fa-clock-o'></i> " + solicitacao.titulo,
                template: mensagem
            });
            alertPopup.then(function (res) {
                //console.log('Thank you for not eating my delicious ice cream cone');
            });
        };

        
        function activate() {
            obterSolicitacoesPorUsuario(vm.categoria.usuarioId, vm.categoria.categoriaId);
        }

        activate();
    }

    angular.module('cotarApp').controller(controllerId, ['$scope', '$ionicModal', 'autenticacao', '$rootScope', '$location', 'services', '$state', 'load', '$timeout', '$cordovaCamera', '$ionicPopup', '$ionicHistory', cotacaoSolicitacaoCliente]);
})();