(function () {
    'use strict';
    var controllerId = 'cotacao.fornecedor.produto.valor';

    angular.module('cotarApp').controller(controllerId, ['connection', '$ionicPopover', 'socket', 'autenticacao', '$location', '$scope', '$ionicModal', '$ionicPopup', '$state', 'services', '$ionicHistory', 'load', '$timeout', cotacaoFornecedorProdutoValor]);

    function cotacaoFornecedorProdutoValor(connection, $ionicPopover, socket, autenticacao, $location, $scope, $ionicModal, $ionicPopup, $state, services, $ionicHistory, load, $timeout) {
        socket.connect();
        var vm = this;
        var cotacao = {};
        var usuarioSolicitacao = {};
        var envioDeLance = false;
        vm.cotacao = {};
        vm.mostraDescricao = false;
        vm.primeirosLances = [];
        vm.produtoSelecionado = angular.fromJson($state.params.produto);
        vm.usuarioLogado = autenticacao.getUser();

        // function obterPosicaoLanceUsuarioLogado(lances) {
        //     var lanceUsuarioLogado = _.find(lances, { usuarioId: vm.produtoSelecionado.usuarioId });
        //     var indexValorUsuarioLogado = lances.indexOf(lanceUsuarioLogado);

        //     if (indexValorUsuarioLogado == 0 && envioDeLance) {
        //         var device = {};
        //         var usuarios = [];
        //         var ultimoUsuario = '';
        //         var usuariosComLancesAbaixo = _.reject(lances, { usuarioId: vm.produtoSelecionado.usuarioId });

        //         if (usuariosComLancesAbaixo.length > 0) {
        //             usuariosComLancesAbaixo.forEach(function (usuario) {

        //                 if (ultimoUsuario != usuario.usuarioId) {
        //                     usuarios.push({
        //                         usuarioId: usuario.usuarioId
        //                     });
        //                 }
        //                 ultimoUsuario = usuario.usuarioId;
        //             });

        //             device.usuarioId = _.pluck(usuarios, 'usuarioId');
        //             device.titulo = 'Cotar Bem';
        //             device.mensagem = 'Verifique suas cotações';

        //             var notificacaoLeilao = {
        //                 usuariosId: device.usuarioId,
        //                 url: $location.$$url
        //             }

        //             socket.emit('leilao', notificacaoLeilao);

        //             services.deviceTokenServices.notificarUsuarios(device).success(function () { });
        //         }
        //     }

        //     if (indexValorUsuarioLogado >= 3) {
        //         vm.lanceUsuarioLogado = {
        //             usuarioId: lanceUsuarioLogado.usuarioId,
        //             usuarioNome: lanceUsuarioLogado.usuarioNome,
        //             valor: lanceUsuarioLogado.valor,
        //             posicao: indexValorUsuarioLogado + 1
        //         };
        //     }
        // }

        function obterCotacaoPorSolicitacaoEUsuario(solicitacaoId, usuarioId) {
            var cotacao = {
                solicitacao: { _id: solicitacaoId },
                usuario: { _id: usuarioId }
            };

            services.cotacaoServices.obterCotacaoPorSolicitacaoEUsuario(cotacao).success(function (response) {
                vm.cotacao = response;

                if (vm.cotacao != undefined) {
                    var dadosCotacao = _.find(vm.cotacao.produtos, function (item) {
                        return item.produto._id == vm.produtoSelecionado._id
                    });

                    if (dadosCotacao != undefined) {
                        vm.produto = dadosCotacao.produto;
                        vm.produto.cotacao = {};
                        vm.produto.cotacao.disponivel = dadosCotacao.disponivel;
                        vm.produto.cotacao.valor = dadosCotacao.valor;
                        vm.produto.cotacao.observacao = dadosCotacao.observacao;
                    }
                }

                load.hideLoading();
            }).error(function (err, statusCode) {
                load.hideLoading();
                load.toggleLoadingWithMessage(err.message);
            });
        }

        // function atribuirValores(cotacaoLance, lance) {
        //     return {
        //         solicitacaoId: cotacaoLance.solicitacaoId,
        //         produtoId: cotacaoLance.produtoId,
        //         lanceId: lance._id
        //     }
        // }

        function dadosNovaCotacao(produto, solicitacao) {
            return {
                user: vm.usuarioLogado._id,
                solicitacao: solicitacao._id,
                subSegmento: solicitacao.subSegmento._id,
                produtos: [{
                    produto: produto._id,
                    disponivel: produto.cotacao.disponivel,
                    valor: produto.cotacao.valor,
                    observacao: produto.cotacao.observacao
                }],
            }
        }

        function dadosEdicaoCotacao(cotacao, produto) {
            return {
                _id: cotacao._id,
                produto: {
                    _id: produto._id,
                    disponivel: produto.cotacao.disponivel,
                    valor: produto.cotacao.valor,
                    observacao: produto.cotacao.observacao
                }
            }
        }

        function salvoComSucesso() {
            load.showLoading('Salvo com sucesso');

            $timeout(function () {
                load.hideLoading();

                var solicitacao = angular.toJson({ _id: vm.solicitacao._id });
                $state.go('app.cotacaoFornecedorProduto', { 'solicitacao': solicitacao });
            }, 3000);
        }

        vm.salvar = function (isValid) {
            if (!isValid) {
                vm.showAlert('Informe os campos com asterisco (*)');
                return false;
            }

            load.showLoadingSpinner();

            if (vm.cotacao != undefined && vm.cotacao._id) {
                cotacao = dadosEdicaoCotacao(vm.cotacao, vm.produto);

                services.cotacaoServices.editar(cotacao).success(function (response) {
                    salvoComSucesso();
                }).error(function (err, statusCode) {
                    load.hideLoading();
                    load.toggleLoadingWithMessage(err.message);
                });
            } else {
                cotacao = dadosNovaCotacao(vm.produto, vm.solicitacao);

                services.cotacaoServices.adicionar(cotacao).success(function (response) {
                    salvoComSucesso();
                }).error(function (err, statusCode) {
                    load.hideLoading();
                    load.toggleLoadingWithMessage(err.message);
                });
            }
        }

        vm.showAlert = function () {
            var alertPopup = $ionicPopup.alert({
                title: '<span><i class="fa fa-calculator" aria-hidden="true"></i>  Cálculo do Valor Total</span>',
                template: 'Valor unitário x Quantidade'
            });
        };

        $ionicPopover.fromTemplateUrl('templates/popover.html', {
            scope: $scope,
        }).then(function (popover) {
            vm.popover = popover;
        });

        vm.cotacoesProdutoDetalhar = function () {
            cotacao = angular.toJson({
                produto: {
                    _id: vm.produto._id,
                    nome: vm.produto.nome,
                },
                solicitacao: { _id: vm.solicitacao._id }
            });

            vm.popover.hide();
            $state.go('app.cotacaoFornecedorProdutoValorDetalhar', { 'cotacao': cotacao });
        };

        // function criarDadosDaMensagem(descricao, produtoSelecionado) {
        //     services.usuarioServices.obterPorId(produtoSelecionado.solicitacaoUsuarioId).success(function (response) {
        //         usuarioSolicitacao = response.data;
        //     }).then(function () {
        //         return {
        //             usuarioId: vm.usuarioLogado._id,
        //             solicitacao: {
        //                 solicitacao: produtoSelecionado.solicitacao._id,
        //                 usuario: {
        //                     usuarioId: usuarioSolicitacao._id,
        //                     nome: usuarioSolicitacao.nome
        //                 },
        //                 produto: {
        //                     nome: produtoSelecionado.produto.nome,
        //                     descricao: produtoSelecionado.produto.descricao,
        //                     urlImagem: produtoSelecionado.produto.urlImagem,
        //                     tipoCotacao: {
        //                         _id: produtoSelecionado.produto.tipoCotacao._id,
        //                         nome: produtoSelecionado.produto.tipoCotacao.nome
        //                     },
        //                     quantidade: produtoSelecionado.produto.quantidade,
        //                     dataEntrega: produtoSelecionado.produto.dataEntrega
        //                 }
        //             },
        //             descricao: descricao,
        //             data: new Date()
        //         }
        //     });
        // }

        // function mensagemEnviadaComSucesso() {
        //     load.showLoading('Mensagem enviada com sucesso.');

        //     $timeout(function () {
        //         load.hideLoading();
        //     }, 3000);
        // }


        // vm.enviarMotivoImpossivelCotar = function (descricao, form) {
        //     load.showLoadingSpinner();

        //     services.usuarioServices.obterPorId(vm.produtoSelecionado.solicitacaoUsuarioId).success(function (response) {
        //         usuarioSolicitacao = response.data;
        //     }).then(function () {
        //         var impossivelCotar = {
        //             usuarioId: vm.usuarioLogado._id,
        //             solicitacao: {
        //                 _id: vm.produtoSelecionado.solicitacao._id,
        //                 usuario: {
        //                     usuarioId: usuarioSolicitacao._id,
        //                     nome: usuarioSolicitacao.nome
        //                 },
        //                 produto: {
        //                     nome: vm.produtoSelecionado.produto.nome,
        //                     descricao: vm.produtoSelecionado.produto.descricao,
        //                     urlImagem: vm.produtoSelecionado.produto.urlImagem,
        //                     tipoCotacao: {
        //                         _id: vm.produtoSelecionado.produto.tipoCotacao._id,
        //                         nome: vm.produtoSelecionado.produto.tipoCotacao.nome
        //                     },
        //                     quantidade: vm.produtoSelecionado.produto.quantidade,
        //                     dataEntrega: vm.produtoSelecionado.produto.dataEntrega
        //                 }
        //             },
        //             descricao: descricao,
        //             data: new Date()
        //         }

        //         services.faleConoscoServices.adicionar(impossivelCotar).success(function (response) {
        //             mensagemEnviadaComSucesso();
        //             vm.fecharModalImpossivelCotar();
        //             form.$submitted = false;
        //             vm.descricao = '';
        //         });
        //     });
        // }

        // $ionicModal.fromTemplateUrl('impossivelCotar.html', {
        //     scope: $scope,
        //     animation: 'slide-in-up'
        // }).then(function (modal) {
        //     vm.modalImposivelCotar = modal;
        // });

        // vm.abrirModalImpossivelCotar = function () {
        //     vm.modalImposivelCotar.show();
        // };

        // vm.fecharModalImpossivelCotar = function () {
        //     vm.modalImposivelCotar.hide();
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

        /*  vm.fecharImagem = function (){
              vm.modalImagem.hide();
          }*/

        vm.voltarPagina = function () {
            $ionicHistory.goBack();
        }

        function obterSolicitacao(produtoSelecionado) {
            load.showLoadingSpinner();
            services.solicitacaoServices.obterPorId(produtoSelecionado.solicitacao._id).success(function (response) {
                vm.solicitacao = response;
                vm.produto = _.find(vm.solicitacao.produtos, { _id: produtoSelecionado._id });

                // if (vm.produto.imagemURL)
                //     vm.imagemURL = connection.baseWeb() + "/" + vm.produto.imagemURL;
            }).error(function (err, statusCode) {
                load.hideLoading();
                load.toggleLoadingWithMessage(err.message);
            }).then(function () {
                obterCotacaoPorSolicitacaoEUsuario(produtoSelecionado.solicitacao._id, vm.usuarioLogado._id);
                //obterCotacoesPorSolicitacaoEProduto(produtoSelecionado.solicitacaoId, produtoSelecionado._id);
            });
        }

        function activate() {
            obterSolicitacao(vm.produtoSelecionado);
        }

        activate();
    }

})();

