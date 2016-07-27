(function () {
    'use strict';

    var notificacaoServicesId = 'notificacaoServices';

    function notificacaoServices($http, connection) {
        
        function obterTodas() {
            //return $http.get(connection.base() + '/notificacao/obterTodas');
            return $http.get(connection.baseWeb() + '/api/notificacoes');
        }

        function obterPorId(id) {
            return $http.get(connection.base() + '/notificacao/obterPorId/' + id);
        }

        function adicionar(notificacao){
            //return $http.post(connection.base() + '/notificacao/adicionar', notificacao);
            return $http.post(connection.baseWeb() + '/api/notificacoes', notificacao);
        }

        function editar(notificacao){
            return $http.post(connection.base() + '/notificacao/editar', notificacao);
        }

        function remover(id){
            return $http.post(connection.base() + '/notificacao/remover/' + id);
        }
        
        function obterPorNome(nome) {
            return $http.get(connection.base() + '/notificacao/obterPorNome/' + nome);
        }
        
        function obterPorUsuarioId(id) {
            return $http.get(connection.baseWeb() + '/api/notificacoes/obterPorUsuarioId/' + id);
        }
        
        function obterNotificacoesEmAbertoPorUsuarioId(id) {
            return $http.get(connection.baseWeb() + '/api/notificacoes/obterNotificacoesEmAbertoPorUsuarioId/' + id);
        }
        
        function editarLista(notificacoes) {
            return $http.post(connection.baseWeb() + '/api/notificacoes/editarLista', notificacoes);
        }

        function notificarFornecedores(solicitacao){
            return $http.post(connection.baseWeb() + '/api/notificacoes/fornecedores', solicitacao)
        }

        function notificarCliente(solicitacao){
            return $http.post(connection.baseWeb() + '/api/notificacoes/cliente', solicitacao);
        }

        function notificarFornecedorProduto(cotacao){
            return $http.post(connection.baseWeb() + '/api/notificacoes/fornecedor/produto', cotacao);
        }
        
        var services = {
            obterTodas: obterTodas,
            obterPorId: obterPorId,
            adicionar: adicionar,
            editar: editar,
            remover: remover,
            obterPorNome: obterPorNome,
            obterPorUsuarioId: obterPorUsuarioId,
            obterNotificacoesEmAbertoPorUsuarioId: obterNotificacoesEmAbertoPorUsuarioId,
            editarLista: editarLista,
            notificarFornecedores: notificarFornecedores,
            notificarCliente: notificarCliente,
            notificarFornecedorProduto: notificarFornecedorProduto
        };

        return services;
    }

    angular.module('cotarApp').factory(notificacaoServicesId, ['$http', 'connection', notificacaoServices]);
})();
