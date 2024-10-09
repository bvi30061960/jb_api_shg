#include "..//Core//sg.h"
#include <vector>

bool        globalFlagForSmoothingObjects = true;

/************************************************************************/
/* Boundary representation piece                                        */
/************************************************************************/
sgCBRepPiece::sgCBRepPiece():
				m_vertexes(NULL)
               ,m_vertexes_count(0)
			   ,m_edges(NULL)
			   ,m_edges_count(0)
{
	m_brep_piece_handle = NULL;    // creat_np_mem(TNPW, MAXNOV, MAXNOE, MAXNOC, MAXNOF, MAXNOE);
	//assert(m_brep_piece_handle!=NULL);   // for ANDROID
	memset(&m_min,0,sizeof(SG_POINT));
	memset(&m_max,0,sizeof(SG_POINT));
	m_min_triangle_number = 0;
	m_max_triangle_number = 0;
}

sgCBRepPiece::~sgCBRepPiece()
{
	if (m_brep_piece_handle)
	{
		free_np_mem((lpNPW*)(&m_brep_piece_handle));
		m_brep_piece_handle = NULL;
	}

	if (m_vertexes)
	{
		SGFree(m_vertexes);
		m_vertexes = NULL;
	}
	m_vertexes_count = 0;

	if (m_edges)
	{
		SGFree(m_edges);
		m_edges = NULL;
	}
	m_edges_count = 0;
}

void             sgCBRepPiece::GetLocalGabarits(SG_POINT& p_min, SG_POINT& p_max) const
{
	memcpy(&p_min,&m_min,sizeof(SG_POINT));
	memcpy(&p_max,&m_max,sizeof(SG_POINT));
}

void             sgCBRepPiece::GetTrianglesRange(int& min_numb, int& max_numb) const
{
	min_numb = m_min_triangle_number;
	max_numb = m_max_triangle_number;
}

const SG_POINT*  sgCBRepPiece::GetVertexes() const {return m_vertexes;}
unsigned int     sgCBRepPiece::GetVertexesCount() const {return m_vertexes_count;}

const SG_EDGE*   sgCBRepPiece::GetEdges() const {return m_edges;}
unsigned int     sgCBRepPiece::GetEdgesCount() const {return m_edges_count;}

/************************************************************************/
/* Boundary representation                                              */
/************************************************************************/
sgCBRep::sgCBRep():
				m_pieces(NULL)
				,m_pieces_count(0)
{
}

sgCBRep::~sgCBRep()
{
	if (m_pieces)
	{
		for (unsigned int i=0;i<m_pieces_count;i++)
		{
			delete m_pieces[i];
			m_pieces[i] = NULL;
		}
		SGFree(m_pieces);
		m_pieces = NULL;
	}
	m_pieces_count = 0;
}

sgCBRepPiece*    sgCBRep::GetPiece(unsigned int nmbr) const 
{
	if (m_pieces==NULL || nmbr>=m_pieces_count)
		return NULL;
	return m_pieces[nmbr];
}

unsigned int     sgCBRep::GetPiecesCount() const {return m_pieces_count;}

/************************************************************************/
/* 3D Object                                                            */
/************************************************************************/
static  bool					  auto_triangulation = false;
static  SG_TRIANGULATION_TYPE     auto_triangulation_type = SG_DELAUNAY_TRIANGULATION;
static  SG_TRIANGLES_BUFFER_TYPE  auto_triangulation_buffer_type = SG_GENERAL_BUFFER;

static  bool					  auto_brep_flag = false;


SG_TRIANGULATION_TYPE     triangulation_temp_flag = auto_triangulation_type;
SG_TRIANGLES_BUFFER_TYPE  triangulation_temp_buffer_type = auto_triangulation_buffer_type;

void   sgC3DObject::AutoTriangulate(bool aTr, SG_TRIANGULATION_TYPE trType, SG_TRIANGLES_BUFFER_TYPE buffType)
{
	auto_triangulation = aTr;
	auto_triangulation_type = trType;
    auto_triangulation_buffer_type = buffType;
}

void         sgC3DObject::AutoBRep(bool autoBRep)
{
	auto_brep_flag = autoBRep;
}


sgC3DObject::sgC3DObject():sgCObject()
{
  m_objectType = SG_UNKNOWN_3D;
  m_brep = NULL;
  m_triangles = NULL;
  m_world_matrix = NULL;
  m_material = NULL;
}

sgC3DObject::~sgC3DObject()
{
  if (m_brep)
  {
	  delete m_brep;
	  m_brep = NULL;
  }
  FreeTriangles();
  if (m_world_matrix!=NULL)
    delete m_world_matrix;
  if (m_material)
    delete m_material;
}

void   sgC3DObject::FreeTriangles()
{
    if (m_triangles!=NULL)
    {
        if (m_triangles->allUV!=NULL)
            free(m_triangles->allUV);
        if (m_triangles->allNormals!=NULL)
            free(m_triangles->allNormals);
        if (m_triangles->allVertex!=NULL)
            free(m_triangles->allVertex);
        if (m_triangles->generalBuffer!=NULL)
            free(m_triangles->generalBuffer);
        if (m_triangles->indexes!=NULL)
            free(m_triangles->indexes);
        
        free(m_triangles);
    }
    
    m_triangles = NULL;
}

sgC3DObject::sgC3DObject(SG_OBJ_HANDLE objH):sgCObject(objH)
{
  m_objectType = SG_UNKNOWN_3D;
  m_brep = new sgCBRep;
  m_triangles = NULL;
  m_material = NULL;

    sgFloat  tmpVal = 100;
    get_hobj_attr_value(id_SmoothNormals, objH, &tmpVal);

  sgFloat  TmpAttr;
  TmpAttr = (globalFlagForSmoothingObjects) ? 1.0 : 0.0;
 
  if (tmpVal>99.0)
      set_hobj_attr_value(id_SmoothNormals, objH, &TmpAttr);

 
  CopyBRepStructure();
 
  if (auto_triangulation)
	Triangulate(auto_triangulation_type, auto_triangulation_buffer_type);  

  MATR mtrx;
  place_ucs_to_lcs_common(GetObjectHandle(this), mtrx, FALSE);

  m_world_matrix = new sgCMatrix(mtrx);
  m_world_matrix->Transparent();

  GetMaterial();

  PostCreate();
}

SG_3DOBJECT_TYPE   sgC3DObject::Get3DObjectType() const
{return m_objectType;}


sgCBRep*   sgC3DObject::GetBRep()  const
{
	return m_brep;
}

void   sgC3DObject::FreeBRep()
{
	if (m_brep)
	{
		delete m_brep;
		m_brep = NULL;
	}
}

bool  sgC3DObject::ApplyTempMatrix()
{
  if (!sgCObject::ApplyTempMatrix())
    return false;
  m_world_matrix->Transparent();
  m_world_matrix->Multiply(*m_temp_matrix);
  m_world_matrix->Transparent();
  return true;
}

const sgFloat*   sgC3DObject::GetWorldMatrixData() const
{
  if (!m_world_matrix)
  {
    //assert(0);   // for ANDROID
    return NULL;
  }

  return m_world_matrix->GetData();
}



