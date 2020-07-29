///<reference path="../scripts/typings/angularjs/angular.d.ts" /> 
///<reference path="modeloAbax.ts" /> 
///<reference path="../scripts/typings/angularjs/angular-route.d.ts" />
///<reference path="../scripts/typings/angularjs/angular-resource.d.ts" />
///<reference path="../scripts/typings/angular-file-upload/angular-file-upload.d.ts" /> 
///<reference path="../scripts/typings/loading/jquery.isloading.d.ts" />
///<reference path="../scripts/typings/impromptu/jquery-impromptu.d.ts" />
///<reference path="../scripts/typings/fileDownload/jquery.fileDownload.d.ts" />
///<reference path="../scripts/typings/intro/jquery.intro.d.ts" />
///<reference path="../scripts/typings/jquery-fullscreen/jquery-fullscreen.d.ts" />
///<reference path="jQuery/pluginsXbrl.ts" />

module abaxXBRL.controller {

    import services = abaxXBRL.services;
    import model = abaxXBRL.model;
    import upload = ng.angularFileUpload;

    /**
     * Implementación de un controlador para la edición/visualización de documentos instancia XBRL
     *
     * @author José Antonio Huizar Moreno
     * @version 1.0
     */
    export class AbaxXBRLController {

        /** El scope del controlador */
        private $scope: IDocumentoInstanciaScope;

        /** El servicio angular parala comunicación con el backend de la aplicación */
        private abaxService: services.AbaxXBRLServices;

        /** Servicio para presentar diálogos modales al usuario */
        private $modal: ng.ui.bootstrap.IModalService;

        /** El servicio para encolar solicitudes */
        private qService: ng.IQService;

        /**Servicio para el cambio de estado de las vistas dentro del sitio. **/
        private $state: ng.ui.IStateService = null;

        /** El servicio para ejecutar tareas asíncronas */
        private $timeout: ng.ITimeoutService;

        /** El servicio para ser notificado cuando el usuario intenta navegar fuera de la página actual */
        private guardiaNavegacionService: services.GuardianNavegarFueraPaginaService;

        /** El servicio para comunicarse al servidor remoto */
        private httpService: ng.IHttpService;
        /**
        * The document modal window.
        **/
        public static DOCUMENT_WINDOW: Window;


        /**
         * Presenta el documento instancia en pantalla para el usuario.
         */
        private presentarDocumento(): void {
            var self = this;

            self.$scope.idUsuarioActivo = self.abaxService.idUsuarioActivo;
            self.$scope.idEmisoraActiva = self.abaxService.idEmisoraActiva;
            self.$scope.nombreCompletoUsuarioActivo = self.abaxService.nombreCompletoUsuarioActivo;
            self.abaxService.getDocumentoInstancia().xbrlIdioma = null;
            //español por default
            for (var idm in self.abaxService.getDocumentoInstancia().Taxonomia.IdiomasTaxonomiaObjeto) {
                if (self.abaxService.getDocumentoInstancia().Taxonomia.IdiomasTaxonomiaObjeto[idm].ClaveIdioma === "es") {
                    self.abaxService.getDocumentoInstancia().xbrlIdioma = self.abaxService.getDocumentoInstancia().Taxonomia.IdiomasTaxonomiaObjeto[idm];
                    break;
                }
            }
            if (self.abaxService.getDocumentoInstancia().xbrlIdioma == null) {
                self.abaxService.getDocumentoInstancia().xbrlIdioma = self.abaxService.getDocumentoInstancia().Taxonomia.IdiomasTaxonomiaObjeto[0];
            }

            self.$scope.xbrlIdioma = self.abaxService.getDocumentoInstancia().xbrlIdioma;

            self.abaxService.getDocumentoInstancia().modoVistaFormato = "formato";
            self.abaxService.getDocumentoInstancia().NumeroDecimalesTipoDatoMonetario = self.$scope.numeroDecimales;

            self.$scope.actualizarMostrarListaRoles = function () {
                self.$scope.mostrarListaRoles = !self.$scope.mostrarListaRoles;
                if (self.$scope.mostrarListaRoles) {
                    self.$timeout(function () {
                        self.$scope.$broadcast('resize::resize');
                    });
                }
            };

            this.crearHechosDocumentoInstancia().then(function (resultado: boolean) {
                if (resultado) {
                    if (self.abaxService.getDefinicionPlantilla()) {
                        var definicionPlantilla = self.abaxService.getDefinicionPlantilla();
                        for (var idHechoPlantilla in definicionPlantilla.obtenerDefinicionDeElementos().HechosPlantillaPorId) {
                            if (definicionPlantilla.obtenerDefinicionDeElementos().HechosPlantillaPorId.hasOwnProperty(idHechoPlantilla)) {
                                //self.abaxService.obtenerIdHechoDocumentoInstanciaEquivalenteAIdHechoPlantilla(idHechoPlantilla);
                            }
                        }
                    }
                }
            }).finally(function () {

                if (self.abaxService.getDefinicionPlantilla()) {
                    //self.abaxService.getDefinicionPlantilla().eliminarHechosSinUso(self.abaxService);
                }

                self.$scope.formatoActivo = 0;
                self.$scope.rolFormatoActivo = self.abaxService.getDocumentoInstancia().Taxonomia.RolesPresentacion[self.$scope.formatoActivo];
                plugins.XbrlPluginUtils.presentarLoaderFormatos();

                self.$scope.documentoInstancia = self.abaxService.getDocumentoInstancia();

                if (self.$scope.documentoInstancia.Bloqueado && self.$scope.documentoInstancia.IdUsuarioBloqueo != self.abaxService.idUsuarioActivo || !self.$scope.documentoInstancia.Bloqueado) {
                    self.$scope.documentoInstancia.BloquearCamposCaptura = true;
                } else {
                    self.$scope.documentoInstancia.BloquearCamposCaptura = false;
                }

                if (self.$scope.documentoInstancia.IdDocumentoInstancia > 0) {
                    self.$scope.documentoInstancia.PendienteGuardar = false;
                }

                abaxXBRL.model.OperacionesCalculoDocumentoInstancia.getInstance().IndiceOperacionesCalculo = self.abaxService.getDocumentoInstancia().Taxonomia.generarIndiceOperacionesCalculo();
                abaxXBRL.model.OperacionesCalculoDocumentoInstancia.getInstance().IndiceVariablesFormulas = self.abaxService.generarIndiceVariablesFormulas();
                abaxXBRL.model.OperacionesCalculoDocumentoInstancia.getInstance().IndiceFormulasPorConcepto = self.abaxService.generarIndiceFormulasPorConcepto();
                self.abaxService.getDocumentoInstancia().RequiereValidacion = true;
                self.abaxService.getDocumentoInstancia().RequiereValidacionFormulas = true;
                self.abaxService.validarDocumentoInstancia();
                self.abaxService.validarFormulasDocumentoInstancia();


                for (var indiceIdioma in self.$scope.documentoInstancia.Taxonomia.IdiomasTaxonomiaObjeto) {
                    var valorLenguaje = "";
                    var idiomaTaxonomia = self.$scope.documentoInstancia.Taxonomia.IdiomasTaxonomiaObjeto[indiceIdioma].ClaveIdioma;
                    if (idiomaTaxonomia == "en") {
                        valorLenguaje = shared.service.AbaxXBRLUtilsService.getValorEtiqueta('ETIQUETA_INGLES');
                    } else if (idiomaTaxonomia == "es") {
                        valorLenguaje = shared.service.AbaxXBRLUtilsService.getValorEtiqueta('ETIQUETA_ESPANOL');
                    } else {
                        valorLenguaje = self.$scope.documentoInstancia.Taxonomia.IdiomasTaxonomiaObjeto[indiceIdioma].DescripcionIdioma;
                    }
                    self.$scope.documentoInstancia.Taxonomia.IdiomasTaxonomiaObjeto[indiceIdioma].DescripcionIdioma = valorLenguaje;
                }


                self.$scope.$watch('documentoInstancia.RequiereValidacion', function (newValue: boolean, oldValue: boolean, scope: IDocumentoInstanciaScope): void {
                    if (newValue) {
                        self.abaxService.validarDocumentoInstancia();
                        self.$timeout(function () {
                            $('xbrl\\:campo-captura').xbrlCampoCaptura('update');
                            $('xbrl\\:valor-calculado-hecho').xbrlValorCalculadoHecho('update');
                        });
                    }
                });
                self.$scope.$watch('documentoInstancia.RequiereValidacionFormulas', function (newValue: boolean, oldValue: boolean, scope: IDocumentoInstanciaScope): void {
                    if (newValue) {
                        self.abaxService.validarFormulasDocumentoInstancia();
                        self.$timeout(function () {
                            $('xbrl\\:campo-captura').xbrlCampoCaptura('update');
                            $('xbrl\\:mensaje-validacion-formula').xbrlMensajeValidacionFormula('update');
                        });
                    }
                });

                self.$scope.$watch('documentoInstancia.xbrlIdioma', function () {

                    for (var i = 0; i < self.abaxService.getDocumentoInstancia().Taxonomia.RolesPresentacion.length; i++) {
                        self.abaxService.getDocumentoInstancia().Taxonomia.RolesPresentacion[i].Nombre = self.obtenerEtiquetaRol(self.abaxService.getDocumentoInstancia().Taxonomia.RolesPresentacion[i]);
                    }
                });



            });

        }

        private crearHechosDocumentoInstancia(): ng.IPromise<boolean> {
            var deferred = this.qService.defer<boolean>();

            var definicionPlantilla = this.abaxService.getDefinicionPlantilla();
            if (definicionPlantilla && definicionPlantilla != null && !definicionPlantilla.IncapazDeterminarParametrosConfiguracion) {
                this.cargarGrupoDocumentos(this.abaxService.getDocumentoInstancia().Taxonomia.RolesPresentacion, 0, deferred);
            } else {
                deferred.resolve(false);
            }
            return deferred.promise;
        }

