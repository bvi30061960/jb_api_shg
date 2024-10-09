#ifndef   __sgCore__
#define  __sgCore__

#include "sgDefs.h"

/*#if (SG_CURRENT_PLATFORM==SG_PLATFORM_MAC)
	#pragma GCC visibility push(default)
    #pragma pack(1)
#endif

#pragma pack(push, 1) */

#if (SG_CURRENT_PLATFORM==SG_PLATFORM_WINDOWS)
    #pragma pack(push, 1)
#else
	#pragma GCC diagnostic push
	#pragma GCC diagnostic ignored "-Wpragma-pack"
	#pragma pack(push)
	#pragma pack(1)
#endif

#include "sgErrors.h"
#include "sgMatrix.h"
#include "sgSpaceMath.h"
#include "sgObject.h"
#include "sg2D.h"
#include "sgGroup.h"
#include "sg3D.h"

#include "sgScene.h"
#include "sgAlgs.h"


#include "sgTD.h"
#include "sgIApp.h"
#include "sgFileManager.h"

sgCore_API    bool   sgInitKernel(const char* temp_directory = 0);
sgCore_API    void   sgFreeKernel(bool show_memleaks=true);
sgCore_API    void   sgGetVersion(int& major, int& minor, int& release, int& build);
/****************************************************************/
/*************************************************************************************/

/*#if (SG_CURRENT_PLATFORM==SG_PLATFORM_MAC)
	#pragma GCC visibility pop
#endif

#pragma pack( pop )*/

#if (SG_CURRENT_PLATFORM==SG_PLATFORM_WINDOWS)
    #pragma pack( pop )
#else
	#pragma pack(pop)
	#pragma GCC diagnostic pop
#endif


#endif    // __sgCore__
