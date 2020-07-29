using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AbaxXBRLViewerWeb.Common.Aplication.Dto
{
    /// <summary>
    /// Dto con la informacion de un archivo documento instancia
    /// </summary>
    public class ArchivoDocumentoInstanciaDto
    {
        /// <summary>
        /// Identificador unico del archivo documento instancia
        /// </summary>
        public long IdArchivoDocumentoInstancia { get; set; }

        /// <summary>
        /// IUdentificador del documento instancia
        /// </summary>
        public long IdDocumentoInstancia { get; set; }


        /// <summary>
        /// Tipo de archivo que se visualiza
        /// </summary>
        public long IdTipoArchivo { get; set; }

        /// <summary>
        /// Informacion del archivo
        /// </summary>
        public byte[] Archivo { get; set; }
    }
}