        private cargarGrupoDocumentos(rolesPresentacion: Array<model.RolPresentacion>, rolActual: number, deferred: ng.IDeferred<boolean>) {

            if (rolActual == rolesPresentacion.length) {
                deferred.resolve(true);
                return;
            }
            var self = this;
            var definicionPlantilla = this.abaxService.getDefinicionPlantilla();
            var rol = rolesPresentacion[rolActual];
            var url = definicionPlantilla.obtenerUbicacionDefinicionDeRol(rol.Uri);
            url += ((url.indexOf('?') > 0 ? '&' : '?') + "versionApp=" + root.AbaxXBRLConstantesRoot.VERSION_APP.version);
            $.getScript(url).done(function () {
                var nombreClase = rol.Uri.replace(/:/g, '_').replace(/\//g, '_').replace(/\./g, '_').replace(/\-/g, '_');
                var definicionElementosPlantilla: abaxXBRL.model.DefinicionDeElementosPlantilla = eval('new abaxXBRL.templates.' + nombreClase + '()');
                definicionPlantilla.agregarDefinicionElementos(definicionElementosPlantilla);
                self.cargarGrupoDocumentos(rolesPresentacion, ++rolActual, deferred);
            }).fail(function () {
                deferred.resolve(false);
            });
        }

        private inicializarFormatoDesgloseCreditos() {
            var self = this;

            var valorPresentacion = this.abaxService.getDocumentoInstancia().UnidadesPresentacionTipoDatoMonetario;
            var numeroDecimales = this.abaxService.getDocumentoInstancia().NumeroDecimalesTipoDatoMonetario;

            var conceptoTipoDato = this.abaxService.getDocumentoInstancia().obtenerConceptoPorId("ifrs_mx-cor_20141205_ComercioExteriorBancarios");
            var tipoDatoNumerico = <abaxXBRL.model.TipoDatoNumerico>(abaxXBRL.model.TiposDatoXbrl.getInstance().get()[conceptoTipoDato.TipoDatoXbrl]);
            var opcionesAutonumeric = tipoDatoNumerico.OpcionesAutonumeric;

            $(".spanValorNumericItem").each(function (index) {
                var Hecho: model.Hecho = self.abaxService.getDocumentoInstancia().obtenerHechoPorId($(this).attr('id'));
                if (Hecho && Hecho != null) {
                    var valorHechoMonetario = Hecho.ValorHecho;

                    if (valorHechoMonetario && valorHechoMonetario.length > 0) {
                        valorHechoMonetario = math.eval('bignumber("' + valorHechoMonetario + '")').dividedBy(valorPresentacion).toDP(numeroDecimales);
                        $(this).text(valorHechoMonetario);
                    }
                }
            });


            if (this.abaxService.getDocumentoInstancia().NumeroDecimalesTipoDatoMonetario > 0) {
                var opcionesAutonumericPersonalizado: any = {};
                opcionesAutonumericPersonalizado.mDec = numeroDecimales.toString();
                opcionesAutonumericPersonalizado.vMin = opcionesAutonumeric.vMin;
                opcionesAutonumericPersonalizado.vMax = opcionesAutonumeric.vMax;
                opcionesAutonumericPersonalizado.aSign = opcionesAutonumeric.aSign;
                opcionesAutonumericPersonalizado.nBracket = opcionesAutonumeric.nBracket;
                opcionesAutonumericPersonalizado.pSign = opcionesAutonumeric.pSign;

                $(".spanValorNumericItem").autoNumeric('update', opcionesAutonumericPersonalizado);
            } else {

                $(".spanValorNumericItem").autoNumeric('update', opcionesAutonumeric);
            }
        }



        /**
         * Inicializa el controlador.
         */
        private init(): void {
            var self = this;

            var aceptar = shared.service.AbaxXBRLUtilsService.getValorEtiqueta('EDITOR_XBRL_ACEPTAR');
            self.$scope.idUsuarioActivo = self.abaxService.idUsuarioActivo;
            self.$scope.idEmisoraActiva = self.abaxService.idEmisoraActiva;
            self.$scope.panelActivo = PanelesDatos.Formatos;
            self.$scope.PanelFormatos = PanelesDatos.Formatos;
            self.$scope.PanelUsuarios = PanelesDatos.Usuarios;
            self.$scope.PanelVersiones = PanelesDatos.Versiones;
            self.$scope.deshabilitarExportar = false;
            self.$scope.deshabilitarGuardar = false;
            self.$scope.deshabilitarImportarWord = false;
            self.$scope.deshabilitarImportarExcel = false;

            self.$scope.numeroDecimales = 0;


            self.$scope.$on('$locationChangeStart', function ($event: ng.IAngularEvent, newUrl: string, oldUrl: string) {
                $event.preventDefault();
                return;
            })

            this.guardiaNavegacionService.depurarGuardianes();
            this.guardiaNavegacionService.registrarGuardian(function (): string {
                var mensaje = undefined;
                mensaje = shared.service.AbaxXBRLUtilsService.getValorEtiqueta('MENSAJE_CONFIRM_SALIR_VISOR');
                return mensaje;
            });

            self.abaxService.limpiarDocumentoYPlantilla();
            var idDocumentoInstancia = shared.service.AbaxXBRLSessionService.getAtributoSesion("idDocumentoInstancia");
            var idDocumentoEnvioStiv = shared.service.AbaxXBRLSessionService.getAtributoSesion("idDocumentoEnvioStiv");
            var documentoInstanciaJson = shared.service.AbaxXBRLSessionService.getAtributoSesion("documentoInstanciaJson");
            var nombreArchivo = shared.service.AbaxXBRLSessionService.getAtributoSesion("nombreArchivo");
            self.abaxService.nombreArchivo = nombreArchivo;


            shared.service.AbaxXBRLSessionService.remueveAtributoSesion("idDocumentoInstancia");
            shared.service.AbaxXBRLSessionService.remueveAtributoSesion("documentoInstanciaJson");
            shared.service.AbaxXBRLSessionService.remueveAtributoSesion("nombreArchivo");
            shared.service.AbaxXBRLSessionService.remueveAtributoSesion("idDocumentoEnvioStiv");


            

            this.$scope.esFormatoActivo = function (numeroFormato: number): boolean {
                return self.$scope.formatoActivo == numeroFormato;
            };

            this.$scope.establecerFormatoActivo = function (numeroFormato: number, recargar?: boolean): void {

                if (recargar && recargar == true) {
                    plugins.XbrlPluginUtils.presentarLoaderFormatos();
                    self.$scope.recargarFormato = true;
                } else {
                    if (!recargar && self.$scope.formatoActivo == numeroFormato) return;
                    self.$scope.formatoActivo = numeroFormato;
                    plugins.XbrlPluginUtils.presentarLoaderFormatos();
                    self.$scope.rolFormatoActivo = self.abaxService.getDocumentoInstancia().Taxonomia.RolesPresentacion[numeroFormato];
                    if (self.$scope.panelActivo != PanelesDatos.Formatos) {
                        self.$scope.panelActivo = PanelesDatos.Formatos;
                    }
                }


                //self.$scope.rolFormatoActivo = self.abaxService.getDocumentoInstancia().Taxonomia.RolesPresentacion[0];

            };

            this.$scope.guardarDocumentoInstancia = function (): void {
                self.$scope.deshabilitarGuardar = true;
                var modalInstance = self.$modal.open({
                    templateUrl: 'ts/templates/template-xbrl-guardar-documento.html?version=' + root.AbaxXBRLConstantesRoot.VERSION_APP.version,
                    controller: GuardarDocumentoController,
                    resolve: {
                        documentoInstancia: function () {
                            return self.$scope.documentoInstancia;
                        }
                    }
                });

                modalInstance.result.then(function () {
                    self.$scope.deshabilitarGuardar = false;
                }, function () {
                    self.$scope.deshabilitarGuardar = false;
                });
            };

            this.$scope.esPanelActivo = function (idPanel: PanelesDatos): boolean {
                return self.$scope.panelActivo == idPanel;
            };

            this.$scope.establecerPanelActivo = function (idPanel: PanelesDatos): void {
                self.$scope.panelActivo = idPanel;
            };

            this.$scope.establecerPanelActivoFormatos = function (recargar: boolean): void {
                self.$scope.panelActivo = self.$scope.PanelFormatos;
                if (recargar) {
                    self.$scope.establecerFormatoActivo(self.$scope.formatoActivo, true);
                }
            };

            this.$scope.presentarVersionesDocumentoInstancia = function (): void {

                $.isLoading({ text: shared.service.AbaxXBRLUtilsService.getValorEtiqueta('EDITOR_XBRL_CARGANDO_HISTORIA_DOCUMENTO') });
                self.abaxService.obtenerHistoricoVersionesDeDocumentoInstancia().then(function (resultadoOperacion: abaxXBRL.model.ResultadoOperacion) {
                    self.$scope.listaHistoricoVersiones = new Array<model.VersionDocumentoInstancia>();
                    if (resultadoOperacion.InformacionExtra && resultadoOperacion.InformacionExtra != null && resultadoOperacion.InformacionExtra.length && resultadoOperacion.InformacionExtra.length > 0) {
                        for (var i = 0; i < resultadoOperacion.InformacionExtra.length; i++) {
                            self.$scope.listaHistoricoVersiones.push(new model.VersionDocumentoInstancia().deserialize(resultadoOperacion.InformacionExtra[i]));
                        }
                    }
                    self.$scope.panelActivo = PanelesDatos.Versiones;
                }, function (resultadoOperacion: abaxXBRL.model.ResultadoOperacion) {
                    $.prompt(shared.service.AbaxXBRLUtilsService.getValorEtiqueta('EDITOR_XBRL_ERROR_HISTORIA_DOCUMENTO'),
                        {
                            title: shared.service.AbaxXBRLUtilsService.getValorEtiqueta('EDITOR_XBRL_ERROR_CONTACTAR_SERVIDOR'),
                            buttons: { aceptar: true }
                        });
                }).finally(function () {
                    $.isLoading('hide');
                });
            };

            this.$scope.presentarUsuariosDocumentoInstancia = function (): void {
                if (self.$scope.documentoInstancia.IdDocumentoInstancia != null) {
                    self.$scope.panelActivo = PanelesDatos.Usuarios;
                } else {
                    $.prompt(shared.service.AbaxXBRLUtilsService.getValorEtiqueta('EDITOR_XBRL_COMPARTIR_CAMBIOS_PENDIENTES'),
                        {
                            title: shared.service.AbaxXBRLUtilsService.getValorEtiqueta('EDITOR_XBRL_COMPARTIR_DOCUMENTO_INSTANCIA'),
                            buttons: { aceptar: true }
                        });
                }
            };

            this.$scope.bloquearLiberarDocumentoInstancia = function (): void {

                $.isLoading({
                    text: shared.service.AbaxXBRLUtilsService.getValorEtiqueta('EDITOR_XBRL_BLOQUEANDO_DOCUMENTO_INSTANCIA')
                });

                self.abaxService.bloquearLiberarDocumentoInstancia(!self.$scope.documentoInstancia.Bloqueado).then(function (resultadoOperacion: abaxXBRL.model.ResultadoOperacion) {
                    self.$scope.documentoInstancia.Bloqueado = resultadoOperacion.InformacionExtra.Bloqueado;
                    self.$scope.documentoInstancia.IdUsuarioBloqueo = resultadoOperacion.InformacionExtra.IdUsuarioBloqueo;
                    self.$scope.documentoInstancia.NombreUsuarioBloqueo = resultadoOperacion.InformacionExtra.NombreUsuarioBloqueo;

                    if ((self.$scope.documentoInstancia.Bloqueado && self.$scope.documentoInstancia.IdUsuarioBloqueo != self.abaxService.idUsuarioActivo) || !self.$scope.documentoInstancia.Bloqueado) {
                        self.$scope.documentoInstancia.BloquearCamposCaptura = true;
                    } else {
                        self.$scope.documentoInstancia.BloquearCamposCaptura = false;
                    }
                    $('xbrl\\:campo-captura').xbrlCampoCaptura('soloLectura', self.$scope.documentoInstancia.BloquearCamposCaptura);
                    $('xbrl\\:campo-captura').xbrlCampoCaptura('update');
                    $('table[xbrl\\:tabla-excel]').xbrlTablaExcel('soloLectura', self.$scope.documentoInstancia.BloquearCamposCaptura);
                    self.$scope.rolFormatoActivo = self.abaxService.getDocumentoInstancia().Taxonomia.RolesPresentacion[self.$scope.formatoActivo];
                    var mensajePop = shared.service.AbaxXBRLUtilsService.getValorEtiqueta(resultadoOperacion.Mensaje);
                    $.prompt(shared.service.AbaxXBRLUtilsService.getValorEtiqueta(mensajePop),
                        {
                            title: shared.service.AbaxXBRLUtilsService.getValorEtiqueta('ETIQUETA_BLOQUEAR_DESBLOQUEAR'),
                            buttons: { aceptar: true }
                        });


                }, function (resultadoOperacion: abaxXBRL.model.ResultadoOperacion) {
                    var mensajePop = shared.service.AbaxXBRLUtilsService.getValorEtiqueta(resultadoOperacion.Mensaje);
                    $.prompt(shared.service.AbaxXBRLUtilsService.getValorEtiqueta(mensajePop),
                        {
                            title: shared.service.AbaxXBRLUtilsService.getValorEtiqueta('TITULO_PROMPT_DOCUMENTO_BLOQUEADO'),
                            buttons: { aceptar: true }
                        });

                }).finally(function () {

                    $.isLoading('hide');


                });

            };

            this.$scope.exportarDocumentoInstancia = function () {
                self.$scope.deshabilitarExportar = true;
                var modalInstance = self.$modal.open({
                    templateUrl: 'ts/templates/template-xbrl-exportar-documento.html?version=' + root.AbaxXBRLConstantesRoot.VERSION_APP.version,
                    controller: ExportarDocumentoController,
                    resolve: {
                        documentoInstancia: function () {
                            return self.$scope.documentoInstancia;
                        }
                    }
                });

                modalInstance.result.then(function () {
                    self.$scope.deshabilitarExportar = false;
                }, function () {
                    self.$scope.deshabilitarExportar = false;
                });
            };

            this.$scope.cambiarPresentacionDatoMonetario = function (valorFormatoPresentacion: number) {
                if (self.abaxService.getDocumentoInstancia().UnidadesPresentacionTipoDatoMonetario != valorFormatoPresentacion) {
                    self.abaxService.getDocumentoInstancia().UnidadesPresentacionTipoDatoMonetario = valorFormatoPresentacion;
                    $('xbrl\\:campo-captura').xbrlCampoCaptura('marcarSucio');
                    $('xbrl\\:campo-captura').xbrlCampoCaptura('update');
                    self.inicializarFormatoDesgloseCreditos();


                    $('.monetaryItemType').each(function () {
                        var elemento = $(this);
                        var hecho = self.abaxService.getDocumentoInstancia().HechosPorId[elemento.attr("id")];
                        if (hecho) {

                            var valorFinal = hecho.ValorHecho;
                            if (valorFinal && valorFinal.length > 0) {
                                valorFinal = math.eval('bignumber("' + valorFinal + '")').dividedBy(valorFormatoPresentacion).toDP(self.abaxService.getDocumentoInstancia().NumeroDecimalesTipoDatoMonetario);
                            }
                            var concepto = self.abaxService.getDocumentoInstancia().Taxonomia.ConceptosPorId[hecho.IdConcepto];
                            var tipoDato: any = null;
                            tipoDato = abaxXBRL.model.TiposDatoXbrl.getInstance().get()[concepto.TipoDatoXbrl];
                            if (self.abaxService.getDocumentoInstancia().NumeroDecimalesTipoDatoMonetario > 0 && tipoDato.Nombre == "monetaryItemType") {
                                valorFinal = shared.service.AbaxXBRLUtilsService.setNumberFormat(valorFinal, tipoDato.OpcionesAutonumeric, self.abaxService.getDocumentoInstancia().NumeroDecimalesTipoDatoMonetario);
                            } else {
                                valorFinal = shared.service.AbaxXBRLUtilsService.setNumberFormat(valorFinal, tipoDato.OpcionesAutonumeric);
                            }
                            elemento.text(valorFinal);
                        }

                    });



                }


            }




            this.$scope.cambiarIdiomaDocumentoInstancia = function (indiceIdiomaSeleccionado: number) {
                self.abaxService.getDocumentoInstancia().xbrlIdioma = self.$scope.documentoInstancia.Taxonomia.IdiomasTaxonomiaObjeto[indiceIdiomaSeleccionado];
                self.$scope.xbrlIdioma = self.abaxService.getDocumentoInstancia().xbrlIdioma;
                $('xbrl\\:etiqueta-concepto').xbrlEtiquetaConcepto('update');
                var servicioInstanciaSesion = shared.service.AbaxXBRLSessionService.SINGELTON_SERVICE_INSTANCE;
                servicioInstanciaSesion.cambiarIdioma(self.$scope.xbrlIdioma.ClaveIdioma);
                self.$scope.inicializarOpcionesIntro();



                for (var i = 0; i < self.abaxService.getDocumentoInstancia().Taxonomia.RolesPresentacion.length; i++) {
                    self.abaxService.getDocumentoInstancia().Taxonomia.RolesPresentacion[i].Nombre = self.obtenerEtiquetaRol(self.abaxService.getDocumentoInstancia().Taxonomia.RolesPresentacion[i]);
                }


                $('.claseCambioIdioma').click();

                for (var indiceIdioma in self.$scope.documentoInstancia.Taxonomia.IdiomasTaxonomiaObjeto) {
                    var valorLenguaje = "";
                    var idiomaTaxonomia = self.$scope.documentoInstancia.Taxonomia.IdiomasTaxonomiaObjeto[indiceIdioma].ClaveIdioma;
                    if (idiomaTaxonomia == "en") {
                        valorLenguaje = shared.service.AbaxXBRLUtilsService.getValorEtiqueta('ETIQUETA_INGLES');
                    } else if (idiomaTaxonomia == "es") {
                        valorLenguaje = shared.service.AbaxXBRLUtilsService.getValorEtiqueta('ETIQUETA_ESPANOL');
                    } else {
                        valorLenguaje = self.$scope.documentoInstancia.Taxonomia.IdiomasTaxonomiaObjeto[indiceIdioma].DescripcionIdioma;
                    }
                    self.$scope.documentoInstancia.Taxonomia.IdiomasTaxonomiaObjeto[indiceIdioma].DescripcionIdioma = valorLenguaje;
                }
            };

            this.$scope.expandirEditor = function () {
                if (self.abaxService.getDocumentoInstancia().modoVistaFormato == "formatoExpandido") {
                    self.abaxService.getDocumentoInstancia().modoVistaFormato = "formato";
                } else {
                    self.abaxService.getDocumentoInstancia().modoVistaFormato = "formatoExpandido";
                }

            };

            this.$scope.mostrarPantallaCompletaDocumento = function () {

                if ($(document).fullScreen() && $(document).fullScreen() !== null) {
                    $(document).fullScreen(false);
                    self.$scope.EsPantallaCompleta = false;
                } else {
                    if ($(document).fullScreen() !== null) {
                        $(document).fullScreen(true);
                        self.$scope.EsPantallaCompleta = true;
                        $(document).bind("fullscreenchange", function () {
                            $(document).unbind("fullscreenchange");
                            self.$scope.EsPantallaCompleta = $(document).fullScreen();
                        });

                    }
                }
            };


            this.$scope.agrandarFuente = function () {
                var fontSize = $(".tamanioLetraDocumento").css("font-size").replace("px", "");

                fontSize = parseInt(fontSize) + 1 + "px";
                $(".tamanioLetraDocumento").css({ 'font-size': fontSize });

                if ($(".tamanioNumeroDocumento")) {
                    var fontSizeNumero = $(".tamanioNumeroDocumento").css("font-size").replace("px", "");
                    fontSizeNumero = parseInt(fontSizeNumero) + 1 + "px";
                    $(".tamanioNumeroDocumento").css({ 'font-size': fontSizeNumero });
                }
            }

            this.$scope.encogerFuente = function () {
                var fontSize = $(".tamanioLetraDocumento").css("font-size").replace("px", "");

                fontSize = parseInt(fontSize) - 1 + "px";
                $(".tamanioLetraDocumento").css({ 'font-size': fontSize });

                if ($(".tamanioNumeroDocumento")) {
                    var fontSizeNumero = $(".tamanioNumeroDocumento").css("font-size").replace("px", "");
                    fontSizeNumero = parseInt(fontSizeNumero) - 1 + "px";
                    $(".tamanioNumeroDocumento").css({ 'font-size': fontSizeNumero });
                }
            }



            this.$scope.importarNotasWord = function () {
                self.$scope.deshabilitarImportarWord = true;
                var modalInstance = self.$modal.open({
                    templateUrl: 'ts/templates/template-xbrl-importar-notas-word.html?version=' + root.AbaxXBRLConstantesRoot.VERSION_APP.version,
                    controller: ImportarNotasDocumentoInstanciaController,
                    resolve: {
                        documentoInstancia: function () {
                            return self.$scope.documentoInstancia;
                        }
                    }
                });
                modalInstance.result.then(function (exitoImportacion) {
                    if (exitoImportacion) {
                        self.$scope.establecerFormatoActivo(self.$scope.formatoActivo, true);
                        $.prompt(shared.service.AbaxXBRLUtilsService.getValorEtiqueta('EDITOR_XBRL_EXITO_IMPORTAR_WORD'),
                            {
                                title: shared.service.AbaxXBRLUtilsService.getValorEtiqueta('EDITOR_XBRL_IMPORTAR_DOCUMENTO'),
                                buttons: { "Aceptar": true }
                            });
                    }
                    self.$scope.deshabilitarImportarWord = false;
                }, function () {
                    //console.log('Modal dismissed at: ' + new Date());
                    self.$scope.deshabilitarImportarWord = false;
                });
            };

            this.$scope.importarInformacionDeDocumentoExcel = function () {
                self.$scope.deshabilitarImportarExcel = true;
                var modalInstance = self.$modal.open({
                    templateUrl: 'ts/templates/template-xbrl-importar-documento-excel.html?version=' + root.AbaxXBRLConstantesRoot.VERSION_APP.version,
                    controller: ImportarDocumentoInstanciaExcelController,
                    resolve: {
                        documentoInstancia: function () {
                            return self.$scope.documentoInstancia;
                        }
                    }
                });
                modalInstance.result.then(function (exitoImportacion) {
                    if (exitoImportacion) {
                        self.$scope.establecerFormatoActivo(self.$scope.formatoActivo, true);
                        $.prompt(shared.service.AbaxXBRLUtilsService.getValorEtiqueta('EDITOR_XBRL_EXITO_IMPORTAR_EXCEL'),
                            {
                                title: shared.service.AbaxXBRLUtilsService.getValorEtiqueta('EDITOR_XBRL_IMPORTAR_DOCUMENTO'),
                                buttons: { aceptar: true }
                            });
                    }
                    self.$scope.deshabilitarImportarExcel = false;
                }, function () {
                    //console.log('Modal dismissed at: ' + new Date());
                    self.$scope.deshabilitarImportarExcel = false;
                });
            };

            this.$scope.inicializarOpcionesIntro = function (): void {
                self.$scope.opcionesIntro = {
                    doneLabel: shared.service.AbaxXBRLUtilsService.getValorEtiqueta('EDITOR_XBRL_LISTO'),
                    exitOnEsc: true,
                    keyboardNavigation: true,
                    exitOnOverlayClick: false,
                    showBullets: true,
                    showButtons: true,
                    showProgress: true,
                    showStepNumbers: true,
                    prevLabel: shared.service.AbaxXBRLUtilsService.getValorEtiqueta('EDITOR_XBRL_PREVIO'),
                    nextLabel: shared.service.AbaxXBRLUtilsService.getValorEtiqueta('EDITOR_XBRL_SIGUIENTE'),
                    skipLabel: shared.service.AbaxXBRLUtilsService.getValorEtiqueta('EDITOR_XBRL_SALTAR'),
                    scrollToElement: true,
                    steps: [
                        {
                            element: '#panelRolesTaxonomia',
                            intro: shared.service.AbaxXBRLUtilsService.getValorEtiqueta('EDITOR_XBRL_INTRO_PANEL_ROLES_TAXONOMIA'),
                            position: 'right'
                        },
                        {
                            element: '#panelToolbar',
                            intro: shared.service.AbaxXBRLUtilsService.getValorEtiqueta('EDITOR_XBRL_INTRO_PANEL_TOOLBAR'),
                            position: 'bottom'
                        },
                        {
                            element: '#btnExportarDocumentoInstancia',
                            intro: shared.service.AbaxXBRLUtilsService.getValorEtiqueta('EDITOR_XBRL_EXPORTAR_DOCUMENTO_AYUDA'),
                            position: 'bottom'
                        },

                        {
                            element: '#btnAgregarDocumentoComparar',
                            intro: shared.service.AbaxXBRLUtilsService.getValorEtiqueta('EDITOR_XBRL_COMPARA_DOCUMENTO'),
                            position: 'bottom'
                        },
                        {
                            element: '#btnExpandirVista',
                            intro: shared.service.AbaxXBRLUtilsService.getValorEtiqueta('EDITOR_XBRL_INTRO_BTN_EXPANDIR_VISTA'),
                            position: 'bottom'
                        },
                        {
                            element: '#btnPantallaCompleta',
                            intro: shared.service.AbaxXBRLUtilsService.getValorEtiqueta('EDITOR_XBRL_INTRO_BTN_PANTALLA_COMPLETA'),
                            position: 'bottom'
                        },
                        {
                            element: '#btnAgrandarFuente',
                            intro: shared.service.AbaxXBRLUtilsService.getValorEtiqueta('EDITOR_XBRL_INTRO_BTN_AGRANDAR_FUENTE'),
                            position: 'bottom'
                        },
                        {
                            element: '#btnEncogerFuente',
                            intro: shared.service.AbaxXBRLUtilsService.getValorEtiqueta('EDITOR_XBRL_INTRO_BTN_ENCOGER_FUENTE'),
                            position: 'bottom'
                        },
                        {
                            element: '#btnCambiarIdiomaEtiquetas',
                            intro: shared.service.AbaxXBRLUtilsService.getValorEtiqueta('EDITOR_XBRL_INTRO_BTN_IDIOMA_DOCUMENTO'),
                            position: 'bottom'
                        },

                        {
                            element: '#btnPresentarCantidadMonetario',
                            intro: shared.service.AbaxXBRLUtilsService.getValorEtiqueta('EDITOR_XBRL_INTRO_BTN_CANTIDAD_MONETARIO'),
                            position: 'bottom'
                        },
                        /*{
                            element: '#btnPresentarNumeroDecimales',
                            intro: shared.service.AbaxXBRLUtilsService.getValorEtiqueta('EDITOR_XBRL_INTRO_BTN_NUMERO_DECIMALES'),
                            position: 'bottom'
                        },  */
                        {
                            element: '#filtroEtiquetas',
                            intro: shared.service.AbaxXBRLUtilsService.getValorEtiqueta('EDITOR_XBRL_INTRO_FILTRO_ETIQUETAS'),
                            position: 'bottom'
                        },

                        {
                            element: '#contenedorFormatos',
                            intro: shared.service.AbaxXBRLUtilsService.getValorEtiqueta('EDITOR_XBRL_INTRO_CONTENEDOR_FORMATOS'),
                            position: 'left'
                        },
                        {
                            element: '#footerEditor',
                            intro: shared.service.AbaxXBRLUtilsService.getValorEtiqueta('EDITOR_XBRL_INTRO_FOOTER_EDITOR'),
                            position: 'top'
                        }
                    ]
                };
            }
            this.$scope.opcionesIntro = {
                doneLabel: shared.service.AbaxXBRLUtilsService.getValorEtiqueta('EDITOR_XBRL_LISTO'),
                exitOnEsc: true,
                keyboardNavigation: true,
                exitOnOverlayClick: false,
                showBullets: true,
                showButtons: true,
                showProgress: true,
                showStepNumbers: true,
                prevLabel: shared.service.AbaxXBRLUtilsService.getValorEtiqueta('EDITOR_XBRL_PREVIO'),
                nextLabel: shared.service.AbaxXBRLUtilsService.getValorEtiqueta('EDITOR_XBRL_SIGUIENTE'),
                skipLabel: shared.service.AbaxXBRLUtilsService.getValorEtiqueta('EDITOR_XBRL_SALTAR'),
                scrollToElement: true,
                steps: [
                    {
                        element: '#panelRolesTaxonomia',
                        intro: shared.service.AbaxXBRLUtilsService.getValorEtiqueta('EDITOR_XBRL_INTRO_PANEL_ROLES_TAXONOMIA'),
                        position: 'right'
                    },
                    {
                        element: '#panelToolbar',
                        intro: shared.service.AbaxXBRLUtilsService.getValorEtiqueta('EDITOR_XBRL_INTRO_PANEL_TOOLBAR'),
                        position: 'bottom'
                    },


                    {
                        element: '#btnExportarDocumentoInstancia',
                        intro: shared.service.AbaxXBRLUtilsService.getValorEtiqueta('EDITOR_XBRL_EXPORTAR_DOCUMENTO_AYUDA'),
                        position: 'bottom'
                    },

                    {
                        element: '#btnAgregarDocumentoComparar',
                        intro: shared.service.AbaxXBRLUtilsService.getValorEtiqueta('EDITOR_XBRL_COMPARA_DOCUMENTO'),
                        position: 'bottom'
                    },

                    {
                        element: '#btnExpandirVista',
                        intro: shared.service.AbaxXBRLUtilsService.getValorEtiqueta('EDITOR_XBRL_INTRO_BTN_EXPANDIR_VISTA'),
                        position: 'bottom'
                    },
                    {
                        element: '#btnPantallaCompleta',
                        intro: shared.service.AbaxXBRLUtilsService.getValorEtiqueta('EDITOR_XBRL_INTRO_BTN_PANTALLA_COMPLETA'),
                        position: 'bottom'
                    },
                    {
                        element: '#btnAgrandarFuente',
                        intro: shared.service.AbaxXBRLUtilsService.getValorEtiqueta('EDITOR_XBRL_INTRO_BTN_AGRANDAR_FUENTE'),
                        position: 'bottom'
                    },
                    {
                        element: '#btnEncogerFuente',
                        intro: shared.service.AbaxXBRLUtilsService.getValorEtiqueta('EDITOR_XBRL_INTRO_BTN_ENCOGER_FUENTE'),
                        position: 'bottom'
                    },
                    {
                        element: '#btnCambiarIdiomaEtiquetas',
                        intro: shared.service.AbaxXBRLUtilsService.getValorEtiqueta('EDITOR_XBRL_INTRO_BTN_IDIOMA_DOCUMENTO'),
                        position: 'bottom'
                    },
                    {
                        element: '#btnPresentarCantidadMonetario',
                        intro: shared.service.AbaxXBRLUtilsService.getValorEtiqueta('EDITOR_XBRL_INTRO_BTN_CANTIDAD_MONETARIO'),
                        position: 'bottom'
                    },

                    {
                        element: '#filtroEtiquetas',
                        intro: shared.service.AbaxXBRLUtilsService.getValorEtiqueta('EDITOR_XBRL_INTRO_FILTRO_ETIQUETAS'),
                        position: 'bottom'
                    },
                    {
                        element: '#contenedorFormatos',
                        intro: shared.service.AbaxXBRLUtilsService.getValorEtiqueta('EDITOR_XBRL_INTRO_CONTENEDOR_FORMATOS'),
                        position: 'left'
                    },
                    {
                        element: '#footerEditor',
                        intro: shared.service.AbaxXBRLUtilsService.getValorEtiqueta('EDITOR_XBRL_INTRO_FOOTER_EDITOR'),
                        position: 'top'
                    }
                ]
            };

            this.$scope.actualizarNumeroDecimalesTipoDatoNumerico = function (aumenta: boolean): void {
                if (aumenta && self.$scope.numeroDecimales < 6) {
                    self.$scope.numeroDecimales++;
                    self.$scope.documentoInstancia.NumeroDecimalesTipoDatoMonetario = self.$scope.numeroDecimales;

                    $('xbrl\\:campo-captura').xbrlCampoCaptura('marcarSucio');
                    $('xbrl\\:campo-captura').xbrlCampoCaptura('update');

                } else if (self.$scope.numeroDecimales > 0) {
                    self.$scope.numeroDecimales--;
                    self.$scope.documentoInstancia.NumeroDecimalesTipoDatoMonetario = self.$scope.numeroDecimales;

                    $('xbrl\\:campo-captura').xbrlCampoCaptura('marcarSucio');
                    $('xbrl\\:campo-captura').xbrlCampoCaptura('update');
                }

            }


            this.$scope.tieneFacultad = function (facultad: number) { return shared.service.AbaxXBRLSessionService.tieneFacultad(facultad); }

            this.$scope.idUsuarioActivo = this.abaxService.idUsuarioActivo;
            this.$scope.idEmisoraActiva = this.abaxService.idEmisoraActiva;
            this.$scope.nombreCompletoUsuarioActivo = this.abaxService.nombreCompletoUsuarioActivo;

            var self = this;
            var scope = self.$scope;

            this.$scope.consultaListadoEnviosInfFinacieraXbrl = function (): void {
                shared.service.AbaxXBRLUtilsService.cambiarEstadoVistasA("inicio.visorXBRL.enviosInformacionFinanciera");
            }

            this.$scope.presentarDocumentosParaComparar = function (): void {

                var modalInstance = self.$modal.open({
                    templateUrl: 'ts/templatesVisor/template-xbrl-presentar-documentos-para-comparar.html?version=' + root.AbaxXBRLConstantesRoot.VERSION_APP.version,
                    controller: ConsultarDocumentosParaCompararController,
                    size: 'lg',
                    resolve: {
                        documentoInstancia: function () {
                            return self.$scope.documentoInstancia;
                        },
                        identificadoresDocumentosPresentados: function () {
                            return self.$scope.identificadoresDocumentosPresentados;
                        }
                    }
                });
                modalInstance.result.then(function (exitoImportacion) {
                    if (exitoImportacion) {

                        self.$scope.establecerFormatoActivo(self.$scope.formatoActivo, true);
                    }
                }, function () {
                    //console.log('Modal dismissed at: ' + new Date());
                });


            };


            this.$scope.regresarDocumentoInstancia = function (): void {

                self.abaxService.setDocumentoInstancia(self.abaxService.getDocumentoInstanciaAntesComparacion());
                self.$scope.establecerFormatoActivo(self.$scope.formatoActivo, true);
                self.$scope.documentoInstancia = self.abaxService.getDocumentoInstancia();
                self.$scope.documentoInstancia.EsComparadorDocumento = false;
                self.abaxService.getDocumentoInstancia().EsComparadorDocumento = false;

            }



            shared.service.AbaxXBRLUtilsService.addEventListenerToRootScope('validaRetornoDeEditorGenerico', '$stateChangeSuccess',
                function (event: ng.IAngularEvent, toState: ng.ui.IState, toParams: {}, fromState: ng.ui.IState, fromParams: {}) {
                    if (scope.documentoInstancia && scope.documentoInstancia != null) {
                        if (fromState.name == "inicio.editorXBRL.editorXbrl") {
                            var to: string = toState.name;
                            if (to.indexOf('inicio.editorXBRL.') == 0 && to != 'inicio.editorXBRL.DocumentoInstanciaCrearDocumentoInstancia1') {
                                self.$state.go('inicio.editorXBRL.DocumentoInstanciaCrearDocumentoInstancia1');
                            }
                        }
                    }
                }
            );

            math.config({ number: 'bignumber' });
            plugins.AngularJQueryBridge.getInstance().establecerAbaxService(this.abaxService);
            plugins.AngularJQueryBridge.getInstance().establecerScopeAngular(this.$scope);


            plugins.XbrlPluginUtils.inicializaCampoBusqueda();

            if (idDocumentoInstancia && idDocumentoInstancia > 0) {
                self.abaxService.cargarDocumentoInstanciaPorId(idDocumentoInstancia, null).then(function (resultadoOperacion: model.ResultadoOperacion) {
                    if (resultadoOperacion.Resultado) {
                        self.presentarDocumento();
                    } else {
                        console.log("Error al cargar documento:" + idDocumentoInstancia);
                    }
                });
            } else if (documentoInstanciaJson) {

                self.abaxService.cargarDocumentoInstanciaPorJson(documentoInstanciaJson).then(function (resultadoOperacion: boolean) {
                    if (resultadoOperacion) {
                        self.$scope.documentoInstancia = self.abaxService.getDocumentoInstancia();
                        self.abaxService.getDocumentoInstancia().EsComparadorDocumento = false;
                        self.abaxService.getDocumentoInstancia().IdEnvioStiv = idDocumentoEnvioStiv;
                        self.presentarDocumento();
                    }
                }).catch(function (error) {
                    console.log(error);
                });
            }
        }

        /**
         * Obtiene la etiqueta del rol que deberá ser presentada al usuario.
         *
         * @return la etiqueta del rol que deberá ser presentada al usuario.
         */
        obtenerEtiquetaRol(rolPresentacion: model.RolPresentacion): string {

            var etiquetaRol = this.abaxService.getDocumentoInstancia().Taxonomia.obtenerEtiquetaDeRol(rolPresentacion.Uri, this.abaxService.getDocumentoInstancia().xbrlIdioma.ClaveIdioma);

            if (etiquetaRol.length == 0) {
                etiquetaRol = rolPresentacion.Nombre;
            }


            return etiquetaRol;
        }

        /**
         * Constructor de la clase AbaxXBRLController
         *
         * @param $scope el scope del controlador
         * @param abaxXBRLServices el servicio de negocio para interactuar con el back end.
         * @param $q el servicio angular para operaciones en cola.
         * @param FullScreen servicio que muestra el documento en pantalla completa
         * @param $state Servicio para el manejo de cambios de estadoen las vistas.
         * @param $timeout El servicio para ejecutar tareas asíncronas
         * @param guardiaNavegacionService el servicio para ser notificado cuando el usuario intenta navegar fuera de la página
         */
        constructor($scope: IDocumentoInstanciaScope, abaxXBRLServices: services.AbaxXBRLServices, $modal: ng.ui.bootstrap.IModalService, $q: ng.IQService, FullScreen: ng.fullscreen.IFullScreen, $state: ng.ui.IStateService, $timeout: ng.ITimeoutService, guardiaNavegacionService: services.GuardianNavegarFueraPaginaService, $http: ng.IHttpService) {
            var self = this;
            this.$scope = $scope;
            this.qService = $q;
            this.abaxService = abaxXBRLServices;
            this.$scope.operacionesCalculo = model.OperacionesCalculoDocumentoInstancia.getInstance();
            this.$modal = $modal;
            this.$scope.FullScreen = FullScreen;
            this.$scope.mostrarListaRoles = true;
            this.$state = $state;
            this.$timeout = $timeout;
            this.guardiaNavegacionService = guardiaNavegacionService;
            this.httpService = $http;

            this.init();
        }
    }
    AbaxXBRLController.$inject = ['$scope', 'abaxXBRLServices', '$modal', '$q', 'Fullscreen', '$state', '$timeout', 'guardiaNavegacionService', '$http'];


