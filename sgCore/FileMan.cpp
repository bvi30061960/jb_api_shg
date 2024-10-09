#include "CORE//sg.h"

bool sgFileManager::Save(const sgCScene*, const char* file_name, 
						 const void* userData, unsigned long userDataSize, bool selected)
{
    return RealSaveModel(const_cast<char*>(file_name), (selected)?TRUE:FALSE,userData, userDataSize);
}

bool sgFileManager::ExportDXF(const sgCScene*, const char* file_name)
{
  return export_3d_to_dxf(const_cast<char*>(file_name));
}

bool sgFileManager::ExportSTL(const sgCScene*, const char* file_name)
{
	return export_3d_to_stl(const_cast<char*>(file_name));
}

bool sgFileManager::GetFileHeader(const char* file_name, sgFileManager::SG_FILE_HEADER& file_header)
{
	FILE* fl = NULL;

	try
	{
		fl = fopen(file_name,"r");
	}
	catch(...)
	{
		return false;
	}

	if (!fl)
		return false;

	sgFileManager::SG_FILE_HEADER tmpFH;

	try
	{ 
		if (!fread(&tmpFH,sizeof(sgFileManager::SG_FILE_HEADER),1,fl))
		{
			fclose(fl);
			return false;
		}
	}
	catch(...)
	{
		fclose(fl);
		return false;
	}

	fclose(fl);

	if (!strcmp(tmpFH.signature,SG_FILE_SIGNATURE))
	{
		file_header = tmpFH;
		return true;
	}
	return false;
}

bool  sgFileManager::GetUserData(const char* file_name, void* usetData)
{
	if (file_name==NULL || usetData==NULL || usetData==NULL)
		return false;

	FILE* fl = NULL;

	try
	{
		fl = fopen(file_name,"r");
	}
	catch(...)
	{
		return false;
	}

	if (!fl)
		return false;

	sgFileManager::SG_FILE_HEADER tmpFH;

	try
	{ 
		if (!fread(&tmpFH,sizeof(sgFileManager::SG_FILE_HEADER),1,fl))
		{
			fclose(fl);
			return false;
		}
	}
	catch(...)
	{
		fclose(fl);
		return false;
	}

	if (!strcmp(tmpFH.signature,SG_FILE_SIGNATURE))
	{
		if (tmpFH.userBlockSize==0)
		{
			fclose(fl);
			return false;
		}
		if (!fread(usetData,tmpFH.userBlockSize,1,fl))
		{
			fclose(fl);
			return false;
		}
		fclose(fl);
		return true;
	}
	return false;
}

bool sgFileManager::Open(const sgCScene*, const char* file_name)
{
  INIT_PROGRESSER(2, "Open file");
  if (append_from_file(const_cast<char*>(file_name), TRUE, NULL, TRUE)!=G_OK)
  {
    STOP_PROGRESSER();
    return false;
  }

  {
    hOBJ  htail, hobj;

    htail = objects.hhead;
    hobj = htail;

    int scSz = objects.num;
    int curCnt=0;
	PROGRESS(0, "");
    while (hobj)
    {
      sgCObject* ooo = ObjectFromHandle(hobj);
/*      if (ooo->GetAttribute(SG_OA_LAYER)>=scene_layers.size())
      {
        scene_layers.clear();
        for (unsigned char i=0;i<=ooo->GetAttribute(SG_OA_LAYER);i++)
          scene_layers.push_back(1);
      }*/
	  PROGRESS(100*curCnt/scSz, "Loading objects");
      curCnt++;
      get_next_item(hobj, &hobj);
    }
	PROGRESS(100, "");
  }

  STOP_PROGRESSER();

  memset(&global_loadedFileHeader, 0, sizeof(sgFileManager::SG_FILE_HEADER));
  strcpy(global_loadedFileHeader.signature, SG_FILE_SIGNATURE);
  global_loadedFileHeader.major_ver = KERNEL_VERSION_MAJOR;
  global_loadedFileHeader.minor_ver = KERNEL_VERSION_MINOR;

  return true;
}

bool sgFileManager::ImportDXF(const sgCScene*, const char* file_name)
{
  MATR mtr;
  hOBJ  htail, hobj;
  htail = NULL;
  if (objects.num>0)
	  htail = objects.htail;
  INIT_PROGRESSER(2, "Import DXF");
  if (import(DEV_DXF, const_cast<char*>(file_name), &objects, FALSE, mtr,false)<=0)
  {
    STOP_PROGRESSER();
    return false;
  }
  {
   	if (htail)
		get_next_item(htail, &htail);
	else
		htail = objects.hhead;
    hobj = htail;

    int scSz = objects.num;
    int curCnt=0;
    PROGRESS(0, "");
    while (hobj)
    {
      sgCObject* ooo = ObjectFromHandle(hobj);
     /* if (ooo->GetAttribute(SG_OA_LAYER)>=scene_layers.size())
      {
        scene_layers.clear();
        for (unsigned char i=0;i<=ooo->GetAttribute(SG_OA_LAYER);i++)
          scene_layers.push_back(1);
      }*/
      PROGRESS(100*curCnt/scSz, "Loading object");
      curCnt++;
      get_next_item(hobj, &hobj);
    }
	PROGRESS(0, "");
  }
  STOP_PROGRESSER();
  get_scene_limits();
  return true;
}

