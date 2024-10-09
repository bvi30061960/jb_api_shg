#include "../sg.h"

#if (SG_CURRENT_PLATFORM==SG_PLATFORM_ANDROID || SG_CURRENT_PLATFORM==SG_PLATFORM_LINUX)
    #include <locale>           // for ANDROID
    static std::locale loc;     // for ANDROID
#endif

//
// maxlen -    name  0
void auto_name(const char * prefix, char * name, short maxlen)
{
	short  i,j,len;
	int num = 0;
	char number_txt[14];

	len = strlen(prefix);
	i = 0;
	if ( len ) {
		for ( i=len-1; i >= 0; i--){
            #if (SG_CURRENT_PLATFORM!=SG_PLATFORM_ANDROID && SG_CURRENT_PLATFORM!=SG_PLATFORM_LINUX)
                if ( isdigit(prefix[i] ) ) continue;
            #else
                if ( std::isdigit(prefix[i], loc ) ) continue;    //  for ANDROID
            #endif
			break;
		}
		i++;
		if ( i != len )   num = atol(&prefix[i] );   //  
	}
	num++;
	//ltoa(num,number_txt,10);
	memcpy(name,prefix,i);
	len = strlen(number_txt);
	j = len;
	if ( len+i >= maxlen ) j = maxlen - i - 1;
	memcpy(&name[i],&number_txt[len-j],j);
	name[j + i ] =0;
}