    /**
     * Implementación de un controlador para la visualización de envios realizados de información financiera
     * @author Luis Angel Morales Gonzalez
     * @version 1.0
     */
    export class AbaxXBRLInfFinancieraController {

        /** El scope del controlador */
        private $scope: IInformacionFinancieraScope;

        /** El servicio angular parala comunicación con el backend de la aplicación */
        private abaxService: services.AbaxXBRLServices;

        private static _abaxService: services.AbaxXBRLServices;

        /** Servicio para presentar diálogos modales al usuario */
        private $modal: ng.ui.bootstrap.IModalService;

        /** El servicio para encolar solicitudes */
        private qService: ng.IQService;

        /**Servicio para el cambio de estado de las vistas dentro del sitio. **/
        private $state: ng.ui.IStateService = null;

        /** El servicio para ejecutar tareas asíncronas */
        private $timeout: ng.ITimeoutService;

        /** El servicio para ser notificado cuando el usuario intenta navegar fuera de la página actual */
        private guardiaNavegacionService: services.GuardianNavegarFueraPaginaService;

        /** El servicio para comunicarse al servidor remoto */
        private httpService: ng.IHttpService;
        /**
        * Diccionario con la infomración de las taxonomías existentes.
        **/
        private diccionarioTaxonomia: { [EspacioNombresPrincipal: string]: shared.modelos.TaxonomiaXbrlDto } = {};

