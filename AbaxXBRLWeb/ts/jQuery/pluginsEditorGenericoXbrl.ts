///<reference path="../../scripts/typings/xregexp/xregexp.d.ts" /> 
///<reference path="../../scripts/typings/decimal.js/decimal.js.d.ts" /> 
///<reference path="../../scripts/typings/bootstrap/bootstrap.d.ts" />
///<reference path="../../scripts/typings/toolbartip/jquery-toolbar.d.ts" /> 
///<reference path="../directivasEditorGenerico.ts" /> 

module abaxXBRL.plugins {


    /**
     * Definición de los settings del plugin que presenta el detalle de un rol del documento instancia.
     *
     * @author Luis Angel Morales Gonzalez
     * @version 1.0
     */
    export class XbrlEstructuraDocumentoSettings {

        /** Rol del documento que se desea desplegar como elemento de pantalla*/
        public xbrlRol: model.RolPresentacion;
    }


    /**
     * Implementación de un elemento de presentación encargado de mostrar una plantilla generica de un rol del documento instancia
     *
     * @author Luis Angel Morales Gonzalez
     * @version 1.0
     */
    export class XbrlEstructuraDocumento implements ElementoPresentacionXbrl {

        /** Los parámetros usados para la creación/presentación del plugin en pantalla */
        private settings: XbrlEstructuraDocumentoSettings;

        /** El identificador del elemento que contiene este plugin dentro del dom */
        private idPlugin: string;

        /** El elemento que originalmente se había definido antes de ejecutar el plugin */
        private elemento: JQuery;

        /** Tipo de elemento que define que se trata de una tabla*/
        private TipoElementoDocumentoTabla: abaxXBRL.directives.TipoElementoDocumento;
        
        /** Tipo de elemento que define que se trata de una titulo*/
        private TipoElementoDocumentoTitulo: abaxXBRL.directives.TipoElementoDocumento;

        /** La estructura del documento instancia a presentar en pantalla */
        private estructuraDocumento: abaxXBRL.directives.EstructuraDocumento;

        /** Documento instancia que se mostrara*/
        private documentoInstancia: model.DocumentoInstanciaXbrl;

        /**
         * Inicializa el plugin de JQuery a partir de los parámetros especificados en la declaración del elemento
         *
         * @param element el elemento JQuery al que se aplica el plugin
         * @param settings los settings con los que se inicializó el plugin al momento de ser creado
         */
        public init(element: JQuery, settings: XbrlEstructuraDocumentoSettings): void {
            this.elemento = element;
            this.idPlugin = utils.UUIDUtils.generarUUID();
            this.TipoElementoDocumentoTabla = abaxXBRL.directives.TipoElementoDocumento.Tabla;
            this.TipoElementoDocumentoTitulo = abaxXBRL.directives.TipoElementoDocumento.Titulo;

            this.settings = settings;

            $(this.elemento).data('xbrlEstructuraDocumento', this);

            this.actualizarUI();

        }

        /**
         * Actualiza la interfaz del usuario de acuerdo a los cambios del modelo
         */
        actualizarUI(): void {

            var self = this;
            

            this.documentoInstancia = AngularJQueryBridge.getInstance().obtenerDocumentoInstancia();
            var variablesPlantilla = new Array<{ llave: string; valor: string; }>();
            variablesPlantilla.push({ llave: 'idPlugin', valor: this.idPlugin });

            XbrlPluginUtils.cargarPlantillaYReemplazarVariables('ts/jQuery/templates/template-xbrl-estructura-documento.html?version=' + root.AbaxXBRLConstantesRoot.VERSION_APP.version,
                variablesPlantilla,
                function (plantilla: JQuery) {
                    self.inicializarPlantillaGenerica();
                    self.elemento.empty().append(plantilla);
                }, function (textStatus: any, errorThrown: any) {
                    console.log('ocurrió un error al cargar la plantilla del valor calculado de un hecho en un detalle de operacion');
                });
        }

        /**
        * Inicializa la plantilla generica que corresponde al rol seleccionado del documento instancia
        */
        inicializarPlantillaGenerica(): void {

            if (this.settings.xbrlRol && this.settings.xbrlRol !== null) {
                this.estructuraDocumento = new abaxXBRL.directives.EstructuraDocumento();
                this.recorrerArbolLinkbasePresentacion(this.settings.xbrlRol.Estructuras, this.estructuraDocumento, null, 0, this.settings.xbrlRol);
            }
            this.prepararTodasLasEstructurasTabla();
            this.inicializarElementosFormato();
        }

        /**
        * Inicializa todos los elementos que tiene el formato del documento instancia, Tablas, Titulos y encabzados
        */
        inicializarElementosFormato(): void {

            for (var indiceElemento in this.estructuraDocumento.elementos) {
                var elemento = this.estructuraDocumento.elementos[indiceElemento];
                if (elemento.mostrarElementoDocumento && elemento.tipo == this.TipoElementoDocumentoTitulo) {
                    this.mostrarElementoDocumentoTitulo(elemento);
                } else if (elemento.mostrarElementoDocumento && elemento.tipo == this.TipoElementoDocumentoTabla) {
                    this.mostrarElementoDocumentoTabla(elemento);
                }
            }
        }

        /**
        * Carga en la plantilla un elemento del documento de tipo titulo
        * @param elemento, elemento que tiene el titulo a mostrar
        */
        mostrarElementoDocumentoTitulo(elemento: abaxXBRL.directives.ElementoDocumento): void {
            var self = this;

            var idPluginElemento = utils.UUIDUtils.generarUUID();

            var variablesPlantilla = new Array<{ llave: string; valor: string; }>();
            variablesPlantilla.push({ llave: 'idPlugin', valor: idPluginElemento });
            variablesPlantilla.push({ llave: 'documentoInstancia.xbrlIdioma.ClaveIdioma', valor: this.documentoInstancia.xbrlIdioma.ClaveIdioma });
            variablesPlantilla.push({ llave: 'elementoDocumento.idConcepto', valor: elemento.idConcepto });
            variablesPlantilla.push({ llave: 'elementoDocumento.indentacion', valor: elemento.indentacion.toString() });
            

            XbrlPluginUtils.cargarPlantillaYReemplazarVariables('ts/jQuery/templates/template-xbrl-estructura-documento-titulo.html?version=' + root.AbaxXBRLConstantesRoot.VERSION_APP.version,
                variablesPlantilla,
                function (plantilla: JQuery) {
                    //self.elemento.empty().append(plantilla);
                    $("#elementosEstructuraDocumento").append(plantilla);
                }, function (textStatus: any, errorThrown: any) {
                    console.log('ocurrió un error al cargar la plantilla del valor calculado de un hecho en un detalle de operacion');
                });

        }

        /**
        * Carga en la plantilla un elemento del documento de tipo titulo
        * @param elemento, elemento que tiene el titulo a mostrar
        */
        mostrarElementoDocumentoTabla(elemento: abaxXBRL.directives.ElementoDocumento): void {
            var self = this;

            var idPluginElemento = utils.UUIDUtils.generarUUID();

            var variablesPlantilla = new Array<{ llave: string; valor: string; }>();
            variablesPlantilla.push({ llave: 'idPlugin', valor: idPluginElemento });

            XbrlPluginUtils.cargarPlantillaYReemplazarVariables('ts/jQuery/templates/template-xbrl-estructura-documento-tabla.html?version=' + root.AbaxXBRLConstantesRoot.VERSION_APP.version,
                variablesPlantilla,
                function (plantilla: JQuery) {
                    //self.elemento.empty().append(plantilla);
                    $("#elementosEstructuraDocumento").append(plantilla);
                }, function (textStatus: any, errorThrown: any) {
                    console.log('ocurrió un error al cargar la plantilla del valor calculado de un hecho en un detalle de operacion');
                });

        }


