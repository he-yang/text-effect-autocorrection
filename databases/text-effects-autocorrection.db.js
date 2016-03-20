/*
 * text-effect-autocorrection
 * https://help.wtsolutions.cn
 *
 * Copyright (c) 2016 He Yang <he.yang @ wtsolutions.cn>
 * Licensed under the MIT license
 */


var databases={
		standard:[
			{ s1: "[0-9][xX][0-9]",s1Opt:{ matchWildCards: true }, s2:"[xX]",s2Opt:{ matchWildCards: true },to: "×"},
			{ s1: "excel", s1Opt:{}, to: "Excel"}
		],
		unit:[
            { s1: "[0-9][mM][gG]/[lL]",s1Opt:{ matchWildCards: true }, s2:"mg/L",s2Opt:{ matchCase: false }, to:"mg/L"},
            { s1: "[0-9] [mM][gG]/[lL]",s1Opt:{ matchWildCards: true }, s2:"mg/L",s2Opt:{ matchCase: false }, to:"mg/L"},
            { s1: "[0-9][kK][wW]",s1Opt:{ matchWildCards: true }, s2:"kw",s2Opt:{ matchCase: false }, to: "kW"},
            { s1: "[0-9] [kK][wW]",s1Opt:{ matchWildCards: true }, s2:"kw",s2Opt:{ matchCase: false }, to: "kW"},
            { s1: "[0-9][kK][nN]",s1Opt:{ matchWildCards: true }, s2:"kn",s2Opt:{ matchCase: false }, to: "kN"},
            { s1: "[0-9] [kK][nN]",s1Opt:{ matchWildCards: true }, s2:"kn",s2Opt:{ matchCase: false }, to: "kN"},
            { s1: "[0-9][hH][aA]",s1Opt:{ matchWildCards: true }, s2:"ha",s2Opt:{ matchCase: false }, to: "ha"},
            { s1: "[0-9] [hH][aA]",s1Opt:{ matchWildCards: true }, s2:"ha",s2Opt:{ matchCase: false }, to: "ha"},
            { s1: "[0-9][mM][pP][aA]",s1Opt:{ matchWildCards: true }, s2:"mpa",s2Opt:{ matchCase: false }, to: "MPa"},            
            { s1: "[0-9] [mM][pP][aA]",s1Opt:{ matchWildCards: true }, s2:"mpa",s2Opt:{ matchCase: false }, to: "MPa"},            
            { s1: "[0-9][mM][lL]",s1Opt:{ matchWildCards: true }, s2:"ml",s2Opt:{ matchCase: false }, to: "mL"},
            { s1: "[0-9] [mM][lL]",s1Opt:{ matchWildCards: true }, s2:"ml",s2Opt:{ matchCase: false }, to: "mL"},
			{ s1: "[mM][23]",s1Opt:{ matchWildCards: true }, s2: "M",s2Opt:{matchCase: true}, to: "m"},
			{ s1: "[mM][23]",s1Opt:{ matchWildCards: true }, s2: "[23]",s2Opt:{ matchWildCards: true }, to: "superscript"},
            { s1: "[mM]3/[aAdDhHsS]",s1Opt:{ matchWildCards: true }, s2: "3",s2Opt:{ matchWildCards: true }, to: "superscript"},			
			{ s1: "(mg/l)", s1Opt:{}, to: "(mg/L)"},
			{ s1: "(kw)", s1Opt:{}, to: "(kW)"},
			{ s1: "(kn)", s1Opt:{}, to: "(kN)"},
			{ s1: "(ha)", s1Opt:{}, to: "(ha)"},
			{ s1: "(mpa)", s1Opt:{}, to: "(MPa)"},
			{ s1: "(ml)", s1Opt:{}, to: "(mL)"},
			{ s1: "db(A)", s1Opt:{}, to: "dB(A)"},
			{ s1: "(kn/m)", s1Opt:{}, to: "(kN/m)"},
		],
		chemical:[
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
            { s1: "BOD5",s1Opt:{}, s2: "5",s2Opt:{}, to: "subscript"},
            { s1: "KMnO4",s1Opt:{}, s2: "4",s2Opt:{}, to: "subscript"},
            { s1: "CaCO3",s1Opt:{}, s2: "3",s2Opt:{}, to: "subscript"},
            { s1: "Al2O3",s1Opt:{}, s2: "[23]",s2Opt:{}, to: "subscript"},
            { s1: "NaClO[2-3]", s1Opt:{ matchWildCards: true },s2: "[2-3]",s2Opt:{}, to: "subscript"},
		],
		water:[
            { s1: "[dD][nN][0-9]",s1Opt:{ matchWildCards: true }, s2:"dn",s2Opt:{ matchCase: false },to: "DN"},
            { s1: "[dD][eE][0-9]",s1Opt:{ matchWildCards: true }, s2:"de",s2Opt:{ matchCase: false },to: "de"},
			{ s1: "[pP][hH] [0-9]",s1Opt:{ matchWildCards: true }, s2:"ph",s2Opt:{ matchCase: false },to: "pH"},
			{ s1: "[pP][hH][0-9]",s1Opt:{ matchWildCards: true }, s2:"ph",s2Opt:{ matchCase: false },to: "pH"},
			{ s1: "CODMn",s1Opt:{ matchCase: false }, s2: "Mn",s2Opt:{ matchCase: false }, to: "subscript"},
			{ s1: "CODMn",s1Opt:{ matchCase: false }, s2: "cod",s2Opt:{ matchCase: false }, to: "COD"},
            { s1: "CODCr",s1Opt:{ matchCase: false }, s2: "Cr",s2Opt:{ matchCase: false }, to: "subscript"},
            { s1: "CODCr",s1Opt:{ matchCase: false }, s2: "cod",s2Opt:{ matchCase: false }, to: "COD"},
            { s1: "ntu",s1Opt:{ matchCase: false }, to: "NTU"},
			{ s1: "L/m2[`.]s", s1Opt:{ matchWildCards: true }, s2: "2" , s2Opt:{}, to: "superscript"},
			{ s1: "L/m2[`.]s", s1Opt:{ matchWildCards: true }, s2: "[`.]" , s2Opt:{ matchWildCards: true }, to: "·"},
			{ s1: "[lL][*xX][bB]", s1Opt:{ matchWildCards: true }, s2: "[*xX]" , s2Opt:{ matchWildCards: true }, to: "×"},
			{ s1: "[bB][*xX][hH]", s1Opt:{ matchWildCards: true }, s2: "[*xX]" , s2Opt:{ matchWildCards: true }, to: "×"},
        ]
	}