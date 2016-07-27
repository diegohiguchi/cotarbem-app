(function () {
    'use strict';
    var controllerId = 'sala';

    angular.module('cotarApp').controller(controllerId, ['services', 'load', '$state', '$ionicScrollDelegate', 'autenticacao', sala]);

    function sala(services, load, $state, $ionicScrollDelegate, autenticacao) {
        var vm = this;
        var sala = {};
        var usuario = {};
        var tipoUsuario = {};
        var solicitacoes = [];
        var viewScroll = $ionicScrollDelegate.$getByHandle('userMessageScroll');

        vm.mostrarSala = function (tipoUsuario) {
            if (vm.verificarTipoUsuario(tipoUsuario)) {
                vm.mostraSalaTipoUsuario = null;
            } else {
                vm.mostraSalaTipoUsuario = tipoUsuario;
            }
        };

        vm.verificarTipoUsuario = function (tipoUsuario) {
            return vm.mostraSalaTipoUsuario === tipoUsuario;
        };

        function obterSalas(usuario) {
            load.showLoadingSpinner();
            if (vm.usuario.cliente)
                obterSolicitacoes(usuario);
            if (vm.usuario.fornecedor)
                obterSalasPorUsuario(usuario);
        }

        function obterSolicitacoes(usuario) {
            services.solicitacaoServices.obterSolicitacoesPorUsuarioId(usuario._id).success(function (response) {
                solicitacoes = response;

                if (solicitacoes.length > 0) {
                    solicitacoes = _.pluck(solicitacoes, '_id');
                    obterSalasPorSolicitacao(solicitacoes);
                } else
                    load.hideLoading();

            }).error(function (err, statusCode) {
                load.hideLoading();
                load.toggleLoadingWithMessage(err.message);
            });
        }

        function obterSalasPorSolicitacao(solicitacoes) {
            services.salaServices.obterSalasPorSolicitacao(solicitacoes).success(function (response) {
                vm.salasCliente = response;
                load.hideLoading();
            }).error(function (err, statusCode) {
                load.hideLoading();
                load.toggleLoadingWithMessage(err.message);
            });
        }

        function obterSalasPorUsuario(usuario) {
            services.salaServices.obterSalasPorUsuarioId(usuario._id).success(function (response) {
                vm.salasFornecedor = response;
                load.hideLoading();
            }).error(function (err, statusCode) {
                load.hideLoading();
                load.toggleLoadingWithMessage(err.message);
            });
        }

        vm.salaSelecionada = function (sala) {
            sala = angular.toJson({
                _id: sala._id,
                solicitacao: sala.solicitacao,
                produto: sala.produto,
                usuario: { _id: sala.tipoUsuario == 'Fornecedor' ? sala.solicitacao.user : sala.user },
                cotacao: { fornecedor: sala.user },
                tipoUsuario: sala.tipoUsuario,
                menuSala: true,
                visualizacao: sala.visualizacao
            });

            $state.go('app.salaChat', { 'sala': sala })
        }

        function obterUsuario() {
            vm.usuario = autenticacao.getUser();
            vm.usuario.cliente = _.contains(vm.usuario.roles, 'cliente');
            vm.usuario.fornecedor = _.contains(vm.usuario.roles, 'fornecedor');
            debugger
            
            obterSalas(vm.usuario);
        }

        function activate() {
            vm.salas = [];
            obterUsuario();
        }

        activate();
    }

})
    ();


/*
 (function () {
 'use strict';
 var controllerId = 'sala';

 function sala($rootScope, $location, autenticacao, services, $state) {
 var vm = this;
 var salaUsuario = {};
 var salas = [];
 vm.salas = [];

 if (!$rootScope.isAuthenticated)
 $location.path('/app/login');

 function activate() {
 vm.usuario = autenticacao.getUser();

 services.salaServices.obterPorUsuarioId(vm.usuario._id).success(function (response) {
 salas = response.data;

 salas.forEach(function(sala){
 vm.salas.push({
 id: sala._id,
 nome: sala.nome,
 ativo: sala.ativo,
 dataCriacao: sala.dataCriacao,
 usuarios: sala.usuarios
 })
 })
 });
 }

 vm.salaSelecionada = function (sala) {

 salaUsuario = angular.toJson({
 id: sala.id,
 nome: sala.nome,
 usuarioId: vm.usuario._id,
 usuarioNome: vm.usuario.nome,
 ativo: sala.ativo,
 dataCriacao: sala.dataCriacao
 });

 $state.go('app.salaUsuario', {'salaUsuario': salaUsuario})
 }

 activate();
 }

 angular.module('cotarApp').controller(controllerId, ['$rootScope', '$location', 'autenticacao', 'services', '$state', sala]);
 })();*/