static OSCAN_COD edgesBr_pre_scan(hOBJ hobj, lpSCAN_CONTROL lpsc); //   
static OSCAN_COD edgesBr_geo_scan(hOBJ hobj, lpSCAN_CONTROL lpsc);

static NP_STR_LIST               list_str;

bool  sgC3DObject::CopyBRepStructure()
{
  if (m_brep==NULL)
  {
    //assert(0);   // for ANDROID
    return false;
  }

  SCAN_CONTROL    sc;
  OSCAN_COD   cod;

  init_scan(&sc);

  sc.user_pre_scan  = edgesBr_pre_scan;
  if (auto_brep_flag)
      sc.user_geo_scan  = edgesBr_geo_scan;   //  IF YOU NEED BREP EDGES

  sc.data           = this;

  cod = o_scan(GetObjectHandle(this),&sc);

  return true;
}

static OSCAN_COD soloBr_post_scan(hOBJ hobj, lpSCAN_CONTROL lpsc);  //   
static OSCAN_COD soloBr_geo_scan(hOBJ hobj, lpSCAN_CONTROL lpsc); //   

static SG_ALL_TRIANGLES*   triangles_of_cur_object = NULL;

static hOBJ  localObjForMirrorCheck;
static BOOL  IsMatrixMirror();

#include "..//Core//Aplicat//Delone//BREPTriangulator.h"

bool  sgC3DObject::Triangulate(SG_TRIANGULATION_TYPE trTp, SG_TRIANGLES_BUFFER_TYPE buffType)
{
 if (m_triangles!=NULL)
  {
    return true;
  }

  SCAN_CONTROL    sc;
  OSCAN_COD   cod;

  m_triangles = (SG_ALL_TRIANGLES*)malloc(sizeof(SG_ALL_TRIANGLES));
  if (m_triangles==NULL)
    return false;
  memset(m_triangles,0,sizeof(SG_ALL_TRIANGLES));

  triangles_of_cur_object = m_triangles;

  triangulation_temp_flag = trTp;
  triangulation_temp_buffer_type = buffType;

  CBREPTriangulator* brTr = new CBREPTriangulator(GetObjectHandle(this));

  init_scan(&sc);

  //   
  sc.user_geo_scan  = soloBr_geo_scan;
  sc.user_post_scan = soloBr_post_scan;
  sc.data           = brTr;

  cod = o_scan(GetObjectHandle(this),&sc);
  switch ( cod )
  {
  case OSTRUE:
    break;
  case OSFALSE:
    free(m_triangles);
    return false;
  }
 
  localObjForMirrorCheck = GetObjectHandle(this);

  brTr->EndTriangulate();

  triangles_of_cur_object->nTr = brTr->GetTrianglesCount();

  if(triangles_of_cur_object->nTr)
  {
    if (buffType==SG_SEPARATE_BUFFERS)
    {
        triangles_of_cur_object->allVertex = brTr->GetTrianglesPoints();
        triangles_of_cur_object->allNormals = brTr->GetTrianglesNormals();
    }
    else if (buffType==SG_GENERAL_BUFFER)
    {
        triangles_of_cur_object->generalBuffer = brTr->GetGeneralBuffer();
        triangles_of_cur_object->indexes = brTr->GetIndexesBuffer();
    }
  }

  if(IsMatrixMirror())
  {
      if (buffType==SG_SEPARATE_BUFFERS)
      {
          for(int m = 0; m < 3*triangles_of_cur_object->nTr; m += 3)
          {
              triangles_of_cur_object->allNormals[m].x  = -triangles_of_cur_object->allNormals[m].x;
              triangles_of_cur_object->allNormals[m].y  = -triangles_of_cur_object->allNormals[m].y;
              triangles_of_cur_object->allNormals[m].z  = -triangles_of_cur_object->allNormals[m].z;

              triangles_of_cur_object->allNormals[m+1].x  = -triangles_of_cur_object->allNormals[m+1].x;
              triangles_of_cur_object->allNormals[m+1].y  = -triangles_of_cur_object->allNormals[m+1].y;
              triangles_of_cur_object->allNormals[m+1].z  = -triangles_of_cur_object->allNormals[m+1].z;

              triangles_of_cur_object->allNormals[m+2].x  = -triangles_of_cur_object->allNormals[m+2].x;
              triangles_of_cur_object->allNormals[m+2].y  = -triangles_of_cur_object->allNormals[m+2].y;
              triangles_of_cur_object->allNormals[m+2].z  = -triangles_of_cur_object->allNormals[m+2].z;

          }
      }
      else if(buffType==SG_GENERAL_BUFFER)
      {
          for(int m = 0; m < 3*11*triangles_of_cur_object->nTr; m += 33)
          {
              triangles_of_cur_object->generalBuffer[m+3] = -triangles_of_cur_object->generalBuffer[m+3];
              triangles_of_cur_object->generalBuffer[m+4] = -triangles_of_cur_object->generalBuffer[m+4];
              triangles_of_cur_object->generalBuffer[m+5] = -triangles_of_cur_object->generalBuffer[m+5];
              triangles_of_cur_object->generalBuffer[m+14] = -triangles_of_cur_object->generalBuffer[m+14];
              triangles_of_cur_object->generalBuffer[m+15] = -triangles_of_cur_object->generalBuffer[m+15];
              triangles_of_cur_object->generalBuffer[m+16] = -triangles_of_cur_object->generalBuffer[m+16];
              triangles_of_cur_object->generalBuffer[m+25] = -triangles_of_cur_object->generalBuffer[m+25];
              triangles_of_cur_object->generalBuffer[m+26] = -triangles_of_cur_object->generalBuffer[m+26];
              triangles_of_cur_object->generalBuffer[m+27] = -triangles_of_cur_object->generalBuffer[m+27];

          }
      }
  }
  delete brTr;

  return true;
}

#pragma argsused
static OSCAN_COD soloBr_post_scan(hOBJ hobj, lpSCAN_CONTROL lpsc)
{
  return OSTRUE;
}

#pragma argsused