        /**
         * Recorre la estructura del linkbase de presentación de un rol de la taxonomía para generar un objeto equivalente con la estructura del documento para poder presentarlo en pantalla.
         *
         * @param estructuras las estructuras que componen el linkbase de presentación del rol.
         * @param estructuraDocumento la estructura del documento que resulta del recorrido del linkbase de presentación.
         * @param elementoPredecesor el elemento del documento que precede al elemento que debe ser creado por la estructura que actualmente se está recorriendo.
         * @param indentacion el nivel de indentacion que debe aplicarse a los elementos creados para la estructura actual del linkbase de presentación.
         * @return el elemento del documento instancia que resultó de recorrer la estructura del linkbase de presentación.
         */
        private recorrerArbolLinkbasePresentacion(estructuras: Array<model.EstructuraFormato>, estructuraDocumento: abaxXBRL.directives.EstructuraDocumento, elementoPredecesor: abaxXBRL.directives.ElementoDocumento,
            indentacion: number, rol: model.RolPresentacion): abaxXBRL.directives.ElementoDocumento {
            var elementoDocumento: abaxXBRL.directives.ElementoDocumento = null;
            if (!estructuras || estructuras == null || !estructuras.length || estructuras.length == 0) return null;
            for (var i = 0; i < estructuras.length; i++) {
                var estructura = estructuras[i];
                var concepto = this.documentoInstancia.Taxonomia.ConceptosPorId[estructura.IdConcepto];
                if (concepto.EsAbstracto) {

                    //Si algún hijo es un hipercubo, crear la estructura de la tabla completa
                    if (this.algunHijoEsHipercubo(estructura)) {
                        //Crear el titulo del hipercubo
                        elementoDocumento = new abaxXBRL.directives.ElementoDocumento();
                        elementoDocumento.tipo = abaxXBRL.directives.TipoElementoDocumento.Titulo;
                        elementoDocumento.indentacion = indentacion;
                        elementoDocumento.idConcepto = concepto.Id;
                        estructuraDocumento.elementos.push(elementoDocumento);
                        
                        
                        
                        //Asegurarse de crear primero el hipercubo
                        var estructuraDeclaracionHipercubo: model.EstructuraFormato = null;

                        for (var iSub = 0; iSub < estructura.SubEstructuras.length; iSub++) {
                            var estructuraDeHipercubo = estructura.SubEstructuras[iSub];
                            var conceptoDeHipercubo = this.documentoInstancia.Taxonomia.ConceptosPorId[estructuraDeHipercubo.IdConcepto];
                            if (conceptoDeHipercubo.EsHipercubo) {
                                var tabla = this.crearTablaDimensional(estructuraDeHipercubo, rol);
                                elementoDocumento = new abaxXBRL.directives.ElementoDocumento();
                                elementoDocumento.tipo = abaxXBRL.directives.TipoElementoDocumento.Tabla;
                                elementoDocumento.indentacion = indentacion;
                                elementoDocumento.tabla = tabla;
                                estructuraDocumento.elementos.push(elementoDocumento);
                                estructuraDeclaracionHipercubo = estructuraDeHipercubo;
                            }
                        }
                        for (var iSub = 0; iSub < estructura.SubEstructuras.length; iSub++) {
                            var estructuraDeHipercubo = estructura.SubEstructuras[iSub];
                            var conceptoDeHipercubo = this.documentoInstancia.Taxonomia.ConceptosPorId[estructuraDeHipercubo.IdConcepto];
                            if (!conceptoDeHipercubo.EsHipercubo) {
                                this.agregarRenglonATabla(elementoDocumento.tabla, conceptoDeHipercubo, indentacion, estructura.RolEtiquetaPreferido);
                                this.recorrerArbolLinkbasePresentacion(estructuraDeHipercubo.SubEstructuras, estructuraDocumento, elementoDocumento, indentacion + 1, rol);
                            }
                        }
                        //Si el hipercubo no tiene elementos primario line items, tomarlos de los hijos del hipercubo que no sean dimensiones
                        //Esta consideración se agregó debido a que reportes de la sec no tenían line items como hermanos de los hipercubos
                        if (elementoDocumento && elementoDocumento.tabla && estructuraDeclaracionHipercubo != null) {
                            if (!elementoDocumento.tabla.renglones || elementoDocumento.tabla.renglones.length == 0) {
                                for (var iSub = 0; iSub < estructuraDeclaracionHipercubo.SubEstructuras.length; iSub++) {
                                    var estructuraHijaHipercubo = estructuraDeclaracionHipercubo.SubEstructuras[iSub];
                                    var conceptoDeHipercubo = this.documentoInstancia.Taxonomia.ConceptosPorId[estructuraHijaHipercubo.IdConcepto];
                                    if (!conceptoDeHipercubo.EsDimension) {
                                        this.agregarRenglonATabla(elementoDocumento.tabla, conceptoDeHipercubo, indentacion, estructuraDeclaracionHipercubo.RolEtiquetaPreferido);
                                        this.recorrerArbolLinkbasePresentacion(estructuraHijaHipercubo.SubEstructuras, estructuraDocumento, elementoDocumento, indentacion + 1, rol);
                                    }
                                }
                            }
                        }


                    } else {
                        if (this.algunDescendienteTieneHipercubo(estructura)) {
                            elementoDocumento = new abaxXBRL.directives.ElementoDocumento();
                            elementoDocumento.tipo = abaxXBRL.directives.TipoElementoDocumento.Titulo;
                            elementoDocumento.indentacion = indentacion;
                            elementoDocumento.idConcepto = estructura.IdConcepto;
                            estructuraDocumento.elementos.push(elementoDocumento);
                            this.recorrerArbolLinkbasePresentacion(estructura.SubEstructuras, estructuraDocumento, null, indentacion + 1, rol);
                        } else {
                            if (elementoPredecesor && elementoPredecesor != null && elementoPredecesor.tipo == abaxXBRL.directives.TipoElementoDocumento.Tabla) {
                                this.agregarRenglonATabla(elementoPredecesor.tabla, concepto, indentacion, estructura.RolEtiquetaPreferido);
                                elementoDocumento = elementoPredecesor;
                                this.recorrerArbolLinkbasePresentacion(estructura.SubEstructuras, estructuraDocumento, elementoPredecesor, indentacion + 1, rol);
                            } else {
                                var tabla = this.crearTablaNoDimensional(concepto);
                                elementoDocumento = new abaxXBRL.directives.ElementoDocumento();
                                elementoDocumento.tipo = abaxXBRL.directives.TipoElementoDocumento.Tabla;
                                elementoDocumento.indentacion = indentacion;
                                elementoDocumento.tabla = tabla;
                                elementoDocumento.tabla.renglones[0].EsAbstracto = concepto.EsAbstracto;
                                estructuraDocumento.elementos.push(elementoDocumento);
                                this.recorrerArbolLinkbasePresentacion(estructura.SubEstructuras, estructuraDocumento, elementoDocumento, 1, rol);
                            }
                        }
                    }
                } else {
                    if (this.algunDescendienteTieneHipercubo(estructura)) {
                        var tabla = this.crearTablaNoDimensional(concepto);

                        elementoDocumento = new abaxXBRL.directives.ElementoDocumento();
                        elementoDocumento.tipo = abaxXBRL.directives.TipoElementoDocumento.Tabla;
                        elementoDocumento.indentacion = indentacion;
                        elementoDocumento.tabla = tabla;
                        estructuraDocumento.elementos.push(elementoDocumento);
                        this.recorrerArbolLinkbasePresentacion(estructura.SubEstructuras, estructuraDocumento, elementoDocumento, 1, rol);
                    } else {
                        if (elementoPredecesor && elementoPredecesor != null && elementoPredecesor.tipo == abaxXBRL.directives.TipoElementoDocumento.Tabla) {
                            this.agregarRenglonATabla(elementoPredecesor.tabla, concepto, indentacion, estructura.RolEtiquetaPreferido);
                            elementoDocumento = elementoPredecesor;
                            this.recorrerArbolLinkbasePresentacion(estructura.SubEstructuras, estructuraDocumento, elementoPredecesor, indentacion + 1, rol);
                        } else {
                            var tabla = this.crearTablaNoDimensional(concepto);

                            elementoDocumento = new abaxXBRL.directives.ElementoDocumento();
                            elementoDocumento.tipo = abaxXBRL.directives.TipoElementoDocumento.Tabla;
                            elementoDocumento.indentacion = indentacion;
                            elementoDocumento.tabla = tabla;
                            estructuraDocumento.elementos.push(elementoDocumento);
                            this.recorrerArbolLinkbasePresentacion(estructura.SubEstructuras, estructuraDocumento, elementoDocumento, 1, rol);
                        }
                    }
                }
                elementoPredecesor = elementoDocumento;
            }

            return elementoDocumento;
        }