        /**
        * Diccionario con la infomración de las taxonomías existentes.
        **/
        private diccionarioTaxonomiaPorId: { [IdTaxonomiaXbrl: string]: shared.modelos.TaxonomiaXbrlDto } = {};
        /**
        * Diccionario con la lista de opciones disponibles para las taxonomías según su periodicidad.
        **/
        private diccionarioOpcionesTaxonomiaPorPeriodicidad: { [IdPeriodicidadReporte: string]: Array<shared.modelos.OptionItemDto> } = {};

        /**
        * Lista que contiene la bandera de cada fila para validar si se muestra el icono + o - y mostrar el detalle 
        **/
        private static _toggle: Array<boolean>;

        private limpiaFiltros(): void {

            var $self = this;
            $self.$scope.ejercicioSeleccionado = null;
            $self.$scope.trimestreSeleccionado = null;
            $self.$scope.mensualSeleccionado = null;
            $self.$scope.clavePizarraSeleccionada = null;
            $self.$scope.taxonomiaSeleccionada = null;
            $self.$scope.periodicidadSeleccionada = null;
            $self.$scope.idSeleccionada = null;
            $self.$scope.idSeleccionada = null;
            $self.$scope.ocultarComboTrimestre = true;
            $self.$scope.ocultarComboMensual = true;
            $self.$scope.listadosOpciones.taxonomias = $self.diccionarioOpcionesTaxonomiaPorPeriodicidad[0];
            
        }

        /**
        * Selecciona la periodicidad indicada.
        * @param item Periodicidad requerida.
        **/
        private seleccionaPeriodicidad(item: { Label: string; Value: string }): void {

            var $self = this;
            var $scope = $self.$scope;
            //$self.limpiaFiltros();
            $scope.periodicidadSeleccionada = item.Value;
            
            $scope.ocultarComboTrimestre = item.Value != "1";
            $scope.ocultarComboMensual = item.Value != "2";
            $self.$scope.listadosOpciones.taxonomias = $self.diccionarioOpcionesTaxonomiaPorPeriodicidad[$scope.periodicidadSeleccionada] ?
                $self.diccionarioOpcionesTaxonomiaPorPeriodicidad[$scope.periodicidadSeleccionada] : [];
        }

        /**
        * Obtiene las periodicidades.
        **/
        private obtenPeriodicidades(): ng.IPromise<void> {

            var $self = this;
            var onError = $self.abaxService.abaxXBRLRequestService.getOnErrorDefault();
            var $deferred = shared.service.AbaxXBRLUtilsService.creatPromiseDeferred<void>();
            $self.abaxService.abaxXBRLRequestService.post("DocumentoInstancia/ObtenerPeriodicidades", {})
                .then(function (result: any) {

                    var resultadoOperacion: abaxXBRL.model.ResultadoOperacion = result.data;
                    if (resultadoOperacion.Resultado) {

                        for (var index = 0; index < resultadoOperacion.InformacionExtra.length; index++) {
                            var itemResult = resultadoOperacion.InformacionExtra[index];
                            $self.$scope.periodicidades.push(itemResult);
                        }
                        //$self.seleccionaPeriodicidad($self.$scope.periodicidades[0]);
                    }
                    else {

                        console.error("No fue posible obtener los periodos.");
                    }

                })
                .catch(onError)
                .finally(function () {

                    $deferred.resolve();
                });

            return $deferred.promise;
        }
        /**
        * Obtiene los mese del año.
        **/
        private obtenMeses(): void {

            var $self = this;
            $self.$scope.listaMeses.push({ Value: '1', Label: shared.service.AbaxXBRLUtilsService.getValorEtiqueta('MES_ENERO') }); 
            $self.$scope.listaMeses.push({ Value: '2', Label: shared.service.AbaxXBRLUtilsService.getValorEtiqueta('MES_FEBRERO') }); 
            $self.$scope.listaMeses.push({ Value: '3', Label: shared.service.AbaxXBRLUtilsService.getValorEtiqueta('MES_MARZO') }); 
            $self.$scope.listaMeses.push({ Value: '4', Label: shared.service.AbaxXBRLUtilsService.getValorEtiqueta('MES_ABRIL') }); 
            $self.$scope.listaMeses.push({ Value: '5', Label: shared.service.AbaxXBRLUtilsService.getValorEtiqueta('MES_MAYO') }); 
            $self.$scope.listaMeses.push({ Value: '6', Label: shared.service.AbaxXBRLUtilsService.getValorEtiqueta('MES_JUNIO') }); 
            $self.$scope.listaMeses.push({ Value: '7', Label: shared.service.AbaxXBRLUtilsService.getValorEtiqueta('MES_JULIO') }); 
            $self.$scope.listaMeses.push({ Value: '8', Label: shared.service.AbaxXBRLUtilsService.getValorEtiqueta('MES_AGOSTO') }); 
            $self.$scope.listaMeses.push({ Value: '9', Label: shared.service.AbaxXBRLUtilsService.getValorEtiqueta('MES_SEPTIEMBRE') }); 
            $self.$scope.listaMeses.push({ Value: '10', Label: shared.service.AbaxXBRLUtilsService.getValorEtiqueta('MES_OCTUBRE') }); 
            $self.$scope.listaMeses.push({ Value: '11', Label: shared.service.AbaxXBRLUtilsService.getValorEtiqueta('MES_NOVIEMBRE') }); 
            $self.$scope.listaMeses.push({ Value: '12', Label: shared.service.AbaxXBRLUtilsService.getValorEtiqueta('MES_DICIEMBRE') }); 
            
        }

        /**
        * Obtiene las taxonomías disponibles en el catalog genera.
        * @return Promesa que se cumple cuando se obtiene una respuesta.
        **/
        private obtenTaxonomias(): ng.IPromise<void> {

            var $self = this;
            var $deferred = shared.service.AbaxXBRLUtilsService.creatPromiseDeferred<void>();
            var onError = $self.abaxService.abaxXBRLRequestService.getOnErrorDefault();
            $self.diccionarioTaxonomiaPorId["0"] = new shared.modelos.TaxonomiaXbrlDto().deserialize({
                IdTaxonomiaXbrl: 0,
                Nombre: "Taxonomía desconocida",
                EspacioNombresPrincipal: "",
                IdPeriodicidadReporte: "1",
            });


            $self.abaxService.abaxXBRLRequestService.post("DocumentoInstancia/ObtenerTaxonomias", {})
                .then(function (result: any) {

                    var resultadoOperacion: abaxXBRL.model.ResultadoOperacion = result.data;
                    if (resultadoOperacion.Resultado) {
                        var idTodosPeriodicidad=0;
                        $self.diccionarioOpcionesTaxonomiaPorPeriodicidad[idTodosPeriodicidad] = new Array<shared.modelos.OptionItemDto>();
                        var opcionesTodosTaxonomias = $self.diccionarioOpcionesTaxonomiaPorPeriodicidad[idTodosPeriodicidad];
                        for (var index = 0; index < resultadoOperacion.InformacionExtra.length; index++) {

                            var itemResult = new shared.modelos.TaxonomiaXbrlDto().deserialize(resultadoOperacion.InformacionExtra[index]);
                            if (!$self.diccionarioTaxonomia[itemResult.EspacioNombresPrincipal]) {

                                $self.diccionarioTaxonomia[itemResult.EspacioNombresPrincipal] = itemResult;
                                $self.diccionarioTaxonomiaPorId[itemResult.IdTaxonomiaXbrl] = itemResult;

                                var idPeriodicidadReporte = itemResult.IdPeriodicidadReporte.toString();
                                if (!$self.diccionarioOpcionesTaxonomiaPorPeriodicidad[idPeriodicidadReporte]) {
                                    $self.diccionarioOpcionesTaxonomiaPorPeriodicidad[idPeriodicidadReporte] = new Array<shared.modelos.OptionItemDto>();
                                }
                                
                                var opcionesTaxonomia = $self.diccionarioOpcionesTaxonomiaPorPeriodicidad[idPeriodicidadReporte];
                                var opcion = new shared.modelos.OptionItemDto().deserialize({ Value: itemResult.IdTaxonomiaXbrl.toString(), Label: itemResult.Nombre });
                                opcionesTaxonomia.push(opcion);
                                opcionesTodosTaxonomias.push(opcion);   
                            }
                        }
                        $self.$scope.listadosOpciones.taxonomias = $self.diccionarioOpcionesTaxonomiaPorPeriodicidad[0];
                    }
                    else {

                        console.error("No fue posible obtener las taxonomías.");
                    }

                })
                .catch(onError)
                .finally(function () {

                    $deferred.resolve();
                });

            return $deferred.promise;
        }

        /**
        * Obtiene las trimestres.
        **/
        private obtenEjercicios(): ng.IPromise<void> {

            var $self = this;
            var onError = $self.abaxService.abaxXBRLRequestService.getOnErrorDefault();
            var $deferred = shared.service.AbaxXBRLUtilsService.creatPromiseDeferred<void>();
            $self.abaxService.abaxXBRLRequestService.post("DocumentoInstancia/ObtenerEjercicios", {})
                .then(function (result: any) {

                    var resultadoOperacion: abaxXBRL.model.ResultadoOperacion = result.data;
                    if (resultadoOperacion.Resultado) {

                        for (var index = 0; index < resultadoOperacion.InformacionExtra.length; index++) {
                            var itemResult = resultadoOperacion.InformacionExtra[index];
                            $self.$scope.listaEjercicios.push(itemResult);
                        }
                    }
                    else {

                        console.error("No fue posible obtener los ejercicios.");
                    }

                })
                .catch(onError)
                .finally(function () {

                    $deferred.resolve();
                });

            return $deferred.promise;
        }

        /**
        * Obtiene las trimestres.
        **/
        private obtenerTrimestres(): ng.IPromise<void> {

            var $self = this;
            var itemResult = new Array<string>();
            var onError = $self.abaxService.abaxXBRLRequestService.getOnErrorDefault();
            var $deferred = shared.service.AbaxXBRLUtilsService.creatPromiseDeferred<void>();
            $self.abaxService.abaxXBRLRequestService.post("DocumentoInstancia/ObtenerTrimestres", {})
                .then(function (result: any) {

                    var resultadoOperacion: abaxXBRL.model.ResultadoOperacion = result.data;
                    if (resultadoOperacion.Resultado) {

                        for (var index = 0; index < resultadoOperacion.InformacionExtra.length; index++) {
                            var itemResult = resultadoOperacion.InformacionExtra[index];
                            $self.$scope.listaTrimestres.push(itemResult);
                        }
                    }
                    else {

                        console.error("No fue posible obtener los trimestres.");
                    }

                })
                .catch(onError)
                .finally(function () {

                    $deferred.resolve();
                });

            return $deferred.promise;
        }
        /**
        * Configura las opciones del data table para manejar del lado del servidor el procesamiento de los datos a mostrar.
        **/
        private configurarOpcionesDataTable() {
            var self = this;
            var scope = self.$scope;
            var onBeforeSend = function (xhr: any, settings: any) {
                var params: { [id: string]: any } = {};

                var taxonomia = scope.taxonomiaSeleccionada;
                var clavePizarra = scope.clavePizarraSeleccionada;
                var ejercicio = scope.ejercicioSeleccionado;
                var trimestre = scope.trimestreSeleccionado;
                var mensual = scope.mensualSeleccionado;

                var periodicidad = scope.periodicidadSeleccionada

                if (taxonomia && taxonomia != null) {
                    params["taxonomia"] = taxonomia;
                }
                if (clavePizarra && clavePizarra != null) {
                    params["clavePizarra"] = clavePizarra;
                }
                if (ejercicio && ejercicio != null) {
                    params["ejercicio"] = ejercicio[0];
                }
                if (trimestre && trimestre != null) {
                    params["trimestre"] = trimestre[0];
                }
                if (mensual && mensual != null) {
                    params["mensual"] = mensual;
                }
                if (periodicidad && periodicidad != null) {
                    params["periodicidad"] = periodicidad;
                }

                settings.data += '&' + $.param(params);
            };
            var opcionesDt = scope.opcionesDataTable;
            var onOpcionesSucess = function (opcioensAjax) {
                opcionesDt.withOption("paging", true);
                opcionesDt.withOption("searching", false);
                opcionesDt.withOption("sDom", "<'row'<'col-sm-6'l><'col-sm-6'f>r>t<'row'<'col-sm-6'i><'col-sm-6'p>>");
                opcionesDt.withPaginationType('simple_numbers');
                opcionesDt.withOption("order", [[0, 'desc']]);
                opcionesDt.withOption("aLengthMenu", [
                    [10, 20, 30, 50],
                    [10, 20, 30, 50]
                ]);
                opcionesDt.withOption('rowCallback', function () {

                });

                opcioensAjax.url = AbaxXBRLConstantes.CONSULTA_ENVIOS_INFORMACION;
                opcioensAjax.beforeSend = onBeforeSend;
                opcioensAjax.dataSrc = function (response: any): any {
                    var data = response.data;
                    scope._toggle=[];
                    for (var i = 0; i < data.length; i++) {
                        var nombre = data[i][5];
                        var noRegistros = data[i][12]; 
                        var id = data[i][0];
                        data[i][0] = '<a href=\"javascript: abaxXBRL.controller.AbaxXBRLInfFinancieraController.mostrarDocumentoInstanciaDataTable(\'' + nombre + '\',\'' + id +'\');\"><i class=\"fa fa-search-plus text-muted\" style=\"color:#18AFA4\"></i></a>';
                        if (noRegistros=='1'){
                            data[i][1] ='';
                        }else{
                            data[i][1] = '<a href=\"javascript: abaxXBRL.controller.AbaxXBRLInfFinancieraController.cambiarToggle('+i+','+id+');\"><i id=\'row_' + i +'\' class=\"glyphicon glyphicon-plus\" style=\"color:#18AFA4\"></i></a>';
                        }
                        scope._toggle[i]=false;
    
                    }
                    return data;
                };
                opcionesDt.withOption('serverSide', true);
                opcionesDt.withOption('ajax', opcioensAjax);
                opcionesDt.withOption("aLengthMenu", [
                    [10, 20, 30, 50],
                    [10, 20, 30, 50]
                ]);
                shared.service.AbaxXBRLUtilsService.getLasDataTableInstance().then(function (instance: any) {
                    scope.dataTableInstance = instance;
                });
            }

            self.abaxService.abaxXBRLRequestService.generarOpcionesAjax().then(onOpcionesSucess);
        }