static OSCAN_COD soloBr_geo_scan(hOBJ hobj, lpSCAN_CONTROL lpsc)
{
  unsigned int  ii;
  OSCAN_COD   cod = OSTRUE;
  BYTE      TypeFace;
  BYTE      bIsUV;
#ifndef NEW_TRIANGULATION
	NP_STR          str;
#endif

  if (lpsc->type!=OBREP)
    return OSTRUE;

  //     BREP,   
  //======================================================
  TypeFace    = SG_L_NP_SOFT;
  bIsUV     = 0;

  if ( lpsc->breptype == FRAME )
    return OSTRUE;

#ifndef NEW_TRIANGULATION
  if ( scan_flg_np_begin )
    if ( !np_init_list(&list_str) )
      return OSFALSE;

  npwg->type = TNPW;
  if ( !np_cplane(npwg) )
  {
    cod = OSFALSE;
    goto end;
  }    //  - -
  if ( !(np_put(npwg,&list_str)) )
  {
    cod = OSFALSE;
    goto end;
  }
#endif

  if ( !scan_flg_np_end )           return OSTRUE;

  //-------   -----------
  {
	  sgC3DObject*  obj3D = reinterpret_cast<sgC3DObject*>((static_cast<lpOBJ>(hobj))->extendedClass);
	  unsigned int  pCnt = 0;

	  bool  needSmooth = false;
	  sgFloat  tmpVal;
	  get_hobj_attr_value(id_SmoothNormals, hobj, &tmpVal);
	  needSmooth = (tmpVal > 0.5);

 #ifndef NEW_TRIANGULATION
	pCnt = list_str.number_all;
#else
	sgCBRep*  brep = obj3D->GetBRep();
	pCnt = brep->GetPiecesCount();
	int   start_tr_number = 0;
	int   end_tr_number = 0;
	int   tmp_tr_cnt = 0;
#endif
    for (ii = 0; ii < pCnt; ii++)
    {
      CBREPTriangulator* brTr = reinterpret_cast<CBREPTriangulator*>(lpsc->data);
#ifndef NEW_TRIANGULATION
      read_elem(&list_str.vdim, ii, &str);
      if (!(read_np(&list_str.bnp, str.hnp, npwg)))
      {   
        cod=OSFALSE;
        goto end1;
      }
      brTr->TriangulateOneNP(&list_str, npwg, needSmooth);
#else
	  brTr->TriangulateOneNP(ii,tmp_tr_cnt);
	  end_tr_number = start_tr_number+tmp_tr_cnt-1;
	  SetBRepPieceMinTriangleNumber(brep->GetPiece(ii),start_tr_number);
	  SetBRepPieceMaxTriangleNumber(brep->GetPiece(ii),end_tr_number);
	  start_tr_number = end_tr_number+1;
  #endif
      
    }
#ifndef NEW_TRIANGULATION
end1:
#endif
    ;
  }
#ifndef NEW_TRIANGULATION
end:
  np_end_of_put(&list_str,NP_CANCEL,0,NULL);
#endif
  return cod;
}

void TriangleNormal(SG_POINT* Vert1,SG_POINT* Vert2,SG_POINT* Vert3,SG_VECTOR* N)
{
  SG_POINT    P1,P2,P3;

  P1.x = Vert1->x;
  P1.y = Vert1->y;
  P1.z = Vert1->z;

  P2.x = Vert2->x;
  P2.y = Vert2->y;
  P2.z = Vert2->z;

  P3.x = Vert3->x;
  P3.y = Vert3->y;
  P3.z = Vert3->z;

  N->x = (P2.y-P1.y)*(P3.z-P1.z) - (P2.z-P1.z)*(P3.y-P1.y);
  N->y = (P2.z-P1.z)*(P3.x-P1.x) - (P2.x-P1.x)*(P3.z-P1.z);
  N->z = (P2.x-P1.x)*(P3.y-P1.y) - (P2.y-P1.y)*(P3.x-P1.x);

  sgFloat cs;

  cs = sqrt(N->x*N->x + N->y*N->y + N->z*N->z);
  if ( cs < MINsgFloat*10) return;   //  
  N->x /= cs;                      //  
  N->y /= cs;
  N->z /= cs;
}

/*
static void FillTriangBrep()
{
  int   j, k, m,idP1,idP2,idP3;

  size_t  all_np_ar_sz = all_np_of_brep.size();

  //      - 
  triangles_of_cur_object->nTr = 0;

  for(size_t i = 0; i<all_np_ar_sz; i++)
    triangles_of_cur_object->nTr += all_np_of_brep[i].nTr;

  if(triangles_of_cur_object->nTr)
  {
    triangles_of_cur_object->allVertex = (SG_POINT*)malloc(3*triangles_of_cur_object->nTr*sizeof(SG_POINT));
    triangles_of_cur_object->allNormals = (SG_VECTOR*)malloc(3*triangles_of_cur_object->nTr*sizeof(SG_VECTOR));

  }
  // 
  m = 0;
  for(size_t i = 0; i<all_np_ar_sz; i++)
  {
    switch(all_np_of_brep[i].TypeFace)
    {
    case SG_L_NP_SOFT:
      for(j = 0; j < all_np_of_brep[i].nTr; j++)
      {
        idP1 = all_np_of_brep[i].pTr[j].i1;
        idP2 = all_np_of_brep[i].pTr[j].i2;
        idP3 = all_np_of_brep[i].pTr[j].i3;

        //  
        triangles_of_cur_object->allVertex[m]  = all_np_of_brep[i].pV[idP1];
        triangles_of_cur_object->allVertex[m+1] = all_np_of_brep[i].pV[idP2];
        triangles_of_cur_object->allVertex[m+2] = all_np_of_brep[i].pV[idP3];
        //  
        triangles_of_cur_object->allNormals[m]   = all_np_of_brep[i].pN[idP1];
        triangles_of_cur_object->allNormals[m+1] = all_np_of_brep[i].pN[idP2];
        triangles_of_cur_object->allNormals[m+2] = all_np_of_brep[i].pN[idP3];
        m += 3;
      }
      break;
    case SG_L_NP_SHARP:
      for(j = 0, k = 0; j < all_np_of_brep[i].nTr; j++, k += 3)
      {
        idP1 = all_np_of_brep[i].pTr[j].i1;
        idP2 = all_np_of_brep[i].pTr[j].i2;
        idP3 = all_np_of_brep[i].pTr[j].i3;
        //  
        triangles_of_cur_object->allVertex[m]  = all_np_of_brep[i].pV[idP1];
        triangles_of_cur_object->allVertex[m+1] = all_np_of_brep[i].pV[idP2];
        triangles_of_cur_object->allVertex[m+2] = all_np_of_brep[i].pV[idP3];
        //  
        triangles_of_cur_object->allNormals[m]   = all_np_of_brep[i].pN[k];
        triangles_of_cur_object->allNormals[m+1] = all_np_of_brep[i].pN[k+1];
        triangles_of_cur_object->allNormals[m+2] = all_np_of_brep[i].pN[k+2];
        m += 3;
      }
      break;
    case SG_L_NP_PLANE:
      for(j = 0; j < all_np_of_brep[i].nTr; j++)
      {
        SG_VECTOR N;
        idP1 = all_np_of_brep[i].pTr[j].i1;
        idP2 = all_np_of_brep[i].pTr[j].i2;
        idP3 = all_np_of_brep[i].pTr[j].i3;
        //  
        triangles_of_cur_object->allVertex[m]  = all_np_of_brep[i].pV[idP1];
        triangles_of_cur_object->allVertex[m+1] = all_np_of_brep[i].pV[idP2];
        triangles_of_cur_object->allVertex[m+2] = all_np_of_brep[i].pV[idP3];

        TriangleNormal(&triangles_of_cur_object->allVertex[m],
                    &triangles_of_cur_object->allVertex[m+1],
                    &triangles_of_cur_object->allVertex[m+2],&N);
        triangles_of_cur_object->allNormals[m]  = N;
        triangles_of_cur_object->allNormals[m+1] = N;
        triangles_of_cur_object->allNormals[m+2] = N;
        m += 3;
      }

      break;
    }
  }
  //   
  //    -  
  if(IsMatrixMirror())
  {
    for(m = 0; m < 3*triangles_of_cur_object->nTr; m += 3)
    {
      triangles_of_cur_object->allNormals[m].x  = -triangles_of_cur_object->allNormals[m].x;
      triangles_of_cur_object->allNormals[m].y  = -triangles_of_cur_object->allNormals[m].y;
      triangles_of_cur_object->allNormals[m].z  = -triangles_of_cur_object->allNormals[m].z;

      triangles_of_cur_object->allNormals[m+1].x  = -triangles_of_cur_object->allNormals[m+1].x;
      triangles_of_cur_object->allNormals[m+1].y  = -triangles_of_cur_object->allNormals[m+1].y;
      triangles_of_cur_object->allNormals[m+1].z  = -triangles_of_cur_object->allNormals[m+1].z;

      triangles_of_cur_object->allNormals[m+2].x  = -triangles_of_cur_object->allNormals[m+2].x;
      triangles_of_cur_object->allNormals[m+2].y  = -triangles_of_cur_object->allNormals[m+2].y;
      triangles_of_cur_object->allNormals[m+2].z  = -triangles_of_cur_object->allNormals[m+2].z;

    }
  }

}
*/
void MultVectMatr(sgFloat* t,lpD_POINT v,lpD_POINT vp)
{
  sgFloat vx, vy, vz;
  vx = v->x; vy = v->y; vz = v->z;
  vp->x = vx*t[0] + vy*t[4] + vz*t[8]  + t[12];
  vp->y = vx*t[1] + vy*t[5] + vz*t[9]  + t[13];
  vp->z = vx*t[2] + vy*t[6] + vz*t[10] + t[14];
}

