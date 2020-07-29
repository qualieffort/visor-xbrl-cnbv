using System.Data;

namespace AbaxXBRLViewerWeb.Common.Util
{
    public class DbUtil
    {
        /// <summary>
        /// Indica si un campo esta presente en los resultados de una consulta a la base de datos.
        /// </summary>
        /// <param name="reader">El objeto con los resultados de la consulta</param>
        /// <param name="fieldName">Campo (nombre o alias de la columna) a buscar en los resultados de la consulta</param>
        /// <returns>True si esta presente y no es null, false en caso contrario</returns>
        public static bool FieldExists(IDataReader reader, string fieldName)
        {
            reader.GetSchemaTable().DefaultView.RowFilter = string.Format("ColumnName= '{0}'", fieldName);
            return (reader.GetSchemaTable().DefaultView.Count > 0 && !reader.IsDBNull(reader.GetOrdinal(fieldName)));
        }
    }
}
