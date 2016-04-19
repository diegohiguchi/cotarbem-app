(function () {
    'use strict';
    var controllerId = 'chat';

    function chat($location, socket, $timeout, $ionicPopover, $scope, $ionicModal, load, services, $firebaseArray, autenticacao, $state, $ionicScrollDelegate, $ionicHistory) {
        socket.connect();
        var vm = this;
        var salaAdicionada = {};
        var usuarioIdChat = '';
        var viewScroll = $ionicScrollDelegate.$getByHandle('userMessageScroll');
        var notificacaoChat = {};
        vm.sala = angular.fromJson($state.params.sala);
        vm.denuncia = {};
        vm.usuario = {}
        vm.mensagens = [];

        var listRef = new Firebase("https://cotar.firebaseio.com/presence/");

        function obterParametrosSala(sala){
            if(sala == undefined){
                var notificacaoSala = {
                    solicitacao: {
                        solicitacaoId: $state.params.solicitacaoId
                    },
                    produto:{
                        nome: $state.params.produtoNome
                    }
                }

                obterSala(notificacaoSala);
            }else
                obterSala(sala);
        }

        function verificarUsuarioOnline(mensagem) {
            var usuarioStatus = false;

            listRef.on("child_added", function (snapshot) {
                var usuario = snapshot.val();

                if (usuario.usuarioId == usuarioIdChat) {
                    usuarioStatus = true;
                }
                //console.log(usuarioIdChat + " is currently " + usuario.status)
            });

            //if (!usuarioStatus) {

            var device = {
                usuarioId: usuarioIdChat != (undefined || "") ? usuarioIdChat : vm.sala.usuario.usuarioId,
                titulo: vm.usuario.nome,
                mensagem: mensagem
            }

            services.deviceTokenServices.notificar(device).success(function (response) {
            });

            notificacaoChat.usuarioId = device.usuarioId;

            //}
        }

        vm.enviarMensagem = function (mensagem) {
            verificarUsuarioOnline(mensagem);
            if (_.isEmpty(salaAdicionada))
                criarSala(vm.sala, mensagem);
            else {

                notificacaoChat.url = 'app/chat/notificacao/sala?solicitacaoId=' + salaAdicionada.solicitacao.solicitacaoId + '&produtoNome='+ salaAdicionada.produto.nome;
                socket.emit('envia-mensagem-chat', notificacaoChat);

                vm.mensagens.$add({
                    usuarioId: vm.usuario._id,
                    usuarioNome: vm.usuario.nome,
                    usuarioUrlImagem: vm.usuario.urlImagem != undefined ? vm.usuario.urlImagem : '',
                    mensagem: mensagem,
                    horario: Date.now()
                });

                vm.mensagem = "";

                $ionicScrollDelegate.scrollBottom(true);
            }
        }

        function obterUsuario() {
            vm.usuario = autenticacao.getUser();
        }

        function conectar() {
            var userRef = listRef.push();

            // Add ourselves to presence list when online.
            var presenceRef = new Firebase("https://cotar.firebaseio.com/.info/connected");
            presenceRef.on("value", function (snap) {
                if (snap.val()) {
                    userRef.set({ usuarioId: vm.usuario._id, status: true });
                    // Remove ourselves when we disconnect.
                    userRef.onDisconnect().remove();
                }
            });

            // Number of online users is the number of objects in the presence list.
            listRef.on("value", function (snap) {
                console.log("# of online users = " + snap.numChildren());
            });
        }

        function obterConversas(salaId) {
            var ref = new Firebase('https://cotar.firebaseio.com/chat/' + salaId);
            vm.mensagens = $firebaseArray(ref);

            ref.on("child_added", function (snapshot) {
                var usuarioChat = snapshot.val();

                if (usuarioChat.usuarioId != vm.usuario._id)
                    usuarioIdChat = usuarioChat.usuarioId;
                //console.log(usuarioChat.usuarioId);
                
                load.hideLoading();
            });
        }

        function obterSala(sala) {
            load.showLoadingSpinner();
            services.salaServices.obterSalaPorSolicitacaoEProduto(sala).success(function (response) {
                salaAdicionada = response.data;

                if (salaAdicionada) {
                    if(vm.sala == undefined){
                        vm.sala = {
                            usuario:{
                                nome: salaAdicionada.usuario.nome
                            }
                        }
                    }

                    obterConversas(salaAdicionada._id);
                }
                else
                    load.hideLoading();
            });
        }

        function criarSala(sala, mensagem) {
            load.showLoadingSpinner();
            services.salaServices.adicionar(sala).success(function (response) {
                salaAdicionada = response.data;

                notificacaoChat.url = 'app/chat/notificacao/sala?solicitacaoId=' + salaAdicionada.solicitacao.solicitacaoId + '&produtoNome='+ salaAdicionada.produto.nome;
                socket.emit('envia-mensagem-chat', notificacaoChat);

                var ref = new Firebase('https://cotar.firebaseio.com/chat/' + salaAdicionada._id);
                vm.mensagens = $firebaseArray(ref);

                vm.mensagens.$add({
                    usuarioId: vm.usuario._id,
                    usuarioNome: vm.usuario.nome,
                    usuarioUrlImagem: vm.usuario.urlImagem != undefined ? vm.usuario.urlImagem : '',
                    mensagem: mensagem,
                    horario: Date.now()
                });

                vm.mensagem = "";
                $ionicScrollDelegate.scrollBottom(true);

                load.hideLoading();
            });
        }

        vm.detalharProduto = function (solicitacao) {
            load.showLoadingSpinner();
            services.cotacaoServices.obterCotacaoPorSolicitacaoEProduto(solicitacao).success(function (response) {
                vm.cotacao = response.data;
            }).error(function (err, statusCode) {
                load.hideLoading();
                load.toggleLoadingWithMessage(err.message);
            }).then(function () {
                vm.usuarioVencedor = _.sortBy(vm.cotacao.lances, 'valor')[0];
                services.usuarioServices.obterPorId(vm.usuarioVencedor.usuarioId).success(function (response) {
                    vm.usuarioVencedorEndereco = response.data;
                    vm.abrirModalDetalheProduto();
                    load.hideLoading();
                });
            });
        }

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

        function activate() {
            obterUsuario();
            conectar();
            obterParametrosSala(vm.sala);
            //obterSala(vm.sala);
        }

        activate();
    }

    angular.module('cotarApp').controller(controllerId, ['$location', 'socket', '$timeout', '$ionicPopover', '$scope', '$ionicModal', 'load', 'services', '$firebaseArray', 'autenticacao', '$state', '$ionicScrollDelegate', '$ionicHistory', chat]);

})();