static BOOL  IsMatrixMirror()
{
  lpOBJ obj = (lpOBJ)localObjForMirrorCheck;

  MATR  tmp_matr;
  memcpy(tmp_matr,((lpGEO_BREP)(obj->geo_data))->matr,sizeof(MATR));

  D_POINT p0={0.0, 0.0, 0.0};
  D_POINT p1={1.0, 0.0, 0.0};
  D_POINT p2={0.0, 1.0, 0.0};
  D_POINT p3={0.0, 0.0, 1.0};

  MultVectMatr(tmp_matr,&p0,&p0);
  MultVectMatr(tmp_matr,&p1,&p1);
  MultVectMatr(tmp_matr,&p2,&p2);
  MultVectMatr(tmp_matr,&p3,&p3);

  //   -  .
  p1.x=p1.x-p0.x;
  p1.y=p1.y-p0.y;
  p1.z=p1.z-p0.z;

  p2.x=p2.x-p0.x;
  p2.y=p2.y-p0.y;
  p2.z=p2.z-p0.z;

  p3.x=p3.x-p0.x;
  p3.y=p3.y-p0.y;
  p3.z=p3.z-p0.z;

  dvector_product(&p1,&p2, &p1);

  //     p1*p3
  if((p1.x*p3.x + p1.y*p3.y + p1.z*p3.z) < 0)
    return TRUE;
  return FALSE;

}






const SG_ALL_TRIANGLES* sgC3DObject::GetTriangles() const
{return m_triangles;}



static OSCAN_COD edgesBr_pre_scan(hOBJ hobj, lpSCAN_CONTROL lpsc)
{
	sgC3DObject* tmpObj = static_cast<sgC3DObject*>(lpsc->data);
	if(lpsc->type == OBREP)
	{
		//   
		if ( lpsc->breptype == BODY )
			Set3DObjectType(tmpObj, SG_BODY);
		else
			/*if ( lpsc->breptype == FRAME )
				Set3DObjectType(tmpObj, SG_FRAME);
			else*/
				Set3DObjectType(tmpObj, SG_SURFACE);
	}
	//   
	return OSTRUE;
}

static OSCAN_COD edgesBr_geo_scan(hOBJ hobj, lpSCAN_CONTROL lpsc)
{
  int  i;
  OSCAN_COD   cod = OSTRUE;
  NP_STR          str;

  /************   COMMON PART FOR OBJECT SCANNING BEGIN   ***************/
  if (lpsc->type!=OBREP)
    return OSTRUE;

  if ( scan_flg_np_begin )
    if ( !np_init_list(&list_str) )
      return OSFALSE;

  npwg->type = TNPW;
  if ( !np_cplane(npwg) )
  {
    cod = OSFALSE;
   // goto end;
    np_end_of_put(&list_str,NP_CANCEL,0,NULL);
    return cod;
  }
  if ( !(np_put(npwg,&list_str)) )
  {
    cod = OSFALSE;
    //goto end;
    np_end_of_put(&list_str,NP_CANCEL,0,NULL);
    return cod;
  }

  if ( !scan_flg_np_end )           return OSTRUE;

  /************   COMMON PART FOR OBJECT SCANNING END   ***************/


  sgCBRep* tmpBRep = (static_cast<sgC3DObject*>(lpsc->data))->GetBRep();

  AllocMemoryForBRepPiecesInBRep(tmpBRep, list_str.number_all);

 // FILE*  fl = fopen("D://brep.ooo","w+");

  for (i = 0; i < list_str.number_all; i++)
  {
    read_elem(&list_str.vdim, i, &str);

#ifndef NEW_TRIANGULATION
    read_np(&list_str.bnp, str.hnp, npwg);
#else
    lpNPW  tmpNPW = GetNPWFromBRepPiece(tmpBRep->GetPiece(i));
	read_np(&list_str.bnp, str.hnp, tmpNPW);

	/*fprintf(fl,"------ New BREP piece ------ number %i -------\n",i);
	fprintf(fl,"  Vertexes Count: %i\n", tmpNPW->nov);
	fprintf(fl,"  Edges Count:    %i\n", tmpNPW->noe);
	fprintf(fl,"  Faces Count:    %i\n", tmpNPW->nof);
	fprintf(fl,"  Cicles Count:   %i\n", tmpNPW->noc);
	fprintf(fl,"   ------ Vertexes -----\n");
	for (short jj=0;jj<tmpNPW->nov+5;jj++)
	{
	fprintf(fl,"     %3i :  X=%10f   Y=%10f   Z=%10f\n", jj,tmpNPW->v[jj].x,tmpNPW->v[jj].y,tmpNPW->v[jj].z);
	}
	fprintf(fl,"   ------ Edges -----\n");
	for (short jj=0;jj<tmpNPW->noe+5;jj++)
	{
		fprintf(fl,"     %3i :  Begin=%5i   End=%5i   Type=%5i\n", jj,tmpNPW->efr[jj].bv , tmpNPW->efr[jj].ev, tmpNPW->efr[jj].el);
	}
	fprintf(fl,"   ------ Faces -----\n");
	for (short jj=0;jj<tmpNPW->nof+5;jj++)
	{
		fprintf(fl,"     %3i :  Begin contour=%5i   Type=%5i\n", jj,tmpNPW->f[jj].fc , tmpNPW->f[jj].fl);
	}
	fprintf(fl,"   ------ Cicles -----\n");
	for (short jj=0;jj<tmpNPW->noc+5;jj++)
	{
		fprintf(fl,"     %3i :  First edge=%5i   Next contour=%5i\n", jj,tmpNPW->c[jj].fe , tmpNPW->c[jj].nc);
	}*/
#endif

	TMP_STRUCT_FOR_BREP_PIECES_SETTING tmpSFBPS;
	tmpSFBPS.br = tmpBRep;
	tmpSFBPS.ii = i;

#ifndef NEW_TRIANGULATION
	Set_i_BRepPiece(&tmpSFBPS,npwg);
#else
	Set_i_BRepPiece(&tmpSFBPS,tmpNPW);
#endif
  }

 /* fflush(fl);
  fclose(fl);*/

//end:
  np_end_of_put(&list_str,NP_CANCEL,0,NULL);
  return cod;
}



