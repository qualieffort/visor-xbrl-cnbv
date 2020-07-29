module abaxXBRL.error.config {
    

    /**
    * Clase que especifica la configuración de las peticiones del servicio http.
    **/
    export class AbaxXBRLErrorHttpConfig {

        /**
        * Constructor de la configuración.
        **/
        constructor($httpProvider: ng.IHttpProvider) {

            $httpProvider.interceptors.push('errorHttpInterceptor');
        }
    }

    AbaxXBRLErrorHttpConfig.$inject = ['$httpProvider'];
} 