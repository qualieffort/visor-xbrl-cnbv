/// <reference path="../../../../../scripts/typings/raven-sentry/raven.ts" />

module abaxXBRL.shared.manejadores.error {

    /**
    * Manejador de excepsiones globales de AbaxXBRL.
    **/
    export class AbaxXBRLManejadorExcepsiones{

        /**
        * Fabrica de los manejadores de excepsiones.
        **/
        public static factory():Function {
            var manejador = new AbaxXBRLManejadorExcepsiones();
            //Retornamos una funcion que funje como proxy para el manejador abax.
            return function(exception, cause) {
                manejador.manejaExcepsion(exception, cause);
            };
        }


        /**
        * Maneja un error ocurrido en la app.
        * @param exception Excepsion ocurrida.
        * @param cause Motivo del error.
        **/
        public manejaExcepsion(exception: any, cause: any) {
            console.error(exception.stack);
            if (Raven && Raven.captureException) {
                Raven.captureException(exception);
            }
        }

        /**
        * Constructor  por defecto de la aplicación.
        **/
        constructor() { }
    }
}