        //Verifica si en el siguiente nivel de hijos de la estructura hay alguna declaración de hipercubo
        private algunHijoEsHipercubo(estructura: model.EstructuraFormato): boolean {

            if (estructura && estructura.SubEstructuras && estructura.SubEstructuras != null && estructura.SubEstructuras.length > 0) {
                for (var iSub = 0; iSub < estructura.SubEstructuras.length; iSub++) {
                    var concepto = this.documentoInstancia.Taxonomia.ConceptosPorId[estructura.SubEstructuras[iSub].IdConcepto];
                    if (concepto && concepto.EsHipercubo) {
                        return true;
                    }
                }
            }
            return false;
        }

        //Agrega conceptos renglones a una estructura de tabla
        private agregarRenglonATabla(tabla: abaxXBRL.directives.EstructuraTabla, concepto: model.Concepto, indentacion: number, rolEtiqueta: string): void {
            var renglon = new abaxXBRL.directives.RenglonTabla();
            renglon.idConcepto = concepto.Id;
            renglon.EsAbstracto = concepto.EsAbstracto;
            renglon.indentacion = indentacion;
            renglon.visible = true;
            renglon.rolEtiqueta = rolEtiqueta;

            tabla.renglones.push(renglon);
        }
        //Crea la estructura de una tabla con las dimensiones de tiempo y entidad únicamente
        private crearTablaNoDimensional(concepto): abaxXBRL.directives.EstructuraTabla {
            var tabla = new abaxXBRL.directives.EstructuraTabla();
            tabla.agruparFechas = true;
            tabla.encabezado = new abaxXBRL.directives.EncabezadoTabla();
            var informacionDimensionTiempo = new abaxXBRL.directives.InformacionDimension();
            informacionDimensionTiempo.tipo = abaxXBRL.directives.TipoDimension.Ficticia;
            informacionDimensionTiempo.titulo = 'Periodo';
            informacionDimensionTiempo.idConceptoEje = abaxXBRL.directives.InformacionDimension.ID_DIMENSION_TIEMPO;
            informacionDimensionTiempo.subEstructuraOrigen = new model.EstructuraFormato();
            informacionDimensionTiempo.subEstructuraOrigen.IdConcepto = abaxXBRL.directives.InformacionDimension.ID_DIMENSION_TIEMPO;
            informacionDimensionTiempo.orden = 0;
            var informacionDimensionEntidad = new abaxXBRL.directives.InformacionDimension();
            informacionDimensionEntidad.tipo = abaxXBRL.directives.TipoDimension.Ficticia;
            informacionDimensionEntidad.titulo = 'Entidad';
            informacionDimensionEntidad.idConceptoEje = abaxXBRL.directives.InformacionDimension.ID_DIMENSION_ENTIDAD;
            informacionDimensionEntidad.subEstructuraOrigen = new model.EstructuraFormato();
            informacionDimensionEntidad.subEstructuraOrigen.IdConcepto = abaxXBRL.directives.InformacionDimension.ID_DIMENSION_ENTIDAD;
            informacionDimensionEntidad.orden = 1;

            tabla.encabezado.dimensionesPorId[informacionDimensionTiempo.idConceptoEje] = informacionDimensionTiempo
            tabla.encabezado.dimensiones.push(informacionDimensionTiempo);

            tabla.encabezado.dimensionesPorId[informacionDimensionEntidad.idConceptoEje] = informacionDimensionEntidad
            tabla.encabezado.dimensiones.push(informacionDimensionEntidad);

            var renglon = new abaxXBRL.directives.RenglonTabla();
            renglon.idConcepto = concepto.Id;
            renglon.indentacion = 0;
            renglon.visible = true;

            tabla.renglones.push(renglon);

            return tabla;
        }
        //Crea la estructura de una tabla dimensional incluidas las dimensiones de entidad y tiempo
        private crearTablaDimensional(estructura: model.EstructuraFormato, rol: model.RolPresentacion): abaxXBRL.directives.EstructuraTabla {

            var concepto = this.documentoInstancia.Taxonomia.ConceptosPorId[estructura.IdConcepto];
            if (!concepto.EsHipercubo) return null;

            var tabla = new abaxXBRL.directives.EstructuraTabla();
            tabla.agruparFechas = true;
            tabla.encabezado = new abaxXBRL.directives.EncabezadoTabla();

            var ordenDimensiones = 0;

            if (estructura.SubEstructuras && estructura.SubEstructuras.length) {
                for (var i = 0; i < estructura.SubEstructuras.length; i++) {
                    var estructuraDimension = estructura.SubEstructuras[i];
                    var conceptoDimension = this.documentoInstancia.Taxonomia.ConceptosPorId[estructuraDimension.IdConcepto];
                    if (conceptoDimension.EsDimension) {
                        var informacionDimension = new abaxXBRL.directives.InformacionDimension();
                        informacionDimension.tipo = abaxXBRL.directives.TipoDimension.Real;
                        informacionDimension.idConceptoEje = conceptoDimension.Id;
                        informacionDimension.orden = ordenDimensiones++;
                        //Localizar la dimensión en el inventario de hipercubos
                        var dimensionHipercubo = this.buscarDimensionEnHipercubo(conceptoDimension.Id, this.documentoInstancia.Taxonomia.ListaHipercubos);
                        if (dimensionHipercubo != null) {
                            informacionDimension.subEstructuraOrigen = dimensionHipercubo;
                            if (dimensionHipercubo.SubEstructuras && dimensionHipercubo.SubEstructuras.length) {
                                for (var j = 0; j < dimensionHipercubo.SubEstructuras.length; j++) {
                                    this.obtenerInformacionDimension(dimensionHipercubo.SubEstructuras[j], informacionDimension, 0);
                                }
                            }
                            tabla.encabezado.dimensionesPorId[informacionDimension.idConceptoEje] = informacionDimension;
                            tabla.encabezado.dimensiones.push(informacionDimension);
                        }
                    }
                }
            }



            var informacionDimensionTiempo = new abaxXBRL.directives.InformacionDimension();
            informacionDimensionTiempo.tipo = abaxXBRL.directives.TipoDimension.Ficticia;
            informacionDimensionTiempo.titulo = 'Periodo';
            informacionDimensionTiempo.idConceptoEje = abaxXBRL.directives.InformacionDimension.ID_DIMENSION_TIEMPO;
            informacionDimensionTiempo.subEstructuraOrigen = new model.EstructuraFormato();
            informacionDimensionTiempo.subEstructuraOrigen.IdConcepto = abaxXBRL.directives.InformacionDimension.ID_DIMENSION_TIEMPO;

            informacionDimensionTiempo.orden = ordenDimensiones++;;
            var informacionDimensionEntidad = new abaxXBRL.directives.InformacionDimension();
            informacionDimensionEntidad.tipo = abaxXBRL.directives.TipoDimension.Ficticia;
            informacionDimensionEntidad.titulo = 'Entidad';
            informacionDimensionEntidad.idConceptoEje = abaxXBRL.directives.InformacionDimension.ID_DIMENSION_ENTIDAD;
            informacionDimensionEntidad.subEstructuraOrigen = new model.EstructuraFormato();
            informacionDimensionEntidad.subEstructuraOrigen.IdConcepto = abaxXBRL.directives.InformacionDimension.ID_DIMENSION_ENTIDAD;
            informacionDimensionEntidad.orden = ordenDimensiones++;;

            tabla.encabezado.dimensionesPorId[informacionDimensionTiempo.idConceptoEje] = informacionDimensionTiempo
            tabla.encabezado.dimensiones.push(informacionDimensionTiempo);

            tabla.encabezado.dimensionesPorId[informacionDimensionEntidad.idConceptoEje] = informacionDimensionEntidad
            tabla.encabezado.dimensiones.push(informacionDimensionEntidad);


            return tabla;
        }
        //Busca una dimensión en específico dentro de una lista de las declaraciones de los roles de la taxonomía
        private buscarDimensionEnHipercubo(idDimension: string, hipercubosRol: { [rol: string]: Array<model.Hipercubo>; }): model.EstructuraFormato {
            var dimensionBuscada: model.EstructuraFormato = null;

            if (hipercubosRol) {
                for (var rol in hipercubosRol) {
                    var listaHipercubos = hipercubosRol[rol];
                    if (listaHipercubos) {
                        for (var idxh in listaHipercubos) {
                            var hipercubo = listaHipercubos[idxh];
                            if (hipercubo.EstructuraDimension[idDimension]) {
                                //dimension encontrada
                                dimensionBuscada = new model.EstructuraFormato();
                                dimensionBuscada.IdConcepto = idDimension;
                                dimensionBuscada.SubEstructuras = hipercubo.EstructuraDimension[idDimension];
                                break;
                            }
                        }
                    }

                }
            }
            return dimensionBuscada;

        }
        //Obtiene la información no estructurada (en forma de lista) de una estructura de árbol de los miembros de una dimensión
        private obtenerInformacionDimension(estructura: model.EstructuraFormato, informacionDimension: abaxXBRL.directives.InformacionDimension, indentacion: number) {
            if (estructura && estructura != null) {
                var conceptoMiembro = this.documentoInstancia.Taxonomia.ConceptosPorId[estructura.IdConcepto];
                if (conceptoMiembro.EsMiembroDimension) {

                    var miembroDimension = new abaxXBRL.directives.MiembroDimension();
                    miembroDimension.idDimension = informacionDimension.idConceptoEje;
                    miembroDimension.idConceptoMiembro = conceptoMiembro.Id;
                    miembroDimension.indentacion = indentacion;
                    miembroDimension.visible = true;

                    informacionDimension.miembros[miembroDimension.idConceptoMiembro] = miembroDimension;
                    if (estructura.SubEstructuras && estructura.SubEstructuras.length) {
                        for (var i = 0; i < estructura.SubEstructuras.length; i++) {
                            this.obtenerInformacionDimension(estructura.SubEstructuras[i], informacionDimension, indentacion + 1);
                        }
                    }
                }
            }
        }
        //Verfica si algún descendiente del nodo tiene un hipercubo declarado
        private algunDescendienteTieneHipercubo(estructura: model.EstructuraFormato): boolean {
            var resultado: boolean = false;

            if (estructura && estructura != null) {
                resultado = this.documentoInstancia.Taxonomia.ConceptosPorId[estructura.IdConcepto].EsHipercubo;
                if (!resultado && estructura.SubEstructuras && estructura.SubEstructuras.length && estructura.SubEstructuras.length > 0) {
                    for (var i = 0; i < estructura.SubEstructuras.length; i++) {
                        resultado = this.algunDescendienteTieneHipercubo(estructura.SubEstructuras[i]);
                        if (resultado) break;
                    }
                }
            }
            return resultado;
        }
        
