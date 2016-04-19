(function () {
    'use strict';
    var controllerId = 'categoria.remover';

    function categoriaRemover($rootScope, $location, services, load, $stateParams, $scope, $state) {
        var vm = this;
        var id = $stateParams;

        function activate() {
        }

        vm.closeModal = function() {
            $scope.modal.hide();
        };

        vm.remover = function (id) {
            load.showLoading('Removendo...');

            services.categoriaServices.remover(id).success(function (response) {
                load.hideLoading();
                vm.closeModal();

            }).error(function (err, statusCode) {
                load.hideLoading();
                load.toggleLoadingWithMessage(err.message);
            });
        };

        activate();
    }

    angular.module('cotarApp').controller(controllerId, ['$rootScope', '$location', 'services', 'load', '$stateParams', '$scope', '$state', categoriaRemover]);

})();