/// <reference path="../../../../../scripts/typings/raven-sentry/raven.ts" />

module abaxXBRL.shared.manejadores.error {

    /**
    * Interceptor de rechazos de una promesa http.
    **/
    export class AbaxXBRLInterceptorErroresHttp {

        /**
        * Servicio para la el encolamiento de peticiones.
        **/
        private $q: ng.IQService;

        /**
        * Fabrica del interceptor.
        * @param $q Servicio para la el encolamiento de peticiones.
        **/
        public static factory($q:ng.IQService): any {
            var interceptor = new AbaxXBRLInterceptorErroresHttp($q);
            var proxyResponseError = function (rejection) {
                return interceptor.respuestaError(rejection);
            };

            return {responseError: proxyResponseError};
        }
        /**
        * Maneja el error enviado por http.
        * @param rejection Información enviada en la promesa rechazada.
        * @return Retorna la promesa que proceso la solicitud rechazada.
        **/
        public respuestaError(rejection: any): ng.IPromise<any> {

            if (rejection.status != undefined && Raven && Raven.captureException) {
                var esContrasenaIncorrecta = rejection.status == 400 && rejection.data && rejection.data.error == "invalid_grant";

                if (!esContrasenaIncorrecta) {

                    Raven.captureException(new Error('HTTP ERROR (' + rejection.status + "): Error al realizar solicitud http al servidor  "), {
                        extra: {
                            config: rejection.config,
                            status: rejection.status,
                            data: rejection.data
                        }
                    });
                }
            }
            return this.$q.reject(rejection);
        }
        /**
        * Constructor de la clase.
        * @param $q Servicio para la el encolamiento de peticiones.
        **/
        constructor($q: ng.IQService) {
            this.$q = $q;
        }
    }
} 