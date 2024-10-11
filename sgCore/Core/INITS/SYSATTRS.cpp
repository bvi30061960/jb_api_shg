#include "../sg.h"

void InitSysAttrs(void);

IDENT_V id_Density;  				
IDENT_V id_Material; 					
IDENT_V id_TextureScaleU; 		
IDENT_V id_TextureScaleV; 		
IDENT_V	id_TextureShiftU; 		
IDENT_V id_TextureShiftV; 		
IDENT_V	id_TextureAngle; 	
IDENT_V	id_Smooth;
IDENT_V	id_MixColor; 					
IDENT_V	id_UVType; 						
IDENT_V	id_TextureMult; 			
IDENT_V	id_LookNum = 0; 			

IDENT_V	id_ProtoInfo; 				 

IDENT_V id_Mass;						
IDENT_V id_XCenterMass;				
IDENT_V id_YCenterMass;				
IDENT_V id_ZCenterMass;				
IDENT_V id_Layer = 0;					

sgFloat	Default_Density = 1000.;	

IDENT_V	 id_Name; 			
IDENT_V	 id_TypeID;
IDENT_V  id_SmoothNormals;

static  IDENT_V RegSysAttrFloat(char *Name, char* text, UCHAR Size, short Prec, WORD AddStatus, long double val)
{
	sgFloat  num;
    long double   tmpDouble;   // for ANDROID;
    
	void*   adr;
	IDENT_V id;

    tmpDouble = val;   // for ANDROID;
    num = (sgFloat)tmpDouble;             // for ANDROID;
    adr = (void*)&num;
		
    id = create_sys_attr(Name, text, ATTR_sgFloat, Size, Prec, AddStatus, adr);

    return id;
}

static  IDENT_V RegSysAttrString(char *Name, char* text, UCHAR Size, short Prec, WORD AddStatus, const char* val)
{
    sgFloat  num;
    long double   tmpDouble;   // for ANDROID;
    
    void*   adr;
    IDENT_V id;

    adr = (void*)val;
    
    id = create_sys_attr(Name, text, ATTR_STR, Size, Prec, AddStatus, adr);
    
    return id;
}

void InitSysAttrs(void)
{

/*  
	ATTR_STR        //  
	ATTR_sgFloat     // 
	ATTR_BOOL       // 
	ATTR_TEXT       // 
*/

/* 
	ATT_SYSTEM      // 
	ATT_RGB         //   GOLORREF
	ATT_PATH        //    
	ATT_ENUM        // 
*/


/*	id_Density = RegSysAttr("$Density", "Density",
									ATTR_sgFloat, 10, 3, ATT_SYSTEM|ATT_ENUM, Default_Density);
*/
	id_Material = RegSysAttrFloat((char*)"$1M", (char*)"1M", 10, 3, ATT_SYSTEM|ATT_ENUM, -1.);

	id_TextureScaleU = RegSysAttrFloat((char*)"$2M", (char*)"2M", 10, 3, ATT_SYSTEM|ATT_ENUM, 1.);

	id_TextureScaleV = RegSysAttrFloat((char*)"$3M", (char*)"3M", 10, 3, ATT_SYSTEM|ATT_ENUM, 1.);

	id_TextureShiftU = RegSysAttrFloat((char*)"$4M", (char*)"4M", 10, 3, ATT_SYSTEM|ATT_ENUM, 0.);

	id_TextureShiftV = RegSysAttrFloat((char*)"$5M", (char*)"5M", 10, 3, ATT_SYSTEM|ATT_ENUM, 0.);

	id_TextureAngle = RegSysAttrFloat((char*)"$6M", (char*)"6M", 10, 3, ATT_SYSTEM|ATT_ENUM, 0.);

	id_Smooth = RegSysAttrFloat((char*)"$7M", (char*)"7M", 10, 3, ATT_SYSTEM|ATT_ENUM, 1.);

	id_MixColor = RegSysAttrFloat((char*)"$8M", (char*)"8M",10, 3, ATT_SYSTEM|ATT_ENUM, 3.);

	id_UVType = RegSysAttrFloat((char*)"$9M", (char*)"9M",10, 3, ATT_SYSTEM|ATT_ENUM, 1.);

	id_TextureMult = RegSysAttrFloat((char*)"$10M", (char*)"10M",10, 3, ATT_SYSTEM|ATT_ENUM, 1.);

	id_Name = RegSysAttrString((char*)"$Name", (char*)"Name", SG_OBJ_NAME_MAX_LEN, 3, ATT_SYSTEM, 0);
	id_TypeID = RegSysAttrString((char*)"$TypeID", (char*)"TypeID", 39, 3, ATT_SYSTEM, 0);

	id_SmoothNormals = RegSysAttrFloat((char*)"$SmthOb", (char*)"SmthOb", 10, 3, ATT_SYSTEM | ATT_ENUM, 1.);

    
}


