(function () {
    'use strict';

    var app = angular.module('cotarApp');

    // Collect the routes
    //app.constant('routes', getRoutes());

    // Configure the routes and route resolvers
    //app.config(['$routeProvider', 'routes', routeConfigurator]);
    app.config(['$stateProvider', '$urlRouterProvider', '$httpProvider',
        function ($stateProvider, $urlRouterProvider, $httpProvider) {

            // setup the token interceptor
            $httpProvider.interceptors.push('tokenInterceptor');

            $stateProvider

                .state('login', {
                    url: "/login",
                    templateUrl: "app/usuario/autenticacao/login.html"
                })

                .state('app', {
                    url: "/app",
                    abstract: true,
                    templateUrl: "app/menu/menu.html"
                })

                .state('app.home', {
                    url: "/home",
                    views: {
                        'menuContent': {
                            templateUrl: "app/home/home.html"
                        }
                    }
                })

                // .state('app.solicitacaoCliente', {
                //     url: "/cotacao/solicitacao/cliente/:categoria",
                //     views: {
                //         'menuContent': {
                //             templateUrl: "app/cotacao/solicitacao/cliente/cotacao.solicitacao.cliente.html"
                //         }
                //     }
                // })

                .state('app.cotacaoCliente', {
                    url: "/cotacao/cliente",
                    views: {
                        'menuContent': {
                            templateUrl: "app/cotacao/cliente/cotacao.cliente.html"
                        }
                    }
                })

                // .state('app.cotacaoClienteFiltrar', {
                //     url: "/cotacao/cliente/filtrar",
                //     views: {
                //         'menuContent': {
                //             templateUrl: "app/cotacao/cliente/filtrar/cotacao.cliente.filtrar.html"
                //         }
                //     }
                // })

                .state('app.cotacaoClienteProduto', {
                    url: "/cotacao/cliente/produto/:solicitacao",
                    views: {
                        'menuContent': {
                            templateUrl: "app/cotacao/cliente/produto/cotacao.cliente.produto.html"
                        }
                    }
                })

                .state('app.cotacaoClienteProdutoValor', {
                    url: "/cotacao/cliente/produto/valor/:cotacao",
                    views: {
                        'menuContent': {
                            templateUrl: "app/cotacao/cliente/produto/valor/cotacao.cliente.produto.valor.html"
                        }
                    }
                })

                .state('app.cotacaoClienteProdutoValorDetalhar', {
                    url: "/cotacao/cliente/produto/valor/detalhar/:cotacao",
                    views: {
                        'menuContent': {
                            templateUrl: "app/cotacao/cliente/produto/valor/detalhar/cotacao.cliente.produto.valor.detalhar.html"
                        }
                    }
                })

                .state('app.cotacaoFornecedor', {
                    url: "/cotacao/fornecedor",
                    views: {
                        'menuContent': {
                            templateUrl: "app/cotacao/fornecedor/cotacao.fornecedor.html"
                        }
                    }
                })

                .state('app.cotacaoFornecedorProduto', {
                    url: "/cotacao/fornecedor/produto/:solicitacao",
                    views: {
                        'menuContent': {
                            templateUrl: "app/cotacao/fornecedor/produto/cotacao.fornecedor.produto.html"
                        }
                    }
                })

                .state('app.cotacaoFornecedorProdutoValor', {
                    url: "/cotacao/produto/fornecedor/valor/:produto",
                    views: {
                        'menuContent': {
                            templateUrl: "app/cotacao/fornecedor/produto/valor/cotacao.fornecedor.produto.valor.html"
                        }
                    }
                })

                .state('app.cotacaoFornecedorProdutoValorDetalhar', {
                    url: "/cotacao/fornecedor/produto/valor/detalhar/:cotacao",
                    views: {
                        'menuContent': {
                            templateUrl: "app/cotacao/fornecedor/produto/valor/detalhar/cotacao.fornecedor.produto.valor.detalhar.html"
                        }
                    }
                })

                .state('app.notificacaoSolicitacaoProduto', {
                    url: "/cotacao/produto/notificacao/solicitacao?id",
                    views: {
                        'menuContent': {
                            templateUrl: "app/cotacao/fornecedor/produto/cotacao.fornecedor.produto.html"
                        }
                    }
                })

                .state('app.cotacaoClienteSolicitacaoAdicionar', {
                    url: "/cotacao/cliente/solicitacao/adicionar/:solicitacao",
                    views: {
                        'menuContent': {
                            templateUrl: "app/cotacao/cliente/solicitacao/adicionar/cotacao.cliente.solicitacao.adicionar.html"
                        }
                    }
                })

                // .state('app.cotacaoDashboardCliente', {
                //     url: "/cotacao/dashboard/cliente",
                //     views: {
                //         'menuContent': {
                //             templateUrl: "app/cotacao/dashboard/cliente/cotacao.dashboard.cliente.html"
                //         }
                //     }
                // })

                // .state('app.cotacaoDashboardFornecedor', {
                //     url: "/cotacao/dashboard/fornecedor",
                //     views: {
                //         'menuContent': {
                //             templateUrl: "app/cotacao/dashboard/fornecedor/cotacao.dashboard.fornecedor.html"
                //         }
                //     }
                // })

                .state('app.cotacaoNotificacao', {
                    url: "/notificacao",
                    views: {
                        'menuContent': {
                            templateUrl: "app/notificacao/notificacao.html"
                        }
                    }
                })

                // .state('app.cotacaoNotificacaoFornecedor', {
                //     url: "/notificacao/fornecedor",
                //     views: {
                //         'menuContent': {
                //             templateUrl: "app/notificacao/fornecedor/notificacao.fornecedor.html"
                //         }
                //     }
                // })

                // .state('app.cotacaoNotificacaoCliente', {
                //     url: "/notificacao/cliente",
                //     views: {
                //         'menuContent': {
                //             templateUrl: "app/notificacao/cliente/notificacao.cliente.html"
                //         }
                //     }
                // })

                .state('app.compra', {
                    url: "/compra",
                    views: {
                        'menuContent': {
                            templateUrl: "app/compra/compra.html"
                        }
                    }
                })

                .state('app.compraCliente', {
                    url: "/compra/cliente/:usuarioId",
                    views: {
                        'menuContent': {
                            templateUrl: "app/compra/cliente/compra.cliente.html"
                        }
                    }
                })

                .state('app.compraFornecedor', {
                    url: "/compra/fornecedor/:usuarioId",
                    views: {
                        'menuContent': {
                            templateUrl: "app/compra/fornecedor/compra.fornecedor.html"
                        }
                    }
                })

                .state('app.sala', {
                    url: "/sala",
                    views: {
                        'menuContent': {
                            templateUrl: "app/sala/sala.html"
                        }
                    }
                })

                .state('app.salaChat', {
                    url: "/sala/chat/:sala",
                    views: {
                        'menuContent': {
                            templateUrl: "app/sala/chat/sala.chat.html"
                        }
                    }
                })

                .state('app.salaChatDetalhar', {
                    url: "/sala/chat/detalhar/:cotacao",
                    views: {
                        'menuContent': {
                            templateUrl: "app/sala/chat/detalhar/sala.chat.detalhar.html"
                        }
                    }
                })

                .state('app.salaChatDenuncia', {
                    url: "/sala/chat/denuncia",
                    views: {
                        'menuContent': {
                            templateUrl: "app/denuncia/denuncia.html"
                        }
                    }
                })

                .state('app.chatNotificacao', {
                    url: "/chat/notificacao/sala?solicitacaoId&produtoNome",
                    views: {
                        'menuContent': {
                            templateUrl: "app/sala/chat/sala.chat.html"
                        }
                    }
                })

                .state('app.categoria', {
                    url: "/categoria",
                    views: {
                        'menuContent': {
                            templateUrl: "app/categoria/categoria.html"
                        }
                    }
                })

                .state('app.segmento', {
                    url: "/segmento",
                    views: {
                        'menuContent': {
                            templateUrl: "app/segmento/segmento.html"
                        }
                    }
                })

                .state('app.subSegmento', {
                    url: "/segmento/subSegmento/:segmentoId",
                    views: {
                        'menuContent': {
                            templateUrl: "app/segmento/subSegmento/subSegmento.html"
                        }
                    }
                })

                .state('app.categoriaAdicionar', {
                    url: "/categoria/adicionar",
                    views: {
                        'menuContent': {
                            templateUrl: "app/categoria/adicionar/categoria.adicionar.html"
                        }
                    }
                })

                // .state('app.categoriaEditar', {
                //     url: "/categoria/editar/:id",
                //     views: {
                //         'menuContent': {
                //             templateUrl: "app/categoria/editar/categoria.editar.html"
                //         }
                //     }
                // })

                .state('app.usuario', {
                    url: "/usuario",
                    views: {
                        'menuContent': {
                            templateUrl: "app/usuario/usuario.html"
                        }
                    }
                })

                .state('app.usuarioEditar', {
                    url: "/usuario/editar/:usuarioId",
                    views: {
                        'menuContent': {
                            templateUrl: "app/usuario/editar/usuario.editar.html"
                        }
                    }
                })

                .state('app.usuarioEditarEnderecamento', {
                    url: "/usuario/editar/enderecamento/:usuarioId",
                    views: {
                        'menuContent': {
                            templateUrl: "app/usuario/editar/enderecamento/usuario.editar.enderecamento.html"
                        }
                    }
                })

                .state('app.usuarioDetalhar', {
                    url: "/usuario/detalhar",
                    views: {
                        'menuContent': {
                            templateUrl: "app/usuario/detalhar/usuario.detalhar.html"
                        }
                    }
                })

                .state('app.usuarioAdicionar', {
                    url: "/usuario/adicionar/:localizacao",
                    views: {
                        'menuContent': {
                            templateUrl: "app/usuario/adicionar/usuario.adicionar.html"
                        }
                    }
                })

                .state('app.usuarioLocalizacao', {
                    url: "/usuario/localizacao/:usuario",
                    views: {
                        'menuContent': {
                            templateUrl: "app/usuario/localizacao/usuario.localizacao.html"
                        }
                    }
                });

            // if none of the above states are matched, use this as the fallback
            $urlRouterProvider.otherwise('app/home');
        }
    ])
})();