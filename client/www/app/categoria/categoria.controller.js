(function () {
    'use strict';
    var controllerId = 'categoria';

    function categoria($ionicHistory, $rootScope, $location, services, $ionicModal, $scope, autenticacao, $ionicPopup, load) {
        var vm = this;
        var categoriaSelecionada = [];
        vm.categorias = [];
        vm.usuario = autenticacao.getUser();

        if (!$rootScope.isAuthenticated)
            $location.path('/app/login');

        function obterUsuarioLogado() {
            services.usuarioServices.obterPorId(vm.usuario._id).success(function (response) {
                vm.usuario = response.data;
                localStorage.user = JSON.stringify(vm.usuario);
            });
        }

        function obterCategorias() {
            services.categoriaServices.obterTodas().success(function (response) {
                var categorias = response.data;
                vm.categorias = [];

                categorias.forEach(function (categoria) {
                    var index = vm.usuario.categorias.indexOf(categoria._id);

                    vm.categorias.push({
                        _id: categoria._id,
                        nome: categoria.nome,
                        categoriaSelecionada: index > -1 ? true : false
                    });
                });
            });
        }

        // function obterTipoUsuarioLogado() {
        //     services.tipoUsuarioServices.obterPorId(vm.usuario.tipoUsuarioId).success(function (response) {
        //         vm.tipoUsuario = response.data;
        //     });
        // }

        vm.voltarPagina = function () {
            $ionicHistory.goBack();
        }


        function activate() {
            obterUsuarioLogado();
            obterCategorias();
            //obterTipoUsuarioLogado();
        }

        function remover(id) {
            load.showLoading('Removendo...');

            services.categoriaServices.remover(id).success(function (response) {
                load.hideLoading();
                activate();
            }).error(function (err, statusCode) {
                load.hideLoading();
                load.toggleLoadingWithMessage(err.message);
            });
        }

        vm.removerCategoria = function (categoria) {
            var confirmPopup = $ionicPopup.confirm({
                title: categoria.nome,
                template: 'Deseja remover essa categoria?',
                cancelText: 'Cancelar',
                okText: 'Remover'
            });
            confirmPopup.then(function (res) {
                if (res) {
                    //console.log('You are sure');
                    remover(categoria._id);
                } else {
                    console.log('You are not sure');
                }
            });
        }

        $ionicModal.fromTemplateUrl('app/categoria/remover/categoria.remover.html', function (modal) {
            $scope.modal = modal;
        }, {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function (modal) {
                $scope.modal = modal;
            });

        /*vm.openModal = function (categoria) {
            $scope.categoria = categoria;
            $scope.modal.show();
        };

        $scope.$on('modal.hidden', function () {
            activate();
        });*/

        function adicionarCategoriaUsuario(usuario) {
            services.usuarioServices.adicionarCategoria(usuario).success(function (response) {
                obterUsuarioLogado();
            });
        }

        function removerCategoriaUsuario(usuario) {
            services.usuarioServices.removerCategoria(usuario).success(function (response) {
                obterUsuarioLogado();
            });
        }

        vm.selecionado = function (categoria) {
            var index = categoriaSelecionada.indexOf(categoria);
            var indexUsuario = vm.usuario.categorias.indexOf(categoria._id);
            vm.usuario.categoriaId = categoria._id;

            if (index > -1 || indexUsuario > -1) {
                removerCategoriaUsuario(vm.usuario);
                categoriaSelecionada.splice(index, 1);
                categoria.categoriaSelecionada = false;
            } else {
                adicionarCategoriaUsuario(vm.usuario);
                categoriaSelecionada.push(categoria);
                categoria.categoriaSelecionada = true;
            }
        }

        activate();
    }

    angular.module('cotarApp').controller(controllerId, ['$ionicHistory', '$rootScope', '$location', 'services', '$ionicModal', '$scope', 'autenticacao', '$ionicPopup', 'load', categoria]);

})();
