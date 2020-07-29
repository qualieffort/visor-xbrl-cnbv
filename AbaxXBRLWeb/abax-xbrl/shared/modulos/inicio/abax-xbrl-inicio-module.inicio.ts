module abaxXBRL.modulos {
    /**
     * Implementación de un singleton para contener la instancia única de la declaración del módulo abaxXBRL con los elementos solo accesibles para cuando el usuario inicio session.
     * El nombre del modulo es "abaxXBRL.inicio".
     *
     * @author Oscar Ernesto Loyola Sánchez - 2H
     * @version 1.0
     */
    export class AbaxXBRLInicioModule {

        /** La instancia única de la clase */
        private static _instance: AbaxXBRLInicioModule = null;

        /** La declaración del módulo angular que contiene al visor */
        public module: ng.IModule;

        /**Inicializa los elementos del modulo **/
        private init(): void {

            //Creamos el modulo
            var abaxXBRLInicioModule = this.module;
            //Definimos las referencias a los controladores del modulo.
            abaxXBRLInicioModule.controller('abaxXBRLCabeceraInicioController', componentes.controllers.AbaxXBRLCabeceraInicioController);
            abaxXBRLInicioModule.controller('abaxXBRLBarraNavegacionInicioController', componentes.controllers.AbaxXBRLBarraNavegacionInicioController);
            abaxXBRLInicioModule.controller('abaxXBRLInicioController', componentes.controllers.AbaxXBRLInicioController);
            
            
            
            abaxXBRLInicioModule.controller('abaxVisorXBRLController', componentes.controllers.AbaxVisorXBRLController);

            

            //Definimos las directivas
            abaxXBRLInicioModule.directive('abaxXbrlCabeceraInicio', componentes.directivas.AbaxXBRLCabeceraInicio.AbaxXBRLCabeceraInicioDirective);
            abaxXBRLInicioModule.directive('abaxXBrlSplashContenidoInicio', shared.directivas.AbaxXBRLSplashContenidoInicio.AbaxXBRLSplashContenidoInicioDirective);
            
            abaxXBRLInicioModule.directive('abaxXbrlEstadoInicialVista', componentes.directivas.AbaxXBRLEstadoInicialVista.AbaxXBRLEstadoInicialVistaDirective);
            abaxXBRLInicioModule.directive('xbrlResize', abaxXBRL.directives.XbrlResize.XbrlResizeDirective);
            //abaxXBRLInicioModule.directive('xbrlAutoNumeric', abaxXBRL.directives.XbrlAutoNumeric.XbrlAutoNumericDirective);
            //Definimos las directivas.
            abaxXBRLInicioModule.filter('abaxXBRLAsignarFilter', abaxXBRL.filters.AbaxXBRLAsignarFilter.factory);
    
            //Se agrega la configuración del ruteo del modulo de inicio.
            abaxXBRLInicioModule.config(routes.AbaxXBRLInicioRoutesConfig);

        }
        

        /**
         * Constructor de la clase ModuloVisor
         */
        constructor() {
            if (AbaxXBRLInicioModule._instance) {
                throw new Error("Error: Fallo al instanciar: Utilice getInstance() en lugar de new.");
            }
            var self = this;
            AbaxXBRLInicioModule._instance = self;
            shared.service.AbaxXBRLUtilsService.cargaModulosAngularPoNombre(['localytics.directives', 'angularUtils.directives.dirPagination'])
                .then(function () {
                //Agregamos los siguientes modulos de dependencias:
                //- abaxXBRL: Modulo principal de la aplicación.
                //- localytics.directives: Directivas para el manejo de chosen dentro de los combos de selección.
                //- angularUtils.directives.dirPagination: Modulo con la definición de directivas para el paginado de listas.
                self.module = angular.module('abaxXBRL.inicio', ['abaxXBRL', 'localytics.directives', 'angularUtils.directives.dirPagination']);
                self.init();
            }, function (error) {
                    if (console && console.log) {
                        console.log(error);
                    }
                });
        }

        /**
         * Obtiene la instancia única de esta clase. Si no existe, la crea.
         *
         * @return la instancia única de esta clase.
         */
        public static getInstance(): AbaxXBRLInicioModule {
            if (AbaxXBRLInicioModule._instance === null) {
                AbaxXBRLInicioModule._instance = new AbaxXBRLInicioModule();
            }
            return AbaxXBRLInicioModule._instance;
        }
    }
    //Disparamos la creación del modulo
    modulos.AbaxXBRLInicioModule.getInstance();



}  