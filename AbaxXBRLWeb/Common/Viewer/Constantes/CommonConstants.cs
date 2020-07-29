using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace AbaxXBRLCore.Common.Constants
{
    /// <summary>
    /// Constantes comunes a todo el módulo.
    /// <author>José Antonio Huizar Moreno</author>
    /// <version>1.0</version>
    /// </summary>
    public class CommonConstants
    {
        /// <summary>
        /// Accion auditable para el login del sitio
        /// </summary>
        public const string SeparadorNombreCalificado = ":";
        /// <summary>
        /// Extensión de archivo zip
        /// </summary>
        public const string ExtensionZIP = ".zip";
        /// <summary>
        /// Extensión de archivo XBRL
        /// </summary>
        public const string ExtensionXBRL = ".xbrl";
        /// <summary>
        /// Extensión de archivo XML
        /// </summary>
        public const string ExtensionXML = ".xml";
        /// <summary>
        /// Siglas de lenguaje español
        /// </summary>
        public const string LenguajeEsp = "es";
        /// <summary>
        /// Diferentes representaciones de un valor verdadero
        /// </summary>
        public static string[] CADENAS_VERDADERAS = new String[]{"si","true","verdadero","1","yes"};
        /// <summary>
        /// Diferentes representaciones de un valor falso
        /// </summary>
        public static string[] CADENAS_FALSE = new String[] {"no","false","falso","0","no"};
        /// <summary>
        /// Cadena para exportar valores verdaderos
        /// </summary>
        public static string SI = "Si";
        /// <summary>
        /// Cadena para exportar valores falsos
        /// </summary>
        public static string NO = "No";

        
        /// <summary>
        /// Tipo de archivo que indica es un XLS
        /// </summary>
        public static string TipoArchivoXLS="1";

        /// <summary>
        /// Tipo de archivo que indica es un PDF
        /// </summary>
        public static string TipoArchivoPDF = "2";

        /// <summary>
        /// Tipo de archivo que indica es un XBRL
        /// </summary>
        public static string TipoArchivoXBRL = "3";

        /// <summary>
        /// Tipo de archivo que indica es un json
        /// </summary>
        public static string TipoArchivoJSON = "4";

        /// <summary>
        /// Tipo de archivo que indica es un ZIP
        /// </summary>
        public static string TipoArchivoXbrlZip = "5";

        /// <summary>
        /// Tipo de archivo que indica es un DOC
        /// </summary>
        public static string TipoArchivoWord = "6";



    }
}