        //Invoca la preparación de todas las tablas del formato
        public prepararTodasLasEstructurasTabla(): void {
            var self = this;
            //Inicializar los encabezados de las tablas
            for (var idxElemento in this.estructuraDocumento.elementos) {
                //recopilar los hechos que se muestran an la tabla
                var estructura = this.estructuraDocumento.elementos[idxElemento];
                estructura.mostrarElementoDocumento = true;
                if (estructura.tipo == abaxXBRL.directives.TipoElementoDocumento.Tabla) {
                    this.prepararEstructuraTabla(estructura);
                }
            }
        }

        //Prepara la estructura de una tabla calculando los encabezados al realiza el producto cartesiano de las dimensiones
        //Popula la tabla que representa lo que se despliega en pantalla tomando en cuenta los encabezados de las dimensiones de la tabla
        public prepararEstructuraTabla(elementoDocumento: abaxXBRL.directives.ElementoDocumento): void {
            var listaHechos = this.crearMiembrosDimensionesFicticias(elementoDocumento.tabla);
            this.crearEstructuraEncabezadosHipercubo(elementoDocumento.tabla, listaHechos);
            this.crearEstructuraTabla(elementoDocumento.tabla, listaHechos);
            if (!elementoDocumento.tabla.mostrarColumnasVacias) {
                this.depurarColumnasTabla(elementoDocumento.tabla);
            }
            this.agruparEncabezados(elementoDocumento.tabla);
            if (!elementoDocumento.tabla.mostrarRenglonesVacios) {
                this.depurarRenglonesEstructuraDocumento(elementoDocumento);
            }
        }

        //Agrupa los encabezados padres que abrasan el siguiente nivel de identación
        public agruparEncabezados(tabla: abaxXBRL.directives.EstructuraTabla): void {

            for (var idxRenglon = 0; idxRenglon < tabla.encabezado.renglonesEncabezado; idxRenglon++) {
                var renglon = tabla.encabezado.tablaEncabezado[idxRenglon];
                if (renglon) {
                    var colspan = 0;
                    var miembroActual: abaxXBRL.directives.MiembroDimension = null;
                    var colInicioMiembro = 0;
                    for (var iCol = 0; iCol < tabla.encabezado.columnasTotales; iCol++) {

                        if (miembroActual == null) {
                            miembroActual = renglon[iCol].miembroDimension;
                            colInicioMiembro = iCol;
                        } else if (!renglon[iCol].miembroDimension || renglon[iCol].miembroDimension == null || miembroActual != renglon[iCol].miembroDimension ||
                            (miembroActual == renglon[iCol].miembroDimension && this.existeCambioMiembroRenglonAnterior(tabla.encabezado, idxRenglon, iCol))) {
                            //Corte de miembro
                            colspan = iCol - colInicioMiembro;
                            renglon[colInicioMiembro].numeroColumnas = colspan;
                            for (var subCol = colInicioMiembro + 1; subCol <= colInicioMiembro + colspan - 1; subCol++) {
                                //Indicar que las columnas no serán visibles
                                renglon[subCol].visible = false;

                            }
                            //Colocar el indicador de cierre de grupo en la última columna del grupo
                            this.colocarTerminoDeGrupo(tabla.encabezado, idxRenglon, colInicioMiembro + colspan - 1);

                            miembroActual = renglon[iCol].miembroDimension;
                            colInicioMiembro = iCol;
                        }
                    }
                    //Corte de miembro
                    colspan = iCol - colInicioMiembro;
                    if (renglon[colInicioMiembro]) {
                        renglon[colInicioMiembro].numeroColumnas = colspan;
                        for (var subCol = colInicioMiembro + 1; subCol <= colInicioMiembro + colspan - 1; subCol++) {
                            //Indicar que las columnas no serán visibles
                            renglon[subCol].visible = false;
                            //Colocar el indicador de cierre de grupo en la última columna si el colspan es mayor a 1
                            if (colspan > 1 && subCol == colInicioMiembro + colspan - 1) {
                                this.colocarTerminoDeGrupo(tabla.encabezado, idxRenglon, subCol);
                            }
                        }
                    }
                }
            }
        }
        //Verifica si en en renglón anterior al actual, existe un cambio de miembro de la columna actual
        //a la columna anterior
        public existeCambioMiembroRenglonAnterior(encabezado: abaxXBRL.directives.EncabezadoTabla, renglon: number, columna: number): boolean {
            
            //si existe renglón anterior 
            if (renglon > 0 && columna > 0) {

                //Verifica si existe cambio en algún renglón superior al nivel actual
                for (var iRenglon = renglon - 1; iRenglon >= 0; iRenglon--) {
                    var celdaAnterior = encabezado.tablaEncabezado[iRenglon][columna - 1];
                    var celdaActual = encabezado.tablaEncabezado[iRenglon][columna];
                    if (celdaAnterior == null && celdaActual == null) {
                        continue;
                    }

                    if ((celdaActual == null && celdaAnterior != null) || (celdaActual != null && celdaAnterior == null)) {
                        return true;
                    }

                    if ((celdaActual.miembroDimension == null && celdaAnterior.miembroDimension != null) || (celdaActual.miembroDimension != null && celdaAnterior.miembroDimension == null)) {
                        return true;
                    }

                    if (celdaActual.miembroDimension != null && celdaAnterior.miembroDimension != null) {
                        if (celdaActual.miembroDimension.idDimension != celdaAnterior.miembroDimension.idDimension) {
                            return true;
                        }
                        var miembroActual = "";
                        var miembroAnterior = "";
                        if (celdaActual.miembroDimension.elementoMiembroTipificado && celdaActual.miembroDimension.elementoMiembroTipificado != null) {
                            miembroActual = celdaActual.miembroDimension.elementoMiembroTipificado;
                        } else {
                            miembroActual = celdaActual.miembroDimension.idConceptoMiembro;
                        }
                        if (celdaAnterior.miembroDimension.elementoMiembroTipificado && celdaAnterior.miembroDimension.elementoMiembroTipificado != null) {
                            miembroAnterior = celdaAnterior.miembroDimension.elementoMiembroTipificado;
                        } else {
                            miembroAnterior = celdaAnterior.miembroDimension.idConceptoMiembro;
                        }
                        if (miembroActual == miembroAnterior) {
                            continue;
                        } else {
                            return true;
                        }
                    }
                }
            }
            return false;
        }

