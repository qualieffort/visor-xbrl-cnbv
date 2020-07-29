/// <reference path="manejadores/abax-xbrl-manejador-excepsiones.root.ts" />
/// <reference path="../../../../scripts/typings/raven-sentry/raven.ts" />

module abaxXBRL.modulos {

    /**
    * Clase que genera el modulo para el manejo de errores en AbaxXBRL.
    * @author Oscar Ernesto Loyola Sánchez - 2H
    * @version 1.0
    **/
    export class AbaxXBRLExceptionHandler {
        /** La instancia única de la clase */
        private static _instance: AbaxXBRLExceptionHandler = null;

        /** La declaración del módulo angular que contiene al visor */
        public module: ng.IModule;

        /**
         * Constructor de la clase.
         */
        constructor() {
            if (AbaxXBRLExceptionHandler._instance) {
                throw new Error("Error: Fallo al instanciar: Utilice ModuloVisor.getInstance() en lugar de new.");
            }
            AbaxXBRLExceptionHandler._instance = this;
            AbaxXBRLExceptionHandler._instance.module = angular.module('abaxXBRL.exceptionHandler', []);
        }

        /**
         * Obtiene la instancia única de esta clase. Si no existe, la crea.
         *
         * @return la instancia única de esta clase.
         */
        public static getInstance(): AbaxXBRLExceptionHandler {
            if (AbaxXBRLExceptionHandler._instance === null) {
                AbaxXBRLExceptionHandler._instance = new AbaxXBRLExceptionHandler();
            }
            return AbaxXBRLExceptionHandler._instance;
        }
    }
    //Inicializamos el modulo.
    var errorModule = AbaxXBRLExceptionHandler.getInstance().module;
    errorModule.factory('$exceptionHandler', [shared.manejadores.error.AbaxXBRLManejadorExcepsiones.factory]);
    errorModule.factory('errorHttpInterceptor', ['$q', shared.manejadores.error.AbaxXBRLInterceptorErroresHttp.factory]);
    errorModule.config(error.config.AbaxXBRLErrorHttpConfig);
} 