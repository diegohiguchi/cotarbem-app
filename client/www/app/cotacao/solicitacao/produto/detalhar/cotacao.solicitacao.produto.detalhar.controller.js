(function () {
    'use strict';
    var controllerId = 'cotacao.solicitacao.produto.detalhar';

    function cotacaoSolicitacaoProdutoDetalhar(ratingConfig, $scope, $ionicPopup, $ionicModal, autenticacao, $rootScope, $location, services, $state, load, $ionicHistory) {
        var vm = this;
        var sala = {};
        var avaliacao = {} || '';
        vm.mostraDescricao = false;
        vm.cotacaoProduto = angular.fromJson($state.params.produto);
        vm.rating = {};
        vm.rating.rate = 0;
        vm.rating.max = 5;
        vm.avaliacao = {};
        vm.avaliacao.rate = 0;
        vm.avaliacao.max = 5;

        if (!$rootScope.isAuthenticated)
            $location.path('/app/login');

        vm.voltarPagina = function () {
            $ionicHistory.goBack();
        }

        vm.usuarioSelecionado = function () {
            var data = new Date();
            data = moment(data).format("DD/MM/YYYY HH:mm:ss");

            sala = angular.toJson({
                usuario: {
                    usuarioId: vm.cotacaoProduto.usuarioId,
                    nome: vm.cotacaoProduto.usuarioNome,
                    urlImagem: vm.cotacaoProduto.usuarioUrlImagem
                },
                solicitacao: {
                    solicitacaoId: vm.cotacaoProduto.solicitacaoId,
                    titulo: vm.cotacaoProduto.solicitacaoTitulo
                },
                produto: vm.cotacaoProduto.produto.produto,
                ativo: true,
                dataCadastro: data
            });

            $state.go('app.chat', { 'sala': sala })
        }

        function obterEnderecoUsuario(usuarioId) {
            load.showLoadingSpinner();
            services.usuarioServices.obterPorId(usuarioId).success(function (response) {
                vm.usuario = response.data;
                load.hideLoading();
            }).error(function (err, statusCode) {
                load.hideLoading();
                load.toggleLoadingWithMessage(err.message);
            });
        }

        function vincularDadosDaAvaliacao(cotacao, usuarioVencedor, avaliacao) {
            return {
                usuario: {
                    usuarioId: vm.usuarioLogado._id,
                    nome: vm.usuarioLogado.nome
                },
                cotacao: {
                    cotacaoId: cotacao._id,
                    usuario: {
                        usuarioId: usuarioVencedor.usuarioId,
                        nome: usuarioVencedor.usuarioNome
                    },
                    produto: {
                        nome: cotacao.produto.nome,
                        tipoCotacao: cotacao.produto.tipoCotacao,
                        quantidade: cotacao.produto.quantidade
                    }
                },
                nota: avaliacao.rate
            }
        }

        function adicionarAvaliacao(cotacao, avaliacao) {
            load.showLoadingSpinner();

            var usuarioVencedor = _.sortBy(cotacao.lances, 'valor')[0];
            avaliacao = vincularDadosDaAvaliacao(cotacao, usuarioVencedor, avaliacao);
    
            services.avaliacaoServices.adicionar(avaliacao).success(function (response) {
                load.hideLoading();
            });
        }

        function obterAvaliacao(cotacaoId) {
            services.avaliacaoServices.obterPorCotacaoId(cotacaoId).success(function (response) {
                vm.avaliacao.rate = response.data != undefined ? response.data.nota : response.data;
                load.hideLoading();
            });
        }

        function obterCotacaoPorSolicitacaoEProduto(solicitacao) {
            load.showLoadingSpinner();
            services.cotacaoServices.obterCotacaoPorSolicitacaoEProduto(solicitacao).success(function (response) {
                vm.cotacao = response.data;
            }).error(function (err, statusCode) {
                load.hideLoading();
                load.toggleLoadingWithMessage(err.message);
            }).then(function () {
                obterAvaliacao(vm.cotacao._id);
            });
        }

        vm.avaliarCotacao = function (rating) {
            vm.avaliacao.rate = rating.rate;
            vm.avaliacao.max = rating.max;

            adicionarAvaliacao(vm.cotacao, vm.avaliacao);
        }

        vm.showPopup = function () {

            // An elaborate, custom popup
            var myPopup = $ionicPopup.show({
                templateUrl: 'avaliacao.html',
                title: 'Avaliação',
                //subTitle: 'Please use normal things',
                scope: $scope,
                buttons: [
                    { text: 'Cancelar' },
                    {
                        text: '<b>Avaliar</b>',
                        type: 'button-positive',
                        onTap: function (e) {
                            if (!vm.rating) {
                                //don't allow the user to close unless he enters wifi password
                                e.preventDefault();
                            } else {

                                return vm.avaliarCotacao(vm.rating);
                            }
                        }
                    },
                ]
            });
            myPopup.then(function (res) {
                console.log('Tapped!', res);
            });
            // $timeout(function () {
            //     myPopup.close(); //close the popup after 3 seconds for some reason
            // }, 3000);
        };

        vm.ampliarImagem = function(animation){
            $ionicModal.fromTemplateUrl('imagem.html', {
                scope: $scope,
                animation: 'animated ' + animation,
            }).then(function (modal) {
                vm.modalImagem = modal;
                vm.modalImagem.show();
                vm.fecharImagem = function (){
                    vm.modalImagem.hide();
                }
            });
            /*vm.modalImagem.show();*/
        }

        function obterUsuarioLogado() {
            vm.usuarioLogado = autenticacao.getUser();
        }

        function activate() {
            obterUsuarioLogado();
            obterEnderecoUsuario(vm.cotacaoProduto.usuarioId);
            obterCotacaoPorSolicitacaoEProduto(vm.cotacaoProduto);
        }

        activate();
    }

    angular.module('cotarApp').controller(controllerId, ['ratingConfig', '$scope', '$ionicPopup', '$ionicModal', 'autenticacao', '$rootScope', '$location', 'services', '$state', 'load', '$ionicHistory', cotacaoSolicitacaoProdutoDetalhar]);
})();