        //Coloca, desde esta celda, hacia abajo, hasta encontrar otro miembro el indicador de termino de grupo
        public colocarTerminoDeGrupo(encabezado: abaxXBRL.directives.EncabezadoTabla, renglon: number, col: number): void {
            encabezado.tablaEncabezado[renglon][col].presentaTerminoAgrupacion = true;
            for (var renglonActual = renglon + 1; renglonActual < encabezado.renglonesEncabezado; renglonActual++) {
                if (encabezado.tablaEncabezado[renglonActual][col].miembroDimension && encabezado.tablaEncabezado[renglonActual][col].miembroDimension != null) {
                    break;
                }
                encabezado.tablaEncabezado[renglonActual][col].presentaTerminoAgrupacion = true;
            }
        }

        //Quita las columnas que no tienen hechos
        public depurarColumnasTabla(tabla: abaxXBRL.directives.EstructuraTabla): void {
            var tablaEncabezadoFinal: { [row: number]: { [col: number]: abaxXBRL.directives.CeldaTabla; }; } = {};
            var tablaHechosFinal: { [row: number]: { [col: number]: abaxXBRL.directives.CeldaTabla; }; } = {};
            var columnaFinal = 0;
            for (var iRenglon = 0; iRenglon < tabla.encabezado.renglonesEncabezado; iRenglon++) {
                tablaEncabezadoFinal[iRenglon] = {};
                columnaFinal = 0;
                //Crear las columnas por renglon, excepto las columnas sin hechos
                for (var iColumna = 0; iColumna < tabla.encabezado.columnasTotales; iColumna++) {
                    if (tabla.numeroHechosPorColumna[iColumna] > 0) {
                        tablaEncabezadoFinal[iRenglon][columnaFinal] = tabla.encabezado.tablaEncabezado[iRenglon][iColumna];
                        columnaFinal++;
                    }
                }
            }
            //quitar de la tabla de hechos las columnas también
            for (var idxRenglon in tabla.tablaHechos) {
                tablaHechosFinal[idxRenglon] = {};
                columnaFinal = 0;
                for (var iColumna = 0; iColumna < tabla.encabezado.columnasTotales; iColumna++) {
                    if (tabla.numeroHechosPorColumna[iColumna] > 0) {
                        tablaHechosFinal[idxRenglon][columnaFinal] = tabla.tablaHechos[idxRenglon][iColumna];
                        columnaFinal++;
                    }
                }
            }
            tabla.encabezado.columnasTotales = columnaFinal;

            tabla.tablaHechos = tablaHechosFinal;
            tabla.encabezado.tablaEncabezado = tablaEncabezadoFinal;
        }

        /**
        * Identifica los renglones que no tiene hechos y marca como no visible el renglon
        */
        public depurarRenglonesEstructuraDocumento(elementoDocumento: abaxXBRL.directives.ElementoDocumento): void {
            elementoDocumento.mostrarElementoDocumento = true;
            if (elementoDocumento.tipo == abaxXBRL.directives.TipoElementoDocumento.Tabla) {
                elementoDocumento.mostrarElementoDocumento = false;
                for (var i = 0; i < elementoDocumento.tabla.renglones.length; i++) {
                    var hechosRenglon = elementoDocumento.tabla.tablaHechos[i];
                    var tieneHechosRenglon = false;
                    for (var iCol = 0; iCol < elementoDocumento.tabla.encabezado.columnasTotales; iCol++) {
                        var celda = elementoDocumento.tabla.tablaHechos[i][iCol];
                        if ((celda.hechosEnCelda && celda.hechosEnCelda.length > 0)) {
                            tieneHechosRenglon = true;
                            elementoDocumento.mostrarElementoDocumento = true;
                            break;
                        }
                        if (elementoDocumento.tabla.renglones[i].EsAbstracto) {
                            tieneHechosRenglon = true;
                        }
                    }

                    if (!tieneHechosRenglon) {
                        elementoDocumento.tabla.renglones[i].visible = false;
                    }
                }
            }
        }
        /**
        * Crea una estructura tabular donde coloca en la celda correspondiente con el concepto del renglon
        * y la combinación de dimensiones de la columna los hechos que corresponden
        */
        public crearEstructuraTabla(tabla: abaxXBRL.directives.EstructuraTabla, listaHechos: Array<model.Hecho>): void {

            var hechosPorColumna: { [col: number]: number; } = {};
            var ultimoRenglonConHechos = 0;
            var ultimoColumnaConHechos = 0;
            tabla.tablaHechos = {};

            for (var numRenglon = 0; numRenglon < tabla.renglones.length; numRenglon++) {
                tabla.tablaHechos[numRenglon] = {};
            }

            for (var iCol = 0; iCol < tabla.encabezado.columnasTotales; iCol++) {
                hechosPorColumna[iCol] = 0;
                var dimensiones = tabla.encabezado.obtenerDimensionesColumna(iCol);

                for (var numRenglon = 0; numRenglon < tabla.renglones.length; numRenglon++) {

                    tabla.tablaHechos[numRenglon][iCol] = new abaxXBRL.directives.CeldaTabla();
                    tabla.tablaHechos[numRenglon][iCol].hechosEnCelda = new Array<model.Hecho>();

                    for (var idx in listaHechos) {
                        var hecho = listaHechos[idx];
                        if (tabla.renglones[numRenglon].idConcepto == hecho.IdConcepto &&
                            this.correspondeHechoADimensiones(hecho, dimensiones, tabla.encabezado, tabla.renglones[numRenglon])) {

                            ultimoRenglonConHechos = numRenglon;
                            ultimoColumnaConHechos = iCol;
                            hechosPorColumna[iCol] = hechosPorColumna[iCol] + 1;

                            tabla.tablaHechos[numRenglon][iCol].hechosEnCelda.push(hecho);
                            tabla.tablaHechos[numRenglon][iCol].hechoMostrado = hecho;
                            tabla.tablaHechos[numRenglon][iCol].visible = true;
                            tabla.tablaHechos[numRenglon][iCol].esUltimoHecho = false;
                            //this.$scope.ultimoHecho = hecho;

                        }
                    }

                }
            }
            tabla.numeroHechosPorColumna = hechosPorColumna;
            if (tabla.tablaHechos[ultimoRenglonConHechos] && tabla.tablaHechos[ultimoRenglonConHechos][ultimoColumnaConHechos]) {
                tabla.tablaHechos[ultimoRenglonConHechos][ultimoColumnaConHechos].esUltimoHecho = true;
            }
        }

