﻿module abaxXBRL {
    /**
    * Clase con los diccionarios de equivalencia para los caracteres especiales.
    **/
    export class AbaxXBRLCaracteresEspeciales
    {
        /**
        * Diccionario con los caracteres equivalentes a la clave HTML indicada.
        **/
        public static HTMLCaracter: { [claveHTML: string]: string } = {
            "&ndash;": "–",
            "&mdash;": "—",
            "&iexcl;": "¡",
            "&iquest;": "¿",
            "&quot;": "\"",
            "&ldquo;": "“",
            "&rdquo;": "”",
            "&lsquo;": "‘",
            "&rsquo;": "’",
            "&laquo;": "«",
            "&raquo;": "»",
            "&nbsp;": " ",
            "&amp;": "&",
            "&cent;": "¢",
            "&copy;": "©",
            "&divide;": "÷",
            "&gt;": ">",
            "&lt;": "<",
            "&micro;": "µ",
            "&middot;": "·",
            "&para;": "¶",
            "&plusmn;": "±",
            "&euro;": "€",
            "&pound;": "£",
            "&reg;": "®",
            "&sect;": "§",
            "&trade;": "™",
            "&yen;": "¥",
            "&deg;": "°",
            "&aacute;": "á",
            "&Aacute;": "Á",
            "&agrave;": "à",
            "&Agrave;": "À",
            "&acirc;": "â",
            "&Acirc;": "Â",
            "&aring;": "å",
            "&Aring;": "Å",
            "&atilde;": "ã",
            "&Atilde;": "Ã",
            "&auml;": "ä",
            "&Auml;": "Ä",
            "&aelig;": "æ",
            "&AElig;": "Æ",
            "&ccedil;": "ç",
            "&Ccedil;": "Ç",
            "&eacute;": "é",
            "&Eacute;": "É",
            "&egrave;": "è",
            "&Egrave;": "È",
            "&ecirc;": "ê",
            "&Ecirc;": "Ê",
            "&euml;": "ë",
            "&Euml;": "Ë",
            "&iacute;": "í",
            "&Iacute;": "Í",
            "&igrave;": "ì",
            "&Igrave;": "Ì",
            "&icirc;": "î",
            "&Icirc;": "Î",
            "&iuml;": "ï",
            "&Iuml;": "Ï",
            "&ntilde;": "ñ",
            "&Ntilde;": "Ñ",
            "&oacute;": "ó",
            "&Oacute;": "Ó",
            "&ograve;": "ò",
            "&Ograve;": "Ò",
            "&ocirc;": "ô",
            "&Ocirc;": "Ô",
            "&oslash;": "ø",
            "&Oslash;": "Ø",
            "&otilde;": "õ",
            "&Otilde;": "Õ",
            "&ouml;": "ö",
            "&Ouml;": "Ö",
            "&szlig;": "ß",
            "&uacute;": "ú",
            "&Uacute;": "Ú",
            "&ugrave;": "ù",
            "&Ugrave;": "Ù",
            "&ucirc;": "û",
            "&Ucirc;": "Û",
            "&uuml;": "ü",
            "&Uuml;": "Ü",
            "&yuml;": "ÿ"
        };

        /**
        * Diccionario con la clave HTML por caracter.
        **/
        public static CaracterHtml: { [caracter: string]: string } = {
            "–": '&ndash;',
            "—": '&mdash;',
            "¡": '&iexcl;',
            "¿": '&iquest;',
            "\"": '&quot;',
            "“": '&ldquo;',
            "”": '&rdquo;',
            "‘": '&lsquo;',
            "’": '&rsquo;',
            "«": '&laquo;',
            "»": '&raquo;',
            " ": '&nbsp;',
            "&": '&amp;',
            "¢": '&cent;',
            "©": '&copy;',
            "÷": '&divide;',
            ">": '&gt;',
            "<": '&lt;',
            "µ": '&micro;',
            "·": '&middot;',
            "¶": '&para;',
            "±": '&plusmn;',
            "€": '&euro;',
            "£": '&pound;',
            "®": '&reg;',
            "§": '&sect;',
            "™": '&trade;',
            "¥": '&yen;',
            "°": '&deg;',
            "á": '&aacute;',
            "Á": '&Aacute;',
            "à": '&agrave;',
            "À": '&Agrave;',
            "â": '&acirc;',
            "Â": '&Acirc;',
            "å": '&aring;',
            "Å": '&Aring;',
            "ã": '&atilde;',
            "Ã": '&Atilde;',
            "ä": '&auml;',
            "Ä": '&Auml;',
            "æ": '&aelig;',
            "Æ": '&AElig;',
            "ç": '&ccedil;',
            "Ç": '&Ccedil;',
            "é": '&eacute;',
            "É": '&Eacute;',
            "è": '&egrave;',
            "È": '&Egrave;',
            "ê": '&ecirc;',
            "Ê": '&Ecirc;',
            "ë": '&euml;',
            "Ë": '&Euml;',
            "í": '&iacute;',
            "Í": '&Iacute;',
            "ì": '&igrave;',
            "Ì": '&Igrave;',
            "î": '&icirc;',
            "Î": '&Icirc;',
            "ï": '&iuml;',
            "Ï": '&Iuml;',
            "ñ": '&ntilde;',
            "Ñ": '&Ntilde;',
            "ó": '&oacute;',
            "Ó": '&Oacute;',
            "ò": '&ograve;',
            "Ò": '&Ograve;',
            "ô": '&ocirc;',
            "Ô": '&Ocirc;',
            "ø": '&oslash;',
            "Ø": '&Oslash;',
            "õ": '&otilde;',
            "Õ": '&Otilde;',
            "ö": '&ouml;',
            "Ö": '&Ouml;',
            "ß": '&szlig;',
            "ú": '&uacute;',
            "Ú": '&Uacute;',
            "ù": '&ugrave;',
            "Ù": '&Ugrave;',
            "û": '&ucirc;',
            "Û": '&Ucirc;',
            "ü": '&uuml;',
            "Ü": '&Uuml;',
            "ÿ": '&yuml;'
        };

        public static CaracterXML: { [caracter: string]: string } = {
            '"': "&quot;",
            "'": "&apos;",
            "<": "&lt;",
            ">": "&gt;",
            "&": "&amp;",
        }

        public static XMLCaracter: { [caracter: string]: string } = {
            "&quot;": '"',
            "&apos;": "'",
            "&lt;": "<",
            "&gt;": ">",
            "&amp;": "&",
        }
    }
} 