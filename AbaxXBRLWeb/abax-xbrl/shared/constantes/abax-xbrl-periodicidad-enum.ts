module abaxXBRL {

    /**
    * Enumerador de las periodicidades exisntentes.
    * @author Oscar Ernesto Loyola Sánchez
    **/
    export enum PeriodicidadReporteEnum {

        /**
        * Información reportada cada tres meses
        **/
        Trimestral = 1,
        /**
        * Información reportada cada mes
        **/
        Mensual = 2,
        /**
        * Información reportada cada año
        **/
        Anual = 3,
        /**
        * Información reportada cada que ocurre algún evento
        **/
        PorEvento = 4
    }
}