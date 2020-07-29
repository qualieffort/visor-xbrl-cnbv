using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace AbaxXBRLViewerWeb.Common.Aplication.Dto
{
    public class DocumentoInstanciaDto
    {
        public long IdDocumentoInstancia { get; set; }
        public string Titulo { get; set; }
        public string RutaArchivo { get; set; }
        public Nullable<System.DateTime> FechaCreacion { get; set; }
        public long IdEmpresa { get; set; }
        public bool EsCorrecto { get; set; }
        public bool Bloqueado { get; set; }
        public Nullable<long> IdUsuarioBloqueo { get; set; }
        public Nullable<long> IdUsuarioUltMod { get; set; }
        public Nullable<System.DateTime> FechaUltMod { get; set; }
        public Nullable<int> UltimaVersion { get; set; }
        public string GruposContextosEquivalentes { get; set; }
        public string ParametrosConfiguracion { get; set; }
        public string EspacioNombresPrincipal { get; set; }
        /// <summary>
        /// Identificador de la taxonomía del documento de instancia.
        /// </summary>
        public long IdTaxonomiaXbrl { get; set; }
        public string ClaveEmisora { get; set; }
        public Nullable<int> Anio { get; set; }
        public string Trimestre { get; set; }
        /// <summary>
        /// Identificador de la periodicidad del reporte.
        /// </summary>
        public int IdPeriodicidadReporte { get; set; }
        /// <summary>
        /// Periodo reportado en el documento de instancia.
        /// </summary>
        public Nullable<DateTime> FechaReporte { get; set; }

        /// <summary>
        /// Nombre de la taxonomía a la que pertenece este documento.
        /// </summary>
        public string Taxonomia { get; set; }
        /// <summary>
        /// Nombre de la entidad a la que se esta reportando.
        /// </summary>
        public string NombreEntidadReporte { get; set; }
        
    }
}