        /**
        * Verifica si un hecho tiene correspondencia con la lista de dimensiones enviada
        */
        public correspondeHechoADimensiones(hecho: model.Hecho, miembros: Array<abaxXBRL.directives.MiembroDimension>, encabezado: abaxXBRL.directives.EncabezadoTabla, renglonTabla: abaxXBRL.directives.RenglonTabla): boolean {
            var ctx: model.Contexto = null;
            if (hecho.IdContexto && this.documentoInstancia.ContextosPorId[hecho.IdContexto]) {
                ctx = this.documentoInstancia.ContextosPorId[hecho.IdContexto];
            }
            for (var idxDim in miembros) {
                var miembro = miembros[idxDim];
                var dimension = encabezado.dimensionesPorId[miembro.idDimension];
                var listaMiembrosGrupo = new Array<abaxXBRL.directives.MiembroDimension>();
                listaMiembrosGrupo.push(miembro);
                if (miembro.miembrosAgrupados && miembro.miembrosAgrupados != null && miembro.miembrosAgrupados.length && miembro.miembrosAgrupados.length > 0) {
                    for (var id = 0; id < miembro.miembrosAgrupados.length; id++) {
                        //Si están agrupadas fechas
                        if (dimension.idConceptoEje == abaxXBRL.directives.InformacionDimension.ID_DIMENSION_TIEMPO) {

                            if (renglonTabla.rolEtiqueta && renglonTabla.rolEtiqueta == "http://www.xbrl.org/2003/role/periodStartLabel") {
                                //Si la etiqueta es de inicio de periodo agregar al grupo si la fecha es de inicio
                                var fechaInicioInstante = moment(miembro.miembrosAgrupados[id].informacionExtra["FechaInstante"]).add(1, "days").toDate();
                                if (miembro.informacionExtra["FechaInicio"].getTime() == fechaInicioInstante.getTime()) {
                                    listaMiembrosGrupo.push(miembro.miembrosAgrupados[id]);
                                }
                            } else if (renglonTabla.rolEtiqueta && renglonTabla.rolEtiqueta == "http://www.xbrl.org/2003/role/periodEndLabel") {
                                //Si la etiqueta es de fin de periodo agregar al grupo si la fecha es de final
                                if (miembro.informacionExtra["FechaFin"].getTime() == miembro.miembrosAgrupados[id].informacionExtra["FechaInstante"].getTime()) {
                                    listaMiembrosGrupo.push(miembro.miembrosAgrupados[id]);
                                }
                            } else {
                                //Si no, agregar al grupo
                                listaMiembrosGrupo.push(miembro.miembrosAgrupados[id]);
                            }
                        } else {
                            listaMiembrosGrupo.push(miembro.miembrosAgrupados[id]);
                        }
                    }
                }
                var correspondeADimension = false;
                for (var id = 0; id < listaMiembrosGrupo.length; id++) {
                    miembro = listaMiembrosGrupo[id];
                    correspondeADimension = correspondeADimension ||
                    this.correspondeContextoAMiembro(dimension, ctx, miembro);
                }
                if (!correspondeADimension) {
                    return false;
                }
            }
            return true;
        }
        //Verifica si el contexto enviado corresponde al miembro de dimensión enviado como parámetro
        public correspondeContextoAMiembro(dimension: abaxXBRL.directives.InformacionDimension, ctx: model.Contexto, miembro: abaxXBRL.directives.MiembroDimension): boolean {

            if (dimension && dimension.tipo == abaxXBRL.directives.TipoDimension.Ficticia && dimension.idConceptoEje == abaxXBRL.directives.InformacionDimension.ID_DIMENSION_TIEMPO && ctx != null) {
                var periodoColumna = new model.Periodo();
                periodoColumna.Tipo = miembro.informacionExtra["Tipo"];
                periodoColumna.FechaFin = miembro.informacionExtra["FechaFin"];
                periodoColumna.FechaInicio = miembro.informacionExtra["FechaInicio"];
                periodoColumna.FechaInstante = miembro.informacionExtra["FechaInstante"];
                if (!ctx.Periodo.EstructuralmenteIgual(periodoColumna)) {
                    return false;
                }
            }

            if (dimension && dimension.tipo == abaxXBRL.directives.TipoDimension.Ficticia && dimension.idConceptoEje == abaxXBRL.directives.InformacionDimension.ID_DIMENSION_ENTIDAD && ctx != null) {
                if (!(ctx.Entidad.EsquemaId == miembro.informacionExtra["EsquemaId"] && ctx.Entidad.IdEntidad == miembro.informacionExtra["IdEntidad"])) {
                    return false;
                }
            }

            if (dimension && dimension.tipo == abaxXBRL.directives.TipoDimension.Real && ctx != null) {
                var esDefault = false;
                if (this.documentoInstancia.Taxonomia.DimensionDefaults[dimension.idConceptoEje] &&
                    this.documentoInstancia.Taxonomia.DimensionDefaults[dimension.idConceptoEje] != null &&
                    this.documentoInstancia.Taxonomia.DimensionDefaults[dimension.idConceptoEje] == miembro.idConceptoMiembro) {
                    esDefault = true;
                }

                if (!esDefault) {
                    if (!this.existeMiembroEnContexto(ctx, miembro)) {
                        return false;
                    }
                } else {
                    //Si es default, verificar que el hecho no tenga la dimensión en su contexto
                    if (this.existeDimensionEnContexto(ctx, dimension)) {
                        return false;
                    }
                }
            }
            return true;
        }

        /**
        * Verifica si el miembro de la dimensión existe en los valores dimensionales del contexto
        */
        public existeMiembroEnContexto(contexto: model.Contexto, miembro: abaxXBRL.directives.MiembroDimension) {
            var dimensionesContexto = new Array<model.DimensionInfo>();
            if (contexto.ValoresDimension && contexto.ValoresDimension.length) {
                for (var idx in contexto.ValoresDimension) {
                    dimensionesContexto.push(contexto.ValoresDimension[idx]);
                }
            }
            if (contexto.Entidad.ValoresDimension && contexto.Entidad.ValoresDimension.length) {
                for (var idx in contexto.Entidad.ValoresDimension) {
                    dimensionesContexto.push(contexto.Entidad.ValoresDimension[idx]);
                }
            }
            for (var idx in dimensionesContexto) {
                var dimInfo = dimensionesContexto[idx];
                if (dimInfo.IdDimension == miembro.idDimension) {
                    if (dimInfo.Explicita) {
                        if (dimInfo.IdItemMiembro == miembro.idConceptoMiembro) {
                            return true;
                        }
                    } else {
                        if (dimInfo.ElementoMiembroTipificado == miembro.elementoMiembroTipificado) {
                            return true;
                        }
                    }
                }
            }
            return false;
        }
        /**
        * Verifica si la dimensión existe en los valores dimensionales del contexto
        */
        public existeDimensionEnContexto(contexto: model.Contexto, infoDimensionBuscada: abaxXBRL.directives.InformacionDimension) {
            var dimensionesContexto = new Array<model.DimensionInfo>();
            if (contexto.ValoresDimension && contexto.ValoresDimension.length) {
                for (var idx in contexto.ValoresDimension) {
                    dimensionesContexto.push(contexto.ValoresDimension[idx]);
                }
            }
            if (contexto.Entidad.ValoresDimension && contexto.Entidad.ValoresDimension.length) {
                for (var idx in contexto.Entidad.ValoresDimension) {
                    dimensionesContexto.push(contexto.Entidad.ValoresDimension[idx]);
                }
            }
            for (var idx in dimensionesContexto) {
                var dimInfo = dimensionesContexto[idx];
                if (dimInfo.IdDimension == infoDimensionBuscada.idConceptoEje) {
                    return true;
                }
            }
            return false;
        }

