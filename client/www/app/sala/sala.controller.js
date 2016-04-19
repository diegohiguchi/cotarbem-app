(function () {
    'use strict';
    var controllerId = 'sala';

    function sala(services, load, $state, $ionicScrollDelegate, autenticacao) {
        var vm = this;
        var sala = {};
        var usuario = {};
        var tipoUsuario = {};
        var solicitacoes = [];
        var listaSolicitacoes = [];
        var viewScroll = $ionicScrollDelegate.$getByHandle('userMessageScroll');

        function obterUsuario() {
            usuario = autenticacao.getUser();
        }

        function obterSalas(usuario){
            load.showLoadingSpinner();
            if(usuario.tipoUsuario.nome === 'Cliente')
                obterSolicitacoes();
            else if(usuario.tipoUsuario.nome === 'Fornecedor')
                obterSalasPorUsuario(usuario);
        }

        function obterSolicitacoes(){
            services.solicitacaoServices.obterSolicitacoesIdPorUsuarioId(usuario._id).success(function(response){
                solicitacoes = response.data;
                solicitacoes.forEach(function(solicitacao){
                    listaSolicitacoes.push(solicitacao._id);
                });

            }).then(function(){
                obterSalasPorSolicitacao(listaSolicitacoes)
            });
        }

        function obterSalasPorSolicitacao(solicitacoes) {
            services.salaServices.obterListaSalasPorSolicitacaoId(solicitacoes).success(function (response) {
                vm.salas = response.data;
                load.hideLoading();
            }).error(function (err, statusCode) {
                load.hideLoading();
                load.toggleLoadingWithMessage(err.message);
            });
        }

        function obterSalasPorUsuario(usuario){
            services.salaServices.obterPorUsuarioId(usuario._id).success(function (response) {
                vm.salas = response.data;
                load.hideLoading();
            }).error(function (err, statusCode) {
                load.hideLoading();
                load.toggleLoadingWithMessage(err.message);
            });
        }

        vm.salaSelecionada = function (sala) {

            sala = angular.toJson({
                solicitacao: sala.solicitacao,
                produto: sala.produto,
                usuario: sala.usuario,
                menuSala: true
            });

            $state.go('app.chat', {'sala': sala})
        }

        function activate() {
            vm.salas = [];
            obterUsuario();
            obterSalas(usuario);
        }

        activate();
    }

    angular.module('cotarApp').controller(controllerId, ['services', 'load', '$state', '$ionicScrollDelegate', 'autenticacao', sala]);
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
