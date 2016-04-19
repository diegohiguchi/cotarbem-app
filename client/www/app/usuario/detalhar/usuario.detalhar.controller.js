(function () {
    'use strict';
    var controllerId = 'usuario.detalhar';

    function usuarioDetalhar($location, $rootScope, services, autenticacao, load, $state, $timeout, $cordovaToast) {
        var vm = this;
        var usuario = {};
        vm.tipoUsuario = [];

        function obterUsuario() {
            vm.usuario = autenticacao.getUser();
        }

        vm.editarUsuario = function () {

            usuario = angular.toJson({
                usuarioId: vm.usuario._id,
                nome: vm.usuario.nome,
                urlImagem: vm.usuario.urlImagem,
                cnpj: vm.usuario.cnpj,
                email: vm.usuario.email,
                cep: vm.usuario.endereco.cep.toString(),
                telefone: vm.usuario.telefone.toString(),
                numero: vm.usuario.endereco.numero,
                endereco: vm.usuario.endereco
            });

            $state.go('app.usuarioEditar', { 'usuario': usuario })
        }

        vm.logout = function () {
            load.showLoadingSpinner();
            services.loginServices.logout();
            $rootScope.isAuthenticated = false;
            $location.path('/login');
            //load.toggleLoadingWithMessage('Successfully Logged Out!', 2000);
            localStorage.clear();
            load.hideLoading();
        };

        vm.alterarNotificacao = function(device){
            services.deviceTokenServices.editar(device).success(function(response){
               vm.device = response.data;
            });
        }

        function obterDevice(usuarioId){
            load.showLoadingSpinner();
            services.deviceTokenServices.obterPorUsuarioId(usuarioId).success(function(response){
                vm.device = response.data;
                load.hideLoading();
            });
        }

        function activate() {
            obterUsuario();
            obterDevice(vm.usuario._id);
        }

        activate();
    }

    angular.module('cotarApp').controller(controllerId, ['$location', '$rootScope', 'services', 'autenticacao', 'load', '$state', '$timeout', '$cordovaToast', usuarioDetalhar]);

})();