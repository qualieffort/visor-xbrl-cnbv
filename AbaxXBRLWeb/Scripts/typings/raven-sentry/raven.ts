/**
* Mapeo local del servicio para el manejo de excepsiones de Raven.
* @author Oscar Ernesto Loyla Sánchez.
**/
interface IRaven {
    /**
    * Obtiene una excpesión y la envia a sentry.
    * @param exception Excepsión ocurrida.
    * @param data Diccionario con información adicional del error.
    **/
    captureException(exception: any, data?: any): void;
    /**
    * Asigna el contexto de usuario para el reporteo de errores.
    *@param userContext Obejeto con los datos del contexto de usuario.
    **/
    setUserContext(userContext: any): void;
} 
/**
* Declaramos la variable para acceder a los métodos de Raven.
**/
declare var Raven: IRaven;