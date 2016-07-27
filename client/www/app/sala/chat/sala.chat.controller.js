(function () {
    'use strict';
    var controllerId = 'sala.chat';

    angular.module('cotarApp').controller(controllerId, ['connection', '$location', 'socket', '$timeout', '$ionicPopover', '$scope', '$ionicModal', 'load', 'services', '$firebaseArray',
        'autenticacao', '$state', '$ionicScrollDelegate', '$ionicHistory', salaChat]);

    function salaChat(connection, $location, socket, $timeout, $ionicPopover, $scope, $ionicModal, load, services, $firebaseArray, autenticacao, $state, $ionicScrollDelegate, $ionicHistory) {
        socket.connect();
        var vm = this;
        var salaAdicionada = {};
        var usuarioIdChat = '';
        var viewScroll = $ionicScrollDelegate.$getByHandle('userMessageScroll');
        var notificacaoChat = {};
        //vm.connection = connection.baseWeb();
        vm.sala = angular.fromJson($state.params.sala);
        vm.denuncia = {};
        vm.mensagens = [];
        var userRef = '';

        // vm.detalharProduto = function (solicitacao) {
        //     load.showLoadingSpinner();
        //     services.cotacaoServices.obterCotacaoPorSolicitacaoEProduto(solicitacao).success(function (response) {
        //         vm.cotacao = response;
        //     }).error(function (err, statusCode) {
        //         load.hideLoading();
        //         load.toggleLoadingWithMessage(err.message);
        //     }).then(function () {
        //         vm.usuarioVencedor = _.sortBy(vm.cotacao.lances, 'valor')[0];
        //         services.usuarioServices.obterPorId(vm.usuarioVencedor.usuarioId).success(function (response) {
        //             vm.usuarioVencedorEndereco = response.data;
        //             vm.abrirModalDetalheProduto();
        //             load.hideLoading();
        //         });
        //     });
        // }

        function obterParametrosSala(sala) {
            if (sala == undefined) {
                var notificacaoSala = {
                    solicitacao: {
                        solicitacaoId: $state.params.solicitacaoId
                    },
                    produto: {
                        nome: $state.params.produtoNome
                    }
                }

                obterSala(notificacaoSala);
            } else
                obterSala(sala);
        }

        function verificarUsuarioOnline(mensagem) {
            userRef = verificarPresenca(usuarioIdChat);

            userRef.on('value', function (snapshot) {
                if (snapshot.val() !== true) {
                    var device = {
                        usuarioId: usuarioIdChat != (undefined || "") ? usuarioIdChat : vm.sala.user._id,
                        titulo: vm.usuario.displayName,
                        mensagem: mensagem
                    };

                    services.deviceServices.notificar(device).success(function (response) {
                    }).error(function (err, statusCode) {
                        load.hideLoading();
                        load.toggleLoadingWithMessage(err.message);
                    });

                    // .then(function () {
                    //     if (!_.isEmpty(salaAdicionada))
                    //         editarSala(vm.sala, mensagem);
                    // });

                    notificacaoChat.usuarioId = device.usuarioId;

                    return false;
                } else {
                    return true
                }
            });
        }

        function editarSala(sala) {
            load.showLoadingSpinner();

            var usuario = vm.usuario._id == vm.sala.solicitacao.user ? vm.sala.usuario._id : vm.sala.solicitacao.user;

            sala.visualizacao = {
                user: usuario,
                ativo: true
            }

            services.salaServices.editar(sala).success(function (response) {
                load.hideLoading();
            }).error(function (err, statusCode) {
                load.hideLoading();
                load.toggleLoadingWithMessage(err.message);
            });
        }

        function criarMensagem(mensagem) {
            vm.mensagens.$add({
                usuario: {
                    _id: vm.usuario._id,
                    nome: vm.usuario.displayName,
                    profileImageURL: vm.usuario.profileImageURL
                },
                mensagem: mensagem,
                horario: Date.now()
            });

            vm.mensagem = "";
        }

        vm.enviarMensagem = function (mensagem) {
            var status = verificarUsuarioOnline(mensagem);

            if (_.isEmpty(salaAdicionada))
                criarSala(vm.sala, mensagem);
            else {
                if (vm.sala.tipoUsuario == 'Cliente')
                    notificacaoChat.assunto = 'Fornecedor - Mensagem chat';
                else
                    notificacaoChat.assunto = 'Cliente - Mensagem chat';

                notificacaoChat.sala = vm.sala;
                socket.emit('envia-mensagem-chat', notificacaoChat);
                
                if (!status)
                    editarSala(vm.sala);

                criarMensagem(mensagem);

                $ionicScrollDelegate.scrollBottom(true);
            }
        }

        function conectar() {
            var presenceRef = new Firebase("https://cotar.firebaseio.com/.info/connected");

            presenceRef.on('value', function (snapshot) {
                if (snapshot.val()) {
                    userRef.onDisconnect().set(false);
                    userRef.set(true);
                }
            });
        }

        function obterConversas(salaId) {
            var ref = new Firebase('https://cotar.firebaseio.com/chat/' + salaId);
            vm.mensagens = $firebaseArray(ref);

            ref.on("child_added", function (snapshot) {
                var usuarioChat = snapshot.val();

                if (usuarioChat.usuario._id != vm.usuario._id)
                    usuarioIdChat = usuarioChat.usuario._id;

                load.hideLoading();
            });
        }

        function obterSala(sala) {
            load.showLoadingSpinner();
            services.salaServices.obterSalaPorSolicitacaoEProduto(sala).success(function (response) {
                salaAdicionada = response;

                if (salaAdicionada) {
                    if (vm.sala == undefined) {
                        vm.sala = {
                            usuario: {
                                nome: salaAdicionada.usuario.nome
                            }
                        }
                    }

                    obterConversas(salaAdicionada._id);
                }
                else
                    load.hideLoading();

            }).error(function (err, statusCode) {
                load.hideLoading();
                load.toggleLoadingWithMessage(err.message);
            });
        }

        function criarSala(sala, mensagem) {
            load.showLoadingSpinner();

            sala.visualizacao = {
                user: sala.user
            }

            services.salaServices.adicionar(sala).success(function (response) {
                salaAdicionada = response;

                notificacaoChat.assunto = 'Fornecedor - Mensagem chat';
                notificacaoChat.sala = salaAdicionada;

                socket.emit('envia-mensagem-chat', notificacaoChat);

                var ref = new Firebase('https://cotar.firebaseio.com/chat/' + salaAdicionada._id);
                vm.mensagens = $firebaseArray(ref);

                vm.mensagens.$add({
                    usuario: {
                        _id: vm.usuario._id,
                        nome: vm.usuario.displayName,
                        profileImageURL: vm.usuario.profileImageURL
                    },
                    mensagem: mensagem,
                    horario: Date.now()
                });

                vm.mensagem = "";
                $ionicScrollDelegate.scrollBottom(true);

                load.hideLoading();
            }).error(function (err, statusCode) {
                load.hideLoading();
                load.toggleLoadingWithMessage(err.message);
            });
        }

        vm.detalharCotacaoProduto = function (sala) {
            var cotacao = angular.toJson({
                usuario: sala.cotacao.fornecedor,
                solicitacao: sala.solicitacao,
                produto: sala.produto
            });

            vm.popover.hide();
            $state.go('app.salaChatDetalhar', { 'cotacao': cotacao });
        };

        vm.denunciar = function (solicitacao) {
            load.showLoadingSpinner();
            services.cotacaoServices.obterCotacaoPorSolicitacaoEProduto(solicitacao).success(function (response) {
                vm.cotacao = response.data;
                vm.usuarioVencedor = _.sortBy(vm.cotacao.lances, 'valor')[0];
                vm.abrirModalDenuncia();
                load.hideLoading();
            }).error(function (err, statusCode) {
                load.hideLoading();
                load.toggleLoadingWithMessage(err.message);
            });
        }

        function montarDenuncia(denuncia) {
            return {
                usuarioId: vm.usuario._id,
                descricao: denuncia.descricao,
                data: new Date(),
                cotacao: {
                    cotacaoId: vm.cotacao._id,
                    usuario: {
                        usuarioId: vm.usuarioVencedor.usuarioId,
                        nome: vm.usuarioVencedor.usuarioNome
                    },
                    produto: {
                        nome: vm.cotacao.produto.nome,
                        tipoCotacao: vm.cotacao.produto.tipoCotacao,
                        quantidade: vm.cotacao.produto.quantidade
                    }
                }
            }
        }

        function denunciaEnviadaComSucesso() {
            load.showLoading('Den&uacute;ncia enviada com sucesso.');

            $timeout(function () {
                vm.fecharModalDenuncia();
                load.hideLoading();
                vm.denuncia.descricao = '';
            }, 3000);
        }

        vm.enviarDenuncia = function (denuncia, form) {
            load.showLoadingSpinner();
            var novaDenuncia = montarDenuncia(denuncia)

            services.denunciaServices.adicionar(novaDenuncia).success(function (response) {
                denunciaEnviadaComSucesso();
                form.$submitted = false;
            }).error(function (err, statusCode) {
                load.hideLoading();
                load.toggleLoadingWithMessage(err.message);
            });
        }

        $ionicPopover.fromTemplateUrl('templates/popover.html', {
            scope: $scope,
        }).then(function (popover) {
            vm.popover = popover;
        });

        vm.demo = 'ios';
        vm.setPlatform = function (p) {
            document.body.classList.remove('platform-ios');
            document.body.classList.remove('platform-android');
            document.body.classList.add('platform-' + p);
            vm.demo = p;
        }

        $ionicModal.fromTemplateUrl('detalheProduto.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            vm.modalDetalheProduto = modal;
        });

        vm.abrirModalDetalheProduto = function () {
            vm.modalDetalheProduto.show();
        };

        vm.fecharModalDetalheProduto = function () {
            vm.modalDetalheProduto.hide();
        };

        $ionicModal.fromTemplateUrl('denuncia.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            vm.modalDenuncia = modal;
        });

        vm.abrirModalDenuncia = function () {
            vm.modalDenuncia.show();
        };

        vm.fecharModalDenuncia = function () {
            vm.modalDenuncia.hide();
        };

        vm.voltarPagina = function () {
            $ionicHistory.goBack();
        }

        function obterVisualizacao() {
            if (vm.sala.visualizacao != undefined) {
                if (vm.usuario._id == vm.sala.visualizacao.user) {
                    if (vm.sala.visualizacao.ativo) {
                        vm.sala.visualizacao.ativo = false;

                        services.salaServices.editar(vm.sala).success(function (response) { });
                    }
                }
            }
        }

        function verificarPresenca(usuarioId) {
            return new Firebase("https://cotar.firebaseio.com/presence/" + usuarioId);
        }

        function obterUsuarioLogado() {
            vm.usuario = autenticacao.getUser();
            // vm.imagemURL = connection.baseWeb() + '/' + vm.usuario.profileImageURL;
            vm.usuario.cliente = _.contains(vm.usuario.roles, 'cliente');
            vm.usuario.fornecedor = _.contains(vm.usuario.roles, 'fornecedor');


            userRef = verificarPresenca(vm.usuario._id);
            obterVisualizacao();
        }

        function activate() {
            obterUsuarioLogado();
            conectar();
            obterParametrosSala(vm.sala);
            //obterSala(vm.sala);
        }

        activate();
    }

})();