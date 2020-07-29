module abaxXBRL.shared.modelos {
    
    /**
     * Definición del contrato para la deserialización de un objeto JSON a su equivalente en TS.
     *
     * @author José Antonio Huizar Moreno
     * @version 1.0
     */
    export interface Serializable<T> {
        /**
        * Deserializa un objecto JS a su equivalente Typescript
        * @param input el objeto JS a deserializar
        * @return el objeto deserializado de tipo Typescript
        */
        deserialize(input: Object): T;
    }
}