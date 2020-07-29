module abaxXBRL.shared.modelos {
    /** 
    * Contrato que define un elemento enviado.
    **/
    export interface IDocumentoInstanciaEnviado {
        /** Identificador unico del identificador del documento instancia*/
        Id: string;
        /** Clave de la emisora que se ha enviado*/
        Emisora: string;
        /** Ejercicio del documento instancia enviado*/
        Ejercicio: string;
        /** Periodo del documento instancia enviado*/
        Periodo: string;
        /** Descripción del documento instancia enviado*/
        Descripcion: string;
        /** Fecha de recepcion del documento instancia enviado*/
        FechaRecepcion: string;

        /** Taxonomia*/
        Taxonomia: TaxonomiaXbrlDto;
        /**
        * Identificador de la taxonomía
        **/
        IdTaxonomiaXbrl: number;

        /** Nombre del archivo de envío*/
        NombreArchivo: string;

        /**
        * Nombre de la periodicidad del documento actual.
        **/
        Periodicidad: string;
        /**
        * Fecha del periodo reportado por el documento de instancia.
        **/
        FechaReporte?: Moment;
        /**
        * Texto del periodo que será mostrado en pantalla.
        **/
        TextoPeriodo?: string;


        /** Dts documentos de entrada de la taxonomia*/
        DtsDocumento?: Array<IDtsDocumentoInstanciaEnviado>;

    }
}