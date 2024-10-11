#ifndef  __sgDefs__
#define  __sgDefs__


#define   SG_PLATFORM_WINDOWS     0
#define   SG_PLATFORM_MAC         1
#define   SG_PLATFORM_IOS         2
#define   SG_PLATFORM_ANDROID     3
#define   SG_PLATFORM_LINUX       4

//#define     PLATFORM_64

#ifdef _WIN64
     #define     SG_CURRENT_PLATFORM     SG_PLATFORM_WINDOWS
     #define     PLATFORM_64
#elif _WIN32
   #define   SG_CURRENT_PLATFORM     SG_PLATFORM_WINDOWS
#elif __APPLE__
    #include "TargetConditionals.h"
    #if TARGET_OS_IPHONE && TARGET_IPHONE_SIMULATOR
        #define   SG_CURRENT_PLATFORM     SG_PLATFORM_IOS
    #elif TARGET_OS_IPHONE
        #define   SG_CURRENT_PLATFORM     SG_PLATFORM_IOS
    #else
        #define   TARGET_OS_OSX 1
        #define   SG_CURRENT_PLATFORM     SG_PLATFORM_MAC
    #endif
#elif __linux 
    #define   SG_CURRENT_PLATFORM     SG_PLATFORM_LINUX
#endif

#if (SG_CURRENT_PLATFORM==SG_PLATFORM_WINDOWS)
	#ifndef sgCore_API
	#define  sgCore_API __declspec(dllimport)
	#else
	#undef   sgCore_API
	#define  sgCore_API __declspec(dllexport)
	#endif
   // #define  sgCore_API
#else
   #define     PLATFORM_64
   #define     sgCore_API
#endif

#if (SG_CURRENT_PLATFORM==SG_PLATFORM_IOS || SG_CURRENT_PLATFORM==SG_PLATFORM_ANDROID ||  SG_CURRENT_PLATFORM==SG_PLATFORM_LINUX)
    typedef   float   sgFloat;
#else
    typedef   long double  sgFloat;
#endif


struct  sgCore_API SG_POINT
{
  sgFloat x;
  sgFloat y;
  sgFloat z;
  SG_POINT()
  {
        x = 0.0;   y = 0.0;    z = 0.0;
  }
  SG_POINT(sgFloat pX, sgFloat pY, sgFloat pZ)
  {
        x = pX;   y = pY;    z = pZ;
  }
} ;

#define  SG_VECTOR   SG_POINT

struct SG_LINE
{
  SG_POINT  p1;
  SG_POINT  p2;
};

typedef  void*       SG_OBJ_HANDLE;
typedef  void(*SG_DRAW_LINE_FUNC)(SG_POINT*,SG_POINT*);

struct  SG_USER_DYNAMIC_DATA
{
  virtual void Finalize()   =0;
};



void*    sgPrivateAccess(int, void*, void*);
#define  PRIVATE_ACCESS   friend void* sgPrivateAccess(int, void*, void*);



#endif
