module abaxXBRL.shared.modelos {
    /** 
    * Contrato que define los elementos de una entidad empresa.
    **/
    export interface IEmpresa {
        /**Identificador de la entidad. **/
        IdEmpresa?: number;
        /**Razon social con la que fue registrada la empresa. **/
        RazonSocial?: string;
        /**Nombre corto de la empresa **/
        NombreCorto?: string;
        /**Registro federal de causantes con el que fue registrada la empresa. **/
        RFC?: string;
        /**Domicilio en el que esta registrada la empresa. **/
        DomicilioFiscal?: string;
        /**Si es un registro borrado de la BD. **/
        Borrado?: boolean;
    }
}  