#include "../../sg.h"
#pragma argsused
BOOL o_copy_obj(hOBJ hobjin, hOBJ * hobjout, char * path)
{
	char nametmp[144];
	BOOL cod = FALSE;
	BUFFER_DAT bd;
	{
  /*	char Buffer[MAX_PATH];  // address of buffer for temp. path
	  GetTempPath(MAX_PATH, Buffer );
    GetTempFileName(Buffer, "mrph", 0, nametmp);
  */
	
#if (SG_CURRENT_PLATFORM==SG_PLATFORM_IOS)
		strcpy(nametmp, tempnam("/usr/temp","mrph"));   // for ANDROID
#else
	#if (SG_CURRENT_PLATFORM==SG_PLATFORM_WINDOWS)
		char Buffer[MAX_PATH]; 	// address of buffer for temp. path
		GetTempPathA(MAX_PATH, Buffer );
		GetTempFileNameA(Buffer, "mrph", 0, nametmp);
	#else
		strcpy(nametmp, tempnam(global_temparary_directory,"mrph"));
	#endif
#endif

	}

	*hobjout = NULL;
	appl_init();
	if (!init_buf(&bd,nametmp,BUF_NEWINMEM)) {
		return FALSE;
	}
	if ( !o_save_obj(&bd,hobjin) ) 	{
		goto err;
	}

	if ( !seek_buf(&bd,0) ) 		 {
		goto err;
	}
	if ( !o_load_obj(&bd,hobjout) ) {
		goto err;
	}
	cod = TRUE;
err:
	close_buf(&bd);
	if ( *hobjout && !cod )	o_free(*hobjout,NULL);
//	nb_unlink(name);
	nb_unlink(nametmp);
	return cod;
}
