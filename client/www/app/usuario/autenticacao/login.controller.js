(function () {
    'use strict';
    var controllerId = 'login';

    //function login($rootScope, $location, services, autenticacao, load, $ionicUser, $ionicPush) {
    function login($cordovaFile, $scope, $rootScope, $location, services, autenticacao, load, $timeout, $ionicPush, $ionicUser, $cordovaCamera, $ionicPopup, $ionicScrollDelegate, $ionicModal) {
        var vm = this;
        vm.viewLogin = false;
        vm.viewRegistro = false;
        vm.tipoUsuario = [{ tipoUsuarioId: 1, nome: 'Cliente' }, { tipoUsuarioId: 2, nome: 'Fornecedor' }];
        vm.usuario = {
            email: '',
            password: '',
            //urlImagem: '',
            endereco: {}
        };

        $rootScope.$on('$cordovaPush:tokenReceived', function (event, data) {
            console.log('Got token', data.token, data.platform);
            adicionarDeviceToken(data.token);
        });

        function redirecionarHome(tipoUsuario) {
            // services.tipoUsuarioServices.obterPorId(tipoUsuarioId).success(function (response) {
            //     tipoUsuario = response.data;
            // }).then(function () {
            if (tipoUsuario.nome === 'Fornecedor')
                $location.path('/app/cotacao/dashboard/fornecedor');
            else if (tipoUsuario.nome === 'Cliente')
                $location.path('/app/cotacao/dashboard/cliente');
            else if (tipoUsuario.nome == 'Administrador')
                $location.path('/app/categoria');
            // });

            //load.hideLoading();
        }

        vm.buscarCep = function (cep) {
            if (cep == undefined) {
                vm.usuario.endereco = {};
                vm.usuario.cep = '';
                vm.mensagem = '';
                return;
            }

            load.showLoadingSpinner();
            services.localizacaoServices.obterCep(cep).success(function (response) {
                vm.mensagem = '';
                vm.usuario.endereco = response.data;
                load.hideLoading();
            }).error(function (err, statusCode) {
                vm.usuario.endereco = {};
                vm.mensagem = err.message;
                load.hideLoading();
            });
        }

        function activate() {

        }

        activate();

        /*function editarDeviceToken(device) {
         services.deviceTokenServices.editar(device).success(function (response) {
         });
         }

         function obterDeviceToken(response) {
         var tokenAndroid = deviceToken.getDeviceToken();

         if (tokenAndroid) {
         var device = {
         usuarioId: response.user._id,
         token: tokenAndroid
         }

         editarDeviceToken(device);
         }

         }*/

        function adicionarDeviceToken(token) {
            var usuario = autenticacao.getUser();

            var device = {
                usuarioId: usuario._id,
                token: token
            }

            services.deviceTokenServices.register(device).then(function (response) {
                /* deviceToken.setDeviceToken(appDeviceToken);
                 deviceToken.setToken({
                 token: response.token,
                 expires: response.expires
                 });*/
                //alert('registered!');
            });

            load.hideLoading();
        }

        function obterDeviceToken() {
            //Basic registration
            //vm.pushRegister = function() {
            //alert('Registering...');

            $ionicPush.register({
                canShowAlert: false,
                onNotification: function (notification) {
                    // Called for each notification for custom handling
                    vm.lastNotification = JSON.stringify(notification);
                }
            }).then(function (deviceToken) {
                vm.token = deviceToken;
                //adicionarDeviceToken(vm.token);
                console.log(vm.token);
            });
            //}
        }

        function identificarUsuario() {
            //alert('Identifying');
            console.log('Identifying user');

            var user = $ionicUser.get();
            if (!user.user_id) {
                // Set your user_id here, or generate a random one
                user.user_id = $ionicUser.generateGUID()
            }

            angular.extend(user, {
                name: 'Test User',
                message: 'I come from planet Ion'
            });

            $ionicUser.identify(user);
        }

        vm.login = function (usuario) {
            load.showLoadingSpinner();

            services.loginServices.login(usuario).success(function (response) {

                response = response.data;
                autenticacao.setUser(response.user);
                autenticacao.setToken({
                    token: response.token,
                    expires: response.expires
                });

                $rootScope.isAuthenticated = true;

                //obterDeviceToken(response);
                identificarUsuario();
                //obterDeviceToken();
                redirecionarHome(response.user.tipoUsuario);
                //$scope.modal.hide();
            }).error(function (err, statusCode) {
                load.hideLoading();
                load.toggleLoadingWithMessage(err.message);
            });
        }

        function adicionarEndereco(usuario) {
            return {
                cep: usuario.cep,
                logradouro: usuario.endereco.logradouro,
                bairro: usuario.endereco.bairro,
                cidade: usuario.endereco.cidade,
                estado: usuario.endereco.estado,
                numero: usuario.numero
            }
        }

        vm.registrar = function (usuario) {
            if (vm.mensagem != '')
                return;

            load.showLoadingSpinner();

            usuario.endereco = adicionarEndereco(usuario);

            services.loginServices.registrar(usuario).success(function (response) {

                response = response.data;
                autenticacao.setUser(response.user);
                autenticacao.setToken({
                    token: response.token,
                    expires: response.expires
                });

                $rootScope.isAuthenticated = true;

                //obterDeviceToken(response);
                identificarUsuario();
                obterDeviceToken();
                redirecionarHome(response.user.tipoUsuario);
            }).error(function (err, statusCode) {
                load.hideLoading();
                load.toggleLoadingWithMessage(err.message);
            });
        }

        vm.showPopup = function () {
            var myPopup = $ionicPopup.show({
                //templateUrl: 'popupImagem.html',
                title: 'Escolher imagem',
                cssClass: '.popup-buttons .button',
                buttons: [{ // Array[Object] (optional). Buttons to place in the popup footer.
                    text: 'C&acirc;mera',
                    type: 'button icon-left ion-camera button-clear button-dark',
                    onTap: function (e) {
                        // e.preventDefault() will stop the popup from closing when tapped.
                        return vm.tirarFoto();
                    }
                }, {
                        text: 'Documentos',
                        type: 'button icon-left ion-android-list button-clear button-dark',
                        onTap: function (e) {
                            // Returning a value will cause the promise to resolve with the given value.
                            return vm.selecionarFoto();
                        }
                    }]
            });
        };

        vm.tirarFoto = function () {
            var options = {
                quality: 50,
                destinationType: Camera.DestinationType.FILE_URI,
                sourceType: Camera.PictureSourceType.CAMERA,
                allowEdit: true,
                encodingType: Camera.EncodingType.JPEG,
                targetWidth: 1024,
                targetHeight: 768,
                popoverOptions: CameraPopoverOptions,
                saveToPhotoAlbum: false,
                //correctOrientation: true
            };

            $cordovaCamera.getPicture(options).then(function (sourcePath) {
                var sourceDirectory = sourcePath.substring(0, sourcePath.lastIndexOf('/') + 1);
                var sourceFileName = sourcePath.substring(sourcePath.lastIndexOf('/') + 1, sourcePath.length);
               
                $cordovaFile.copyFile(sourceDirectory, sourceFileName, cordova.file.dataDirectory, sourceFileName).then(function (success) {
                    vm.usuario.urlImagem = cordova.file.dataDirectory + sourceFileName;
                }, function (error) {
                    console.dir(error);
                });

            }, function (err) {
                console.log(err);
            });
        }

        vm.selecionarFoto = function () {
            var options = {
                quality: 50,
                destinationType: Camera.DestinationType.FILE_URI,
                sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                allowEdit: true,
                encodingType: Camera.EncodingType.JPEG,
                targetWidth: 1024,
                targetHeight: 768,
                popoverOptions: CameraPopoverOptions,
                saveToPhotoAlbum: false,
                //correctOrientation: true
            };

            $cordovaCamera.getPicture(options).then(function (sourcePath) {
                var sourceDirectory = sourcePath.substring(0, sourcePath.lastIndexOf('/') + 1);
                var sourceFileName = sourcePath.substring(sourcePath.lastIndexOf('/') + 1, sourcePath.length);
               
                $cordovaFile.copyFile(sourceDirectory, sourceFileName, cordova.file.dataDirectory, sourceFileName).then(function (success) {
                    vm.usuario.urlImagem = cordova.file.dataDirectory + sourceFileName;
                }, function (error) {
                    console.dir(error);
                });

            }, function (err) {
                console.log(err);
            });
        }


        vm.retirarImagem = function () {
            if (vm.usuario.urlImagem != undefined) {
                $cordovaCamera.cleanup();
                vm.usuario.urlImagem = '';
            }
        }

        $ionicModal.fromTemplateUrl('formEsqueceuSenha.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            vm.modal = modal;
        });

        vm.abrirModalEsqueceuSenha = function () {
            vm.modal.show();
        };

        vm.fecharModalEsqueceuSenha = function () {
            vm.modal.hide();
        };

        vm.enviarSenha = function (email) {
            load.showLoading('Enviando...');
            services.loginServices.resetPassword(email).success(function (response) {
                load.toggleLoadingWithMessage('Nova senha enviada com sucesso.');
            }).error(function (err, statusCode) {
                load.hideLoading();
                load.toggleLoadingWithMessage(err.message);
            });
        }
    }

    angular.module('cotarApp').controller(controllerId, ['$cordovaFile', '$scope', '$rootScope', '$location', 'services', 'autenticacao', 'load',
        '$timeout', '$ionicPush', '$ionicUser', '$cordovaCamera', '$ionicPopup', '$ionicScrollDelegate', '$ionicModal', login]);
})();