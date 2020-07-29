
namespace AbaxXBRLViewerWeb.Common.Integration.Dao
{
    /// <summary>
    /// Interfaz de negocio que define las operaciones base para las clases DAO.
    /// <author>Christian E. Badillo Martinez - 2H Software</author>
    /// <version>1.0</version>
    /// </summary>
    public interface IBaseDAO
    {
        /// <summary>
        /// Obtiene el último identificador insertado en la BD asociado con esta conección.
        /// </summary>
        /// <returns>el último identificador insertado en la BD asociado con esta conección.</returns>
        long obtenerUltimoIdInsertado();
    }
}