void  sgC3DObject::SetMaterial(const SG_MATERIAL& newMat)
{
  if (!m_material)
    m_material = new SG_MATERIAL;

  if (memcmp(m_material, &newMat, sizeof(SG_MATERIAL))!=0)
  {
    memcpy(m_material,&newMat,sizeof(SG_MATERIAL));

    sgFloat TmpAttr = m_material->MaterialIndex;
    set_hobj_attr_value(id_Material, GetObjectHandle(this),&TmpAttr);

    set_hobj_attr_value(id_TextureScaleU, GetObjectHandle(this), &m_material->TextureScaleU);
    set_hobj_attr_value(id_TextureScaleV, GetObjectHandle(this), &m_material->TextureScaleV);
    set_hobj_attr_value(id_TextureShiftU, GetObjectHandle(this), &m_material->TextureShiftU);
    set_hobj_attr_value(id_TextureShiftV, GetObjectHandle(this), &m_material->TextureShiftV);
    set_hobj_attr_value(id_TextureAngle, GetObjectHandle(this),  &m_material->TextureAngle);

    TmpAttr = (m_material->TextureSmooth)?1.0:0.0;
    set_hobj_attr_value(id_Smooth, GetObjectHandle(this),&TmpAttr);

    TmpAttr = (sgFloat)m_material->MixColorType;
    set_hobj_attr_value(id_MixColor, GetObjectHandle(this),&TmpAttr);

    TmpAttr = (sgFloat)m_material->TextureUVType;
    set_hobj_attr_value(id_UVType, GetObjectHandle(this),&TmpAttr);

    TmpAttr = (m_material->TextureMult)?1.0:0.0;
    set_hobj_attr_value(id_TextureMult, GetObjectHandle(this),&TmpAttr);

    CalcUV();
  }
}

const  SG_MATERIAL* sgC3DObject::GetMaterial()
{
  if (m_material)
    return m_material;

  sgFloat nMat=-1.0;
  get_hobj_attr_value(id_Material, GetObjectHandle(this), &nMat);
  if (nMat>=0)
  {
    m_material = new SG_MATERIAL;
    m_material->MaterialIndex = static_cast<int>(nMat);
    get_hobj_attr_value(id_TextureScaleU, GetObjectHandle(this), &m_material->TextureScaleU);
    get_hobj_attr_value(id_TextureScaleV, GetObjectHandle(this), &m_material->TextureScaleV);
    get_hobj_attr_value(id_TextureShiftU, GetObjectHandle(this), &m_material->TextureShiftU);
    get_hobj_attr_value(id_TextureShiftV, GetObjectHandle(this), &m_material->TextureShiftV);
    get_hobj_attr_value(id_TextureAngle, GetObjectHandle(this), &m_material->TextureAngle);

    sgFloat TmpAttr = 0.0;
    get_hobj_attr_value(id_Smooth, GetObjectHandle(this), &TmpAttr);
    m_material->TextureSmooth = (TmpAttr>0.001);

    get_hobj_attr_value(id_MixColor, GetObjectHandle(this), &TmpAttr);
    switch((int)TmpAttr)
    {
    case 1:
      m_material->MixColorType = SG_MODULATE_MIX_TYPE;
      break;
    case 2:
      m_material->MixColorType = SG_BLEND_MIX_TYPE;
      break;
    default:
      m_material->MixColorType = SG_REPLACE_MIX_TYPE;
      break;
    }

    get_hobj_attr_value(id_UVType, GetObjectHandle(this), &TmpAttr);
    switch((int)TmpAttr)
    {
    case 2:
      m_material->TextureUVType = SG_SPHERIC_UV_TYPE;
      break;
    case 3:
      m_material->TextureUVType = SG_CYLINDER_UV_TYPE;
      break;
    default:
      m_material->TextureUVType = SG_CUBE_UV_TYPE;
      break;
    }

    get_hobj_attr_value(id_TextureMult, GetObjectHandle(this), &TmpAttr);
    m_material->TextureMult = (TmpAttr>0.001);

    if (m_triangles && m_triangles->allUV==NULL)
      CalcUV();
  }

  return m_material;
}

bool sgC3DObject::CalculateOptimalUV(sgFloat& optU, sgFloat& optV)
{
  sgFloat    Sxz,Syz,Sxy,Smax;
  sgFloat    MaxU,MaxV/*,kScale*/;

  Smax = 0;
  Sxz = fabs((m_max.x-m_min.x)*(m_max.z-m_min.z));
  if(Sxz > Smax)
  {
    Smax = Sxz;
    MaxU = m_max.x-m_min.x;
    MaxV = m_max.z-m_min.z;
  }
  Syz = fabs((m_max.y-m_min.y)*(m_max.z-m_min.z));
  if(Syz > Smax)
  {
    Smax = Syz;
    MaxU = m_max.y-m_min.y;
    MaxV = m_max.z-m_min.z;

  }
  Sxy = fabs((m_max.x-m_min.x)*(m_max.y-m_min.y));
  if(Sxy > Smax)
  {
    Smax = Sxz;
    MaxU = m_max.x-m_min.x;
    MaxV = m_max.y-m_min.y;
  }
  //  ,     
  //     !!!!!!
  if(fabs(GetWorldMatrixData()[10]) > 1.0)
  {
    sgFloat kScale = fabs(GetWorldMatrixData()[10]);
    MaxU /= kScale;
    MaxV /= kScale;
  }

  //     
  //    
  sgFloat lScaleU,lScaleV;
  lScaleU = lScaleV = 1.0;
  //if(m_lpTmpHdr->nIdxMat)
/*  if(true)
  {
    MAT_ITEM  TmpItem;
    CString   NameItem;
    int     i,Total;
    long    SelItem;

    //   
    Total = m_lpMatLib->GetTotalMaterial();
    SelItem = c_list.GetCurSel();
    if(SelItem == LB_ERR)
      return ;
    c_list.GetText(SelItem,NameItem);
    //    
    for(i = 0; i < Total; i++)
    {
      if(!strcmp((LPCSTR)NameItem,m_lpMatLib->m_aMatIdx.GetAt(i).szName))
        break;
    }

    //if(m_lpMatLib->LoadMatItem(m_lpTmpHdr->nIdxMat-1,&TmpMat))
    if(m_lpMatLib->LoadMatItem(i,&TmpItem))
    {
      if(fabs(TmpItem.ScaleU) > 0)
        lScaleU = TmpItem.ScaleU;
      if(fabs(TmpItem.ScaleV) > 0)
        lScaleV = TmpItem.ScaleV;
    }
  }*/


  optU = (fabs(MaxU/lScaleU));
  optV = (fabs(MaxV/lScaleV));
  return true;
}