        /**
        * Obtiene que manda a llamar al detalle de los reenvios del elemento seleccionado  
        **/    
        private obtenerDetalle(){
            var self = this;
            var btnDetalle=$('#btnDetalle'); 
            var idFila= btnDetalle.attr("idfila");
            var idDocumento= btnDetalle.attr("iddocumento");
            self.$scope.idSeleccionada = idDocumento;
            
            for (var i=0; i<=$('#tablaInfEnviada > tbody > tr').length-1;i++){
                
                if (idFila !=i.toString()){
                    var row = $('#row_'+i.toString());       
                    row.removeClass('glyphicon glyphicon-minus');
                    row.addClass('glyphicon glyphicon-plus');
                    $('.detail_'+i).remove();
                    AbaxXBRLInfFinancieraController._toggle[i] = false;
                }
            }

            self.configurarOpcionesDataTableReenvios(idDocumento,idFila);
        }

        /**
        * Configura las opciones del data table para manejar del lado del servidor el procesamiento de los datos 
        * para mostrar la lista de reenvio de un documento seleccionado .
        **/
        private configurarOpcionesDataTableReenvios(idDocumento : string,idFila : string) {
            var self = this;
            var scope = self.$scope;
            var onBeforeSend = function (xhr: any, settings: any) {
                                    var params: { [id: string]: any } = {};
                                        params["id"] = scope.idSeleccionada;
                                    settings.data += '&' + $.param(params);
                                };
            var opcionesDt = scope.opcionesDataTableDetail;
            var onOpcionesSucess = function (opcioensAjax) {
                opcioensAjax.url = AbaxXBRLConstantes.CONSULTA_REENVIOS_INFORMACION;
                opcioensAjax.beforeSend = onBeforeSend;
                opcioensAjax.dataSrc = function (response: any): any {
                     var data = response.data;
                     var filas = '';
                     var existeInformacion=false;   
                     for (var f = 0; f < data.length; f++) { 
                         existeInformacion = true;
                        var nombre = data[f][5];
                        var noRegistros = data[f][12]; 
                        var id = data[f][0];
                         filas += '<tr role="row" class="odd detail_'+idFila+' renvio" >';      
                         var celda = '<td><a href=\"javascript: abaxXBRL.controller.AbaxXBRLInfFinancieraController.mostrarDocumentoInstanciaDataTable(\'' + nombre + '\',\'' + id +'\');\"><i class=\"fa fa-search-plus text-muted\" style=\"color:#18AFA4\"></i></a></td>';
                        for (var c = 1; c <= 5; c++) {    
                            celda += '<td>' + data[f][c] +'</td>' ;
                         }
                        filas += celda + '</tr>'; 
                     }  
                    if (existeInformacion){
                        $('#tablaInfEnviada > tbody > tr').eq(Number(idFila)).after(filas);
                    }
                    data = null;
                    return data;
                    
                };
               
                opcionesDt.withOption('serverSide', true);
                opcionesDt.withOption('noCacheParam', new Date().getTime());
                opcionesDt.withOption('ajax', opcioensAjax);
                opcionesDt.withOption("aLengthMenu", [
                    [100],
                    [100]
                ]);
                shared.service.AbaxXBRLUtilsService.getLasDataTableInstance().then(function (instance: any) {
                    scope.dataTableInstanceDetail = instance;
                });
            }

            self.abaxService.abaxXBRLRequestService.generarOpcionesAjax().then(onOpcionesSucess);
        }

        private refreshData(): void {
            var scope = this.$scope;
            if (!scope.dataTableInstance) {
                shared.service.AbaxXBRLUtilsService.getLasDataTableInstance().then(function (instance: any) {
                    scope.dataTableInstance = instance;
                });
            }
            if (scope.dataTableInstance) {
                scope.dataTableInstance.DataTable.ajax.reload();
            }
        }

       private cambioPeriodicidad():void{
          var $self = this;
            if($self.$scope.periodicidadSeleccionada != null){
                var periodicidades = $self.$scope.periodicidades;
 
                var option = null;
                for (var i=0;i<=periodicidades.length;i++){
                    if (periodicidades[i].Value ==$self.$scope.periodicidadSeleccionada){
                        option = periodicidades[i];
                        break;
                    }
                }
            
                $self.seleccionaPeriodicidad(option);
            }else{
                $self.$scope.ocultarComboTrimestre = true;
                $self.$scope.ocultarComboMensual = true;
                $self.$scope.listadosOpciones.taxonomias = $self.diccionarioOpcionesTaxonomiaPorPeriodicidad[0] ?
                $self.diccionarioOpcionesTaxonomiaPorPeriodicidad[0] : [];
            }
       } 

        public static cambiarToggle(idFila: number,idDocumento:number): void {
           var row = $('#row_'+idFila.toString());   
            var btnDetalle = $('#btnDetalle');
           var toggle = AbaxXBRLInfFinancieraController._toggle;
            toggle[idFila] = !toggle[idFila];
 
            if (!toggle[idFila]){
                row.removeClass('glyphicon glyphicon-minus');
                row.addClass('glyphicon glyphicon-plus');
                $('.detail_'+idFila).remove();
            }else{
                row.removeClass('glyphicon glyphicon-plus');
                row.addClass('glyphicon glyphicon-minus');
                btnDetalle.attr('iddocumento',idDocumento.toString());
                btnDetalle.attr('idfila',idFila.toString());
                btnDetalle.click();
            }
        }
        
        public static mostrarDocumentoInstancia(nombreArchivo: string, idEnvio: string): void {

            var self = this;
            $.isLoading({
                text: "Cargando Documento"
            });

            var onSucess = function (result: any) {
                if (result.status && result.status == 204) {
                    $.isLoading('hide');
                    alert("No se tiene archivo xbrl registrado para mostrar.");
                } else {
                    try {
                        shared.service.AbaxXBRLSessionService.setAtributoSesion("documentoInstanciaJson", result.data);
                        shared.service.AbaxXBRLSessionService.setAtributoSesion("nombreArchivo", nombreArchivo);
                        shared.service.AbaxXBRLSessionService.setAtributoSesion("idDocumentoEnvioStiv", idEnvio);


                        shared.service.AbaxXBRLUtilsService.cargaDefinicionModulo('abaxVisorXBRLViewer').then(function () {
                            $.isLoading('hide');              
                            shared.service.AbaxXBRLUtilsService.cambiarEstadoVistasA("inicio.visorXBRL.visorXbrl");
             
                        });
                    } catch (error) {
                        $.isLoading('hide');
                        alert("El archivo xbrl que se intenta cargar es incorrecto.");
                    }

                }
            }
            var abaxService = AbaxXBRLInfFinancieraController._abaxService;

            var onError = abaxService.abaxXBRLRequestService.getOnErrorDefault();

            abaxService.abaxXBRLRequestService.post("DocumentoInstancia/BajarArchivoDocumentoInstancia", { idDocIns: idEnvio, tipoArchivo: 4 }).then(onSucess, onError);
            //self.abaxService.abaxXBRLRequestService.post("DocumentoInstancia/BajarArchivoDocumentoInstancia", { idDocIns: 117, tipoArchivo: 4 }).then(onSucess, onError);
        }




        public static mostrarDocumentoInstanciaDataTable(nombreArchivo: string, idEnvio: string): void {

            var url = location.protocol + '//' + location.host + location.pathname;
            url += "?nombreArchivo=" + nombreArchivo + "&idEnvio=" + idEnvio;
            //if (AbaxXBRLController.DOCUMENT_WINDOW) {

            //    AbaxXBRLController.DOCUMENT_WINDOW = AbaxXBRLController.DOCUMENT_WINDOW.open(url);

            //} else {
            //    AbaxXBRLController.DOCUMENT_WINDOW = window.open(url);
            //}
            window.open(url);
        }


        /**
         * Inicializa el controlador.
         */
        private init(): void {
            var self = this;
            var $util = shared.service.AbaxXBRLUtilsService;
            plugins.XbrlPluginUtils.ocultarLoaderGeneral();

            this.$scope.cargandoEnviosInfFinanciera = true;

            this.$scope.seleccionaPeriodicidad = $.proxy(self.seleccionaPeriodicidad, self);
            this.$scope.cambioPeriodicidad = $.proxy(self.cambioPeriodicidad, self);
            this.$scope.obtenerDetalle = $.proxy(self.obtenerDetalle, self);
            this.$scope.limpiaFiltros = $.proxy(self.limpiaFiltros, self);

            this.$scope.ocultarComboTrimestre = true;
            this.$scope.ocultarComboMensual = true;


            //Se carga el listado de documentos enviados
            //Invocacion para la carga de documentos instancia

            var onSucessPropiedades = function (result: any) {
                var resultadoOperacion: abaxXBRL.model.ResultadoOperacion = result.data;
                if (resultadoOperacion.Resultado) {
                    self.$scope.version = resultadoOperacion.InformacionExtra["Version"];
                }
            }

            var $self = this;
            $self.$scope.listadosOpciones = { taxonomias: [] };
            $self.$scope.listaEjercicios = [];
            $self.$scope.listaTrimestres = [];
            $self.$scope.periodicidades = new Array<{ Value: string; Label: string }>();
            $self.$scope.listaMeses = new Array<{ Value: string; Label: string }>();
            $self.obtenMeses();

            var onSucess = function (result: any) {

                var resultadoOperacion: abaxXBRL.model.ResultadoOperacion = result.data;

                if (resultadoOperacion.Resultado) {
                    self.abaxService.listarDocumentosEnviados(resultadoOperacion.InformacionExtra, $self.diccionarioTaxonomiaPorId);

                    self.$scope.documentosUsuario = [];

                    for (var indiceDocumentoEnviado in self.abaxService.documentosInstanciaEnviados) {
                        var documentoEnviado = self.abaxService.documentosInstanciaEnviados[indiceDocumentoEnviado];
                        self.$scope.documentosUsuario.push(documentoEnviado);
                    }

                    self.ListarEjerciciosTrimestres();
                    self.$scope.cargandoEnviosInfFinanciera = false;
                } else {
                    alert("No fue posible cargar el el listado de envios de informacion financiera.");
                }
            }
            var onError = this.abaxService.abaxXBRLRequestService.getOnErrorDefault();

            $self.obtenTaxonomias().finally(function () {

                $self.obtenPeriodicidades().then(function () {

                    $self.obtenEjercicios().then(function () {

                        $self.obtenerTrimestres().then(function () {

                            $self.$scope.cargandoEnviosInfFinanciera = false;
                            $self.$scope.periodicidadSeleccionada =null;
                            $self.configurarOpcionesDataTable();
                            /*
                            $self.abaxService.abaxXBRLRequestService.post("DocumentoInstancia/ConsultarEnviosInformacion", {}).then(onSucess, onError).finally(function () {
        
                                shared.service.AbaxXBRLUtilsService.setTimeout(function () {
        
                                    $self.ConsultarEnviosInformacion();
                                });
                            });
                            */
                        });
                    });
                });
            });

            $self.abaxService.abaxXBRLRequestService.post("DocumentoInstancia/ObtenerPropiedadesConfiguracion", {}).then(onSucessPropiedades, onError);
            this.$scope.mostrarDocumentoInstancia = AbaxXBRLInfFinancieraController.mostrarDocumentoInstancia;




            this.$scope.consultarEnvioInformacion = function (): void {

                self.$scope.documentosUsuario = [];


                self.$scope.documentosUsuario.length

                for (var indiceDocumentoEnviado in self.abaxService.documentosInstanciaEnviados) {
                    var documentoEnviado = self.abaxService.documentosInstanciaEnviados[indiceDocumentoEnviado];

                    if ((self.$scope.ejercicioSeleccionado.length > 0 && self.$scope.ejercicioSeleccionado == documentoEnviado.Ejercicio) ||
                        (self.$scope.trimestreSeleccionado.length > 0 && self.$scope.trimestreSeleccionado == documentoEnviado.Periodo) ||
                        (self.$scope.mensualSeleccionado.length > 0) ||
                        (self.$scope.clavePizarraSeleccionada.length > 0 && self.$scope.clavePizarraSeleccionada == documentoEnviado.Emisora) ||
                        (self.$scope.trimestreSeleccionado.length == 0 && self.$scope.ejercicioSeleccionado.length == 0 && self.$scope.periodicidadSeleccionada.length == 0) ||
                        (self.$scope.periodicidadSeleccionada.length > 0 && self.$scope.periodicidadSeleccionada == documentoEnviado.Periodicidad)) {

                        self.$scope.documentosUsuario.push(documentoEnviado);

                    }
                }

            }


            this.$scope.$watch('clavePizarraSeleccionada', function () {
                self.refreshData();
            });


            this.$scope.$watch('ejercicioSeleccionado', function () {
                self.refreshData();
            });

            this.$scope.$watch('taxonomiaSeleccionada', function () {
                self.refreshData();
            });

            this.$scope.$watch('trimestreSeleccionado', function () {
                self.refreshData();
            });

            this.$scope.$watch('mensualSeleccionado', function () {
                self.refreshData();
            });

            this.$scope.$watch('periodicidadSeleccionada', function () {
                self.refreshData();
            });

            var dtOptions = shared.service.AbaxXBRLUtilsService.creaOpcionesDataTable();
            this.$scope.opcionesDataTable = dtOptions;

            var dtOptionsDetail = shared.service.AbaxXBRLUtilsService.creaOpcionesDataTable();
            this.$scope.opcionesDataTableDetail = dtOptionsDetail;

            /*
            this.$scope.opcionesDataTable.withOption("aLengthMenu", [
                [10,20, 30, 50],
                [10,20, 30, 50]
            ]);
            this.$scope.opcionesDataTable.withOption("pageLength", 10);
            */
        }


        /**
        * Realiza la consulta con los filtros destinados
        */
        private ConsultarEnviosInformacion(): void {

            var $self = this;
            $self.$scope.cargandoEnviosInfFinanciera = true;
            this.$scope.documentosUsuario = [];
            for (var indiceDocumentoEnviado in this.abaxService.documentosInstanciaEnviados) {
                var documentoEnviado = this.abaxService.documentosInstanciaEnviados[indiceDocumentoEnviado];

                if (!this.$scope.clavePizarraSeleccionada || this.$scope.clavePizarraSeleccionada == "" || (documentoEnviado.Emisora && documentoEnviado.Emisora.toUpperCase().indexOf(this.$scope.clavePizarraSeleccionada.toUpperCase()) >= 0)) {
                    if (!this.$scope.ejercicioSeleccionado || this.$scope.ejercicioSeleccionado == "" || (documentoEnviado.Ejercicio && documentoEnviado.Ejercicio == this.$scope.ejercicioSeleccionado)) {
                        if (!this.$scope.trimestreSeleccionado || this.$scope.trimestreSeleccionado == "" || (documentoEnviado.Periodo && documentoEnviado.Periodo == this.$scope.trimestreSeleccionado)) {
                            if (!this.$scope.taxonomiaSeleccionada || this.$scope.taxonomiaSeleccionada == "" || (documentoEnviado.Taxonomia.IdTaxonomiaXbrl > -1 && documentoEnviado.Taxonomia.IdTaxonomiaXbrl.toString() == this.$scope.taxonomiaSeleccionada)) {
                                if (!this.$scope.periodicidadSeleccionada || this.$scope.periodicidadSeleccionada == "" || documentoEnviado.Periodicidad == this.$scope.periodicidadSeleccionada) {

                                    this.$scope.documentosUsuario.push(documentoEnviado);
                                }
                            }
                        }
                    }
                }
            }

            shared.service.AbaxXBRLUtilsService.setTimeout(function () {
                $self.$scope.cargandoEnviosInfFinanciera = false;
            });
        }