// (function () {
//     'use strict';
//     var controllerId = 'cotacao.produto.valor';

//     angular.module('cotarApp').controller(controllerId, ['socket', 'autenticacao', '$location', '$scope', '$ionicModal', '$ionicPopup', '$state', 'services', '$ionicHistory', 'load', '$timeout', cotacaoFornecedorProdutoValor]);

//     function cotacaoFornecedorProdutoValor(socket, autenticacao, $location, $scope, $ionicModal, $ionicPopup, $state, services, $ionicHistory, load, $timeout) {
//         socket.connect();
//         var vm = this;
//         var cotacao = {};
//         var usuarioSolicitacao = {};
//         var envioDeLance = false;
//         vm.mostraDescricao = false;
//         vm.primeirosLances = [];
//         vm.produtoSelecionado = angular.fromJson($state.params.produto);

//         /*function enviadoComSucesso() {
//             load.showLoading('Lance enviado com sucesso.');

//             $timeout(function () {
//                 load.hideLoading();
//             }, 3000);
//         }*/

//         function obterPosicaoLanceUsuarioLogado(lances) {
//             var lanceUsuarioLogado = _.find(lances, { usuarioId: vm.produtoSelecionado.usuarioId });
//             var indexValorUsuarioLogado = lances.indexOf(lanceUsuarioLogado);