bool sgFileManager::ImportSTL(const sgCScene* scn, const char* file_name, bool  solids_checking)
{
	globalFlagForSmoothingObjects = false;
	sgCObject*   newObj = importSTL(file_name, solids_checking);
	globalFlagForSmoothingObjects = true;

	if (newObj)
	{
		if (scn)
		  sgGetScene()->AttachObject(newObj);
		get_scene_limits();
		return true;
	}
	return false;

	/*MATR mtr;
	o_hcunit(mtr);
	hOBJ  htail, hobj;
	htail = NULL;
	if (objects.num>0)
		htail = objects.htail;
	INIT_PROGRESSER(2, "Import STL");
	if (import(DEV_STL, const_cast<char*>(file_name), &objects, FALSE, mtr, solids_checking)<=0)
	{
		STOP_PROGRESSER();
		return false;
	}
	{
		if (htail)
			get_next_item(htail, &htail);
		else
			htail = objects.hhead;
		hobj = htail;

		int scSz = objects.num;
		int curCnt=0;
		PROGRESS(0, "");
		while (hobj)
		{
			sgCObject* ooo = ObjectFromHandle(hobj);
			PROGRESS(100*curCnt/scSz, "");
			curCnt++;
			get_next_item(hobj, &hobj);
		}
		PROGRESS(100, "");
	}
	STOP_PROGRESSER();
	get_scene_limits();
	return true;*/
}