        /**
        * Lista todos los ejercicios enviados por las emisoras
        */
        public ListarEjerciciosTrimestres(): void {

            var $self = this;
            this.$scope.ejercicios = new Array<string>();
            this.$scope.trimestres = new Array<string>();

            for (var indiceDocumento in this.$scope.documentosUsuario) {

                var documento = this.$scope.documentosUsuario[indiceDocumento];
                var existeEjercicio = false;
                var existeTrimestre = false;
                var existeTaxonomia = false;

                for (var indiceEjercicio in this.$scope.ejercicios) {
                    if (this.$scope.ejercicios[indiceEjercicio] == documento.Ejercicio) {
                        existeEjercicio = true;
                        break;
                    }
                }


                //for (var indiceTaxonomia in this.$scope.taxonomias) {
                //    if (this.$scope.taxonomias[indiceTaxonomia] == documento.NombreTaxonomia) {
                //        existeTaxonomia = true;
                //        break;
                //    }
                //}


                for (var indiceTrimestre in this.$scope.trimestres) {
                    if (this.$scope.trimestres[indiceTrimestre] == documento.Periodo) {
                        existeTrimestre = true;
                        break;
                    }
                }


                if (!existeEjercicio)
                    this.$scope.ejercicios.push(documento.Ejercicio);

                if (!existeTrimestre)
                    this.$scope.trimestres.push(documento.Periodo);

                //if (!existeTaxonomia)
                //    this.$scope.taxonomias.push(documento.NombreTaxonomia);


            }

        }







        /**
         * Constructor de la clase AbaxXBRLController
         *
         * @param $scope el scope del controlador
         * @param abaxXBRLServices el servicio de negocio para interactuar con el back end.
         * @param $q el servicio angular para operaciones en cola.
         * @param FullScreen servicio que muestra el documento en pantalla completa
         * @param $state Servicio para el manejo de cambios de estadoen las vistas.
         * @param $timeout El servicio para ejecutar tareas asíncronas
         * @param guardiaNavegacionService el servicio para ser notificado cuando el usuario intenta navegar fuera de la página
         */
        constructor($scope: IInformacionFinancieraScope, abaxXBRLServices: services.AbaxXBRLServices, $modal: ng.ui.bootstrap.IModalService, $q: ng.IQService, FullScreen: ng.fullscreen.IFullScreen, $state: ng.ui.IStateService, $timeout: ng.ITimeoutService, guardiaNavegacionService: services.GuardianNavegarFueraPaginaService, $http: ng.IHttpService) {
            var self = this;
            this.$scope = $scope;
            this.qService = $q;
            this.abaxService = abaxXBRLServices;
            AbaxXBRLInfFinancieraController._abaxService = abaxXBRLServices;
            AbaxXBRLInfFinancieraController._toggle = new Array<boolean>();
            this.$scope.operacionesCalculo = model.OperacionesCalculoDocumentoInstancia.getInstance();
            this.$modal = $modal;
            this.$scope.FullScreen = FullScreen;
            this.$scope.mostrarListaRoles = true;
            this.$state = $state;
            this.$timeout = $timeout;
            this.guardiaNavegacionService = guardiaNavegacionService;
            this.httpService = $http;

            this.init();




        }
    }
    AbaxXBRLInfFinancieraController.$inject = ['$scope', 'abaxXBRLServices', '$modal', '$q', 'Fullscreen', '$state', '$timeout', 'guardiaNavegacionService', '$http'];


    /*
    * Interfaz para recibir parámetros en el controller
    */
    export interface AbaxControllerRouteParams extends ng.route.IRouteParamsService {
        idDocumentoInstancia: string;
        version: string;
    }
    /**
     * Implementación de un controlador para la operación de guardar una versión del documento instancia XBRL
     *
     * @author José Antonio Huizar Moreno
     * @version 1.0
     */
    export class GuardarDocumentoController {

        /** El scope del controlador para guardar versiones del documento instancia */
        private $scope: IGuardarDocumentoInstanciaScope;

        /** El servicio angular parala comunicación con el backend de la aplicación */
        private abaxService: services.AbaxXBRLServices;

        /**
         * Constructor de la clase AbaxXBRLController
         *
         * @param $scope el scope del controlador
         * @param abaxXBRLServices el servicio de negocio para interactuar con el back end.
         */
        constructor($scope: IGuardarDocumentoInstanciaScope, $modalInstance: ng.ui.bootstrap.IModalServiceInstance,
            abaxXBRLServices: services.AbaxXBRLServices, documentoInstancia: abaxXBRL.model.DocumentoInstanciaXbrl) {
            this.$scope = $scope;
            this.abaxService = abaxXBRLServices;
            var self = this;

            this.$scope.resultadoOperacion = null;
            this.$scope.guardado = false;
            this.$scope.documentoInstancia = documentoInstancia;
            this.$scope.cerrarDialogo = function (): void {
                self.$scope.guardado = false;
                self.$scope.resultadoOperacion = null;
                $modalInstance.close();
            };

            this.$scope.guardarDocumento = function (isValid: boolean): void {
                if (isValid) {
                    $.isLoading({
                        text: shared.service.AbaxXBRLUtilsService.getValorEtiqueta('EDITOR_XBRL_GUARDANDO_ESPERE')
                    });
                    abaxXBRLServices.guardarDocumentoInstancia().then(function (resultadoOperacion: abaxXBRL.model.ResultadoOperacion) {
                        self.$scope.resultadoOperacion = resultadoOperacion;
                        if (resultadoOperacion.Resultado) {
                            abaxXBRLServices.getDocumentoInstancia().IdDocumentoInstancia = resultadoOperacion.InformacionExtra.idDocumentoInstancia;
                            abaxXBRLServices.getDocumentoInstancia().Version = resultadoOperacion.InformacionExtra.version;
                            abaxXBRLServices.getDocumentoInstancia().PendienteGuardar = false;
                        }

                    }, function (resultadoOperacion: abaxXBRL.model.ResultadoOperacion) {
                        self.$scope.resultadoOperacion = resultadoOperacion;
                        console.log(resultadoOperacion);
                    }).finally(function () {
                        $.isLoading('hide');
                        self.$scope.guardado = true;
                    });
                }
            };
        }
    }
    GuardarDocumentoController.$inject = ['$scope', '$modalInstance', 'abaxXBRLServices', 'documentoInstancia'];


    /**
     * Implementación de un controlador para la operación de exportar un documento instancia en el formato definido
     *
     * @author Luis Angel Morales Gonzalez
     * @version 1.0
     */
    export class ExportarDocumentoController {

        /** El scope del controlador para exportar un documento instancia */
        private $scope: IExportarDocumentoInstanciaScope;

        /** El servicio angular parala comunicación con el backend de la aplicación */
        private abaxService: services.AbaxXBRLServices;
        /**
        * Servicio para el envío de solicitudes al servidor.
        **/
        private abaxXBRLRequestService: shared.service.AbaxXBRLRequestService;
        /**
         * Constructor de la clase AbaxXBRLController
         *
         * @param $scope el scope del controlador
         * @param $modalInstance la pantalla modal del documento instancia
         * @param abaxXBRLServices el servicio de negocio para interactuar con el back end.
         * @param documentoInstancia documento que se tiene trabajando
         */
        constructor($scope: IExportarDocumentoInstanciaScope, $modalInstance: ng.ui.bootstrap.IModalServiceInstance, abaxXBRLServices: services.AbaxXBRLServices, documentoInstancia: abaxXBRL.model.DocumentoInstanciaXbrl, abaxXBRLRequestService: shared.service.AbaxXBRLRequestService) {
            this.$scope = $scope;
            this.abaxService = abaxXBRLServices;
            this.$scope.formatoExportaDocumentoInstancia = TipoFormato.FormatoExcel;
            this.abaxXBRLRequestService = abaxXBRLRequestService;
            var self = this;

            this.$scope.documentoInstancia = documentoInstancia;

            this.$scope.exportarExcel = true;
            var desactivar_excel = abaxXBRLServices.getDefinicionPlantilla().obtenerVariablePorId("desactivar_excel");
            if (desactivar_excel && desactivar_excel == "true") {

                this.$scope.exportarExcel = false;
                this.$scope.formatoExportaDocumentoInstancia = TipoFormato.FormatoXbrl;
            }



            this.$scope.cerrarDialogo = function (): void {
                $modalInstance.close();
            };

            this.$scope.exportarDocumentoInstancia = function (): void {


                var tipoArchivo = 1;
                if (self.$scope.formatoExportaDocumentoInstancia == TipoFormato.FormatoPdf) {
                    tipoArchivo = 2;
                } else if (self.$scope.formatoExportaDocumentoInstancia == TipoFormato.FormatoXbrl) {
                    tipoArchivo = 5;
                } else if (self.$scope.formatoExportaDocumentoInstancia == TipoFormato.FormatoWord) {
                    tipoArchivo = 6;
                }

                var data = {
                    idDocIns: self.abaxService.getDocumentoInstancia().IdDocumentoInstancia,
                    tipoArchivo: tipoArchivo,
                    nombreArchivo: self.abaxService.nombreArchivo
                };
                var modal = $modalInstance;

                var onSucess = function (result: any) {
                    console.log(result);
                }

                $.fileDownload("DocumentoInstancia/BajarArchivoDocumentoInstancia", {
                    httpMethod: "POST",
                    data: data
                });

                $modalInstance.close();
            }

        }
    }
    ExportarDocumentoController.$inject = ['$scope', '$modalInstance', 'abaxXBRLServices', 'documentoInstancia', 'abaxXBRLRequestService'];


    /**
     * Implementación de un controlador para la operación de importar un documento plantilla para las notas 
     * de un documento instancia
     *
     * @author Luis Angel Morales Gonzalez
     * @version 1.0
     */
    export class ImportarNotasDocumentoInstanciaController {

        /** El scope del controlador para importar notas de un documento instancia */
        private $scope: IImportarNotasDocumentoInstanciaScope;

        /** El servicio angular parala comunicación con el backend de la aplicación */
        private abaxService: services.AbaxXBRLServices;

        /**
        * El servicio que permite el upload del archivo importado
        */
        private $upload: upload.IUploadService;


        /**
         * Constructor de la clase ImportarNotasDocumentoInstanciaController
         *
         * @param $scope el scope del controlador
         * @param $modalInstance la pantalla modal del documento instancia
         * @param abaxXBRLServices el servicio de negocio para interactuar con el back end.
         * @param documentoInstancia documento que se tiene trabajando
         * @param $upload servicio para la cara de archivos
         */
        constructor($scope: IImportarNotasDocumentoInstanciaScope, $modalInstance: ng.ui.bootstrap.IModalServiceInstance, abaxXBRLServices: services.AbaxXBRLServices, documentoInstancia: abaxXBRL.model.DocumentoInstanciaXbrl, $upload: upload.IUploadService) {
            this.$scope = $scope;
            this.$upload = $upload;

            this.abaxService = abaxXBRLServices;
            var self = this;

            this.$scope.documentoInstancia = documentoInstancia;
            this.$scope.extensionesPermitidas = "*.docx";

            var aceptar = shared.service.AbaxXBRLUtilsService.getValorEtiqueta('EDITOR_XBRL_ACEPTAR');

            this.$scope.cerrarDialogo = function (): void {
                $modalInstance.close();
            };

            this.$scope.obtenerPlantillaNotaDocumentoInstancia = function (): void {

                $.isLoading({ text: shared.service.AbaxXBRLUtilsService.getValorEtiqueta('EDITOR_XBRL_PREPARANDO_DESCARGA') });
                var url = 'DocumentoInstancia/ObtenerPlantillaNotasDocumentoInstancia';

                var data = {
                    espacioNombresPrincipal: self.$scope.documentoInstancia.EspacioNombresPrincipal
                };

                $.fileDownload(url, {
                    httpMethod: "POST",
                    data: data,
                    successCallback: function (url) {
                        $.isLoading('hide');
                    },
                    failCallback: function (response, url) {

                        $.isLoading('hide');
                        $modalInstance.close();
                        $.prompt(shared.service.AbaxXBRLUtilsService.getValorEtiqueta('EDITOR_XBRL_ERROR_DESCARGA'),
                            {
                                title: shared.service.AbaxXBRLUtilsService.getValorEtiqueta('EDITOR_XBRL_DESCARGA_PLANTILLA'),
                                buttons: { aceptar: true }
                            });
                    }
                });
            };

            this.$scope.importarNotasDocumentoInstancia = function (): void {

                if (!self.$scope.archivoNotasDocumentoInstanciaImportado || self.$scope.archivoNotasDocumentoInstanciaImportado == null) {
                    alert(shared.service.AbaxXBRLUtilsService.getValorEtiqueta('EDITOR_XBRL_SELECCIONAR_ARCHIVO_NOTAS'));
                    return;
                }


                var fileConfig: upload.IFileUploadConfig = new MyFileConfig();
                fileConfig.file = self.$scope.archivoNotasDocumentoInstanciaImportado[0];
                fileConfig.fileName = self.$scope.archivoNotasDocumentoInstanciaImportado[0].name;
                fileConfig.data = { "documentoInstancia": $.toJSON(self.$scope.documentoInstancia) };
                fileConfig.method = "POST";
                fileConfig.url = "DocumentoInstancia/ImportarNotasDocumentoInstancia";
                fileConfig.transformRequest = angular.identity,
                    fileConfig.headers = { 'Authorization': 'Bearer ' + shared.service.AbaxXBRLSessionService.getSesionInmediate().Token };

                var exitoImportacion = false;

                $.isLoading({
                    text: shared.service.AbaxXBRLUtilsService.getValorEtiqueta('EDITOR_XBRL_IMPORTANDO_NOTAS')
                });
                self.$upload.upload(fileConfig).progress(
                    function (progreso: any) {

                        self.$scope.cargado = progreso.loaded;
                        self.$scope.total = progreso.total;
                        if (self.$scope.cargado > 0) {
                            self.$scope.porcentajeCargado = Math.round((self.$scope.cargado / self.$scope.total) * 100);
                        }
                    }
                ).then(
                    function (response: any) {
                        var resultadoOperacion: abaxXBRL.model.ResultadoOperacion = response.data;

                        if (resultadoOperacion.Resultado) {
                            self.$scope.documentoInstancia.deserialize(resultadoOperacion.InformacionExtra);
                            if (self.abaxService.getDefinicionPlantilla() && self.abaxService.getDefinicionPlantilla().obtenerDefinicionDeElementos().ListadoDeFormulas) {
                                for (var idFormula in self.abaxService.getDefinicionPlantilla().obtenerDefinicionDeElementos().ListadoDeFormulas) {
                                    if (self.abaxService.getDefinicionPlantilla().obtenerDefinicionDeElementos().ListadoDeFormulas.hasOwnProperty(idFormula)) {
                                        self.abaxService.getDefinicionPlantilla().obtenerDefinicionDeElementos().ListadoDeFormulas[idFormula].RequiereValidacion = true;
                                    }
                                }
                                self.$scope.documentoInstancia.RequiereValidacionFormulas = true;
                            }
                            self.$scope.documentoInstancia.RequiereValidacion = true;
                            /* for (var property in resultadoOperacion.InformacionExtra.HechosPorId) {
                                 if (self.$scope.documentoInstancia.HechosPorId.hasOwnProperty(property)) {
                                     self.$scope.documentoInstancia.HechosPorId[property].deserialize(resultadoOperacion.InformacionExtra.HechosPorId[property]);
                                 }
                             }*/

                            exitoImportacion = true;
                        } else {
                            $.prompt(shared.service.AbaxXBRLUtilsService.getValorEtiqueta('EDITOR_XBRL_ERROR_IMPORTAR_NOTAS') + (resultadoOperacion.Mensaje ? resultadoOperacion.Mensaje : ""),
                                {
                                    title: shared.service.AbaxXBRLUtilsService.getValorEtiqueta('EDITOR_XBRL_ERROR_CONTACTAR_SERVIDOR'),
                                    buttons: { aceptar: true }
                                });
                        }
                    },
                    function (response: any) {

                        $.prompt(shared.service.AbaxXBRLUtilsService.getValorEtiqueta('EDITOR_XBRL_ERROR_IMPORTAR_NOTAS'),
                            {
                                title: shared.service.AbaxXBRLUtilsService.getValorEtiqueta('EDITOR_XBRL_ERROR_CONTACTAR_SERVIDOR'),
                                buttons: { aceptar: true }
                            });
                    }
                    ).finally(
                    function () {
                        self.$scope.cargado = 0;
                        $.isLoading('hide');
                        $modalInstance.close(exitoImportacion);
                    }
                    );
            };


            this.$scope.mostrarNombreInput = function (files: any): void {
                self.$scope.nombreArchivoSeleccionado = files[0].name;
            };
        }
    }
    ImportarNotasDocumentoInstanciaController.$inject = ['$scope', '$modalInstance', 'abaxXBRLServices', 'documentoInstancia', '$upload'];