//             if (indexValorUsuarioLogado == 0 && envioDeLance) {
//                 var device = {};
//                 var usuarios = [];
//                 var ultimoUsuario = '';
//                 var usuariosComLancesAbaixo = _.reject(lances, { usuarioId: vm.produtoSelecionado.usuarioId });

//                 if (usuariosComLancesAbaixo.length > 0) {
//                     usuariosComLancesAbaixo.forEach(function (usuario) {

//                         if (ultimoUsuario != usuario.usuarioId) {
//                             usuarios.push({
//                                 usuarioId: usuario.usuarioId
//                             });
//                         }
//                         ultimoUsuario = usuario.usuarioId;
//                     });

//                     device.usuarioId = _.pluck(usuarios, 'usuarioId');
//                     device.titulo = 'Cotar Bem';
//                     device.mensagem = 'Verifique suas cotações';

//                     var notificacaoLeilao = {
//                         usuariosId: device.usuarioId,
//                         url: $location.$$url
//                     }

//                     socket.emit('leilao', notificacaoLeilao);

//                     services.deviceTokenServices.notificarUsuarios(device).success(function () { });
//                 }
//             }

//             if (indexValorUsuarioLogado >= 3) {
//                 vm.lanceUsuarioLogado = {
//                     usuarioId: lanceUsuarioLogado.usuarioId,
//                     usuarioNome: lanceUsuarioLogado.usuarioNome,
//                     valor: lanceUsuarioLogado.valor,
//                     posicao: indexValorUsuarioLogado + 1
//                 };
//             }
//         }

