(function () {
    'use strict';

    var serviceId = 'services';

    function services(loginServices, tipoUsuarioServices, categoriaServices, cotacaoServices, usuarioServices, solicitacaoServices,
                      produtoServices, deviceServices, salaServices, localizacaoServices, denunciaServices, avaliacaoServices,
                      faleConoscoServices, notificacaoServices, dashboardServices, segmentoServices, subSegmentoServices, planoServices, 
                      pedidoServices, enderecamentoServices, cidadeServices, estadoServices, compraServices) {
        var service = {
            loginServices: loginServices,
            tipoUsuarioServices: tipoUsuarioServices,
            categoriaServices: categoriaServices,
            cotacaoServices: cotacaoServices,
            usuarioServices: usuarioServices,
            solicitacaoServices: solicitacaoServices,
            produtoServices: produtoServices,
            deviceServices: deviceServices,
            salaServices: salaServices,
            localizacaoServices: localizacaoServices,
            denunciaServices: denunciaServices,
            avaliacaoServices: avaliacaoServices,
            faleConoscoServices: faleConoscoServices,
            notificacaoServices: notificacaoServices,
            dashboardServices: dashboardServices,
            segmentoServices: segmentoServices,
            subSegmentoServices: subSegmentoServices,
            planoServices: planoServices,
            pedidoServices: pedidoServices,
            enderecamentoServices: enderecamentoServices,
            cidadeServices: cidadeServices,
            estadoServices: estadoServices,
            compraServices: compraServices
            /*salaServices: salaServices,
            salaUsuarioServices: salaUsuarioServices*/
    };
        return service;
    }

    angular.module('cotarApp').factory(serviceId, [
        'loginServices', 'tipoUsuarioServices', 'categoriaServices', 'cotacaoServices', 'usuarioServices', 'solicitacaoServices',
        'produtoServices', 'deviceServices', 'salaServices', 'localizacaoServices', 'denunciaServices', 'avaliacaoServices',
        'faleConoscoServices', 'notificacaoServices', 'dashboardServices', 'segmentoServices', 'subSegmentoServices', 'planoServices', 'pedidoServices',
        'enderecamentoServices', 'cidadeServices', 'estadoServices', 'compraServices',
        services]);
})();