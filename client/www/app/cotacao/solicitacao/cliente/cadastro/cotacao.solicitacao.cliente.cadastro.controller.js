(function () {
    'use strict';
    var controllerId = 'cotacao.solicitacao.cliente.cadastro';

    function cotacaoSolicitacaoClienteCadastro($cordovaFile, connection, $cordovaFileTransfer, socket, $ionicPopup, $location, $timeout, $scope, $ionicModal, services, autenticacao, load, $state, $ionicHistory, $cordovaCamera) {
        socket.connect();
        var vm = this;
        var edicaoItem = {};
        vm.produtos = [];
        vm.mensagem = '';
        vm.solicitacao = angular.fromJson($state.params.solicitacao);
        vm.usuario = {};
        vm.usuario.urlImagem = "";

        function obterTipoCotacao() {
            vm.tipoCotacao = [{
                _id: 0,
                nome: 'Unidade'
            }, {
                    _id: 1,
                    nome: 'Caixa'
                }];
        }

        vm.cadastrarItem = function (item, form) {

            var indexProduto = vm.produtos.indexOf(item);

            if (indexProduto != -1) {
                vm.produtos[indexProduto] = item;
            } else {
                vm.produtos.push({
                    nome: item.nome,
                    descricao: item.descricao,
                    urlImagem: vm.usuario.urlImagem,
                    tipoCotacao: item.tipoCotacao,
                    quantidade: item.quantidade,
                    dataEntrega: item.dataEntrega
                });
            }

            vm.fecharModalSolicitacaoCadastroItem();
            form.$submitted = false;
            vm.cadastro = [];
            vm.usuario.urlImagem = null;
            vm.mensagem = '';
        }

        function vincularProdutosNaSolicitacao(solicitacao, produtos) {
            var data = new Date();

            return {
                usuarioId: solicitacao.usuarioId,
                titulo: solicitacao.titulo,
                categoriaId: solicitacao.categoriaId,
                produtos: produtos,
                ativo: true,
                dataCadastro: moment(data).format('DD/MM/YYYY HH:mm:ss')
            }
        }

        function adicionadoComSucesso() {
            load.showLoading('Solicita&ccedil;&atilde;o enviada com sucesso');

            $timeout(function () {

                var categoria = angular.toJson({
                    usuarioId: vm.solicitacao.usuarioId,
                    categoriaId: vm.solicitacao.categoriaId,
                    categoriaNome: vm.solicitacao.categoriaNome
                });

                $state.go('app.solicitacaoCliente', { 'categoria': categoria })
                load.hideLoading();
            }, 3000);
        }

        vm.salvarSolicitacao = function (solicitacao, produtos) {
            if (produtos == undefined || produtos.length <= 0) {
                vm.mensagem = 'Adicione pelo menos um item para cotação';
                return;
            }
            // services.produtoServices.adicionarLista(produtos).success(function(response){
            //     listaProdutos = _.pluck(response.data, '_id');
            // }).then(function(){
            load.showLoadingSpinner();
            var solicitacaoProdutos = vincularProdutosNaSolicitacao(solicitacao, produtos);

            services.solicitacaoServices.solicitar(solicitacaoProdutos).success(function (response) {
                adicionadoComSucesso();
                var novaSolicitacao = {};
                novaSolicitacao.solicitacao = response.data;
                novaSolicitacao.url = "app/cotacao/solicitacao/produto/notificacao/solicitacaoId?id=" + response.data._id;

                socket.emit('nova-solicitacao', novaSolicitacao);

            }).error(function (err, statusCode) {
                load.hideLoading();
                load.toggleLoadingWithMessage(err.message);
            }).then(function () {
                services.usuarioServices.obterFornecedoresPorCategoriaId(vm.solicitacao.categoriaId).success(function (response) {
                    var usuarios = {};
                    usuarios.usuarioId = _.pluck(response.data, '_id');
                    usuarios.titulo = 'Cotar Bem';
                    usuarios.mensagem = 'Nova solicitação';
                    services.deviceTokenServices.notificarUsuarios(usuarios).success(function () { });
                });
            });
            //});
        }

        vm.editarItem = function (item) {
            edicaoItem = vm.produtos.indexOf(item);
            vm.abrirModalSolicitacaoCadastroItem(item);
        }

        $ionicModal.fromTemplateUrl('solicitacaoCadastroItem.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            vm.modal = modal;
        });

        vm.abrirModalSolicitacaoCadastroItem = function (item) {
            if (item !== undefined) {
                vm.usuario.urlImagem = item.urlImagem;
                vm.cadastro = item;
            }

            vm.modal.show();
        };

        vm.fecharModalSolicitacaoCadastroItem = function () {
            vm.modal.hide();
            vm.usuario.urlImagem = "";
        };

        vm.voltarPagina = function () {
            $ionicHistory.goBack();
        }

        vm.showPopup = function () {
            var myPopup = $ionicPopup.show({
                //templateUrl: 'popupImagem.html',
                title: "Escolher imagem",
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

        function obterImagem(options) {
            $cordovaCamera.getPicture(options).then(function (sourcePath) {
                //var sourceDirectory = sourcePath.substring(0, sourcePath.lastIndexOf('/') + 1);
                var sourceFileName = sourcePath.substring(sourcePath.lastIndexOf('/') + 1, sourcePath.length);

                // $cordovaFile.copyFile(sourceDirectory, sourceFileName, cordova.file.dataDirectory, sourceFileName).then(function (success) {
                //     vm.usuario.urlImagem = cordova.file.dataDirectory + sourceFileName;
                // }, function (error) {
                //     console.dir(error);
                // });


                // Destination URL 
                var url = connection.baseWeb() + "/api/solicitacoes/cliente/uploadImages";

                //File for Upload
                var targetPath = cordova.file.dataDirectory + sourceFileName;

                // File name only
                var filename = targetPath.split("/").pop();

                var options = {
                    fileKey: "novaImagemProduto",
                    fileName: filename,
                    chunkedMode: false,
                    mimeType: "image/jpeg",
                    params: { 'directory': 'upload', 'fileName': filename } // directory represents remote directory,  fileName represents final remote file name
                };

                $cordovaFileTransfer.upload(url, sourcePath, options).then(function (result) {
                    console.log("SUCCESS: " + JSON.stringify(result.response));
                    var file = JSON.parse(result.response).message.split(".")[1];
                    vm.usuario.urlImagem = connection.baseWeb() + file;
                }, function (err) {
                    console.log("ERROR: " + JSON.stringify(err));
                }, function (progress) {
                    // PROGRESS HANDLING GOES HERE
                });

            }, function (err) {
                console.log(err);
            });
        }

        vm.tirarFoto = function () {
            var options = {
                fileKey: "novaImagemProduto",
                quality: 50,
                destinationType: Camera.DestinationType.FILE_URI,
                sourceType: Camera.PictureSourceType.CAMERA,
                allowEdit: true,
                encodingType: Camera.EncodingType.JPG,
                targetWidth: 1024,
                targetHeight: 768,
                popoverOptions: CameraPopoverOptions,
                saveToPhotoAlbum: false,
                //correctOrientation: true
            };

            obterImagem(options);
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

            obterImagem(options);
        }

        function activate() {
            vm.solicitacao.titulo = '';
            obterTipoCotacao()
        }

        activate();
    }

    angular.module('cotarApp').controller(controllerId, ['$cordovaFile', 'connection', '$cordovaFileTransfer', 'socket', '$ionicPopup', '$location', '$timeout', '$scope', '$ionicModal', 'services', 'autenticacao', 'load', '$state', '$ionicHistory', '$cordovaCamera', cotacaoSolicitacaoClienteCadastro]);

})();