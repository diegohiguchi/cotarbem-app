(function () {
    'use strict';
    var controllerId = 'usuario.localizacao';

    function usuarioLocalizacao($scope, services, load, $state, $compile, $ionicHistory) {
        var vm = this;
        var usuario = angular.fromJson($state.params.usuario);
        var localizacao = {
            latitude: -20.463173,
            longitude: -54.611933
        }

        vm.localizacao = {
            endereco: '',
            latitude: '',
            longitude: ''
        }

        vm.botaoAdicionarLocalizacao = false;
        $scope.gPlace;

        var usuario = angular.fromJson($state.params.usuario);

        function iniciarMapa(localizacao) {
            var latitude = localizacao.latitude;
            var longitude = localizacao.longitude;

            var myLatlng = new google.maps.LatLng(latitude, longitude);

            var mapOptions = {
                center: myLatlng,
                zoom: 12,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };

            var map = new google.maps.Map(document.getElementById("map"),
                mapOptions);

            vm.map = map;
        }

        function geocodeLatLng(geocoder, map, infowindow, localizacao) {
            var input = localizacao.latitude + ',' + localizacao.longitude;
            var latlngStr = input.split(',', 2);
            var latlng = {lat: parseFloat(latlngStr[0]), lng: parseFloat(latlngStr[1])};
            geocoder.geocode({'location': latlng}, function (results, status) {
                if (status === google.maps.GeocoderStatus.OK) {
                    if (results[0]) {
                        map.setCenter(latlng);
                        map.setZoom(17);

                        var marker = new google.maps.Marker({
                            position: latlng,
                            map: map
                        });

                        vm.localizacao = {
                            endereco: results[0].formatted_address,
                            latitude: localizacao.latitude,
                            longitude: localizacao.longitude
                        }

                        infowindow.setContent(results[0].formatted_address);
                        infowindow.open(map, marker);
                    } else {
                        window.alert('No results found');
                    }
                } else {
                    window.alert('Geocoder failed due to: ' + status);
                }
            });
        }

        vm.obterLocalizacao = function (localizacao) {

            localizacao = {
                latitude: (localizacao.latitude != null ? localizacao.latitude : localizacao.geometry.location.lat()),
                longitude: (localizacao.longitude != null ? localizacao.longitude : localizacao.geometry.location.lng())
            }

            var myLatlng = new google.maps.LatLng(localizacao.latitude, localizacao.longitude);

            var mapOptions = {
                center: myLatlng,
                zoom: 16,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };

            var map = new google.maps.Map(document.getElementById("map"),
                mapOptions);

            var geocoder = new google.maps.Geocoder;
            var infowindow = new google.maps.InfoWindow;

            geocodeLatLng(geocoder, map, infowindow, localizacao);

            vm.botaoAdicionarLocalizacao = true;
            vm.map = map;
        }

        vm.centerOnMe = function () {
            if (!vm.map) {
                return;
            }

            load.showLoadingSpinner();

            navigator.geolocation.getCurrentPosition(function (pos) {
                localizacao = {
                    latitude: pos.coords.latitude,
                    longitude: pos.coords.longitude
                }

                vm.obterLocalizacao(localizacao);
                load.hideLoading();
            }, function (error) {
                alert('Não foi possível buscar localização: ' + error.message);
                load.hideLoading();
            });
        };

        vm.adicionarLocalizacao = function () {
            load.showLoadingSpinner();

            if (usuario.usuarioId != "") {
                usuario = angular.toJson(usuario);
                localizacao = angular.toJson(vm.localizacao);
                $state.go('app.usuarioEditar', {'usuario': usuario, 'localizacao': localizacao})
            } else {
                localizacao = angular.toJson(vm.localizacao);
                $state.go('app.usuarioAdicionar', {'localizacao': localizacao})
            }

            load.toggleLoadingWithMessage('Localização adicionada.');
        }

       /* function obterLocalizacaoUsuario(usuario) {
            load.showLoadingSpinner();
            services.localizacaoServices.obterPorId(usuario.localizacaoId).success(function (response) {
                vm.localizacao = response.data;
                load.hideLoading();
            }).error(function (err, statusCode) {
                load.hideLoading();
                load.toggleLoadingWithMessage(err.message);
            });
        }
*/
        vm.voltarPagina = function () {
            $ionicHistory.goBack();
        }

        function activate() {
            //obterLocalizacaoUsuario(usuario);
            iniciarMapa(localizacao);
        }

        activate();
    }

    angular.module('cotarApp').controller(controllerId, ['$scope', 'services', 'load', '$state', '$compile', '$ionicHistory', usuarioLocalizacao]);

})();