        /***
        * Crea la estructura de encabezados para mostrar la tabla ya sea un hipercubo o una tabla 
        */
        public crearEstructuraEncabezadosHipercubo(tabla: abaxXBRL.directives.EstructuraTabla, listaHechos: Array<model.Hecho>) {
            //calcular columnas y renglones
            var columnasTotales = 1;
            var renglonesTotales = 0;
            for (var idxDim in tabla.encabezado.dimensiones) {
                var dimensionInfo = tabla.encabezado.dimensiones[idxDim];
                var columnasDimensionActual = 0;
                var renglonesDimension = 0;
                for (var idxMiembro in dimensionInfo.miembros) {
                    var miembro = dimensionInfo.miembros[idxMiembro];
                    if (miembro.visible) {
                        columnasDimensionActual++;
                    }
                    if (miembro.indentacion > renglonesDimension) {
                        renglonesDimension = miembro.indentacion;
                    }
                }
                columnasTotales = columnasTotales * columnasDimensionActual;
                renglonesTotales += renglonesDimension + 1;
                dimensionInfo.profundidad = renglonesDimension + 1;
            }
            tabla.encabezado.columnasTotales = columnasTotales;
            tabla.encabezado.renglonesEncabezado = renglonesTotales;

            var dimensionesOrdenadas = tabla.encabezado.dimensiones.sort(function (dimA: abaxXBRL.directives.InformacionDimension, dimB: abaxXBRL.directives.InformacionDimension): number {
                return dimA.orden - dimB.orden;
            });

            //recorrer las dimensiones del encabezado en el orden dado
            //console.log("Dimensiones ordenadas");
            //console.log(dimensionesOrdenadas);
            var coordenadaActual = new abaxXBRL.directives.CoordenadaTabla();
            coordenadaActual.col = 0;
            coordenadaActual.row = 0;

            var tablaEncabezado: { [row: number]: { [col: number]: abaxXBRL.directives.CeldaTabla; }; } = {};
            for (var iRow = 0; iRow < tabla.encabezado.renglonesEncabezado; iRow++) {
                tablaEncabezado[iRow] = {};
                for (var iCol = 0; iCol < tabla.encabezado.columnasTotales; iCol++) {
                    //tablaEncabezado[iRow][iCol] = null;
                    tablaEncabezado[iRow][iCol] = new abaxXBRL.directives.CeldaTabla();
                    tablaEncabezado[iRow][iCol].visible = true;
                    tablaEncabezado[iRow][iCol].numeroColumnas = 1;
                    tablaEncabezado[iRow][iCol].presentaTerminoAgrupacion = false;
                }
            }

            this.crearRenglonesEncabezado(dimensionesOrdenadas, dimensionesOrdenadas[0].subEstructuraOrigen.SubEstructuras, coordenadaActual, tablaEncabezado, 0);
            tabla.encabezado.tablaEncabezado = tablaEncabezado;
            
            /*for (var iR = 0; iR < tabla.encabezado.renglonesEncabezado; iR++){
                var str = "";
                for (var iC = 0; iC < tabla.encabezado.columnasTotales; iC++){ 
                str +=
                (tablaEncabezado[iR][iC].miembroDimension && tablaEncabezado[iR][iC].miembroDimension != null ? tablaEncabezado[iR][iC].miembroDimension.idConceptoMiembro : " ")
                    + ";";
                }
                console.log(str);
            }*/
        }



        public crearMiembrosDimensionesFicticias(tabla: abaxXBRL.directives.EstructuraTabla): Array<model.Hecho> {
            var self = this;
            var listaConceptosTabla = new Array<string>();
            for (var idxRenglon in tabla.renglones) {
                var renglon = tabla.renglones[idxRenglon];
                listaConceptosTabla.push(renglon.idConcepto);
            }
            var listaHechos = AngularJQueryBridge.getInstance().obtenerAbaxService().obtenerHechosEnDocumentoPorIdConceptos(listaConceptosTabla);
            var fechas = AngularJQueryBridge.getInstance().obtenerAbaxService().obtenerDiferentesFechasDeHechos(listaHechos);
            var entidades = AngularJQueryBridge.getInstance().obtenerAbaxService().obtenerDiferentesEntidadesDeHechos(listaHechos);
            //console.log(fechas);
            //console.log(entidades);
            for (var idxDim in tabla.encabezado.dimensiones) {
                var dimensionInfo = tabla.encabezado.dimensiones[idxDim];

                if (dimensionInfo.tipo == abaxXBRL.directives.TipoDimension.Ficticia) {
                    if (dimensionInfo.idConceptoEje == abaxXBRL.directives.InformacionDimension.ID_DIMENSION_TIEMPO) {

                        for (var idxFecha in fechas) {
                            var fecha = fechas[idxFecha];
                            var miembroFecha = new abaxXBRL.directives.MiembroDimension();
                            miembroFecha.idDimension = dimensionInfo.idConceptoEje;
                            miembroFecha.informacionExtra = {};
                            miembroFecha.miembrosAgrupados = new Array<abaxXBRL.directives.MiembroDimension>();
                            miembroFecha.informacionExtra["Tipo"] = fecha.Tipo;
                            miembroFecha.informacionExtra["FechaInicio"] = fecha.FechaInicio;
                            miembroFecha.informacionExtra["FechaFin"] = fecha.FechaFin;
                            miembroFecha.informacionExtra["FechaInstante"] = fecha.FechaInstante;
                            miembroFecha.indentacion = 0;
                            miembroFecha.visible = true;
                            miembroFecha.idConceptoMiembro = idxFecha;
                            miembroFecha.esDimensionFicticia = true;
                            miembroFecha.titulo = fecha.Tipo == model.Periodo.INSTANTE ? moment(fecha.FechaInstante).utc().format('YYYY-MM-DD') :
                                moment(fecha.FechaInicio).utc().format('YYYY-MM-DD') + " - " + moment(fecha.FechaFin).utc().format('YYYY-MM-DD');
                            dimensionInfo.miembros[miembroFecha.idConceptoMiembro] = miembroFecha;
                        }
                        if (fechas.length == 0) {
                            //Agregar un miembro default
                            var miembroFecha = new abaxXBRL.directives.MiembroDimension();
                            miembroFecha.idDimension = dimensionInfo.idConceptoEje;
                            miembroFecha.informacionExtra = {};
                            miembroFecha.informacionExtra["Tipo"] = "";
                            miembroFecha.informacionExtra["FechaInicio"] = "";
                            miembroFecha.informacionExtra["FechaFin"] = "";
                            miembroFecha.informacionExtra["FechaInstante"] = "";
                            miembroFecha.indentacion = 0;
                            miembroFecha.visible = true;
                            miembroFecha.idConceptoMiembro = "abax_sin_contexto";
                            miembroFecha.tieneContextoIndefinido = true;
                            miembroFecha.titulo = "Sin Fechas";
                            dimensionInfo.miembros[miembroFecha.idConceptoMiembro] = miembroFecha;
                        }

                        if (tabla.agruparFechas) {
                            //Agrupar las fechas: los miembros de fecha de tipo instante se pueden agrupar con los periodos si:
                            //la fecha instante es igual a la fecha fin del periodo o 
                            //la fecha instante es igual a la fecha de inicio del periodo - 1 día
                            this.agruparDimensionFecha(dimensionInfo);
                        }

                    }
                    if (dimensionInfo.idConceptoEje == abaxXBRL.directives.InformacionDimension.ID_DIMENSION_ENTIDAD) {
                        for (var idxEntidad in entidades) {
                            var entidad = entidades[idxEntidad];
                            var miembroEntidad = new abaxXBRL.directives.MiembroDimension();
                            miembroEntidad.idDimension = dimensionInfo.idConceptoEje;
                            miembroEntidad.informacionExtra = {};
                            miembroEntidad.informacionExtra["EsquemaId"] = entidad.EsquemaId;
                            miembroEntidad.informacionExtra["IdEntidad"] = entidad.IdEntidad;
                            miembroEntidad.indentacion = 0;
                            miembroEntidad.visible = true;
                            miembroEntidad.titulo = entidad.IdEntidad;
                            miembroEntidad.esDimensionFicticia = true;
                            miembroEntidad.idConceptoMiembro = idxEntidad;
                            dimensionInfo.miembros[miembroEntidad.idConceptoMiembro] = miembroEntidad;
                        }
                        if (entidades.length == 0) {
                            //Agregar un miembro default
                            var miembroEntidad = new abaxXBRL.directives.MiembroDimension();
                            miembroEntidad.idDimension = dimensionInfo.idConceptoEje;
                            miembroEntidad.informacionExtra = {};
                            miembroEntidad.informacionExtra["EsquemaId"] = "";
                            miembroEntidad.informacionExtra["IdEntidad"] = "";
                            miembroEntidad.indentacion = 0;
                            miembroEntidad.visible = true;
                            miembroEntidad.titulo = "Sin Entidades";
                            miembroEntidad.idConceptoMiembro = "abax_sin_contexto";
                            miembroEntidad.tieneContextoIndefinido = true;
                            dimensionInfo.miembros[miembroEntidad.idConceptoMiembro] = miembroEntidad;
                        }
                    }
                }
            }
            return listaHechos;
        }

