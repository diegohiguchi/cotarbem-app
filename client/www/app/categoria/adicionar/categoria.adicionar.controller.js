(function () {
    'use strict';
    var controllerId = 'categoria.adicionar';

    function categoriaAdicionar($rootScope, $location, services, load) {
        var vm = this;

        vm.categoria = {
            nome: ''
        }

        function activate() {
        }

        vm.adicionar = function (categoria) {
            load.showLoading('Adicionando...');
            services.categoriaServices.adicionar(categoria).success(function (response) {
                load.hideLoading();
                $location.path('/app/categoria');
            }).error(function (err, statusCode) {
                load.hideLoading();
                load.toggleLoadingWithMessage(err.message);
            });
        };

        activate();
    }

    angular.module('cotarApp').controller(controllerId, ['$rootScope', '$location', 'services', 'load', categoriaAdicionar]);

})();