(function () {
    'use strict';
    var controllerId = 'usuario.adicionar';

    function usuarioAdicionar(services, autenticacao, load, $state, $ionicHistory, $cordovaToast, $timeout) {
        var vm = this;
        var localizacao = $state.params.localizacao != '' ? angular.fromJson($state.params.localizacao) : '';
        vm.localizacoes = [];
        var localizacoes = [];

        vm.adicionarEndereco = function () {
            load.showLoadingSpinner();

            var usuario = angular.toJson({
                usuarioId: vm.usuarioId == undefined ? '' : vm.usuarioId
            });

            $state.go('app.usuarioLocalizacao', {'usuario': usuario});
            load.hideLoading();
        }

        vm.salvarDados = function (usuario) {
            load.showLoadingSpinner();

            services.localizacaoServices.adicionarListaLocalizacoes(vm.localizacoes).success(function (response) {
                localizacoes = response.data;
            }).then(function () {
                usuario.localizacoes = _.pluck(localizacoes, '_id');
                services.usuarioServices.adicionar(usuario).success(function (response) {
                    vm.usuario = '';
                    limparLocalizacoesLocalStorage();
                    load.toggleLoadingWithMessage('Salvo com sucesso');
                    $timeout(function () {
                        $state.go('app.usuario');
                    }, 2000);
                }).error(function (err, statusCode) {
                    load.hideLoading();
                    load.toggleLoadingWithMessage(err.message);
                });
            });
        }

        vm.voltarPagina = function () {
            $ionicHistory.goBack();
        }

        function obterLocalizacoesLocalStorage() {
            if (localizacao != '') {
                localStorage.setItem('localizacaoAdicionar= ' + localizacao.endereco, JSON.stringify(localizacao));
            }

            for (var i = 0; i < localStorage.length; i++) {
                var key = localStorage.key(i).split('=', 1).shift();

                if (key == 'localizacaoAdicionar') {
                    var key = localStorage.key(i);
                    var value = localStorage[key];
                    vm.localizacoes.push(JSON.parse(value));
                }
            }
        }

        function limparLocalizacoesLocalStorage() {
            if (vm.localizacoes.length > 0) {
                for (var i = 0; i < vm.localizacoes.length; i++) {
                    localStorage.removeItem(localStorage.getItem('localizacaoAdicionar= ' + vm.localizacoes[i].endereco));
                }
            }

            vm.localizacoes = '';
        }

        function activate() {
            obterLocalizacoesLocalStorage();
        }

        activate();
    }

    angular.module('cotarApp').controller(controllerId, ['services', 'autenticacao', 'load', '$state', '$ionicHistory', '$cordovaToast', '$timeout', usuarioAdicionar]);

})();