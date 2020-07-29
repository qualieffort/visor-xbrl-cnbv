module abaxXBRL.shared.modelos {

    /**
    * DTO con la información general del registro de una taxonomía XBRL.
    **/
    export class TaxonomiaXbrlDto implements Serializable<TaxonomiaXbrlDto> {


        /**
        * Identificador del registro en base de datos.
        **/
        public IdTaxonomiaXbrl: number;
        /**
        * Nombre de la taxonomía.
        **/
        public Nombre: string;
        /**
        * Espacio de nombres principal de la taxonomía.
        **/
        public EspacioNombresPrincipal: string;
        /**
        * Identificador de la periodicidad con la que se reporta la información.
        **/
        public IdPeriodicidadReporte: number;

        /**
        * Deserializa un elemento de entrada a un objeto del tipo TaxonomiaXbrlDto.
        * @param input Elemento a deserializar.
        * @return Objeto del tipo TaxonomiaXbrlDto con la infomración extraida del elemento de entrada.
        **/
        public deserialize(input: any): TaxonomiaXbrlDto {

            this.IdTaxonomiaXbrl = input.IdTaxonomiaXbrl;
            this.Nombre = input.Nombre;
            this.EspacioNombresPrincipal = input.EspacioNombresPrincipal;
            this.IdPeriodicidadReporte = input.IdPeriodicidadReporte;

            return this;
        }

    }

}