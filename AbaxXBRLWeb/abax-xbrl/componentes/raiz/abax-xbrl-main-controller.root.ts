///<reference path="../../../scripts/typings/angularjs/angular.d.ts" /> 
///<reference path="../../../scripts/typings/angular-ui-router/angular-ui-router.ts" />
///<reference path="../../../scripts/typings/zip.js/zip.js.d.ts" />


module abaxXBRL.componentes.controllers {

    /**Scope raís de toda la aplicación**/
    export interface IAbaxXBRLMainScope extends ng.IScope {
        /**Copia de la entidad con los datos del usuario en sesion. **/
        usuarioSesion: shared.modelos.IUsuario;
        /**
        * Expone el enum con la lista de facultades disponibles.
        **/
        FacultadesEnum: any;
        /**
        * Determina si el usuario en sesión tiene la facultad indicada.
        * @param facultad Identificador de la facultad a evaluar.
        * @return Si el usuario en sesión tiene la facultad indicada.
        **/
        tieneFacultad(facultad: number): boolean;
        /**Destruye la sesión de usuario. **/
        cerrarSesion(): void;
        /**Cambia el idoma en la aplicación. **/
        cambiarIdioma(idioma: string): void;
        /**Muestra u oculta el menú de navegacion. **/
        toggleMenuNavegacion(): void;
        /**Bandera que indica si se debe de mostrar el menú de navegación cuando se esta en vista portrait. **/
        mostrarMenuNavegacionEnportrait: boolean;
        /**
        * Bandera que indica si la navegación debe de ser extra small.
        **/
        navegacionXS: boolean;
        /**
        * Bandera que nos indica si estamos en el editor XBRL o no.
        **/
        enEditorXBRL: boolean;

        /**
        * Presenta el documento instancia que describe el nombre del archivo definido
        */
        //presentarDocumentoInstancia(nombreArchivoDocumentoInstancia: string): void;
    }

    /**Controller principal de la raíz del sitio actual**/
    export class AbaxXBRLMainController {
        /**Scope raíz de la aplicación**/
        private $scope: IAbaxXBRLMainScope = null;
        /**Servicio para el manejo de la sesion. **/
        private abaxXBRLSessionService: shared.service.AbaxXBRLSessionService;
        /**Servicio de utilerias genericas de abax. **/
        private abaxXBRLUtilsService: shared.service.AbaxXBRLUtilsService

        /**Servicio para el cambio de estado de las vistas dentro de. **/
        private $state: ng.ui.IStateService = null;

        /** El servicio para comunicarse al servidor remoto */
        private httpService: ng.IHttpService;

        /** Servicio para el manejo asincrono de peticiones*/
        private $timeout: ng.ITimeoutService;

        /** El servicio para encolar solicitudes */
        private qService: ng.IQService;

        /**
        * Servicio para la navegación entre pantallas
        */
        private $location: ng.ILocationService;

        /** Parametros que recibe de la url*/
        private $routeParams: IRouteParams;


        /**Cambia la bandera que determina si se agrega o no la clase que mustra el menú de navegación den portrait **/
        private toggleMenuNavegacion() {
            this.$scope.mostrarMenuNavegacionEnportrait = !this.$scope.mostrarMenuNavegacionEnportrait;
        }

        /**
        * Obtienen los parametros de la url.
        * @return Diccionario con los parametros y sus valores.
        **/
        private getParametrosCargaInicialDx(): { [name: string]: string } {
            var vars: { [name: string]: string } = {};

            var url = location.href;
            if (url && url != null) {
                var parts = url.replace(/[?&]+([^=&]+)=([^&]*)/gi,
                    function (m, key, value): string {
                        vars[key] = value;
                        return "";
                    });
            }
            return vars;
        }
        

        /**Inicializamos los elementos del scope raíz.**/
        private init(): void {
            var self = this;
            var scope = self.$scope;

            scope.mostrarMenuNavegacionEnportrait = false;
            var sesion: any;

            scope.usuarioSesion = {
                IdUsuario: 0,
                Nombre: 'Visor',
                ApellidoPaterno: '',
                ApellidoMaterno: '',
                CorreoElectronico: '',
                VigenciaPassword: null,
                IntentosErroneosLogin: null,
                Bloqueado: null,
                Activo: null,
                Puesto: '',
                Borrado: null
            };

            sesion = { Usuario: scope.usuarioSesion };

            scope.enEditorXBRL = true;
            shared.service.AbaxXBRLSessionService.setAtributoSesion("esVisor", true);

            var parametros = this.getParametrosCargaInicialDx();

            shared.service.AbaxXBRLUtilsService.cargaDefinicionModulo('abaxVisorXBRLViewer').then(function () {
                if (parametros['idEnvio']) {
                    shared.service.AbaxXBRLUtilsService.cargaDefinicionModulo(root.AbaxXBRLConstantesRoot.NOMBRE_MODULO_ABAX_XBRL_INICIO).then(function () {
                        shared.service.AbaxXBRLUtilsService.cargaDefinicionModulo(root.AbaxXBRLConstantesRoot.NOMBRE_MODULO_ABAX_XBRL_VISOR).then(function () {
                            shared.service.AbaxXBRLUtilsService.setTimeout(function () {
                                abaxXBRL.controller.AbaxXBRLInfFinancieraController.mostrarDocumentoInstancia(parametros['nombreArchivo'], parametros['idEnvio']);
                            }, 333);
                        });
                    });
                    
                } else {
                    shared.service.AbaxXBRLUtilsService.cambiarEstadoVistasA("inicio.visorXBRL.enviosInformacionFinanciera");

                }               
            });
                      
        }


        



        /** 
        * Constructor del controller.
        * @param $scope Scope raíz del sitio.
        * @param abaxXBRLSessionService Servicio para el manejo de la sesion.
        * @param $state Servicio para el cambio de estado de las vistas del sitio.
        **/
        constructor($scope: IAbaxXBRLMainScope, abaxXBRLSessionService: shared.service.AbaxXBRLSessionService, $state: ng.ui.IStateService, abaxXBRLUtilsService: shared.service.AbaxXBRLUtilsService, $http: ng.IHttpService, $timeout: ng.ITimeoutService, $q: ng.IQService, $location: ng.ILocationService, $routeParams: IRouteParams) {
            this.$scope = $scope;
            this.$state = $state;
            this.abaxXBRLSessionService = abaxXBRLSessionService;
            this.abaxXBRLUtilsService = abaxXBRLUtilsService;
            this.httpService = $http;
            this.$timeout = $timeout;
            this.qService = $q;
            this.$location = $location;
            this.$routeParams = $routeParams;

            this.init();
        }
    }
    AbaxXBRLMainController.$inject = ['$scope', 'abaxXBRLSessionService', '$state', 'abaxXBRLUtilsService', '$http', '$timeout', '$q', '$location', '$routeParams'];


    interface IRouteParams extends ng.route.IRouteParamsService {
        documentoInstancia: string;
    }

} 