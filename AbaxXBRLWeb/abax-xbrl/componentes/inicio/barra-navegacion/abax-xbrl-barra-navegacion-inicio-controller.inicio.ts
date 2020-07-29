/// <reference path="../../../shared/services/abax-xbrl-session-service.root.ts" />


module abaxXBRL.componentes.controllers {

    /**Contrato con la definición de los elementos del scope para la barra de navegación izquierda del sitio. **/
    export interface IAbaxXbrlBarraNavegacionIzquierdaScope extends IAbaxXBRLInicioScope{
        /**Bandera que indica si se debe de colapsar el sub menú de configurar **/
        colapsarSubmenuConfigurar: boolean;
        /**Bandera que indica si se debe de colapsar el sub menú  del Editor XBRL**/
        colapsarSubmenuEditorXbrl: boolean;
        /** Url para levantar tickets de soporte por parte de las emisoras*/
        urlSoporteTecnico: string;
        /**
        * Bandera que indica si el usuario tiene facultades de configuración.
        **/
        tieneFacultadesConfiguracion: boolean;
        /**
        * Bandera que indica si el usuario tiene facultad de  consultar empresa.
        **/
        tieneFacultadConsultaEmpresas: boolean;
        /**
        * Bandera que indica si el usuario tiene facultad de consultar roles.
        **/
        tieneFacultadConsultaRoles: boolean;
        /**
        * Bandera que indica si el usuario tiene facultad de conslutar grupos.
        **/
        tieneFacultadConsultaGrupos: boolean;
        /**
        * Bandera que indica si el usuario tiene facultad de  consultar usuarios.
        **/
        tieneFacultadConsultaUsuarios: boolean;
        /**
        * Bandera que indica si el usuario tiene facultad de consultar usuarios misma empresa.
        **/
        tieneFacultadConsultaUsuariosMismaEmpresa: boolean;
        /**
        * Bandera que indica si el usuario tiene facultad de consultar datos de bitacora.
        **/
        tieneFacultadConsultarDatosBitacora:boolean;


    }
    /**Controlador de la vista de la barra de navegación izquierda del sitio. **/
    export class AbaxXBRLBarraNavegacionInicioController {
        /**Scope actual del componente **/
        private $scope: IAbaxXbrlBarraNavegacionIzquierdaScope;
        /**Servicio para el manejo de la sesion. **/
        private abaxXBRLSessionService: shared.service.AbaxXBRLSessionService;
        /**Servicio para el cambio de estado de las vistas dentro del sitio. **/
        private $state: ng.ui.IStateService = null;

        /**
       * Determina si el usuario tiene facultades de configuración.
       **/
        private tieneFacultadesConfiguracion(): boolean {
            var scope = this.$scope;
            var tieenFacultadConfiguracion =
                scope.tieneFacultadConsultaEmpresas || scope.tieneFacultadConsultaRoles ||
                scope.tieneFacultadConsultaGrupos || scope.tieneFacultadConsultaUsuarios ||
                scope.tieneFacultadConsultaUsuariosMismaEmpresa || scope.tieneFacultadConsultarDatosBitacora;
            return tieenFacultadConfiguracion;
        }

        /**Inicializa los elementos del controller. **/
        private init(): void {
            //proxy de la instancia
            var self: AbaxXBRLBarraNavegacionInicioController = this;
            var scope: IAbaxXbrlBarraNavegacionIzquierdaScope = self.$scope;

            scope.colapsarSubmenuConfigurar = true;
            scope.colapsarSubmenuEditorXbrl = true;
            scope.FacultadesEnum = AbaxXBRLFacultadesEnum;
            scope.cerrarAlertaBootstrap = shared.service.AbaxXBRLUtilsService.cerrarAlertaBootsrap;
            scope.alertasBootstrap = shared.service.AbaxXBRLUtilsService.getListaAlertasBootsrap();
            scope.urlSoporteTecnico = AbaxXBRLConstantes.URL_SOPORTE_TECNICO;

            var sesion = shared.service.AbaxXBRLSessionService;
            var FacultadesEnum = AbaxXBRLFacultadesEnum;

            scope.tieneFacultadConsultaEmpresas  = sesion.tieneFacultad(FacultadesEnum.ConsultaEmpresas);
            scope.tieneFacultadConsultaRoles = sesion.tieneFacultad(FacultadesEnum.ConsultaRoles);
            scope.tieneFacultadConsultaGrupos = sesion.tieneFacultad(FacultadesEnum.ConsultaGrupos);
            scope.tieneFacultadConsultaUsuarios = sesion.tieneFacultad(FacultadesEnum.ConsultaUsuarios);
            scope.tieneFacultadConsultaUsuariosMismaEmpresa = sesion.tieneFacultad(FacultadesEnum.ConsultaUsuariosMismaEmpresa);
            scope.tieneFacultadConsultarDatosBitacora = sesion.tieneFacultad(FacultadesEnum.ConsultarDatosBitacora);
            scope.tieneFacultadesConfiguracion = self.tieneFacultadesConfiguracion();
        }
        /**
        * Constructor base de la clase
        * @param $scope Scope actual del login.
        * @param abaxXBRLSessionService Servicio para el manejo de la sesion.
        **/
        constructor($scope: IAbaxXbrlBarraNavegacionIzquierdaScope, abaxXBRLSessionService: shared.service.AbaxXBRLSessionService, $state: ng.ui.IStateService) {
            this.$scope = $scope;
            this.abaxXBRLSessionService = abaxXBRLSessionService;
            this.$state = $state;
            this.init();
        }
    }
    AbaxXBRLBarraNavegacionInicioController.$inject = ['$scope', 'abaxXBRLSessionService','$state'];
} 