    /**
    * Implementación de un controlador para la operación de importar un documento plantilla a partir
    * de un documento en excel
    *
    * @author Luis Angel Morales Gonzalez
    * @version 1.0
    */
    export class ImportarDocumentoInstanciaExcelController {

        /** El scope del controlador para importar notas de un documento instancia en excel*/
        private $scope: IImportarDocumentoInstanciaExcelScope;

        /** El servicio angular parala comunicación con el backend de la aplicación */
        private abaxService: services.AbaxXBRLServices;

        /**
        * El servicio que permite el upload del archivo importado
        */
        private $upload: upload.IUploadService;


        /**
         * Constructor de la clase ImportarDocumentoInstanciaExcelController
         *
         * @param $scope el scope del controlador
         * @param $modalInstance la pantalla modal del documento instancia
         * @param abaxXBRLServices el servicio de negocio para interactuar con el back end.
         * @param documentoInstancia documento que se tiene trabajando
         * @param $upload servicio para la cara de archivos
         */
        constructor($scope: IImportarDocumentoInstanciaExcelScope, $modalInstance: ng.ui.bootstrap.IModalServiceInstance, abaxXBRLServices: services.AbaxXBRLServices, documentoInstancia: abaxXBRL.model.DocumentoInstanciaXbrl, $upload: upload.IUploadService) {
            this.$scope = $scope;
            this.$upload = $upload;

            this.abaxService = abaxXBRLServices;
            var self = this;

            this.$scope.documentoInstancia = documentoInstancia;
            this.$scope.extensionesPermitidas = "*.xlsx";

            this.$scope.cerrarDialogo = function (): void {
                $modalInstance.close();
            };

            var aceptar = shared.service.AbaxXBRLUtilsService.getValorEtiqueta('EDITOR_XBRL_ACEPTAR');

            this.$scope.obtenerPlantillaExcel = function (): void {

                $.isLoading({
                    text: shared.service.AbaxXBRLUtilsService.getValorEtiqueta('EDITOR_XBRL_PREPARANDO_DESCARGA')
                });
                var url = 'DocumentoInstancia/ObtenerPlantillaImportacionExcel';

                var data = {
                    espacioNombresPrincipal: $scope.documentoInstancia.EspacioNombresPrincipal
                };

                $.fileDownload(url, {
                    httpMethod: "POST",
                    data: data,
                    successCallback: function (url) {
                        $.isLoading('hide');
                        self.$scope.rolFormatoActivo = self.abaxService.getDocumentoInstancia().Taxonomia.RolesPresentacion[0];
                    },
                    failCallback: function (response, url) {

                        $.isLoading('hide');
                        $modalInstance.close();
                        $.prompt(shared.service.AbaxXBRLUtilsService.getValorEtiqueta('EDITOR_XBRL_ERROR_DESCARGA'),
                            {
                                title: shared.service.AbaxXBRLUtilsService.getValorEtiqueta('EDITOR_XBRL_DESCARGA_PLANTILLA'),
                                buttons: { aceptar: true }
                            });
                        self.$scope.rolFormatoActivo = self.abaxService.getDocumentoInstancia().Taxonomia.RolesPresentacion[0];
                    }
                });
            };

            this.$scope.importarDocumentoExcel = function (): void {

                if (!self.$scope.archivoXLS || self.$scope.archivoXLS == null) {
                    alert(shared.service.AbaxXBRLUtilsService.getValorEtiqueta('EDITOR_XBRL_SELECCIONAR_ARCHIVO_EXCEL'));
                    return;
                }


                var fileConfig: upload.IFileUploadConfig = new MyFileConfig();
                fileConfig.file = self.$scope.archivoXLS[0];
                fileConfig.fileName = self.$scope.archivoXLS[0].name;
                fileConfig.data = { "documentoInstancia": $.toJSON(self.$scope.documentoInstancia) };
                fileConfig.headers = { 'Authorization': 'Bearer ' + shared.service.AbaxXBRLSessionService.getSesionInmediate().Token };
                fileConfig.method = "POST";
                fileConfig.url = "DocumentoInstancia/ImportarDocumentoInstanciaExcel";
                fileConfig.transformRequest = angular.identity;

                var exitoImportacion = false;

                $.isLoading({
                    text: shared.service.AbaxXBRLUtilsService.getValorEtiqueta('EDITOR_XBRL_IMPORTANDO_EXCEL')
                });
                self.$upload.upload(fileConfig).progress(
                    function (progreso: any) {

                        self.$scope.cargado = progreso.loaded;
                        self.$scope.total = progreso.total;
                        if (self.$scope.cargado > 0) {
                            self.$scope.porcentajeCargado = Math.round((self.$scope.cargado / self.$scope.total) * 100);
                        }
                    }
                ).then(
                    function (response: any) {
                        var resultadoOperacion: abaxXBRL.model.ResultadoOperacion = response.data;

                        if (resultadoOperacion.Resultado) {
                            self.$scope.documentoInstancia.deserialize(resultadoOperacion.InformacionExtra);

                            if (self.abaxService.getDefinicionPlantilla()) {
                                self.abaxService.getDefinicionPlantilla().eliminarHechosSinUso(self.abaxService);
                            }

                            if (self.abaxService.getDefinicionPlantilla() && self.abaxService.getDefinicionPlantilla().obtenerDefinicionDeElementos().ListadoDeFormulas) {
                                for (var idFormula in self.abaxService.getDefinicionPlantilla().obtenerDefinicionDeElementos().ListadoDeFormulas) {
                                    if (self.abaxService.getDefinicionPlantilla().obtenerDefinicionDeElementos().ListadoDeFormulas.hasOwnProperty(idFormula)) {
                                        self.abaxService.getDefinicionPlantilla().obtenerDefinicionDeElementos().ListadoDeFormulas[idFormula].RequiereValidacion = true;
                                    }
                                }
                                self.$scope.documentoInstancia.RequiereValidacionFormulas = true;
                            }
                            self.$scope.documentoInstancia.RequiereValidacion = true;
                            self.$scope.documentoInstancia.PendienteGuardar = true;
                            exitoImportacion = true;
                        } else {
                            $.prompt(shared.service.AbaxXBRLUtilsService.getValorEtiqueta('EDITOR_XBRL_ERROR_IMPORTAR_EXCEL') + (resultadoOperacion.Mensaje ? resultadoOperacion.Mensaje : ""),
                                {
                                    title: shared.service.AbaxXBRLUtilsService.getValorEtiqueta('EDITOR_XBRL_ERROR_CONTACTAR_SERVIDOR'),
                                    buttons: { aceptar: true }
                                });
                        }
                    },
                    function (response: any) {

                        $.prompt(shared.service.AbaxXBRLUtilsService.getValorEtiqueta('EDITOR_XBRL_ERROR_IMPORTAR_EXCEL'),
                            {
                                title: shared.service.AbaxXBRLUtilsService.getValorEtiqueta('EDITOR_XBRL_ERROR_CONTACTAR_SERVIDOR'),
                                buttons: { aceptar: true }
                            });
                    }
                    ).finally(
                    function () {
                        self.$scope.cargado = 0;
                        $.isLoading('hide');
                        $modalInstance.close(exitoImportacion);
                    }
                    );



            };

            this.$scope.mostrarNombreInput = function (files: any): void {
                self.$scope.nombreArchivoSeleccionado = files[0].name;
            };


        }
    }
    ImportarDocumentoInstanciaExcelController.$inject = ['$scope', '$modalInstance', 'abaxXBRLServices', 'documentoInstancia', '$upload'];

    /**
     * Enumeración para contener los posibles identificadores de paneles de datos que se presentan al usuarios
     */
    export enum PanelesDatos {
        /** El identificador del panel que muestra los formatos */
        Formatos = 1,
        /** El identificador del panel que muestra las versiones del documento */
        Versiones = 2,
        /** El identificador del panel que muestra los usuarios con acceso al documento */
        Usuarios = 3
    }

    /**
     * Definición de la estructura del scope del controlador.
     * 
     * @author José Antonio Huizar Moreno
     * @version 1.0
     */
    export interface IDocumentoInstanciaScope extends ng.IScope {


        /** Actualiza la bandera que indica si debe mostrarse o no la lista de roles */
        actualizarMostrarListaRoles();

        /** El documento instancia que está siendo presentado en pantalla */
        documentoInstancia: model.DocumentoInstanciaXbrl;

        /** El conjunto de operaciones de cálculo que se realizan dentro del documento instancia */
        operacionesCalculo: model.OperacionesCalculoDocumentoInstancia;

        /** Idioma que se muestra en el documento instancia*/
        xbrlIdioma: abaxXBRL.model.IdiomaTaxonomia;

        /** Listado de versiones del documento de instancia */
        listaHistoricoVersiones: Array<model.VersionDocumentoInstancia>;

        /** El formato que se encuentra activo en el momento */
        formatoActivo: number;

        /** Indica si debe mostrarse o no la lista de roles */
        mostrarListaRoles: boolean;

        /** Indica si el botón exportar debería estar deshabilitado */
        deshabilitarExportar: boolean;

        /** Indica si el botón guardar debería estar deshabilitado */
        deshabilitarGuardar: boolean;

        /** Indica si el botón importar excel debería estar deshabilitado */
        deshabilitarImportarExcel: boolean;

        /** Indica si el botón importar notas debería estar deshabilitado */
        deshabilitarImportarWord: boolean;

        /** El URI del rol del formato activo */
        rolFormatoActivo: abaxXBRL.model.RolPresentacion;

        /** Informacion de si es necesario recargar le formato  */
        recargarFormato: boolean;

        /** El identificador del panel de datos que está visible al usuario */
        panelActivo: PanelesDatos;

        /** Definición del valor por default del ckeditor que se carga de un inicio en los formatos de un documento instancia*/
        valorCkEditorDefault: string;

        /** Numero de decimales que debe de presentar en los tipos de datos numericos en el formato de un documento instancia*/
        numeroDecimales: number;

        /**
         * Indica si el índice de formato proporcionado es el formato activo.
         *
         * @param numeroFormato el número de formato a consultar
         * @return true si el número de formato corresponde al activo. false en cualquier otro caso.
         */
        esFormatoActivo(numeroFormato: number): boolean;

        /**
         * Establece el número de formato que será considerado como activo.
         *
         * @param numeroFormato el número del formato a marcar como activo.
         */
        establecerFormatoActivo(numeroFormato: number, recargar?: boolean): void;

        /**
         * Presenta el diálogo modal para que el usuario pueda guardar una versión del documento instancia.
         */
        guardarDocumentoInstancia(): void;

        /**
        * Presenta el diálogo para que el usuario pueda exportar un documento instancia en el formato definido.
        */
        exportarDocumentoInstancia(): void;


        /** El panel de datos que muestra los formatos de captura */
        PanelFormatos: PanelesDatos;

        /** El panel que muestra las versiones del documento */
        PanelVersiones: PanelesDatos;

        /** El panel que muestra los usuarios con acceso al documento */
        PanelUsuarios: PanelesDatos;

        /**
         * Indica si el identificador del panel proporcionado es el panel activo.
         *
         * @param idPanel el identificador del panel a consultar
         * @return true si el identificador del panel corresponde al activo. false en cualquier otro caso.
         */
        esPanelActivo(idPanel: PanelesDatos): boolean;

        /**
         * Establece el identificador del panel que será considerado como activo.
         *
         * @param idPanel el identificador del panel a marcar como activo.
         */
        establecerPanelActivo(idPanel: PanelesDatos): void;
        /**
        * Establece el panel de formatos como panel activo
        */
        establecerPanelActivoFormatos(recargar: boolean): void;
        /**
         * Presenta el panel de datos que contiene el histórico de versiones del documento instancia.
         */
        presentarVersionesDocumentoInstancia(): void;

        /**
         * Presenta el panel de datos que contiene el listado de usuarios asignados del documento instancia.
         */
        presentarUsuariosDocumentoInstancia(): void;

        /**
        *Bloquea o desbloquea el documento instancia que este trabajando el usuario
        */
        bloquearLiberarDocumentoInstancia(): void;

        /**
        *Cambia el idioma al documento instancia
        */
        cambiarIdiomaDocumentoInstancia(indiceIdiomaSeleccionado: number): void;

        /**
        * Presentacion de informacion en unidades, miles y millones
        */
        cambiarPresentacionDatoMonetario(valorFormatoPresentacion: number): void;

        /**
        *Expande el editor que esta visualizando el usuario
        */
        expandirEditor(): void;

        /** Muestra el documento activo en pantalla completa*/
        mostrarPantallaCompletaDocumento(): void;

        /**
        * Muestra el dialogo para bajar la plantilla para poder importar notas a los hechos del documento instancia
        */
        importarNotasWord(): void;

        /**
        * Muestra el dialogo para bajar la plantilla y poder importar la informacion de un excel en el documento que se esta trabajando
        */
        importarInformacionDeDocumentoExcel(): void;

        /** Inicializa las opciones de intro*/
        inicializarOpcionesIntro(): void;
        /* Identificador del usuario que realiza la operación */
        idUsuarioActivo: number;

        /* Identificador de la emisora del usuario que realiza la operación */
        idEmisoraActiva: number;

        /* Nombre completo del usuario que realiza la operación */
        nombreCompletoUsuarioActivo: string;


        /* Indica si el formato se esta presentando en pantalla completa */
        EsPantallaCompleta: boolean;

        /** Muestra la pantalla completa del documento que se esta visualizando*/
        FullScreen: ng.fullscreen.IFullScreen;

        /** Las opciones del módulo introductorio a la interfaz del usuario */
        opcionesIntro: intro.js.IntroJSOptions;

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

        /**
        * Presenta pantalla para elegir un documento a comparar con el documento presentado actualmente
        */
        presentarDocumentosParaComparar(): void;

        /**
        * Presenta pantalla de listados de información financiera en XBrl
        */
        consultaListadoEnviosInfFinacieraXbrl(): void;

        /**
        *Regresa al estado inicial de visualización de un documento instancia
        */
        regresarDocumentoInstancia(): void;

        /**
        * Agranda la fuente de los formatos de un documento en un 1 pixel
        */
        agrandarFuente(): void;

