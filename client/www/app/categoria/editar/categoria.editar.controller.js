(function () {
    'use strict';
    var controllerId = 'categoria.editar';

    function categoriaEditar($rootScope, $location, services, load, $stateParams) {
        var vm = this;
        var id = $stateParams.id;

        function activate() {
            services.categoriaServices.obterPorId(id).success(function (response) {
                vm.categoria = response.data;
            });
        }

        vm.editar = function (categoria) {
            load.showLoading('Editando...');

            services.categoriaServices.editar(categoria).success(function (response) {
                load.hideLoading();
                $location.path('/app/categoria');
            }).error(function (err, statusCode) {
                load.hideLoading();
                load.toggleLoadingWithMessage(err.message);
            });
        };

        activate();
    }

    angular.module('cotarApp').controller(controllerId, ['$rootScope', '$location', 'services', 'load', '$stateParams', categoriaEditar]);

})();