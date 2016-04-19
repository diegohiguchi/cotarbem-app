(function () {
    'use strict';
    var controllerId = 'usuario';

    function usuario(services, autenticacao, load, $state, $ionicPopup, $timeout) {
        var vm = this;
        var tipoUsuario = {};
        vm.usuarios = [];

        function obterUsuarioLogado() {
            vm.usuarioLogado = autenticacao.getUser();
        }

        function obterTodosUsuarios() {
            load.showLoadingSpinner();
            services.usuarioServices.obterTodos().success(function(response){
                vm.usuarios = response.data;
                vm.usuarios.splice(_.find(vm.usuarios, {_id: vm.usuarioLogado._id}), 1);

            }).error(function (err, statusCode) {
                load.hideLoading();
                load.toggleLoadingWithMessage(err.message);
            }).then(function(){
                load.hideLoading();
            });
        }

        function remover(id) {
            load.showLoadingSpinner();

            services.usuarioServices.remover(id).success(function (response) {
                load.toggleLoadingWithMessage('Removido com sucesso');
                $timeout(function(){
                    activate();
                }, 2000);
            }).error(function (err, statusCode) {
                load.hideLoading();
                load.toggleLoadingWithMessage(err.message);
            });
        }

        vm.removerUsuario = function(usuario){
            var confirmPopup = $ionicPopup.confirm({
                title: usuario.nome,
                template: 'Deseja remover esse usu&aacute;rio?',
                cancelText: 'Cancelar',
                okText: 'Remover'
            });
            confirmPopup.then(function(res) {
                if(res) {
                    //console.log('You are sure');
                    remover(usuario._id);
                } else {
                    console.log('You are not sure');
                }
            });
        }

        vm.usuarioSelecionado = function (usuario) {
            load.showLoadingSpinner();
            services.tipoUsuarioServices.obterPorId(usuario.tipoUsuarioId).success(function(response){
                tipoUsuario = response.data;
            }).then(function(){
                usuario = angular.toJson({
                    usuarioId: usuario._id,
                    nome: usuario.nome,
                    tipoUsuarioNome: tipoUsuario.nome,
                    email: usuario.email,
                    password: usuario.password,
                    cnpj: usuario.cnpj,
                    telefoneFixo: usuario.telefoneFixo,
                    telefoneCelular: usuario.telefoneCelular,
                    localizacoes: usuario.localizacoes
                });

                $state.go('app.usuarioEditar', {'usuario': usuario, 'localizacao': ''})
                load.hideLoading();
            });
            //$state.go('app.usuarioLocalizacao', {'usuario': usuario})
        }

        vm.adicionarUsuario = function (){
            $state.go('app.usuarioAdicionar', {'localizacao': ''})
        }

        function activate() {
            obterUsuarioLogado();
            obterTodosUsuarios();
        }

        activate();
    }

    angular.module('cotarApp').controller(controllerId, ['services', 'autenticacao', 'load', '$state', '$ionicPopup', usuario]);

})();