void    sgC3DObject::CalcUV()
{
  //assert(m_triangles);    // for ANDROID
  //assert(m_material);     // for ANDROID
 // assert(m_triangles->allNormals);
 // assert(m_triangles->allVertex);
  if (m_triangles==NULL || m_material==NULL)
      return;

  if (m_triangles->allUV==NULL && m_triangles->generalBuffer==NULL)
    m_triangles->allUV = (sgFloat*)malloc(2*3*m_triangles->nTr*sizeof(sgFloat));
    
    float  yUVScale = m_material->TextureScaleV;
    float  xUVScale = m_material->TextureScaleU;
    
    float  yUVShift = m_material->TextureShiftV;
    float  xUVShift = m_material->TextureShiftU;
    
#if (SG_CURRENT_PLATFORM==SG_PLATFORM_WINDOWS)
#define   UCORRECT      /xUVScale + xUVShift
#define   VCORRECT      /yUVScale + yUVShift
#else
#define   UCORRECT      
#define   VCORRECT      
#endif
    
    if (yUVScale<0.001)
        yUVScale = 1.0f;
    if (xUVScale<0.001)
        xUVScale = 1.0f;

  switch(m_material->TextureUVType)
  {
  case SG_CYLINDER_UV_TYPE:
    {
      SG_POINT  P1,P2,P3;
      sgFloat    radius;
      sgFloat    alpha;
      int j = 0;
      for(int i = 0; i < m_triangles->nTr; i += 1)
      {
        if (m_triangles->generalBuffer==NULL)
        {
            P1.x = m_triangles->allVertex[i*3].x;
            P1.y = m_triangles->allVertex[i*3].y;
            P1.z = m_triangles->allVertex[i*3].z;
        }
        else
        {
            P1.x = m_triangles->generalBuffer[i*33];
            P1.y = m_triangles->generalBuffer[i*33+1];
            P1.z = m_triangles->generalBuffer[i*33+2];
        }

        radius = sqrt (P1.x*P1.x+P1.y*P1.y);
        alpha = asin(P1.y/radius);

          if (m_triangles->generalBuffer==NULL)
          {
              m_triangles->allUV[j] = (alpha+M_PI/2)/(2*M_PI)*360 UCORRECT;
              m_triangles->allUV[j+1] = P1.z VCORRECT;
              j += 2;
          }
          else
          {
              m_triangles->generalBuffer[i*33+6] = (alpha+M_PI/2)/(2*M_PI)*360/xUVScale + xUVShift;
              m_triangles->generalBuffer[i*33+7] = P1.z/yUVScale + yUVShift;
          }

          if (m_triangles->generalBuffer==NULL)
          {
              P2.x = m_triangles->allVertex[i*3+1].x;
              P2.y = m_triangles->allVertex[i*3+1].y;
              P2.z = m_triangles->allVertex[i*3+1].z;
          }
          else
          {
              P2.x = m_triangles->generalBuffer[i*33+11];
              P2.y = m_triangles->generalBuffer[i*33+12];
              P2.z = m_triangles->generalBuffer[i*33+13];
          }
          
        radius = sqrt (P2.x*P2.x+P2.y*P2.y);
        alpha = asin(P2.y/radius);
          if (m_triangles->generalBuffer==NULL)
          {
              m_triangles->allUV[j]   = (alpha+M_PI/2)/(2*M_PI)*360 UCORRECT;//U
              m_triangles->allUV[j+1] = P2.z VCORRECT;           // V
              j += 2;
          }
          else
          {
              m_triangles->generalBuffer[i*33+17] = (alpha+M_PI/2)/(2*M_PI)*360/xUVScale + xUVShift;//U
              m_triangles->generalBuffer[i*33+18] = P2.z/yUVScale + yUVShift;
          }

          if (m_triangles->generalBuffer==NULL)
          {
              P3.x = m_triangles->allVertex[i*3+2].x;
              P3.y = m_triangles->allVertex[i*3+2].y;
              P3.z = m_triangles->allVertex[i*3+2].z;
          }
          else
          {
              P3.x = m_triangles->generalBuffer[i*33+22];
              P3.y = m_triangles->generalBuffer[i*33+23];
              P3.z = m_triangles->generalBuffer[i*33+24];
          }
        radius = sqrt (P3.x*P3.x+P3.y*P3.y);
        alpha = asin(P3.y/radius);
          if (m_triangles->generalBuffer==NULL)
          {
              m_triangles->allUV[j]   = (alpha+M_PI/2)/(2*M_PI)*360 UCORRECT;
              m_triangles->allUV[j+1] = P3.z VCORRECT;
              j += 2;
          }
          else
          {
              m_triangles->generalBuffer[i*33+28] = (alpha+M_PI/2)/(2*M_PI)*360/xUVScale + xUVShift;//U
              m_triangles->generalBuffer[i*33+29] = P3.z/yUVScale + yUVShift;
          }

      }

    }
    break;
  case SG_SPHERIC_UV_TYPE:
    {
      SG_POINT  P1,P2,P3;
      sgFloat    radius;
      sgFloat    alpha,beta;
      int j = 0;
      for(int i = 0; i < (m_triangles->nTr); i += 1)
      {

          if (m_triangles->generalBuffer==NULL)
          {
              P1.x = m_triangles->allVertex[i*3].x;
              P1.y = m_triangles->allVertex[i*3].y;
              P1.z = m_triangles->allVertex[i*3].z;
          }
          else
          {
              P1.x = m_triangles->generalBuffer[i*33];
              P1.y = m_triangles->generalBuffer[i*33+1];
              P1.z = m_triangles->generalBuffer[i*33+2];
          }

        radius = sqrt (P1.x*P1.x + P1.y*P1.y + P1.z*P1.z);
        alpha = asin(P1.z/radius);
        beta  = acos(P1.y/sqrt(P1.x*P1.x+P1.y*P1.y));
          if (m_triangles->generalBuffer==NULL)
          {
              m_triangles->allUV[j]   = alpha*180 UCORRECT;
              m_triangles->allUV[j+1] = beta*180 VCORRECT;
              j += 2;
          }
          else
          {
              m_triangles->generalBuffer[i*33+6] = alpha*180.0/xUVScale + xUVShift;
              m_triangles->generalBuffer[i*33+7] = beta*180.0/yUVScale + yUVShift;
          }

          if (m_triangles->generalBuffer==NULL)
          {
              P2.x = m_triangles->allVertex[i*3+1].x;
              P2.y = m_triangles->allVertex[i*3+1].y;
              P2.z = m_triangles->allVertex[i*3+1].z;
          }
          else
          {
              P2.x = m_triangles->generalBuffer[i*33+11];
              P2.y = m_triangles->generalBuffer[i*33+12];
              P2.z = m_triangles->generalBuffer[i*33+13];
          }
        radius = sqrt (P2.x*P2.x + P2.y*P2.y + P2.z*P2.z);
        alpha = asin(P2.z/radius);
        beta  = acos(P2.y/sqrt(P2.x*P2.x+P2.y*P2.y));
          if (m_triangles->generalBuffer==NULL)
          {
              m_triangles->allUV[j]   = alpha*180 UCORRECT;
              m_triangles->allUV[j+1] = beta*180 VCORRECT;
              j += 2;
          }
          else
          {
              m_triangles->generalBuffer[i*33+17] = alpha*180.0/xUVScale + xUVShift;
              m_triangles->generalBuffer[i*33+18] = beta*180.0/yUVScale + yUVShift;
          }

          if (m_triangles->generalBuffer==NULL)
          {
              P3.x = m_triangles->allVertex[i*3+2].x;
              P3.y = m_triangles->allVertex[i*3+2].y;
              P3.z = m_triangles->allVertex[i*3+2].z;
          }
          else
          {
              P3.x = m_triangles->generalBuffer[i*33+22];
              P3.y = m_triangles->generalBuffer[i*33+23];
              P3.z = m_triangles->generalBuffer[i*33+24];
          }
        radius = sqrt (P3.x*P3.x+P3.y*P3.y + P3.z*P3.z);
        alpha = asin(P3.z/radius);
        beta  = acos(P3.y/sqrt(P3.x*P3.x+P3.y*P3.y));
              if (m_triangles->generalBuffer==NULL)
              {
                  m_triangles->allUV[j]   = alpha*180 UCORRECT;
                  m_triangles->allUV[j+1] = beta*180 VCORRECT;
                  j += 2;
              }
              else
              {
                  m_triangles->generalBuffer[i*33+28] = alpha*180.0/xUVScale + xUVShift;
                  m_triangles->generalBuffer[i*33+29] = beta*180.0/yUVScale + yUVShift;
              }

      }

    }
    break;
  default:
    {
      int i;
      SG_POINT  P1,P2,P3;
      int Type;

      int j = 0;
      for(i = 0; i < (m_triangles->nTr); i += 1)
      {
          if (m_triangles->generalBuffer==NULL)
          {
              if ( (fabs(m_triangles->allNormals[i*3].x) > fabs(m_triangles->allNormals[i*3].y))
                  && (fabs(m_triangles->allNormals[i*3].x) > fabs(m_triangles->allNormals[i*3].z)) ){Type = 0;
              }else{
                  if ( (fabs(m_triangles->allNormals[i*3].y) > fabs(m_triangles->allNormals[i*3].z))) {Type = 1;}
                  else  {Type = 2;}
              }

              P1.x = m_triangles->allVertex[i*3].x;
              P1.y = m_triangles->allVertex[i*3].y;
              P1.z = m_triangles->allVertex[i*3].z;
              if(Type == 0){
                  m_triangles->allUV[j]   = P1.y UCORRECT;
                  m_triangles->allUV[j+1] = P1.z VCORRECT;
              } else if(Type ==1)
              {
                  m_triangles->allUV[j]   = P1.x UCORRECT;
                  m_triangles->allUV[j+1] = P1.z VCORRECT;
              }else
              {
                  m_triangles->allUV[j]   = P1.x UCORRECT;
                  m_triangles->allUV[j+1] = P1.y VCORRECT;
              }
              j+=2;
              P2.x = m_triangles->allVertex[i*3+1].x;
              P2.y = m_triangles->allVertex[i*3+1].y;
              P2.z = m_triangles->allVertex[i*3+1].z;
              if(Type == 0)
              {
                  m_triangles->allUV[j]   = P2.y  UCORRECT;
                  m_triangles->allUV[j+1] = P2.z  VCORRECT;
              }
              else if(Type ==1)
              {
                  m_triangles->allUV[j]   = P2.x  UCORRECT;
				  m_triangles->allUV[j + 1] = P2.z VCORRECT;
              }
              else
              {
                  m_triangles->allUV[j]   = P2.x  UCORRECT;
                  m_triangles->allUV[j+1] = P2.y  VCORRECT;
              }
              j+=2;
              P3.x = m_triangles->allVertex[i*3+2].x;
              P3.y = m_triangles->allVertex[i*3+2].y;
              P3.z = m_triangles->allVertex[i*3+2].z;
              if(Type == 0)
              {
                  m_triangles->allUV[j]   = P3.y UCORRECT;
				  m_triangles->allUV[j + 1] = P3.z VCORRECT;
              }
              else if(Type ==1)
              {
                  m_triangles->allUV[j]   = P3.x UCORRECT;
                  m_triangles->allUV[j+1] = P3.z VCORRECT;
              }
              else
              {
                  m_triangles->allUV[j]   = P3.x UCORRECT;
                  m_triangles->allUV[j+1] = P3.y VCORRECT;
              }
              j+=2;
          }
          else
          {
              if ( (fabs(m_triangles->generalBuffer[i*33+3]) > fabs(m_triangles->generalBuffer[i*33+4]))
                  && (fabs(m_triangles->generalBuffer[i*33+3]) > fabs(m_triangles->generalBuffer[i*33+5])) ){Type = 0;
              }else{
                  if ( (fabs(m_triangles->generalBuffer[i*33+4]) > fabs(m_triangles->generalBuffer[i*33+5]))) {Type = 1;}
                  else  {Type = 2;}
              }
              
              P1.x = m_triangles->generalBuffer[i*33+0];
              P1.y = m_triangles->generalBuffer[i*33+1];
              P1.z = m_triangles->generalBuffer[i*33+2];
              if(Type == 0){
                  m_triangles->generalBuffer[i*33+6]   = P1.y/xUVScale + xUVShift;
                  m_triangles->generalBuffer[i*33+7] = P1.z/yUVScale + yUVShift;
              } else if(Type ==1)
              {
                  m_triangles->generalBuffer[i*33+6]   = P1.x/xUVScale + xUVShift;
                  m_triangles->generalBuffer[i*33+7] = P1.z/yUVScale + yUVShift;
              }else
              {
                  m_triangles->generalBuffer[i*33+6]   = P1.x/xUVScale + xUVShift;
                  m_triangles->generalBuffer[i*33+7] = P1.y/yUVScale + yUVShift;
              }

              P2.x = m_triangles->generalBuffer[i*33+11];
              P2.y = m_triangles->generalBuffer[i*33+12];
              P2.z = m_triangles->generalBuffer[i*33+13];
              if(Type == 0)
              {
                  m_triangles->generalBuffer[i*33+17]   = P2.y/xUVScale + xUVShift;
                  m_triangles->generalBuffer[i*33+18] = P2.z/yUVScale + yUVShift;
              }
              else if(Type ==1)
              {
                  m_triangles->generalBuffer[i*33+17]   = P2.x/xUVScale + xUVShift;
                  m_triangles->generalBuffer[i*33+18] = P2.z/yUVScale + yUVShift;
              }
              else
              {
                  m_triangles->generalBuffer[i*33+17]   = P2.x/xUVScale + xUVShift;
                  m_triangles->generalBuffer[i*33+18] = P2.y/yUVScale + yUVShift;
              }

              P3.x = m_triangles->generalBuffer[i*33+22];
              P3.y = m_triangles->generalBuffer[i*33+23];
              P3.z = m_triangles->generalBuffer[i*33+24];
              if(Type == 0)
              {
                  m_triangles->generalBuffer[i*33+28]   = P3.y/xUVScale + xUVShift;
                  m_triangles->generalBuffer[i*33+29] = P3.z/yUVScale + yUVShift;
              }
              else if(Type ==1)
              {
                  m_triangles->generalBuffer[i*33+28]   = P3.x/xUVScale + xUVShift;
                  m_triangles->generalBuffer[i*33+29] = P3.z/yUVScale + yUVShift;
              }
              else
              {
                  m_triangles->generalBuffer[i*33+28]   = P3.x/xUVScale + xUVShift;
                  m_triangles->generalBuffer[i*33+29] = P3.y/yUVScale + yUVShift;
              }

          }

      }
    }
  }
    
    // CALC TANGENT
    if (m_triangles->generalBuffer!=NULL)
    {
        for(int i = 0; i < m_triangles->nTr; i += 1)
        {
            sgFloat x1 = m_triangles->generalBuffer[i*33+11] - m_triangles->generalBuffer[i*33+0];
            sgFloat x2 = m_triangles->generalBuffer[i*33+22] - m_triangles->generalBuffer[i*33+0];
            sgFloat y1 = m_triangles->generalBuffer[i*33+12] - m_triangles->generalBuffer[i*33+1];
            sgFloat y2 = m_triangles->generalBuffer[i*33+23] - m_triangles->generalBuffer[i*33+1];
            sgFloat z1 = m_triangles->generalBuffer[i*33+13] - m_triangles->generalBuffer[i*33+2];
            sgFloat z2 = m_triangles->generalBuffer[i*33+24] - m_triangles->generalBuffer[i*33+2];
            
            sgFloat s1 = m_triangles->generalBuffer[i*33+17] - m_triangles->generalBuffer[i*33+6];
            sgFloat s2 = m_triangles->generalBuffer[i*33+28] - m_triangles->generalBuffer[i*33+6];
            sgFloat t1 = m_triangles->generalBuffer[i*33+18] - m_triangles->generalBuffer[i*33+7];
            sgFloat t2 = m_triangles->generalBuffer[i*33+29] - m_triangles->generalBuffer[i*33+7];
            
            if (fabs(s1 * t2 - s2 * t1)<0.001f)
            {
                m_triangles->generalBuffer[i*33+8] = 0.0;
                m_triangles->generalBuffer[i*33+9] = 0.0;
                m_triangles->generalBuffer[i*33+10] = 1.0;
                m_triangles->generalBuffer[i*33+19] = 0.0;
                m_triangles->generalBuffer[i*33+20] = 0.0;
                m_triangles->generalBuffer[i*33+21] = 1.0;
                m_triangles->generalBuffer[i*33+30] = 0.0;
                m_triangles->generalBuffer[i*33+31] = 0.0;
                m_triangles->generalBuffer[i*33+32] = 1.0;
                
            }
            else
            {
                sgFloat r = 1.0F / (s1 * t2 - s2 * t1);
                
                SG_VECTOR sdir((t2 * x1 - t1 * x2) * r, (t2 * y1 - t1 * y2) * r, (t2 * z1 - t1 * z2) * r);
                SG_VECTOR tdir((s1 * x2 - s2 * x1) * r, (s1 * y2 - s2 * y1) * r, (s1 * z2 - s2 * z1) * r);
                
                for (int vI = 0; vI<=22; vI+=11)
                {
                    SG_VECTOR vert1_norm(m_triangles->generalBuffer[i*33 + vI + 3],
                        m_triangles->generalBuffer[i*33 + vI + 4],
                        m_triangles->generalBuffer[i*33 + vI + 5]);
                    
                    sgFloat     tmpVal1 = sgSpaceMath::VectorsScalarMult(vert1_norm, sdir);
                    SG_VECTOR tmpVect1(vert1_norm.x*tmpVal1, vert1_norm.y*tmpVal1, vert1_norm.z*tmpVal1);
                    tmpVect1 = sgSpaceMath::VectorsSub(sdir, tmpVect1);
                    sgSpaceMath::NormalVector(tmpVect1);
                    
                    m_triangles->generalBuffer[i*33 + vI + 8] = tmpVect1.x;
                    m_triangles->generalBuffer[i*33 + vI + 9] = tmpVect1.y;
                    m_triangles->generalBuffer[i*33 + vI + 10] = tmpVect1.z;
                    
                    // BITANGENT
                    
                    //tmpVal1 = sgSpaceMath::VectorsScalarMult(vert1_norm, tdir);
                    //SG_VECTOR tmpVect2 = {vert1_norm.x*tmpVal1, vert1_norm.y*tmpVal1, vert1_norm.z*tmpVal1};
                    //tmpVect2 = sgSpaceMath::VectorsSub(tdir, tmpVect2);
                    //sgSpaceMath::NormalVector(tmpVect2);
                    
                    //m_structs[startThisTrIndex + vI + 12] = tmpVect2.x;
                    //m_structs[startThisTrIndex + vI + 13] = tmpVect2.y;
                    //m_structs[startThisTrIndex + vI + 14] = tmpVect2.z;
                }
            }
            
        }
        
    }
    
    
    
}

