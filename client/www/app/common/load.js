(function () {
    'use strict';

    var loadId = 'load';

    function load($ionicLoading, $timeout) {

        function showLoading(text) {
            text = text || 'Carregando...';
            $ionicLoading.show({
                template: text
            });
        }

        function hideLoading() {
            $ionicLoading.hide();
        }

        function showLoadingSpinner(){
            $ionicLoading.show({
                //duration: 5000,
                //noBackdrop: true,
                //template: '<p class="item-icon-left">Enviando...<ion-spinner icon="lines"/></p>'
                template: '<ion-spinner></ion-spinner>'
            });
        }

        function toggleLoadingWithMessage(text, timeout) {
            var self = this;

            self.showLoading(text);

            $timeout(function() {
                self.hideLoading();
            }, timeout || 3000);
        }

        var common = {
            showLoading: showLoading,
            hideLoading: hideLoading,
            showLoadingSpinner: showLoadingSpinner,
            toggleLoadingWithMessage: toggleLoadingWithMessage,
        };

        return common;
    }

    angular.module('cotarApp').factory(loadId, ['$ionicLoading', '$timeout', load]);
})();
