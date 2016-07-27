(function () {
    'use strict';
    var controllerId = 'cotacao.cliente.produto.valor.detalhar';

    angular.module('cotarApp').controller(controllerId, ['$timeout', 'connection', 'ratingConfig', '$scope', '$ionicPopup', '$ionicModal',
        'autenticacao', '$rootScope', '$location', 'services', '$state', 'load', '$ionicHistory', cotacaoClienteProdutoValorDetalhar]);

    function cotacaoClienteProdutoValorDetalhar($timeout, connection, ratingConfig, $scope, $ionicPopup, $ionicModal, autenticacao,
        $rootScope, $location, services, $state, load, $ionicHistory) {
        var vm = this;
        var sala = {};
        var avaliacao = {} || '';
        vm.usuarioLogado = autenticacao.getUser();
        vm.mostraDescricao = false;
        vm.cotacao = angular.fromJson($state.params.cotacao);
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
            sala = angular.toJson({
                user: vm.usuario,
                solicitacao: vm.cotacao.solicitacao._id,
                produto: vm.cotacao.produto
            });

            $state.go('app.salaChat', { 'sala': sala })
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

        // function vincularDadosDaAvaliacao(cotacao, usuarioVencedor, avaliacao) {
        //     return {
        //         usuario: {
        //             usuarioId: vm.usuarioLogado._id,
        //             nome: vm.usuarioLogado.nome
        //         },
        //         cotacao: {
        //             cotacaoId: cotacao._id,
        //             usuario: {
        //                 usuarioId: usuarioVencedor.usuarioId,
        //                 nome: usuarioVencedor.usuarioNome
        //             },
        //             produto: {
        //                 nome: cotacao.produto.nome,
        //                 tipoCotacao: cotacao.produto.tipoCotacao,
        //                 quantidade: cotacao.produto.quantidade
        //             }
        //         },
        //         nota: avaliacao.rate
        //     }
        // }

        // function adicionarAvaliacao(cotacao, avaliacao) {
        //     load.showLoadingSpinner();

        //     var usuarioVencedor = _.sortBy(cotacao.lances, 'valor')[0];
        //     avaliacao = vincularDadosDaAvaliacao(cotacao, usuarioVencedor, avaliacao);

        //     services.avaliacaoServices.adicionar(avaliacao).success(function (response) {
        //         load.hideLoading();
        //     });
        // }

        // function obterAvaliacao(cotacaoId) {
        //     services.avaliacaoServices.obterPorCotacaoId(cotacaoId).success(function (response) {
        //         vm.avaliacao.rate = response.data != undefined ? response.data.nota : response.data;
        //         load.hideLoading();
        //     });
        // }

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

        // vm.avaliarCotacao = function (rating) {
        //     vm.avaliacao.rate = rating.rate;
        //     vm.avaliacao.max = rating.max;

        //     adicionarAvaliacao(vm.cotacao, vm.avaliacao);
        // }

        // vm.showPopup = function () {

        //     // An elaborate, custom popup
        //     var myPopup = $ionicPopup.show({
        //         templateUrl: 'avaliacao.html',
        //         title: 'Avaliação',
        //         //subTitle: 'Please use normal things',
        //         scope: $scope,
        //         buttons: [
        //             { text: 'Cancelar' },
        //             {
        //                 text: '<b>Avaliar</b>',
        //                 type: 'button-positive',
        //                 onTap: function (e) {
        //                     if (!vm.rating) {
        //                         //don't allow the user to close unless he enters wifi password
        //                         e.preventDefault();
        //                     } else {

        //                         return vm.avaliarCotacao(vm.rating);
        //                     }
        //                 }
        //             },
        //         ]
        //     });
        //     myPopup.then(function (res) {
        //         console.log('Tapped!', res);
        //     });
        //     // $timeout(function () {
        //     //     myPopup.close(); //close the popup after 3 seconds for some reason
        //     // }, 3000);
        // };

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

        function enviadoComSucesso() {
            load.showLoading('Solicita&ccedil;&atilde;o de compra enviada com sucesso');

            $timeout(function () {
                //$state.go('app.cotacaoCliente');

                load.hideLoading();
            }, 3000);
        }

        function notificarDevice(compra) {
            var device = {
                titulo: 'Cotar Bem',
                mensagem: 'Solicitação de compra',
                usuarioId: compra.fornecedor
            }

            services.deviceServices.notificar(device).success(function (response) {

            }).error(function (err, statusCode) {
                load.hideLoading();
                load.toggleLoadingWithMessage(err.message);
            }).then(function () {
                var cotacao = {
                    produto: vm.cotacao.produto,
                    fornecedor: vm.usuario,
                    cliente: vm.usuarioLogado
                }

                services.notificacaoServices.notificarFornecedorProduto(cotacao).success(function (reponse) {
                    enviadoComSucesso();
                }).error(function (err, statusCode) {
                    load.hideLoading();
                    load.toggleLoadingWithMessage(err.message);
                });
            });
        }

        vm.comprar = function () {
            load.showLoadingSpinner();
            var compra = {
                fornecedor: vm.usuario._id,
                produto: vm.cotacao.produto._id,
                valorTotal: (vm.cotacao.produto.valor * vm.cotacao.produto.quantidade).toFixed(2),
                user: vm.usuarioLogado._id
            }
            
            services.compraServices.adicionar(compra).success(function (response) {

            }).error(function (err, statusCode) {
                load.hideLoading();
                load.toggleLoadingWithMessage(err.message);
            }).then(function () {
                notificarDevice(compra);
            });
        };

        // function obterImagem() {
        //     if (vm.usuario.profileImageURL != undefined && vm.usuario.profileImageURL != '')
        //         vm.imagemURL = connection.baseWeb() + "/" + vm.usuario.profileImageURL;
        // }

        function obterUsuario(usuario) {
            load.showLoadingSpinner();
            services.usuarioServices.obterPorId(usuario._id).success(function (response) {
                vm.usuario = response;
                
                //obterImagem();
                load.hideLoading();
            }).error(function (err, statusCode) {
                load.hideLoading();
                load.toggleLoadingWithMessage(err.message);
            });
        }

        function activate() {
            obterUsuario(vm.cotacao.usuario);
            // obterUsuarioLogado();
            // obterEnderecoUsuario(vm.cotacaoProduto.usuarioId);
            // obterCotacaoPorSolicitacaoEProduto(vm.cotacaoProduto);
        }

        activate();
    }

})();