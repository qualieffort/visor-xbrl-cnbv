using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace AbaxXBRLViewerWeb.Common.Aplication.Dto
{
    /// <summary>
    /// DTO con la información general del registro de una taxonomía XBRL.
    /// </summary>
    public class TaxonomiaXbrlDto
    {
        /// <summary>
        /// Identificador del registro en base de datos.
        /// </summary>
        public long IdTaxonomiaXbrl {get; set;}
        /// <summary>
        /// Nombre de la taxonomía. 
        /// </summary>
        public string Nombre {get; set;}
        /// <summary>
        /// Espacio de nombres principal de la taxonomía.
        /// </summary>
        public string EspacioNombresPrincipal {get; set;}
        /// <summary>
        /// Identificador de la periodicidad con la que se reporta la información.
        /// </summary>
        public int IdPeriodicidadReporte { get; set; }
    }
}