//         function obterListaCotacoesPorSolicitacaoEProduto(cotacao) {
//             load.showLoadingSpinner();

//             services.cotacaoServices.obterCotacaoPorSolicitacaoEProduto(cotacao).success(function (response) {
//                 vm.cotacao = response.data;

//                 if (vm.cotacao != undefined) {
//                     var lances = _.sortBy(vm.cotacao.lances, function (o) { return o.valor; });
//                     vm.primeirosLances = lances.slice(0, 3);
//                     vm.quantidadeLances = _.filter(lances, { usuarioId: vm.produtoSelecionado.usuarioId });

//                     obterPosicaoLanceUsuarioLogado(lances);
//                 }

//                 load.hideLoading();
//             }).error(function (err, statusCode) {
//                 load.hideLoading();
//                 load.toggleLoadingWithMessage(err.message);
//             });
//         }

//         function atribuirValores(cotacaoLance, lance) {
//             return {
//                 solicitacaoId: cotacaoLance.solicitacaoId,
//                 produtoId: cotacaoLance.produtoId,
//                 lanceId: lance._id
//             }
//         }

//         function criarNovaCotacao(valor, produtoSelecionado) {
//             return {
//                 solicitacao: {
//                     solicitacaoId: produtoSelecionado.solicitacaoId,
//                     titulo: produtoSelecionado.solicitacaoTitulo
//                 },
//                 produto: {
//                     nome: produtoSelecionado.produto.nome,
//                     descricao: produtoSelecionado.produto.descricao,
//                     urlImagem: produtoSelecionado.produto.urlImagem,
//                     tipoCotacao: {
//                         _id: produtoSelecionado.produto.tipoCotacao._id,
//                         nome: produtoSelecionado.produto.tipoCotacao.nome
//                     },
//                     quantidade: produtoSelecionado.produto.quantidade,
//                     dataEntrega: produtoSelecionado.produto.dataEntrega
//                 },
//                 lance: {
//                     usuarioId: produtoSelecionado.usuarioId,
//                     usuarioNome: produtoSelecionado.usuarioNome,
//                     valor: valor
//                 }
//             }
//         }

