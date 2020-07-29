module abaxXBRL.shared.modelos {

    /**
    * Elemento para un arreglo de opciones de un capo de selección.
    **/
    export class OptionItemDto implements Serializable<OptionItemDto> {

        /**
        * Valor de la opción
        */
        public Value: string;

        /**
        * Etiqueta de la opción.
        **/
        public Label: string;

        /**
        * Deserializa un elemennto de entrada aun objeto OptionItemDto.
        * @param input Elemento con la información a deserializar.
        * @return Objeto de tipo OptionItemDto con la información deserializada.
        **/
        public deserialize(input: any): OptionItemDto {

            this.Value = input.Value;
            this.Label = input.Label;

            return this;
        }

    }

}