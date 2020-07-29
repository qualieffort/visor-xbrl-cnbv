
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
        /// Obtiene el �ltimo identificador insertado en la BD asociado con esta conecci�n.
        /// </summary>
        /// <returns>el �ltimo identificador insertado en la BD asociado con esta conecci�n.</returns>
        long obtenerUltimoIdInsertado();
    }
}

