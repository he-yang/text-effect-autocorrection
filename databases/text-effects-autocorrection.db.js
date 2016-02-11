var databases={		
		water:[
		//unit
            { s1: "[0-9]* [mM][gG]/[lL]",s1Opt:{ matchWildCards: true }, s2:"mg/L",s2Opt:{ matchCase: false }, to:"mg/L"},
            { s1: "[0-9]* [kK][wW]",s1Opt:{ matchWildCards: true }, s2:"kw",s2Opt:{ matchCase: false }, to: "kW"},
            { s1: "[0-9]* [kK][nN]",s1Opt:{ matchWildCards: true }, s2:"kn",s2Opt:{ matchCase: false }, to: "kN"},
            { s1: "[0-9]* [hH][aA]",s1Opt:{ matchWildCards: true }, s2:"ha",s2Opt:{ matchCase: false }, to: "ha"},
            { s1: "[0-9]* [mM][pP][aA]",s1Opt:{ matchWildCards: true }, s2:"mpa",s2Opt:{ matchCase: false }, to: "MPa"},            
            { s1: "[0-9]* [mM][lL]",s1Opt:{ matchWildCards: true }, s2:"ml",s2Opt:{ matchCase: false }, to: "mL"},
		//mark
            { s1: "*",s1Opt:{},to: "×"},
		//abbr
		      	{ s1: "cod",s1Opt:{ matchCase: false }, to: "COD"},
            { s1: "ss",s1Opt:{ matchCase: false }, to: "SS"},
            { s1: "[dD][nN][0-9]@",s1Opt:{ matchWildCards: true }, s2:"dn",s2Opt:{ matchCase: false },to: "DN"},
            { s1: "[dD][eE][0-9]@",s1Opt:{ matchWildCards: true }, s2:"de",s2Opt:{ matchCase: false },to: "de"},
		      	{ s1: "[pP][hH][0-9]@",s1Opt:{ matchWildCards: true }, s2:"ph",s2Opt:{ matchCase: false },to: "pH"},
		//chemical compound
            { s1: "m[23]/[dhs]",s1Opt:{ matchWildCards: true }, s2: "[23]",s2Opt:{ matchWildCards: true }, to: "subscript"},
            { s1: "H2O",s1Opt:{}, s2: "2",s2Opt:{}, to: "subscript"},
            { s1: "NH3",s1Opt:{}, s2: "3",s2Opt:{}, to: "subscript"},
            { s1: "PO43-",s1Opt:{}, s2: "4",s2Opt:{}, to: "subscript"},
            { s1: "PO43-",s1Opt:{}, s2: "3-",s2Opt:{}, to: "superscript"},
            { s1: "SO42-",s1Opt:{}, s2: "4",s2Opt:{}, to: "subscript"},
            { s1: "SO42-",s1Opt:{}, s2: "2-",s2Opt:{}, to: "superscript"},
            { s1: "Ca2+",s1Opt:{}, s2: "2+",s2Opt:{}, to: "superscript"},
            { s1: "Mg2+",s1Opt:{}, s2: "2+",s2Opt:{}, to: "superscript"},
            { s1: "F-",s1Opt:{}, s2: "-",s2Opt:{}, to: "superscript"},
            { s1: "Cl-",s1Opt:{}, s2: "-",s2Opt:{}, to: "superscript"},
            { s1: "CODMn",s1Opt:{}, s2: "Mn",s2Opt:{}, to: "subscript"},
            { s1: "CODCr",s1Opt:{}, s2: "Cr",s2Opt:{}, to: "subscript"},
            { s1: "BOD5",s1Opt:{}, s2: "5",s2Opt:{}, to: "subscript"},
            { s1: "KMnO4",s1Opt:{}, s2: "4",s2Opt:{}, to: "subscript"},
            { s1: "NaClO[2-3]", s1Opt:{ matchWildCards: true },s2: "[2-3]",s2Opt:{}, to: "subscript"},
		
        ]
	}