sgFloat  sgC3DObject::GetVolume()
{
  if (m_objectType!=SG_BODY)
    return 0.0;

  BOOL     flgs[X_NUM];
  sgFloat   vals[X_NUM];

  for( int i=0; i<X_NUM; i++ ){
    flgs[i] = FALSE;
    vals[i] = 0.0;
  }
  flgs[X_VOLUME] = TRUE;
  Calculate_M_In(GetObjectHandle(this),1000.0, 1.0, flgs,vals);
  return vals[X_VOLUME];
}


sgFloat  sgC3DObject::GetSquare()
{
  BOOL     flgs[X_NUM];
  sgFloat   vals[X_NUM];

  for( int i=0; i<X_NUM; i++ ){
    flgs[i] = FALSE;
    vals[i] = 0.0;
  }
  flgs[X_SQUARE] = TRUE;
  Calculate_M_In(GetObjectHandle(this),1000.0, 1.0, flgs,vals);
  return vals[X_SQUARE];
}


/*
typedef struct {
sgFloat x,y;
} Point;
sgFloat PolygonArea(Point *polygon,int N)
{
  int i,j;
  sgFloat area = 0;
  for (i=0;i<N;i++)
  {
    j = (i + 1) % N;
    area += polygon[i].x * polygon[j].y;
    area -= polygon[i].y * polygon[j].x;
  }
  area /= 2;
  return(area < 0 ? -area : area);
}
 */