//         vm.enviarLance = function (valor) {
//             if (valor == undefined)
//                 return vm.showAlert('Informe o valor do lance');
//             else if (vm.primeirosLances[0] != undefined) {
//                 if (vm.primeirosLances[0].valor < valor)
//                     return vm.showAlert('Dê um lance menor, seja o primeiro colocado!');
//             }
//             // else if (vm.quantidadeLances != undefined && vm.quantidadeLances.length >= 3)
//             //     return vm.showAlert('Não é permitido dar mais que 3 lances');

//             load.showLoadingSpinner();
//             envioDeLance = true;
//             cotacao = criarNovaCotacao(valor, vm.produtoSelecionado);

//             services.cotacaoServices.adicionar(cotacao).success(function (response) {
//                 cotacao = { solicitacaoId: cotacao.solicitacao.solicitacaoId, produto: cotacao.produto }
//                 obterListaCotacoesPorSolicitacaoEProduto(cotacao);

//                 vm.valor = '';
//                 //enviadoComSucesso();
//                 load.hideLoading();
//             }).error(function (err, statusCode) {
//                 load.hideLoading();
//                 load.toggleLoadingWithMessage(err.message);
//             });
//         }

//         vm.showAlert = function (mensagem) {
//             var alertPopup = $ionicPopup.alert({
//                 title: '<span class="alert_error"><i class="fa fa-exclamation-triangle"></i>  Cotação</span>',
//                 template: mensagem
//             });
//             alertPopup.then(function (res) {
//                 //console.log('Thank you for not eating my delicious ice cream cone');
//             });
//         };

//         function criarDadosDaMensagem(descricao, produtoSelecionado) {
//             services.usuarioServices.obterPorId(produtoSelecionado.solicitacaoUsuarioId).success(function (response) {
//                 usuarioSolicitacao = response.data;
//             }).then(function () {
//                 return {
//                     usuarioId: vm.usuarioLogado._id,
//                     solicitacao: {
//                         solicitacaoId: produtoSelecionado.solicitacaoId,
//                         usuario: {
//                             usuarioId: usuarioSolicitacao._id,
//                             nome: usuarioSolicitacao.nome
//                         },
//                         produto: {
//                             nome: produtoSelecionado.produto.nome,
//                             descricao: produtoSelecionado.produto.descricao,
//                             urlImagem: produtoSelecionado.produto.urlImagem,
//                             tipoCotacao: {
//                                 _id: produtoSelecionado.produto.tipoCotacao._id,
//                                 nome: produtoSelecionado.produto.tipoCotacao.nome
//                             },
//                             quantidade: produtoSelecionado.produto.quantidade,
//                             dataEntrega: produtoSelecionado.produto.dataEntrega
//                         }
//                     },
//                     descricao: descricao,
//                     data: new Date()
//                 }
//             });
//         }

