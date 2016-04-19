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

                .state('app.solicitacaoCliente', {
                    url: "/cotacao/solicitacao/cliente/:categoria",
                    views: {
                        'menuContent': {
                            templateUrl: "app/cotacao/solicitacao/cliente/cotacao.solicitacao.cliente.html"
                        }
                    }
                })

                .state('app.solicitacaoFornecedor', {
                    url: "/cotacao/solicitacao/fornecedor/:categoria",
                    views: {
                        'menuContent': {
                            templateUrl: "app/cotacao/solicitacao/fornecedor/cotacao.solicitacao.fornecedor.html"
                        }
                    }
                })

                .state('app.solicitacaoProduto', {
                    url: "/cotacao/solicitacao/produto/:solicitacao",
                    views: {
                        'menuContent': {
                            templateUrl: "app/cotacao/solicitacao/produto/cotacao.solicitacao.produto.html"
                        }
                    }
                })

                .state('app.notificacaoSolicitacaoProduto', {
                    url: "/cotacao/solicitacao/produto/notificacao/solicitacaoId?id",
                    views: {
                        'menuContent': {
                            templateUrl: "app/cotacao/solicitacao/produto/cotacao.solicitacao.produto.html"
                        }
                    }
                })

                .state('app.solicitacaoProdutoDetalhar', {
                    url: "/cotacao/solicitacao/produto/detalhar/:produto",
                    views: {
                        'menuContent': {
                            templateUrl: "app/cotacao/solicitacao/produto/detalhar/cotacao.solicitacao.produto.detalhar.html"
                        }
                    }
                })

                .state('app.solicitacaoProdutoLeilao', {
                    url: "/cotacao/solicitacao/produto/leilao/:produto",
                    views: {
                        'menuContent': {
                            templateUrl: "app/cotacao/solicitacao/produto/leilao/cotacao.solicitacao.produto.leilao.html"
                        }
                    }
                })

                .state('app.cotacaoSolicitacaoClienteCadastro', {
                    url: "/cotacao/solicitacao/cliente/cadastro/:solicitacao",
                    views: {
                        'menuContent': {
                            templateUrl: "app/cotacao/solicitacao/cliente/cadastro/cotacao.solicitacao.cliente.cadastro.html"
                        }
                    }
                })
                
                .state('app.cotacaoDashboardCliente', {
                    url: "/cotacao/dashboard/cliente",
                    views: {
                        'menuContent': {
                            templateUrl: "app/cotacao/dashboard/cliente/cotacao.dashboard.cliente.html"
                        }
                    }
                })

                .state('app.cotacaoDashboardFornecedor', {
                    url: "/cotacao/dashboard/fornecedor",
                    views: {
                        'menuContent': {
                            templateUrl: "app/cotacao/dashboard/fornecedor/cotacao.dashboard.fornecedor.html"
                        }
                    }
                })

                .state('app.cotacaoNotificacaoCliente', {
                    url: "/cotacao/notificacao/cliente",
                    views: {
                        'menuContent': {
                            templateUrl: "app/cotacao/notificacao/cliente/cotacao.notificacao.cliente.html"
                        }
                    }
                })
                
                 .state('app.cotacaoNotificacaoFornecedor', {
                    url: "/cotacao/notificacao/fornecedor",
                    views: {
                        'menuContent': {
                            templateUrl: "app/cotacao/notificacao/fornecedor/cotacao.notificacao.fornecedor.html"
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

                .state('app.denuncia', {
                    url: "/denuncia",
                    views: {
                        'menuContent': {
                            templateUrl: "app/denuncia/denuncia.html"
                        }
                    }
                })

                .state('app.chat', {
                    url: "/chat/:sala",
                    views: {
                        'menuContent': {
                            templateUrl: "app/sala/chat/chat.html"
                        }
                    }
                })

                .state('app.chatNotificacao', {
                    url: "/chat/notificacao/sala?solicitacaoId&produtoNome",
                    views: {
                        'menuContent': {
                            templateUrl: "app/sala/chat/chat.html"
                        }
                    }
                })

                // .state('app.categoria', {
                //     url: "/categoria",
                //     views: {
                //         'menuContent': {
                //             templateUrl: "app/categoria/categoria.html"
                //         }
                //     }
                // })
                
                .state('app.segmento', {
                    url: "/segmento",
                    views: {
                        'menuContent': {
                            templateUrl: "app/segmento/segmento.html"
                        }
                    }
                })
                
                .state('app.subSegmento', {
                    url: "/segmento/subSegmento/:id",
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

                .state('app.categoriaEditar', {
                    url: "/categoria/editar/:id",
                    views: {
                        'menuContent': {
                            templateUrl: "app/categoria/editar/categoria.editar.html"
                        }
                    }
                })

                .state('app.usuario', {
                    url: "/usuario",
                    views: {
                        'menuContent': {
                            templateUrl: "app/usuario/usuario.html"
                        }
                    }
                })

                .state('app.usuarioEditar', {
                    url: "/usuario/editar/:usuario",
                    views: {
                        'menuContent': {
                            templateUrl: "app/usuario/editar/usuario.editar.html"
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