        /** Agrupa los periodos de instante que corresponden al inicio o fin de alguna duración */
        public agruparDimensionFecha(dimensionFecha: abaxXBRL.directives.InformacionDimension): void {
            var miembrosAgrupados: { [id: string]: abaxXBRL.directives.MiembroDimension; } = {};
            for (var idxMiembro in dimensionFecha.miembros) {
                var miembroFecha = dimensionFecha.miembros[idxMiembro];
                //intentar agrupar los miembros
                for (var idxMiembroAgrupar in dimensionFecha.miembros) {
                    var miembroAgrupar = dimensionFecha.miembros[idxMiembroAgrupar];
                    if (this.puedeAgruparMiembro(miembroFecha, miembroAgrupar)) {
                        miembrosAgrupados[idxMiembroAgrupar] = miembroAgrupar;
                        miembroFecha.miembrosAgrupados.push(miembroAgrupar);
                    }
                }
            }
            var miembrosFinales: { [id: string]: abaxXBRL.directives.MiembroDimension; } = {};
            for (var idxMiembro in dimensionFecha.miembros) {
                if (!miembrosAgrupados[idxMiembro]) {
                    miembrosFinales[idxMiembro] = dimensionFecha.miembros[idxMiembro];
                }
            }
            dimensionFecha.miembros = miembrosFinales;
        }
        /// Verifica si el miembro a agrupar puede ser agrupado dentro del miembro fecha
        public puedeAgruparMiembro(miembroFecha: abaxXBRL.directives.MiembroDimension, miembroAAgrupar: abaxXBRL.directives.MiembroDimension): boolean {
            if (miembroFecha.informacionExtra && miembroFecha.informacionExtra["Tipo"] &&
                miembroAAgrupar.informacionExtra && miembroAAgrupar.informacionExtra["Tipo"]) {
                if (miembroFecha.informacionExtra["Tipo"] == model.Periodo.DURACION &&
                    miembroAAgrupar.informacionExtra["Tipo"] == model.Periodo.INSTANTE) {
                    //Si el miembro a agrupar está al final del periodo: se agrupa
                    if (miembroFecha.informacionExtra["FechaFin"].getTime() == miembroAAgrupar.informacionExtra["FechaInstante"].getTime()) {
                        return true;
                    }
                    //Si el miembro a agrupar está un dia antes del inicio del periodo, se agrupa
                    var fechaInicioInstante = moment(miembroAAgrupar.informacionExtra["FechaInstante"]).add(1, "days").toDate();
                    if (miembroFecha.informacionExtra["FechaInicio"].getTime() == fechaInicioInstante.getTime()) {
                        return true;
                    }

                }
            }
            return false;
        }

        public crearRenglonesEncabezado(dimensiones: Array<abaxXBRL.directives.InformacionDimension>, estructuras: Array<model.EstructuraFormato>, coordenadas: abaxXBRL.directives.CoordenadaTabla,
            tablaEncabezado: { [row: number]: { [col: number]: abaxXBRL.directives.CeldaTabla; }; }, dimActual: number): void {
            var dimension = dimensiones[dimActual];


            if (dimension.tipo == abaxXBRL.directives.TipoDimension.Real) {

                for (var idExs in estructuras) {
                    var rowInicial = coordenadas.row;
                    var colInicial = coordenadas.col;
                    var colInicioMiembroPadre = -1;

                    var miembro = estructuras[idExs];
                    var infoMiembro = dimension.miembros[miembro.IdConcepto];
                    var nodoHoja = true;
                    if (miembro.SubEstructuras && miembro.SubEstructuras != null && miembro.SubEstructuras.length > 0) {
                        coordenadas.row += 1;
                        this.crearRenglonesEncabezado(dimensiones, miembro.SubEstructuras, coordenadas, tablaEncabezado, dimActual);
                        nodoHoja = false;
                    }

                    if (infoMiembro.visible) {
                        //Siguiente dimension
                        if (dimActual + 1 < dimensiones.length) {
                            //Avanzar y tantas posiciones como indentación le haga falta el padre
                            coordenadas.row = rowInicial + dimension.profundidad - dimension.miembros[miembro.IdConcepto].indentacion;
                            colInicioMiembroPadre = coordenadas.col;

                            this.crearRenglonesEncabezado(dimensiones, dimensiones[dimActual + 1].subEstructuraOrigen.SubEstructuras, coordenadas, tablaEncabezado, dimActual + 1);
                            nodoHoja = false;
                        }
                    }


                    if (infoMiembro.visible || !nodoHoja) {
                        //Sea o no nodo hoja, si es la última dimensión se avanza la columna 
                        if (colInicioMiembroPadre == -1) {
                            coordenadas.col++;
                        }

                        var colspan = coordenadas.col - colInicial;
                        var rowspan = coordenadas.row - rowInicial;
                        for (var iCol = colInicial; iCol <= colInicial + colspan - 1; iCol++) {
                            tablaEncabezado[rowInicial][iCol] = new abaxXBRL.directives.CeldaTabla();
                            tablaEncabezado[rowInicial][iCol].visible = true;
                            tablaEncabezado[rowInicial][iCol].miembroDimension = dimension.miembros[miembro.IdConcepto];
                            tablaEncabezado[rowInicial][iCol].miembroDimension.titulo = miembro.IdConcepto;
                            tablaEncabezado[rowInicial][iCol].numeroColumnas = 1;
                            tablaEncabezado[rowInicial][iCol].rowspan = dimension.profundidad - dimension.miembros[miembro.IdConcepto].indentacion + 1;
                        }
                        coordenadas.row = rowInicial;
                    }
                }
            } else {
                //Dimensiones ficticias
                for (var idExs in dimension.miembros) {
                    var miembroFicticio = dimension.miembros[idExs];
                    if (miembroFicticio.visible) {
                        var colInicial = coordenadas.col;
                        var rowInicial = coordenadas.row;
                        //Siguiente dimension
                        if (dimActual + 1 < dimensiones.length) {
                            //Avanzar y tantas posiciones como indentación le haga falta el padre
                            coordenadas.row += dimension.profundidad - dimension.miembros[miembroFicticio.idConceptoMiembro].indentacion;
                            this.crearRenglonesEncabezado(dimensiones, dimensiones[dimActual + 1].subEstructuraOrigen.SubEstructuras, coordenadas, tablaEncabezado, dimActual + 1);
                        } else {
                            coordenadas.col++;
                        }
                        var colspan = coordenadas.col - colInicial;
                        var rowspan = coordenadas.row - rowInicial;
                        for (var iCol = colInicial; iCol <= colInicial + colspan - 1; iCol++) {

                            tablaEncabezado[rowInicial][iCol] = new abaxXBRL.directives.CeldaTabla();
                            tablaEncabezado[rowInicial][iCol].visible = true;
                            tablaEncabezado[rowInicial][iCol].miembroDimension = miembroFicticio;
                            tablaEncabezado[rowInicial][iCol].numeroColumnas = 1;

                        }
                        coordenadas.row = rowInicial;
                    }
                }
            }
        }
    }


}