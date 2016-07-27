(function () {
    'use strict';
    var controllerId = 'usuario.detalhar';

    angular.module('cotarApp').controller(controllerId, ['$location', '$rootScope', 'services', 'autenticacao', 'load', '$state', '$timeout', '$cordovaToast', 'connection', usuarioDetalhar]);

    function usuarioDetalhar($location, $rootScope, services, autenticacao, load, $state, $timeout, $cordovaToast, connection) {
        var vm = this;
        var usuario = {};
        vm.tipoUsuario = [];
        vm.usuario = autenticacao.getUser();

        vm.editarUsuario = function () {
            $state.go('app.usuarioEditar', { 'usuarioId': vm.usuario._id })
        }

        vm.editarEnderecamento = function () {
            $state.go('app.usuarioEditarEnderecamento', { 'usuarioId': vm.usuario._id })
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

        vm.editarDevice = function (device) {
            services.deviceServices.editar(device).success(function (response) {
                vm.device = response;
            });
        }

        // function obterImagemPerfil() {
        //     if (vm.usuario.profileImageURL != undefined && vm.usuario.profileImageURL != '')
        //         vm.imagemURL = connection.baseWeb() + "/" + vm.usuario.profileImageURL;
        // }

        function obterDevice(usuarioId) {
            load.showLoadingSpinner();
            services.deviceServices.obterPorUsuarioId(usuarioId).success(function (response) {
                vm.device = response;
                load.hideLoading();
            }).error(function (err, statusCode) {
                load.hideLoading();
                load.toggleLoadingWithMessage(err.message);
            });
        }

        function obterUsuario(usuarioId) {
            load.showLoadingSpinner();
            services.usuarioServices.obterPorId(usuarioId).success(function (response) {
                vm.usuario = response;
                localStorage.user = JSON.stringify(response);
                //obterImagemPerfil();
                load.hideLoading();
            }).error(function (err, statusCode) {
                load.hideLoading();
                load.toggleLoadingWithMessage(err.message);
            });
        }

        function activate() {
            obterUsuario(vm.usuario._id);
            obterDevice(vm.usuario._id);
        }

        activate();
    }
})();