        /**
        * Encoge el valor de la fuente de los formatos de los documentos en un pixel
        */
        encogerFuente(): void;

        /** Actualiza el numero de decimales */
        actualizarNumeroDecimalesTipoDatoNumerico(aumenta: boolean): void;

        /* Lista de los identificadores de los documentos presentados actualmente, incluyendo
        *  los identificadores de los documentos que se comparan
        */
        identificadoresDocumentosPresentados: Array<string>;
    }


    /**
     * Definición de la estructura del scope del controlador para guardar un documento instancia.
     * @ author
     */
    export interface IInformacionFinancieraScope extends IDocumentoInstanciaScope {


        /**
        * Listado de documentos del usuario
        **/
        documentosUsuario: Array<abaxXBRL.shared.modelos.IDocumentoInstanciaEnviado>;

        /**
        * Realiza la consulta de información enviada del archivo 
        */
        consultarEnvioInformacion(): void;


        /**
        * Muestra el documento instancia en el visor
        */
        mostrarDocumentoInstancia(nombreArchivo: string, idEnvio: string): void;

        /**
        * Listado de ejercicios enviados por las emisoras
        */
        ejercicios: Array<string>;

        /**
         * Listado de Ejercicios 
         */
        listaEjercicios: Array<string>;

        /**
         * Listado de Trimestres
         */
        listaTrimestres: Array<string>;


        /**
        * Listado de trimestres enviados por las emisoras
        */
        trimestres: Array<string>;

        
        /**
        * Objeto con los listados de opciones variables.
        */
        listadosOpciones: { taxonomias: Array<shared.modelos.OptionItemDto> };
        /**
        * Arreglo con las periodicidades existentes.
        **/
        periodicidades: Array<{ Value: string, Label: string }>;

        /**
        * Ejercicio que se selecciona como filtro de consulta
        */
        ejercicioSeleccionado: string;


        /**Taxonomia que es seleccionada como filtro de consulta*/
        taxonomiaSeleccionada: string;

        /**
        * Trimestre que se selecciona como filtro de consulta
        */
        trimestreSeleccionado: string;

        /**
        * Clave de la pizarra que se captura para consulta
        */
        clavePizarraSeleccionada: string;
        /**
        * Calve del periodo por el cual se pretende filtrar.
        **/
        periodicidadSeleccionada: string;

        /**
        * Objeto con las opcinoes de configuración del datatable local.
        **/
        opcionesDataTable: any;
        /**Version del visor*/

        /**
        * Referencia a la instancia del datatable.
        **/
        dataTableInstance: any;
        /**
        * Referencia a la instancia del datatable.
        **/
        dataTableInstanceDetail: any;
        /**
        * Refresca el contenido del data table.
        **/
        refreshData(): void;

        version: string;

        /**
        * Información que valida si se estan cargando los envíos generados
        */
        cargandoEnviosInfFinanciera: boolean;

        /**
        * Selecciona la periodicidad indicada.
        * @param item Periodicidad requerida.
        **/
        seleccionaPeriodicidad(item: { Label: string; Value: string }): void;
        /**
        * Bandera que indica si se debe de ocultar el combo de trimestre.
        **/
        ocultarComboTrimestre: boolean;
        /**
        * Evento que se ejecuta cuando se cambia la periodicidad
        **/    
        cambioPeriodicidad():void;

        obtenerDetalle():void;

        /**
        * Objeto con las opcinoes de configuración del datatable local.
        **/
        opcionesDataTableDetail: any;

        idSeleccionada:string;
        /**
        * Bandera que indica si se debe de ocultar el combo de mensual.
        **/
        ocultarComboMensual: boolean;
        /**
        * Mensual que se selecciona como filtro de consulta
        */
        mensualSeleccionado: string;
        /**
        * Arreglo con las meses del año.
        **/
        listaMeses: Array<{ Value: string, Label: string }>;

        limpiaFiltros(): void;
    }


    /**
     * Definición de la estructura del scope del controlador para guardar un documento instancia.
     * @ author
     */
    export interface IGuardarDocumentoInstanciaScope extends IDocumentoInstanciaScope {

        /** Indica si la operación de guardado ya se ha completado */
        guardado: boolean;

        /** El resultado de la invocación remota al servicio de guardado del documento instancia */
        resultadoOperacion: abaxXBRL.model.ResultadoOperacion;

        /** Documento editado */
        documentoInstancia: abaxXBRL.model.DocumentoInstanciaXbrl;


        /**
         * Cierra el diálogo que permite guardar el documento
         */
        cerrarDialogo(): void;


        /**
         * Guarda el documento instancia.
         * 
         * @param isValid el estado de la validación de la forma presentada al usuario. 
         */
        guardarDocumento(isValid: boolean): void;
    }


    /**
    * Enumeración para los tipos de formatos que se pueden exportar
    */
    export enum TipoFormato {
        /** El identificador del tipo de formato XBRL */
        FormatoXbrl = 1,
        /** El identificador del tipo de formato Excel */
        FormatoExcel = 2,
        /** El identificador del tipo de formato Word */
        FormatoWord = 3,
        /** El identificador del tipo de formato PDF */
        FormatoPdf = 4,
        /** El identificador del tipo de formato HTML */
        FormatoHtml = 5
    }

    /**
     * Definición de la estructura del scope del controlador para exportar un documento instancia.
     * @ author Luis Angel Morales Gonzalez
     */
    export interface IExportarDocumentoInstanciaScope extends IDocumentoInstanciaScope {

        /** Documento que se pretende exportar */
        documentoInstancia: abaxXBRL.model.DocumentoInstanciaXbrl;

        /**
         * Cierra el diálogo que permite guardar el documento
         */
        cerrarDialogo(): void;

        /**
         * Exporta el documento instancia al formato definido.
         */
        exportarDocumentoInstancia(): void;

        /**
         * Formato que se pretende exportar el documento instancia.
         */
        formatoExportaDocumentoInstancia: number;
        /**
        * Bandera que indica si se debe mostrar la opción para exportar a Excel.
        **/
        exportarExcel: boolean;
    }

    /**
     * Definición de la estructura del scope del controlador para importar las notas de un documento instancia.
     * @ author Luis Angel Morales Gonzalez
     */
    export interface IImportarNotasDocumentoInstanciaScope extends IDocumentoInstanciaScope {

        /** Documento que se pretende importar las notas */
        documentoInstancia: abaxXBRL.model.DocumentoInstanciaXbrl;

        /**
         * Cierra el diálogo que permite importar las notas de un documento instancia
         */
        cerrarDialogo(): void;

        /**
         * Importa las notas de los hechos del documento instancia.
         */
        importarNotasDocumentoInstancia(): void;

        /**Muestra en el input de la pantalla de carga el nombre del archivo seleccionado*/
        mostrarNombreInput(files: any): void;

        /** Obtiene la plantilla para poder importar informacion de los hechos de tipo blocking text*/
        obtenerPlantillaNotaDocumentoInstancia(): void;

        /** Archivo que será importado en el documento de instancia */
        archivoNotasDocumentoInstanciaImportado: File;

        /** Configuración de extensiones de archivo permitidas */
        extensionesPermitidas: string;

        /** Nombre del archivo Seleccionado */
        nombreArchivoSeleccionado: string;

        /** Total de bytes cargados al momento **/
        cargado: number;

        /** Total de bytes del documento de instancia */
        total: number;

        /** Porcentaje del archivo que se ha cargado */
        porcentajeCargado: number;

    }


    /**
     * Definición de la estructura del scope del controlador para importar informacion de un documento en excel.
     * @ author Luis Angel Morales Gonzalez
     */
    export interface IImportarDocumentoInstanciaExcelScope extends IDocumentoInstanciaScope {

        /** Documento que se pretende importar las notas */
        documentoInstancia: abaxXBRL.model.DocumentoInstanciaXbrl;

        /**
         * Cierra el diálogo que permite importar las notas de un documento instancia
         */
        cerrarDialogo(): void;

        /**
         * Importa las notas de los hechos del documento instancia.
         */
        importarDocumentoExcel(): void;

        /**Muestra en el input de la pantalla de carga el nombre del archivo seleccionado*/
        mostrarNombreInput(files: any): void;

        /** Obtiene la plantilla que será utilizada para importar informacion al documento instancia*/
        obtenerPlantillaExcel();

        /** Archivo que será importado en el documento de instancia */
        archivoXLS: File;

        /** Nombre del archivo Seleccionado */
        nombreArchivoSeleccionado: string;

        /** Configuración de extensiones de archivo permitidas */
        extensionesPermitidas: string;

        /** Total de bytes cargados al momento **/

        cargado: number;

        /** Total de bytes del documento de instancia */
        total: number;

        /** Porcentaje del archivo que se ha cargado */
        porcentajeCargado: number;

    }



    export interface IConsultarDocumentosParaCompararScope extends IDocumentoInstanciaScope {
        /**
        * Listado de documentos del usuario
        **/
        documentosUsuario: Array<abaxXBRL.shared.modelos.IDocumentoInstanciaEnviado>;

        /**
        * Muestra el icono de cargar mientras se consultan los documentos
        */
        mostrarCargando: boolean;

        /**
        * Cierra el dálogo de consulta
        */
        cerrarDialogo(): void;

        /** Indica si el usuario tiene documentos */
        existenDocumentosUsuario: boolean;

        /**
        * Objeto con las opcinoes de configuración del datatable local.
        **/
        opcionesDataTableDocumentosUsuario: any;


        /** ID del documento que se selecciona */
        idDocumentoSeleccionado: string;

        /** Nombre del archivo seleccionado*/
        nombreArchivoSeleccionado: string;


        /** Invoca el servicio para imortar los hechos de un documento de instancia al documento de instancia actual */
        importarHechosDocumento(): void;

        /* Actualiza el identificador del documento de instancia */
        actualizarDocumentoSeleeccionado(idDoc: string, nombreArchivo: string): void;
    }


    export class ConsultarDocumentosParaCompararController {

        /** El scope del controlador para cargar un documento a comparar*/
        private $scope: IConsultarDocumentosParaCompararScope;

        /** El servicio angular parala comunicación con el backend de la aplicación */
        private abaxService: services.AbaxXBRLServices;

        /**Servicio para el manejo de las peticiones al servidor. **/
        private abaxXBRLRequestService: shared.service.AbaxXBRLRequestService;

        /* Servicio de diálogos modales
        */
        private $modalInstance: ng.ui.bootstrap.IModalServiceInstance;

        private init(): void {

            this.$scope.mostrarCargando = true;
            this.$scope.existenDocumentosUsuario = false;
            var self = this;

            this.$scope.cerrarDialogo = function (): void {
                self.$scope.documentosUsuario = null;
                self.$modalInstance.close(false);
            };

            this.$scope.importarHechosDocumento = function (): void {


                if (self.$scope.idDocumentoSeleccionado && self.$scope.idDocumentoSeleccionado !== undefined) {

                    $.isLoading({
                        text: shared.service.AbaxXBRLUtilsService.getValorEtiqueta('EDITOR_XBRL_CARGANDO_DOCUMENTO_INSTANCIA')
                    });

                    self.abaxService.agregarDocumentoInstanciaAComparar(self.$scope.idDocumentoSeleccionado, self.$scope.nombreArchivoSeleccionado).then(function (resultadoOperacion: boolean) {
                        if (resultadoOperacion) {
                            $.prompt(shared.service.AbaxXBRLUtilsService.getValorEtiqueta('VISOR_XBRL_COMPARAR_DOCUMENTO_ALERTA_DOCUMENTO_IMPORTADO_CORRECTAMENTE'),
                                {
                                    title: shared.service.AbaxXBRLUtilsService.getValorEtiqueta('VISOR_XBRL_COMPARAR_DOCUMENTO_ALERTA'),
                                    buttons: { aceptar: true }
                                });

                            self.$scope.identificadoresDocumentosPresentados.push(self.$scope.idDocumentoSeleccionado);

                            self.abaxService.getDocumentoInstancia().EsComparadorDocumento = true;

                            self.$modalInstance.close(true);
                            $.isLoading('hide');
                        } else {
                            var util = shared.service.AbaxXBRLUtilsService;
                            $.isLoading('hide');
                            alert("No fue posible cargar el documento instancia.");
                        }
                    });
                } else {
                    alert(shared.service.AbaxXBRLUtilsService.getValorEtiqueta('VISOR_XBRL_COMPARAR_DOCUMENTO_ALERTA_ELEGIR_DOCUMENTO'));
                }

            };

            this.$scope.actualizarDocumentoSeleeccionado = function (idUnicoDocumento: string, nombreArchivo: string): void {
                self.$scope.idDocumentoSeleccionado = idUnicoDocumento;
                self.$scope.nombreArchivoSeleccionado = nombreArchivo;

            }
            self.$scope.opcionesDataTableDocumentosUsuario = shared.service.AbaxXBRLUtilsService.creaOpcionesDataTable();
            self.$scope.opcionesDataTableDocumentosUsuario.withOption("paging", true);
            self.$scope.opcionesDataTableDocumentosUsuario.withOption("sDom", "<'row'<'col-sm-6'l><'col-sm-6'f>r>t<'row'<'col-sm-6'i><'col-sm-6'p>>");
            var IdEnvioStiv = self.abaxService.getDocumentoInstancia().IdEnvioStiv
            self.$scope.documentosUsuario = [];

            for (var indiceDocumentoEnviado in self.abaxService.documentosInstanciaEnviados) {
                var documentoEnviado = self.abaxService.documentosInstanciaEnviados[indiceDocumentoEnviado];
                if (documentoEnviado.Id != IdEnvioStiv && documentoEnviado.Taxonomia.IdTaxonomiaXbrl == self.abaxService.documentosInstanciaEnviados[IdEnvioStiv].Taxonomia.IdTaxonomiaXbrl) {
                    self.$scope.documentosUsuario.push(documentoEnviado);
                }
            }

            if (self.$scope.documentosUsuario && self.$scope.documentosUsuario.length && self.$scope.documentosUsuario.length > 0) {
                self.$scope.existenDocumentosUsuario = true;
            }

            self.$scope.mostrarCargando = false;

        }

        /**
        * Constructor de la clase ConsultarDocumentosParaCompararController
        *
        * @param $scope el scope del controlador
        * @param $modalInstance la pantalla modal del documento instancia
        * @param abaxXBRLServices el servicio de negocio para interactuar con el back end.
        * @param documentoInstancia documento que se tiene trabajando
        */
        constructor($scope: IConsultarDocumentosParaCompararScope, $modalInstance: ng.ui.bootstrap.IModalServiceInstance,
            abaxXBRLServices: services.AbaxXBRLServices,
            abaxXBRLRequestService: shared.service.AbaxXBRLRequestService,
            documentoInstancia: abaxXBRL.model.DocumentoInstanciaXbrl, identificadoresDocumentosPresentados: Array<string>) {
            this.$modalInstance = $modalInstance;
            this.$scope = $scope;
            this.$scope.identificadoresDocumentosPresentados = identificadoresDocumentosPresentados;
            this.$scope.identificadoresDocumentosPresentados = new Array<string>();

            this.abaxService = abaxXBRLServices;
            this.abaxXBRLRequestService = abaxXBRLRequestService;
            var self = this;
            this.$scope.documentoInstancia = documentoInstancia;


            this.init();
        }
    }
    ConsultarDocumentosParaCompararController.$inject = ['$scope', '$modalInstance', 'abaxXBRLServices', 'abaxXBRLRequestService', 'documentoInstancia', 'identificadoresDocumentosPresentados'];



    /**
    * Implementación de la interfaz para los parámetros de configuración del request del plugin
    * File Upload
    */
    class MyFileConfig implements upload.IFileUploadConfig {
        file: any;
        fileName: string;
        cache;
        data: any;
        headers: any;
        method: string;
        params: any;
        responseType: any;
        timeout: any;
        transformRequest: any;
        transformResponse: any;
        url: string;
        withCredentials: any;
        xsrfCookieName: any;
        xsrfHeaderName: any;
    }

}