(function () {
    'use strict';
    var controllerId = 'cotacao.dashboard';

    angular.module('cotarApp').controller(controllerId, ['socket', 'services', 'autenticacao', 'load', '$state', '$cordovaBadge', cotacaoDashboard]);

    function cotacaoDashboard(socket, services, autenticacao, load, $state, $cordovaBadge) {
        socket.connect();
        var vm = this;
        var categoria = {};
        vm.solicitacoes = [];
        vm.ultimaSolicitacao = [];
        vm.notificacao = [];

        vm.tempo = function (categoriaNome) {
            services.categoriaServices.obterPorNome(categoriaNome).success(function (response) {
                var solicitacaoDashboard = _.find(vm.ultimaSolicitacao, { _id: response.data._id });
                return solicitacaoDashboard.dataCadastro;
            });
        }

        function obterQuantidadeNotificacoesIcone(quantidade) {
            $cordovaBadge.promptForPermission();
            $cordovaBadge.hasPermission().then(function (result) {
                $cordovaBadge.set(quantidade);
            }, function (error) {
                console.log(error);
            });
        }

        function obterListaSolicitacoesPorCategoria(categorias) {
            load.showLoadingSpinner();
            services.solicitacaoServices.obterSolicitacoesAtivasExcetoUltimaSolicitacaoPorCategoriaId(categorias).success(function (response) {
                vm.solicitacoes = response.data;
            }).error(function (err, statusCode) {
                load.hideLoading();
                load.toggleLoadingWithMessage(err.message);
            }).then(function () {
                services.dashboardServices.obterListaDashboardFornecedoresPorCategoriaId(categorias).success(function (response) {
                    vm.ultimaSolicitacao = response.data;
                    load.hideLoading();
                });

            });
        }

        function obterUsuario() {
            vm.usuario = autenticacao.getUser();
            socket.emit('adiciona-usuario', vm.usuario);
        }

        function adicionarNotificacao(data) {
            var notificacao = {
                mensagem: data.mensagem,
                data: data.data,
                ativo: data.ativo,
                usuarioId: vm.usuario._id
            };

            vm.notificacao.push(notificacao);

            obterQuantidadeNotificacoesIcone(vm.notificacao.length);
        }

        socket.on('notificacao-chat-fornecedor', function(data){
            adicionarNotificacao(data);
        });

        socket.on('notificacao-leilao', function(data){
            adicionarNotificacao(data);
        });

        socket.on('envia-solicitacao', function (data) {
            vm.solicitacoes.push(data.solicitacao);

            services.dashboardServices.obterListaDashboardFornecedoresPorCategoriaId(vm.usuario.categorias).success(function (response) {
                vm.ultimaSolicitacao = response.data;
            }).error(function (err, statusCode) {
                load.toggleLoadingWithMessage(err.message);
            }).then(function () {
                adicionarNotificacao(data);
            });
        });

        function carregarCategoriasSocket(categorias) {
            categorias.forEach(function (categoriaId) {
                socket.emit('carrega-categorias', categoriaId);
            });
        }

        function obterNotificacoes(usuarioId) {
            services.notificacaoServices.obterNotificacoesEmAbertoPorUsuarioId(usuarioId).success(function (response) {
                vm.notificacao = response.data;

                obterQuantidadeNotificacoesIcone(vm.notificacao.length);
            });
        }

        function activate() {
            obterUsuario();
            carregarCategoriasSocket(vm.usuario.categorias);
            obterListaSolicitacoesPorCategoria(vm.usuario.categorias);
            obterNotificacoes(vm.usuario._id);
        }

        vm.categoriaSelecionada = function (categoriaNome) {
            load.showLoadingSpinner();
            services.categoriaServices.obterPorNome(categoriaNome).success(function (response) {
                categoria = angular.toJson({
                    usuarioId: vm.usuario._id,
                    usuarioNome: vm.usuario.nome,
                    usuarioUrlImagem: vm.usuario.urlImagem,
                    categoriaId: response.data._id,
                    categoriaNome: response.data.nome
                });

                $state.go('app.solicitacaoFornecedor', { 'categoria': categoria });
                load.hideLoading();
            }).error(function (err, statusCode) {
                load.hideLoading();
                load.toggleLoadingWithMessage(err.message);
            });
        }

        activate();
    }

})();