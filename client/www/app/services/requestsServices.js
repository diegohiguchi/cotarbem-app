(function(){

    angular.module('cotarApp')
        .service('requestsServices', ['$http', '$q', '$ionicLoading', 'connection',  requestsServices]);

    function requestsServices($http, $q, $ionicLoading, connection){

        function register(deviceToken){

            var deferred = $q.defer();
            //$ionicLoading.show();

            //$http.post(connection.base() + '/register', {'device_token': device_token})
            $http.post(connection.base() + '/register', {'deviceToken': deviceToken})
                .success(function(response){

                    $ionicLoading.hide();
                    deferred.resolve(response);

                })
                .error(function(data){
                    deferred.reject();
                });


            return deferred.promise;

        };


        return {
            register: register
        };
    }
})();