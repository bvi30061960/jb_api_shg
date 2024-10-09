#include "../sg.h"

//#if (SG_CURRENT_PLATFORM==SG_PLATFORM_WINDOWS)
//int  nMEM_TRACE_LEVEL = 0;
//#else
int  nMEM_TRACE_LEVEL = 2;
//#endif


BOOL bINHOUSE_VERSION = FALSE;         
//---------------------------------------------------------------

BOOL (*pExtStartupInits)(void) = NULL;

void (*pExtFreeAllMem)(void) = NULL;

void (*pExtSyntaxInit)(void) = NULL;

void (*pExtActionsInit)(void) = NULL;

void (*pExtRegObjects)(void) = NULL;

void (*pExtRegCommonMethods)(void) = NULL;

void (*pExtInitObjMetods)(void) = NULL;

void (*pExtConfigPars)(void) = NULL;

void (*pExtSysAttrs)(void) = NULL;


BOOL (*pExtBeforeRunCmdLoop)(void) = NULL;

BOOL (*pExtBeforeNew)(void) = NULL;
BOOL (*pExtAfterNew)(void) = NULL;
BOOL (*pExtReLoadCSG)(hOBJ hobj, hCSG *hcsg) = NULL;