const void* sgFileManager::ObjectToBitArray(const sgCObject* obj, unsigned long& arrSize)
{
	if (!obj)
		return NULL;

	char nametmp[144];
	BOOL cod = FALSE;
	BUFFER_DAT bd;
	
	{
		/*char Buffer[MAX_PATH];  // address of buffer for temp. path
		GetTempPath(MAX_PATH, Buffer );
		GetTempFileName(Buffer, "mrph", 0, nametmp);*/
		
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

	appl_init();
	if (!init_buf(&bd,nametmp,BUF_NEWINMEM)) {
		return NULL;
	}
	bool was_sel = false;
	if (obj->IsSelect())
	{
		was_sel = true;
		sgCObject*  ooo = const_cast<sgCObject*>(obj);
		ooo->Select(false);
	}
	LISTH  oLis;
	init_listh(&oLis);
	attach_item_tail_z(SEL_LIST,&oLis,GetObjectHandle(obj));
	int cnt = 1;
	if ( !o_save_list(&bd,&oLis,SEL_LIST,&cnt,NULL,NULL) ) 	
	{
		close_buf(&bd);
		nb_unlink(nametmp);
		return NULL;
	}
	detach_item_z(SEL_LIST,&oLis,GetObjectHandle(obj));
	init_listh(&oLis);
	if (was_sel)
	{
		sgCObject*  ooo = const_cast<sgCObject*>(obj);
		ooo->Select(true);
	}

	int sz = get_buf_offset(&bd);
	if (sz<1)
	{
		close_buf(&bd);
		nb_unlink(nametmp);
		return NULL;
	}
	
	lpOBJ lpO = (lpOBJ)GetObjectHandle(obj);
    
	if (lpO->bit_buffer)
	{
		SGFree(lpO->bit_buffer);
	}

	lpO->bit_buffer = NULL;
	lpO->bit_buffer_size = 0;

	lpO->bit_buffer_size = sz;
	lpO->bit_buffer = SGMalloc(lpO->bit_buffer_size);

	if ( !seek_buf(&bd,0) ) 		 
	{
		close_buf(&bd);
		nb_unlink(nametmp);
		return NULL;
	}

	if (load_data(&bd, lpO->bit_buffer_size, lpO->bit_buffer)!=lpO->bit_buffer_size)
	{
		//assert(0);   // for ANDROID
		close_buf(&bd);
		nb_unlink(nametmp);
		return NULL;
	}

	close_buf(&bd);
	nb_unlink(nametmp); //  

	arrSize = lpO->bit_buffer_size;
	return lpO->bit_buffer;
}

sgCObject*  sgFileManager::BitArrayToObject(const void* bitArray, unsigned long arrSize)
{
	if (!bitArray || arrSize<1)
		return NULL;

	char nametmp[144];
	BOOL cod = FALSE;
	BUFFER_DAT bd;

	{
		/*char Buffer[MAX_PATH];  // address of buffer for temp. path
		GetTempPath(MAX_PATH, Buffer );
		GetTempFileName(Buffer, "mrph", 0, nametmp);*/
		
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

	appl_init();
	if (!init_buf(&bd,nametmp,BUF_NEWINMEM)) {
		return NULL;
	}

	if (!story_data(&bd,arrSize,const_cast<void*>(bitArray)))
	{
		close_buf(&bd);
		nb_unlink(nametmp);
		return NULL;
	}

	hOBJ obj_new;
	if ( !seek_buf(&bd,0) ) 		 
	{
		close_buf(&bd);
		nb_unlink(nametmp);
		return NULL;
	}
	LISTH  oLis;
	init_listh(&oLis);
	short cnt = 1;
	if ( !o_load_list(&bd,&oLis,SEL_LIST,&cnt,0,NULL) ) 
	{
		close_buf(&bd);
		nb_unlink(nametmp);
		return NULL;
	}
	obj_new = oLis.hhead;
	if (obj_new)
		detach_item_z(SEL_LIST,&oLis,obj_new);
	init_listh(&oLis);
	
	close_buf(&bd);
	nb_unlink(nametmp);  //  
	
	return ObjectFromHandle(obj_new);
}

 

sgCObject*   sgFileManager::ObjectFromTriangles(const SG_POINT* vertexes, long vert_count,
									const SG_INDEX_TRIANGLE* triangles, long tr_count,
									float smooth_angle_in_radians/*=30.0*3.14159265/180.0*/,
									bool  solids_checking/*=false*/)
{
	if (vertexes==NULL || vert_count<3 || triangles==NULL || tr_count<1)
		return NULL;
	NPTRP			trp;
	TRI_BIAND	    trb;
	D_POINT		    pp, min, max;
	MATR			m, matr, matri;
	hOBJ			hobj;
	long            i;
	sgCObject* ooo = NULL;

	//  :   
	min.x = min.y = min.z =  1.e35;
	max.x = max.y = max.z = -1.e35;
	//	num_proc = start_grad(GetIDS(IDS_SG178), bd->len_file);
	PROGRESS(2, "Calculate gabarits");
	for (i=0;i<vert_count;i++) 
	{
		memcpy(&pp,&(vertexes[i]),sizeof(D_POINT));
		modify_limits_by_point(&pp, &min, &max);
	}
	//	end_grad  (num_proc , bd->p_beg+bd->cur_buf);
	//     
	pp.x = - (min.x + max.x) / 2;
	pp.y = - (min.y + max.y) / 2;
	pp.z = - (min.z + max.z) / 2;
	o_hcunit(matr);
	o_hcunit(m);
	o_tdtran(matr, &pp);
	o_minv(matr, matri);
	o_hcmult(matr, m);

	//  
	if ( !begin_tri_biand(&trb) ) return NULL;

	sgFloat  old_smooth_angle = c_smooth_angle;
	c_smooth_angle = smooth_angle_in_radians;

	trp.constr = 0;
	for (i=0;i<tr_count;i++)
	{
		if (!(i%500))
			PROGRESS(-1, "Triangles optimization");
		for (short j=0;j<3;j++)
		{
			if (triangles[i].ver_indexes[j]>=vert_count) 
				goto err;
			trp.v[j].x = vertexes[triangles[i].ver_indexes[j]].x;
			trp.v[j].y = vertexes[triangles[i].ver_indexes[j]].y;
			trp.v[j].z = vertexes[triangles[i].ver_indexes[j]].z;
			o_hcncrd(matr,&trp.v[j],&trp.v[j]);
		}
		
		if ( !put_tri(&trb, &trp, solids_checking)) {
			goto err;
		}
	}
	LISTH resList;
	init_listh(&resList);
	if ( !end_tri_biand(&trb, &resList) )
    {
		goto err2;
    }
	else 
	{
		if (resList.num>1)
		{
			//assert(0);    // for ANDROID
			goto err2;
		}
		hobj = resList.htail;
		while (hobj){
			o_trans(hobj, matri);
			ooo = ObjectFromHandle(hobj);
			get_prev_item(hobj, &hobj);
		}
		c_smooth_angle = old_smooth_angle;
		return ooo;
	}

err2:
	free_item_list(&resList);
err:
	free_vdim(&trb.vdtri);
	free_vdim(&trb.coor);
	if ( trb.indv ) SGFree(trb.indv);
	np_end_of_put(&trb.list_str,NP_CANCEL,0,NULL); //  
	trb.indv = NULL;
	c_smooth_angle = old_smooth_angle;
	PROGRESS(99, "error");
	return ooo;
}
