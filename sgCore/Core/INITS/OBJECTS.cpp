#include "../sg.h"

EL_OBJTYPE  EPOINT,
            ELINE,
            ECIRCLE,
            EARC,
            EBREP,
            ESPLINE;

void RegCoreObjects(void)
{
  RegCoreObjType(OTEXT,       /*"Text"*/     (char*)"1GFR",       sizeof(GEO_TEXT),    OLD_OTEXT,       NULL,     TRUE);
	RegCoreObjType(OPOINT,     /* "Point"*/  (char*)"GRQF4",      sizeof(GEO_POINT),   OLD_OPOINT,      &EPOINT,  TRUE);
	RegCoreObjType(OLINE,      /* "Line"*/   (char*)"RYEI",       sizeof(GEO_LINE),    OLD_OLINE,       &ELINE,   TRUE);
	RegCoreObjType(OCIRCLE,    /* "Circle"*/ (char*)"ETIWVK",     sizeof(GEO_CIRCLE),  OLD_OCIRCLE,     &ECIRCLE, TRUE);
	RegCoreObjType(OARC,       /* "Arc"*/    (char*)"OQP",        sizeof(GEO_ARC),     OLD_OARC,        &EARC,    TRUE);
	RegCoreObjType(OPATH,     /*  "Path"*/   (char*)"JRYE",       sizeof(GEO_PATH),    OLD_OPATH,       NULL,     FALSE);
	RegCoreObjType(OBREP,     /*  "BRep"*/   (char*)"QNRE",       sizeof(GEO_BREP),    OLD_OBREP,       &EBREP,   FALSE);
	RegCoreObjType(OGROUP,    /*  "Group"*/  (char*)"PPEOR",      sizeof(GEO_GROUP),   OLD_OGROUP,      NULL,     FALSE);
	RegCoreObjType(ODIM,      /*  "Dim"*/    (char*)"EMT",        sizeof(GEO_DIM),     OLD_ODIM,        NULL,     TRUE);
	RegCoreObjType(OINSERT,   /*  "Insert"*/ (char*)"NTYREW",     sizeof(GEO_INSERT),  OLD_OINSERT,     NULL,     FALSE);
	RegCoreObjType(OSPLINE,   /*  "Spline"*/ (char*)"QOREEE",     sizeof(GEO_SPLINE),  OLD_OSPLINE,     &ESPLINE, TRUE);
	RegCoreObjType(OFRAME,   /*   "Frame"*/  (char*)"*H4F46",      sizeof(GEO_FRAME),   OLD_OFRAME,      NULL,     FALSE);
}