//         function mensagemEnviadaComSucesso() {
//             load.showLoading('Mensagem enviada com sucesso.');

//             $timeout(function () {
//                 load.hideLoading();
//             }, 3000);
//         }


//         vm.enviarMotivoImpossivelCotar = function (descricao, form) {
//             load.showLoadingSpinner();

//             services.usuarioServices.obterPorId(vm.produtoSelecionado.solicitacaoUsuarioId).success(function (response) {
//                 usuarioSolicitacao = response.data;
//             }).then(function () {
//                 var impossivelCotar = {
//                     usuarioId: vm.usuarioLogado._id,
//                     solicitacao: {
//                         solicitacaoId: vm.produtoSelecionado.solicitacaoId,
//                         usuario: {
//                             usuarioId: usuarioSolicitacao._id,
//                             nome: usuarioSolicitacao.nome
//                         },
//                         produto: {
//                             nome: vm.produtoSelecionado.produto.nome,
//                             descricao: vm.produtoSelecionado.produto.descricao,
//                             urlImagem: vm.produtoSelecionado.produto.urlImagem,
//                             tipoCotacao: {
//                                 _id: vm.produtoSelecionado.produto.tipoCotacao._id,
//                                 nome: vm.produtoSelecionado.produto.tipoCotacao.nome
//                             },
//                             quantidade: vm.produtoSelecionado.produto.quantidade,
//                             dataEntrega: vm.produtoSelecionado.produto.dataEntrega
//                         }
//                     },
//                     descricao: descricao,
//                     data: new Date()
//                 }

//                 services.faleConoscoServices.adicionar(impossivelCotar).success(function (response) {
//                     mensagemEnviadaComSucesso();
//                     vm.fecharModalImpossivelCotar();
//                     form.$submitted = false;
//                     vm.descricao = '';
//                 });
//             });
//         }

//         $ionicModal.fromTemplateUrl('impossivelCotar.html', {
//             scope: $scope,
//             animation: 'slide-in-up'
//         }).then(function (modal) {
//             vm.modalImposivelCotar = modal;
//         });

//         vm.abrirModalImpossivelCotar = function () {
//             vm.modalImposivelCotar.show();
//         };

//         vm.fecharModalImpossivelCotar = function () {
//             vm.modalImposivelCotar.hide();
//         };

//         /*$ionicModal.fromTemplateUrl('imagem.html', {
//             scope: $scope,
//             animation: 'animated ' + animation,
//         }).then(function (modal) {
//             vm.modalImagem = modal;
//         });*/

//         vm.ampliarImagem = function(animation){
//             $ionicModal.fromTemplateUrl('imagem.html', {
//                 scope: $scope,
//                 animation: 'animated ' + animation,
//             }).then(function (modal) {
//                 vm.modalImagem = modal;
//                 vm.modalImagem.show();
//                 vm.fecharImagem = function (){
//                     vm.modalImagem.hide();
//                 }
//             });
//             /*vm.modalImagem.show();*/
//         }

//       /*  vm.fecharImagem = function (){
//             vm.modalImagem.hide();
//         }*/

//         vm.voltarPagina = function () {
//             $ionicHistory.goBack();
//         }

//         function obterUsuarioLogado(){
//             vm.usuarioLogado = autenticacao.getUser();
//             vm.produtoSelecionado.usuarioId = vm.usuarioLogado._id;
//             vm.produtoSelecionado.usuarioNome = vm.usuarioLogado.displayName;
//         }

//         function activate() {
//             obterUsuarioLogado();
//             cotacao = { solicitacaoId: vm.produtoSelecionado.solicitacaoId, produto: vm.produtoSelecionado.produto }
//             obterListaCotacoesPorSolicitacaoEProduto(cotacao);
//         }

//         activate();
//     }

// })();