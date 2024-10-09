#include "../../sg.h"
#include "BREPTriangulator.h"

#define  MAX_COUNT_OF_NODES           4*MAXNOV        
#define  MAX_COUNT_OF_SEGMENTS        4*MAXNOV
#define  MAX_COUNT_OF_HOLES			  MAXNOV

CBREPTriangulator::CBREPTriangulator(hOBJ objH):
        m_obj_handle(objH)
{
  //assert(objH);   // for ANDROID
  m_list_str = NULL;
  m_cur_np = NULL; 

  m_markers = (int*)malloc(MAX_COUNT_OF_NODES*sizeof(int));
  memset(m_markers,1,MAX_COUNT_OF_NODES*sizeof(int));

  m_nodes_buffer = (sgFloat*)malloc(MAX_COUNT_OF_NODES*sizeof(sgFloat));
  m_nodes_count = 0;

  m_normals_buffer = (sgFloat*)malloc(MAX_COUNT_OF_NODES*sizeof(sgFloat));

  m_segments_buffer = (int*)malloc(MAX_COUNT_OF_SEGMENTS*sizeof(int));
  m_segments_count = 0;

  m_holes_buffer = (sgFloat*)malloc(MAX_COUNT_OF_HOLES*sizeof(sgFloat));
  m_holes_count = 0;

  m_nTr = 0;   
  m_allVertex = NULL;
  m_allNormals = NULL;
    
  m_general_buffer = NULL;
  m_indexes = NULL;
}

CBREPTriangulator::~CBREPTriangulator()
{
	if (m_markers)
		free(m_markers);

	if (m_nodes_buffer)
	   free(m_nodes_buffer);
	if (m_normals_buffer)
		free(m_normals_buffer);
	if (m_segments_buffer)
		free(m_segments_buffer);
	if (m_holes_buffer)
		free(m_holes_buffer);

	m_markers = NULL;

	m_nodes_buffer = NULL;
	m_normals_buffer = NULL;
	m_nodes_count = 0;

	m_segments_buffer = NULL;
	m_segments_count = 0;

	m_holes_buffer = NULL;
	m_holes_count = 0;

	std::list<ONE_FACE_TRIANGLULATOR>::iterator Iter;
	for ( Iter = m_triangulators_buffer.begin( ); 
		  Iter != m_triangulators_buffer.end( ); Iter++ )
	{
		if ((*Iter).face_triangulator)
			delete (*Iter).face_triangulator;
		if ((*Iter).points_of_triangles_of_3_or_4_faces)
			free((*Iter).points_of_triangles_of_3_or_4_faces);
		if ((*Iter).normals_of_3_or_4_faces)
			free((*Iter).normals_of_3_or_4_faces);
	}
	m_triangulators_buffer.clear();
}

static BOOL look_user_last(lpNPW np, short edge){
	short iedge;

	iedge = abs(edge);
	if ( np->efr[iedge].el & ST_TD_CONSTR ) return TRUE;
	return FALSE;
}

#ifndef NEW_TRIANGULATION
bool CBREPTriangulator::TriangulateOneNP(NP_STR_LIST* list_str, NPW* cur_np, bool needSmoothNormals)
{
	//assert(list_str);   // for ANDROID
	//assert(cur_np);     // for ANDROID
	m_list_str = list_str;
	m_cur_np = cur_np; 

	m_TypeFace = SG_L_NP_SOFT;

	D_POINT   CurrentFaceNormal;
	D_POINT   p0 = {0.0, 0.0, 0.0};

	MATR 	  matr, matr_invert;

	short indxc = 0;
	for(short edgeTmp = 1 ; edgeTmp <= m_cur_np->noe ; edgeTmp++)
	{
		if( m_cur_np->efr[abs(edgeTmp)].el & ST_TD_CONSTR )
			indxc++;
	}
	
	if (indxc == 0 )
		m_TypeFace = SG_L_NP_SOFT;
	else  
		if (indxc == m_cur_np->noe)
			m_TypeFace = SG_L_NP_PLANE;
		else       
			m_TypeFace = SG_L_NP_SHARP;

	for( int i=1; i<=m_cur_np->nof; i++ )
	{
		short v = BE(m_cur_np->c[m_cur_np->f[i].fc].fe,m_cur_np);
		memset(&p0,0,sizeof(D_POINT));
		memset(&matr,0,sizeof(MATR));
		memset(&matr_invert,0,sizeof(MATR));

		m_nodes_count = 0;
		m_segments_count = 0;
		m_holes_count =0;

		CurrentFaceNormal=m_cur_np->p[i].v;
		o_hcunit(matr);
		o_tdtran(matr, dpoint_inv( &m_cur_np->v[v], &p0 ));   //    
		o_hcrot1(matr, &CurrentFaceNormal );
		o_minv( matr, matr_invert );

		short contour=m_cur_np->f[i].fc;
		short fedge;
		short edge;

		D_POINT curP,curP1;
		D_POINT curN;

		int     IndexOfStartPointOfContour=0;

		int     sharp_fir_tmp_ind=0;
		int     sharp_cur_tmp_ind=1;

		do
		{
			sharp_fir_tmp_ind = sharp_cur_tmp_ind-1;
			fedge = edge = m_cur_np->c[contour].fe;
			//    
			v = BE(edge,m_cur_np);
			o_hcncrd( matr, &m_cur_np->v[v], &curP );

			if (m_TypeFace!=SG_L_NP_PLANE)
			{
				short tmpEd = (m_TypeFace==SG_L_NP_SHARP)?edge:-edge;
				if( !needSmoothNormals || !np_vertex_normal(list_str, m_cur_np, tmpEd, &curN, look_user_last, TRUE) )
					curN = m_cur_np->p[i].v;
			}
			else
				curN=CurrentFaceNormal;

			if (m_TypeFace!=SG_L_NP_SHARP)
			{
				m_normals_buffer[3*m_nodes_count]=curN.x;
				m_normals_buffer[3*m_nodes_count+1]=curN.y;
				m_normals_buffer[3*m_nodes_count+2]=curN.z;
			}
			else
			{
				m_normals_buffer[3*sharp_cur_tmp_ind]=curN.x;
				m_normals_buffer[3*sharp_cur_tmp_ind+1]=curN.y;
				m_normals_buffer[3*sharp_cur_tmp_ind+2]=curN.z;
			}
			sharp_cur_tmp_ind++;

			//  
			IndexOfStartPointOfContour = m_nodes_count;	
			if (m_nodes_count==MAX_COUNT_OF_NODES)
			{
				//assert(0);    // for ANDROID
				return false;
			}
			m_nodes_buffer[2*m_nodes_count] = curP.x;
			m_nodes_buffer[2*m_nodes_count+1] = curP.y;
			m_nodes_count++;

			while(1)
			{
				short v1 = EE(edge,m_cur_np);
				if( (edge = SL(edge, m_cur_np)) == fedge ) break;

				o_hcncrd( matr, &m_cur_np->v[v1], &curP1 );

				if (m_TypeFace!=SG_L_NP_PLANE)
				{
					short tmpEd = (m_TypeFace==SG_L_NP_SHARP)?edge:-edge;
					if(!needSmoothNormals || !np_vertex_normal(list_str, m_cur_np, tmpEd, &curN, look_user_last, TRUE) )
						curN = m_cur_np->p[i].v;
				}
				else
					curN=CurrentFaceNormal;

				if (m_TypeFace!=SG_L_NP_SHARP)
				{
					m_normals_buffer[3*m_nodes_count]=curN.x;
					m_normals_buffer[3*m_nodes_count+1]=curN.y;
					m_normals_buffer[3*m_nodes_count+2]=curN.z;
				}
				else
				{
					m_normals_buffer[3*sharp_cur_tmp_ind]=curN.x;
					m_normals_buffer[3*sharp_cur_tmp_ind+1]=curN.y;
					m_normals_buffer[3*sharp_cur_tmp_ind+2]=curN.z;
				}
				sharp_cur_tmp_ind++;
				
				if (m_nodes_count==MAX_COUNT_OF_NODES)
				{
					//assert(0);     // for ANDROID
					return false;
				}
				m_nodes_buffer[2*m_nodes_count] = curP1.x;
				m_nodes_buffer[2*m_nodes_count+1] = curP1.y;
				m_nodes_count++;
			}

			if (IndexOfStartPointOfContour>0)
			{
				SG_POINT holP = GetAnyInsidePointOfControur(
							m_nodes_buffer+2*IndexOfStartPointOfContour,
							m_nodes_count-IndexOfStartPointOfContour);
					
					if (m_holes_count==MAX_COUNT_OF_HOLES)
					{
						//assert(0);   // for ANDROID
						return false;
					}
					m_holes_buffer[2*m_holes_count] = holP.x;
					m_holes_buffer[2*m_holes_count+1] = holP.y;
					m_holes_count++;
			}
			
			//---------------------   - -----------------------------
			for( unsigned int j=IndexOfStartPointOfContour; j<m_nodes_count-1; j++ )
			{
				if (m_segments_count==MAX_COUNT_OF_SEGMENTS)
				{
					//assert(0);     // for ANDROID
					return false;
				}
				m_segments_buffer[2*m_segments_count] = j;
				m_segments_buffer[2*m_segments_count+1] = j+1;
				m_segments_count++;
			}

			if (m_segments_count==MAX_COUNT_OF_SEGMENTS)
			{
				//assert(0);    // for ANDROID
				return false;
			}
			m_segments_buffer[2*m_segments_count] = m_nodes_count-1;
			m_segments_buffer[2*m_segments_count+1] = IndexOfStartPointOfContour;
			m_segments_count++;

			if (m_TypeFace==SG_L_NP_SHARP)
			{
				m_normals_buffer[3*sharp_fir_tmp_ind]=m_normals_buffer[3*(sharp_cur_tmp_ind-1)];
				m_normals_buffer[3*sharp_fir_tmp_ind+1]=m_normals_buffer[3*(sharp_cur_tmp_ind-1)+1];
				m_normals_buffer[3*sharp_fir_tmp_ind+2]=m_normals_buffer[3*(sharp_cur_tmp_ind-1)+2];
			}
	
			//------------------------------------------------------------------------------
			//  
			contour=m_cur_np->c[contour].nc;
		}while(contour);
		
		ONE_FACE_TRIANGLULATOR tmpFT;
		memset(&tmpFT,0, sizeof(ONE_FACE_TRIANGLULATOR));
		memcpy(&tmpFT.face_invert_matr,&matr_invert,sizeof(MATR));
		memcpy(&tmpFT.face_normal,&CurrentFaceNormal,sizeof(D_POINT));
		
		if ((m_nodes_count==3 || m_nodes_count==4) && m_holes_count==0)
		{
			if (m_nodes_count==3)
			{
				tmpFT.count_of_points_of_triangles_of_3_or_4_faces = 3;
				tmpFT.points_of_triangles_of_3_or_4_faces = 
					(SG_POINT*)malloc(3*sizeof(SG_POINT));
				
				tmpFT.points_of_triangles_of_3_or_4_faces[0].x = m_nodes_buffer[0];
				tmpFT.points_of_triangles_of_3_or_4_faces[0].y = m_nodes_buffer[1];
				tmpFT.points_of_triangles_of_3_or_4_faces[0].z = 0.0;
				tmpFT.points_of_triangles_of_3_or_4_faces[1].x = m_nodes_buffer[2];
				tmpFT.points_of_triangles_of_3_or_4_faces[1].y = m_nodes_buffer[3];
				tmpFT.points_of_triangles_of_3_or_4_faces[1].z = 0.0;
				tmpFT.points_of_triangles_of_3_or_4_faces[2].x = m_nodes_buffer[4];
				tmpFT.points_of_triangles_of_3_or_4_faces[2].y = m_nodes_buffer[5];
				tmpFT.points_of_triangles_of_3_or_4_faces[2].z = 0.0;

				tmpFT.normals_of_3_or_4_faces = 
					(SG_VECTOR*)malloc(3*sizeof(SG_VECTOR));

				tmpFT.normals_of_3_or_4_faces[0].x = m_normals_buffer[0];
				tmpFT.normals_of_3_or_4_faces[0].y = m_normals_buffer[1];
				tmpFT.normals_of_3_or_4_faces[0].z = m_normals_buffer[2];
				tmpFT.normals_of_3_or_4_faces[1].x = m_normals_buffer[3];
				tmpFT.normals_of_3_or_4_faces[1].y = m_normals_buffer[4];
				tmpFT.normals_of_3_or_4_faces[1].z = m_normals_buffer[5];
				tmpFT.normals_of_3_or_4_faces[2].x = m_normals_buffer[6];
				tmpFT.normals_of_3_or_4_faces[2].y = m_normals_buffer[7];
				tmpFT.normals_of_3_or_4_faces[2].z = m_normals_buffer[8];
			}
			else
				if (m_nodes_count==4)
				{
					tmpFT.count_of_points_of_triangles_of_3_or_4_faces = 4;
					tmpFT.points_of_triangles_of_3_or_4_faces = 
						(SG_POINT*)malloc(6*sizeof(SG_POINT));
					tmpFT.normals_of_3_or_4_faces = 
						(SG_VECTOR*)malloc(6*sizeof(SG_VECTOR));
					if (CalcOptimalTrianglesFor4Face())
					{
						tmpFT.points_of_triangles_of_3_or_4_faces[0].x = m_nodes_buffer[0];
						tmpFT.points_of_triangles_of_3_or_4_faces[0].y = m_nodes_buffer[1];
						tmpFT.points_of_triangles_of_3_or_4_faces[0].z = 0.0;
						tmpFT.points_of_triangles_of_3_or_4_faces[1].x = m_nodes_buffer[2];
						tmpFT.points_of_triangles_of_3_or_4_faces[1].y = m_nodes_buffer[3];
						tmpFT.points_of_triangles_of_3_or_4_faces[1].z = 0.0;
						tmpFT.points_of_triangles_of_3_or_4_faces[2].x = m_nodes_buffer[4];
						tmpFT.points_of_triangles_of_3_or_4_faces[2].y = m_nodes_buffer[5];
						tmpFT.points_of_triangles_of_3_or_4_faces[2].z = 0.0;

						tmpFT.points_of_triangles_of_3_or_4_faces[3].x = m_nodes_buffer[0];
						tmpFT.points_of_triangles_of_3_or_4_faces[3].y = m_nodes_buffer[1];
						tmpFT.points_of_triangles_of_3_or_4_faces[3].z = 0.0;
						tmpFT.points_of_triangles_of_3_or_4_faces[4].x = m_nodes_buffer[4];
						tmpFT.points_of_triangles_of_3_or_4_faces[4].y = m_nodes_buffer[5];
						tmpFT.points_of_triangles_of_3_or_4_faces[4].z = 0.0;
						tmpFT.points_of_triangles_of_3_or_4_faces[5].x = m_nodes_buffer[6];
						tmpFT.points_of_triangles_of_3_or_4_faces[5].y = m_nodes_buffer[7];
						tmpFT.points_of_triangles_of_3_or_4_faces[5].z = 0.0;

						tmpFT.normals_of_3_or_4_faces[0].x = m_normals_buffer[0];
						tmpFT.normals_of_3_or_4_faces[0].y = m_normals_buffer[1];
						tmpFT.normals_of_3_or_4_faces[0].z = m_normals_buffer[2];
						tmpFT.normals_of_3_or_4_faces[1].x = m_normals_buffer[3];
						tmpFT.normals_of_3_or_4_faces[1].y = m_normals_buffer[4];
						tmpFT.normals_of_3_or_4_faces[1].z = m_normals_buffer[5];
						tmpFT.normals_of_3_or_4_faces[2].x = m_normals_buffer[6];
						tmpFT.normals_of_3_or_4_faces[2].y = m_normals_buffer[7];
						tmpFT.normals_of_3_or_4_faces[2].z = m_normals_buffer[8];

						tmpFT.normals_of_3_or_4_faces[3].x = m_normals_buffer[0];
						tmpFT.normals_of_3_or_4_faces[3].y = m_normals_buffer[1];
						tmpFT.normals_of_3_or_4_faces[3].z = m_normals_buffer[2];
						tmpFT.normals_of_3_or_4_faces[4].x = m_normals_buffer[6];
						tmpFT.normals_of_3_or_4_faces[4].y = m_normals_buffer[7];
						tmpFT.normals_of_3_or_4_faces[4].z = m_normals_buffer[8];
						tmpFT.normals_of_3_or_4_faces[5].x = m_normals_buffer[9];
						tmpFT.normals_of_3_or_4_faces[5].y = m_normals_buffer[10];
						tmpFT.normals_of_3_or_4_faces[5].z = m_normals_buffer[11];
					}
					else
					{
						tmpFT.points_of_triangles_of_3_or_4_faces[0].x = m_nodes_buffer[0];
						tmpFT.points_of_triangles_of_3_or_4_faces[0].y = m_nodes_buffer[1];
						tmpFT.points_of_triangles_of_3_or_4_faces[0].z = 0.0;
						tmpFT.points_of_triangles_of_3_or_4_faces[1].x = m_nodes_buffer[2];
						tmpFT.points_of_triangles_of_3_or_4_faces[1].y = m_nodes_buffer[3];
						tmpFT.points_of_triangles_of_3_or_4_faces[1].z = 0.0;
						tmpFT.points_of_triangles_of_3_or_4_faces[2].x = m_nodes_buffer[6];
						tmpFT.points_of_triangles_of_3_or_4_faces[2].y = m_nodes_buffer[7];
						tmpFT.points_of_triangles_of_3_or_4_faces[2].z = 0.0;

						tmpFT.points_of_triangles_of_3_or_4_faces[3].x = m_nodes_buffer[2];
						tmpFT.points_of_triangles_of_3_or_4_faces[3].y = m_nodes_buffer[3];
						tmpFT.points_of_triangles_of_3_or_4_faces[3].z = 0.0;
						tmpFT.points_of_triangles_of_3_or_4_faces[4].x = m_nodes_buffer[4];
						tmpFT.points_of_triangles_of_3_or_4_faces[4].y = m_nodes_buffer[5];
						tmpFT.points_of_triangles_of_3_or_4_faces[4].z = 0.0;
						tmpFT.points_of_triangles_of_3_or_4_faces[5].x = m_nodes_buffer[6];
						tmpFT.points_of_triangles_of_3_or_4_faces[5].y = m_nodes_buffer[7];
						tmpFT.points_of_triangles_of_3_or_4_faces[5].z = 0.0;

						tmpFT.normals_of_3_or_4_faces[0].x = m_normals_buffer[0];
						tmpFT.normals_of_3_or_4_faces[0].y = m_normals_buffer[1];
						tmpFT.normals_of_3_or_4_faces[0].z = m_normals_buffer[2];
						tmpFT.normals_of_3_or_4_faces[1].x = m_normals_buffer[3];
						tmpFT.normals_of_3_or_4_faces[1].y = m_normals_buffer[4];
						tmpFT.normals_of_3_or_4_faces[1].z = m_normals_buffer[5];
						tmpFT.normals_of_3_or_4_faces[2].x = m_normals_buffer[9];
						tmpFT.normals_of_3_or_4_faces[2].y = m_normals_buffer[10];
						tmpFT.normals_of_3_or_4_faces[2].z = m_normals_buffer[11];

						tmpFT.normals_of_3_or_4_faces[3].x = m_normals_buffer[3];
						tmpFT.normals_of_3_or_4_faces[3].y = m_normals_buffer[4];
						tmpFT.normals_of_3_or_4_faces[3].z = m_normals_buffer[5];
						tmpFT.normals_of_3_or_4_faces[4].x = m_normals_buffer[6];
						tmpFT.normals_of_3_or_4_faces[4].y = m_normals_buffer[7];
						tmpFT.normals_of_3_or_4_faces[4].z = m_normals_buffer[8];
						tmpFT.normals_of_3_or_4_faces[5].x = m_normals_buffer[9];
						tmpFT.normals_of_3_or_4_faces[5].y = m_normals_buffer[10];
						tmpFT.normals_of_3_or_4_faces[5].z = m_normals_buffer[11];
					}
				}
				//else
				//	assert(0);    // for ANDROID
		}
		else
		{
			tmpFT.face_triangulator = new CTriangulator;
			tmpFT.face_triangulator->SetAllPoints(m_nodes_count, m_nodes_buffer,
				m_normals_buffer,m_markers);
			tmpFT.face_triangulator->SetAllSegments(m_segments_count, 
				m_segments_buffer,m_markers);
			tmpFT.face_triangulator->SetAllHoles(m_holes_count, m_holes_buffer);

			if (!tmpFT.face_triangulator->StartTriangulate())
			{
				tmpFT.face_triangulator->CorrectPointsCollisions();
				tmpFT.face_triangulator->StartTriangulate();
			}	
			
			tmpFT.face_triangulator->ClearNotAll();
		}

		m_triangulators_buffer.push_back(tmpFT);

	}
  return true;
}
#else
bool   CBREPTriangulator::TriangulateOneNP(short piece, int& triangles_count)
{
	sgC3DObject*  obj3D = reinterpret_cast<sgC3DObject*>((static_cast<lpOBJ>(m_obj_handle))->extendedClass);
	sgCBRep*  brep = obj3D->GetBRep();

	m_cur_np = GetNPWFromBRepPiece(brep->GetPiece(piece)); 

	m_TypeFace = SG_L_NP_SOFT;

	D_POINT   CurrentFaceNormal;
	D_POINT   p0 = {0.0, 0.0, 0.0};

	MATR 	  matr, matr_invert;

	short ic = 0;
	for(short edge = 1 ; edge <= m_cur_np->noe ; edge++)   
	{
        int indxx = abs(edge);
        if( m_cur_np->efr[indxx].el & ST_TD_CONSTR )
			ic++;
	}
	if (ic == 0 )
		m_TypeFace = SG_L_NP_SOFT;
	else  
		if (ic == m_cur_np->noe) 
			m_TypeFace = SG_L_NP_PLANE;
		else       
			m_TypeFace = SG_L_NP_SHARP;

	triangles_count = 0;

	for( int i=1; i<=m_cur_np->nof; i++ )
	{
		short v = BE(m_cur_np->c[m_cur_np->f[i].fc].fe,m_cur_np);
		memset(&p0,0,sizeof(D_POINT));
		memset(&matr,0,sizeof(MATR));
		memset(&matr_invert,0,sizeof(MATR));

		m_nodes_count = 0;
		m_segments_count = 0;
		m_holes_count =0;

		CurrentFaceNormal=m_cur_np->p[i].v;
		o_hcunit(matr);
		o_tdtran(matr, dpoint_inv( &m_cur_np->v[v], &p0 ));   //    
		o_hcrot1(matr, &CurrentFaceNormal );
		o_minv( matr, matr_invert );

		short contour=m_cur_np->f[i].fc;
		short fedge;
		short edge;

		D_POINT curP,curP1;
		D_POINT curN;

		int     IndexOfStartPointOfContour=0;

		int     sharp_fir_tmp_ind=0;
		int     sharp_cur_tmp_ind=1;

		do
		{
			sharp_fir_tmp_ind = sharp_cur_tmp_ind-1;
			fedge = edge = m_cur_np->c[contour].fe;
			//    
			v = BE(edge,m_cur_np);
			o_hcncrd( matr, &m_cur_np->v[v], &curP );

			if (m_TypeFace!=SG_L_NP_PLANE)
			{
				short tmpEd = (m_TypeFace==SG_L_NP_SHARP)?edge:-edge;
				if( !RA_np_vertex_normal(brep, piece, tmpEd, &curN, look_user_last, TRUE) ) 
					curN = m_cur_np->p[i].v;
			}
			else
				curN=CurrentFaceNormal;

			if (m_TypeFace!=SG_L_NP_SHARP)
			{
				m_normals_buffer[3*m_nodes_count]=curN.x;
				m_normals_buffer[3*m_nodes_count+1]=curN.y;
				m_normals_buffer[3*m_nodes_count+2]=curN.z;
			}
			else
			{
				m_normals_buffer[3*sharp_cur_tmp_ind]=curN.x;
				m_normals_buffer[3*sharp_cur_tmp_ind+1]=curN.y;
				m_normals_buffer[3*sharp_cur_tmp_ind+2]=curN.z;
			}
			sharp_cur_tmp_ind++;

			//  
			IndexOfStartPointOfContour = m_nodes_count;	
			if (m_nodes_count==MAX_COUNT_OF_NODES)
			{
				//assert(0);    // for ANDROID
				return false;
			}
			m_nodes_buffer[2*m_nodes_count] = curP.x;
			m_nodes_buffer[2*m_nodes_count+1] = curP.y;
			m_nodes_count++;

			while(1)
			{
				short v1 = EE(edge,m_cur_np);
				if( (edge = SL(edge, m_cur_np)) == fedge ) break;

				o_hcncrd( matr, &m_cur_np->v[v1], &curP1 );

				if (m_TypeFace!=SG_L_NP_PLANE)
				{
					short tmpEd = (m_TypeFace==SG_L_NP_SHARP)?edge:-edge;
					if( !RA_np_vertex_normal(brep, piece, tmpEd, &curN, look_user_last, TRUE) ) 
						curN = m_cur_np->p[i].v;
				}
				else
					curN=CurrentFaceNormal;

				if (m_TypeFace!=SG_L_NP_SHARP)
				{
					m_normals_buffer[3*m_nodes_count]=curN.x;
					m_normals_buffer[3*m_nodes_count+1]=curN.y;
					m_normals_buffer[3*m_nodes_count+2]=curN.z;
				}
				else
				{
					m_normals_buffer[3*sharp_cur_tmp_ind]=curN.x;
					m_normals_buffer[3*sharp_cur_tmp_ind+1]=curN.y;
					m_normals_buffer[3*sharp_cur_tmp_ind+2]=curN.z;
				}
				sharp_cur_tmp_ind++;

				if (m_nodes_count==MAX_COUNT_OF_NODES)
				{
					//assert(0);    // for ANDROID
					return false;
				}
				m_nodes_buffer[2*m_nodes_count] = curP1.x;
				m_nodes_buffer[2*m_nodes_count+1] = curP1.y;
				m_nodes_count++;
			}

			if (IndexOfStartPointOfContour>0)
			{
				SG_POINT holP = GetAnyInsidePointOfControur(
					m_nodes_buffer+2*IndexOfStartPointOfContour,
					m_nodes_count-IndexOfStartPointOfContour);

				if (m_holes_count==MAX_COUNT_OF_HOLES)
				{
					//assert(0);   // for ANDROID
					return false;
				}
				m_holes_buffer[2*m_holes_count] = holP.x;
				m_holes_buffer[2*m_holes_count+1] = holP.y;
				m_holes_count++;
			}

			//---------------------   - -----------------------------
			for( unsigned int j=IndexOfStartPointOfContour; j<m_nodes_count-1; j++ )
			{
				if (m_segments_count==MAX_COUNT_OF_SEGMENTS)
				{
					//assert(0);    // for ANDROID
					return false;
				}
				m_segments_buffer[2*m_segments_count] = j;
				m_segments_buffer[2*m_segments_count+1] = j+1;
				m_segments_count++;
			}

			if (m_segments_count==MAX_COUNT_OF_SEGMENTS)
			{
				//assert(0);    // for ANDROID
				return false;
			}
			m_segments_buffer[2*m_segments_count] = m_nodes_count-1;
			m_segments_buffer[2*m_segments_count+1] = IndexOfStartPointOfContour;
			m_segments_count++;

			if (m_TypeFace==SG_L_NP_SHARP)
			{
				m_normals_buffer[3*sharp_fir_tmp_ind]=m_normals_buffer[3*(sharp_cur_tmp_ind-1)];
				m_normals_buffer[3*sharp_fir_tmp_ind+1]=m_normals_buffer[3*(sharp_cur_tmp_ind-1)+1];
				m_normals_buffer[3*sharp_fir_tmp_ind+2]=m_normals_buffer[3*(sharp_cur_tmp_ind-1)+2];
			}

			//------------------------------------------------------------------------------
			//  
			contour=m_cur_np->c[contour].nc;
		}while(contour);

		ONE_FACE_TRIANGLULATOR tmpFT;
		memset(&tmpFT,0, sizeof(ONE_FACE_TRIANGLULATOR));
		memcpy(&tmpFT.face_invert_matr,&matr_invert,sizeof(MATR));
		memcpy(&tmpFT.face_normal,&CurrentFaceNormal,sizeof(D_POINT));

		if ((m_nodes_count==3 || m_nodes_count==4) && m_holes_count==0)
		{
			if (m_nodes_count==3)
			{
				tmpFT.count_of_points_of_triangles_of_3_or_4_faces = 3;
				tmpFT.points_of_triangles_of_3_or_4_faces = 
					(SG_POINT*)malloc(3*sizeof(SG_POINT));

				tmpFT.points_of_triangles_of_3_or_4_faces[0].x = m_nodes_buffer[0];
				tmpFT.points_of_triangles_of_3_or_4_faces[0].y = m_nodes_buffer[1];
				tmpFT.points_of_triangles_of_3_or_4_faces[0].z = 0.0;
				tmpFT.points_of_triangles_of_3_or_4_faces[1].x = m_nodes_buffer[2];
				tmpFT.points_of_triangles_of_3_or_4_faces[1].y = m_nodes_buffer[3];
				tmpFT.points_of_triangles_of_3_or_4_faces[1].z = 0.0;
				tmpFT.points_of_triangles_of_3_or_4_faces[2].x = m_nodes_buffer[4];
				tmpFT.points_of_triangles_of_3_or_4_faces[2].y = m_nodes_buffer[5];
				tmpFT.points_of_triangles_of_3_or_4_faces[2].z = 0.0;

				tmpFT.normals_of_3_or_4_faces = 
					(SG_VECTOR*)malloc(3*sizeof(SG_VECTOR));

				tmpFT.normals_of_3_or_4_faces[0].x = m_normals_buffer[0];
				tmpFT.normals_of_3_or_4_faces[0].y = m_normals_buffer[1];
				tmpFT.normals_of_3_or_4_faces[0].z = m_normals_buffer[2];
				tmpFT.normals_of_3_or_4_faces[1].x = m_normals_buffer[3];
				tmpFT.normals_of_3_or_4_faces[1].y = m_normals_buffer[4];
				tmpFT.normals_of_3_or_4_faces[1].z = m_normals_buffer[5];
				tmpFT.normals_of_3_or_4_faces[2].x = m_normals_buffer[6];
				tmpFT.normals_of_3_or_4_faces[2].y = m_normals_buffer[7];
				tmpFT.normals_of_3_or_4_faces[2].z = m_normals_buffer[8];
			}
			else
				if (m_nodes_count==4)
				{
					tmpFT.count_of_points_of_triangles_of_3_or_4_faces = 4;
					tmpFT.points_of_triangles_of_3_or_4_faces = 
						(SG_POINT*)malloc(6*sizeof(SG_POINT));
					tmpFT.normals_of_3_or_4_faces = 
						(SG_VECTOR*)malloc(6*sizeof(SG_VECTOR));
					if (CalcOptimalTrianglesFor4Face())
					{
						tmpFT.points_of_triangles_of_3_or_4_faces[0].x = m_nodes_buffer[0];
						tmpFT.points_of_triangles_of_3_or_4_faces[0].y = m_nodes_buffer[1];
						tmpFT.points_of_triangles_of_3_or_4_faces[0].z = 0.0;
						tmpFT.points_of_triangles_of_3_or_4_faces[1].x = m_nodes_buffer[2];
						tmpFT.points_of_triangles_of_3_or_4_faces[1].y = m_nodes_buffer[3];
						tmpFT.points_of_triangles_of_3_or_4_faces[1].z = 0.0;
						tmpFT.points_of_triangles_of_3_or_4_faces[2].x = m_nodes_buffer[4];
						tmpFT.points_of_triangles_of_3_or_4_faces[2].y = m_nodes_buffer[5];
						tmpFT.points_of_triangles_of_3_or_4_faces[2].z = 0.0;

						tmpFT.points_of_triangles_of_3_or_4_faces[3].x = m_nodes_buffer[0];
						tmpFT.points_of_triangles_of_3_or_4_faces[3].y = m_nodes_buffer[1];
						tmpFT.points_of_triangles_of_3_or_4_faces[3].z = 0.0;
						tmpFT.points_of_triangles_of_3_or_4_faces[4].x = m_nodes_buffer[4];
						tmpFT.points_of_triangles_of_3_or_4_faces[4].y = m_nodes_buffer[5];
						tmpFT.points_of_triangles_of_3_or_4_faces[4].z = 0.0;
						tmpFT.points_of_triangles_of_3_or_4_faces[5].x = m_nodes_buffer[6];
						tmpFT.points_of_triangles_of_3_or_4_faces[5].y = m_nodes_buffer[7];
						tmpFT.points_of_triangles_of_3_or_4_faces[5].z = 0.0;

						tmpFT.normals_of_3_or_4_faces[0].x = m_normals_buffer[0];
						tmpFT.normals_of_3_or_4_faces[0].y = m_normals_buffer[1];
						tmpFT.normals_of_3_or_4_faces[0].z = m_normals_buffer[2];
						tmpFT.normals_of_3_or_4_faces[1].x = m_normals_buffer[3];
						tmpFT.normals_of_3_or_4_faces[1].y = m_normals_buffer[4];
						tmpFT.normals_of_3_or_4_faces[1].z = m_normals_buffer[5];
						tmpFT.normals_of_3_or_4_faces[2].x = m_normals_buffer[6];
						tmpFT.normals_of_3_or_4_faces[2].y = m_normals_buffer[7];
						tmpFT.normals_of_3_or_4_faces[2].z = m_normals_buffer[8];

						tmpFT.normals_of_3_or_4_faces[3].x = m_normals_buffer[0];
						tmpFT.normals_of_3_or_4_faces[3].y = m_normals_buffer[1];
						tmpFT.normals_of_3_or_4_faces[3].z = m_normals_buffer[2];
						tmpFT.normals_of_3_or_4_faces[4].x = m_normals_buffer[6];
						tmpFT.normals_of_3_or_4_faces[4].y = m_normals_buffer[7];
						tmpFT.normals_of_3_or_4_faces[4].z = m_normals_buffer[8];
						tmpFT.normals_of_3_or_4_faces[5].x = m_normals_buffer[9];
						tmpFT.normals_of_3_or_4_faces[5].y = m_normals_buffer[10];
						tmpFT.normals_of_3_or_4_faces[5].z = m_normals_buffer[11];
					}
					else
					{
						tmpFT.points_of_triangles_of_3_or_4_faces[0].x = m_nodes_buffer[0];
						tmpFT.points_of_triangles_of_3_or_4_faces[0].y = m_nodes_buffer[1];
						tmpFT.points_of_triangles_of_3_or_4_faces[0].z = 0.0;
						tmpFT.points_of_triangles_of_3_or_4_faces[1].x = m_nodes_buffer[2];
						tmpFT.points_of_triangles_of_3_or_4_faces[1].y = m_nodes_buffer[3];
						tmpFT.points_of_triangles_of_3_or_4_faces[1].z = 0.0;
						tmpFT.points_of_triangles_of_3_or_4_faces[2].x = m_nodes_buffer[6];
						tmpFT.points_of_triangles_of_3_or_4_faces[2].y = m_nodes_buffer[7];
						tmpFT.points_of_triangles_of_3_or_4_faces[2].z = 0.0;

						tmpFT.points_of_triangles_of_3_or_4_faces[3].x = m_nodes_buffer[2];
						tmpFT.points_of_triangles_of_3_or_4_faces[3].y = m_nodes_buffer[3];
						tmpFT.points_of_triangles_of_3_or_4_faces[3].z = 0.0;
						tmpFT.points_of_triangles_of_3_or_4_faces[4].x = m_nodes_buffer[4];
						tmpFT.points_of_triangles_of_3_or_4_faces[4].y = m_nodes_buffer[5];
						tmpFT.points_of_triangles_of_3_or_4_faces[4].z = 0.0;
						tmpFT.points_of_triangles_of_3_or_4_faces[5].x = m_nodes_buffer[6];
						tmpFT.points_of_triangles_of_3_or_4_faces[5].y = m_nodes_buffer[7];
						tmpFT.points_of_triangles_of_3_or_4_faces[5].z = 0.0;

						tmpFT.normals_of_3_or_4_faces[0].x = m_normals_buffer[0];
						tmpFT.normals_of_3_or_4_faces[0].y = m_normals_buffer[1];
						tmpFT.normals_of_3_or_4_faces[0].z = m_normals_buffer[2];
						tmpFT.normals_of_3_or_4_faces[1].x = m_normals_buffer[3];
						tmpFT.normals_of_3_or_4_faces[1].y = m_normals_buffer[4];
						tmpFT.normals_of_3_or_4_faces[1].z = m_normals_buffer[5];
						tmpFT.normals_of_3_or_4_faces[2].x = m_normals_buffer[9];
						tmpFT.normals_of_3_or_4_faces[2].y = m_normals_buffer[10];
						tmpFT.normals_of_3_or_4_faces[2].z = m_normals_buffer[11];

						tmpFT.normals_of_3_or_4_faces[3].x = m_normals_buffer[3];
						tmpFT.normals_of_3_or_4_faces[3].y = m_normals_buffer[4];
						tmpFT.normals_of_3_or_4_faces[3].z = m_normals_buffer[5];
						tmpFT.normals_of_3_or_4_faces[4].x = m_normals_buffer[6];
						tmpFT.normals_of_3_or_4_faces[4].y = m_normals_buffer[7];
						tmpFT.normals_of_3_or_4_faces[4].z = m_normals_buffer[8];
						tmpFT.normals_of_3_or_4_faces[5].x = m_normals_buffer[9];
						tmpFT.normals_of_3_or_4_faces[5].y = m_normals_buffer[10];
						tmpFT.normals_of_3_or_4_faces[5].z = m_normals_buffer[11];
					}
				}
				//else
				//	assert(0);     // for ANDROID
		}
		else
		{
			tmpFT.face_triangulator = new CTriangulator;
			tmpFT.face_triangulator->SetAllPoints(m_nodes_count, m_nodes_buffer,
				m_normals_buffer,m_markers);
			tmpFT.face_triangulator->SetAllSegments(m_segments_count, 
				m_segments_buffer,m_markers);
			tmpFT.face_triangulator->SetAllHoles(m_holes_count, m_holes_buffer);

			if (!tmpFT.face_triangulator->StartTriangulate())
			{
				tmpFT.face_triangulator->CorrectPointsCollisions();
				tmpFT.face_triangulator->StartTriangulate();
			}	
			
			tmpFT.face_triangulator->ClearNotAll();
		}

		unsigned int tmpTrCnt=0;
		if (tmpFT.face_triangulator)
			tmpFT.face_triangulator->GetTrianglesCount(tmpTrCnt);
		else
		{
			if (tmpFT.count_of_points_of_triangles_of_3_or_4_faces==3)
			{
				//assert(tmpFT.points_of_triangles_of_3_or_4_faces);    // for ANDROID
				tmpTrCnt=1;
			}
			else
				if (tmpFT.count_of_points_of_triangles_of_3_or_4_faces==4)
				{
					//assert(tmpFT.points_of_triangles_of_3_or_4_faces);   // for ANDROID
					tmpTrCnt=2;
				}
				//else
					//assert(0);    // for ANDROID
		}
		triangles_count+=tmpTrCnt;

		m_triangulators_buffer.push_back(tmpFT);
	}

	return true;
}
#endif

bool   CBREPTriangulator::CalcOptimalTrianglesFor4Face()
{
	SG_POINT ppp[4];
	ppp[0].x = m_nodes_buffer[0];
	ppp[0].y = m_nodes_buffer[1];
	ppp[0].z = 0.0;
	ppp[1].x = m_nodes_buffer[2];
	ppp[1].y = m_nodes_buffer[3];
	ppp[1].z = 0.0;
	ppp[2].x = m_nodes_buffer[4];
	ppp[2].y = m_nodes_buffer[5];
	ppp[2].z = 0.0;
	ppp[3].x = m_nodes_buffer[6];
	ppp[3].y = m_nodes_buffer[7];
	ppp[3].z = 0.0;

	SG_POINT mids[2];
	mids[0].x =(ppp[0].x+ppp[2].x)*0.5;
	mids[0].y =(ppp[0].y+ppp[2].y)*0.5;
	mids[0].z = 0.0;
	/*mids[1].x = (ppp[1].x+ppp[3].x)*0.5;
	mids[1].y = (ppp[1].y+ppp[3].y)*0.5;
	mids[1].z = 0.0;*/

	if (!Is2DPointInside2DPolygon(&ppp[0],4,mids[0]))
		return false;
	return true;
	
}

SG_POINT   CBREPTriangulator::GetAnyInsidePointOfControur(sgFloat* start_pnt, unsigned int count)
{
	SG_POINT resP;

	sgFloat min_x = FLT_MAX;
	sgFloat pred_min_x = FLT_MAX;
	unsigned int min_x_index = 0;
	int found=0;
	for (unsigned  int i=0;i<2*count;i+=2)
	{
		if(found==0)
		{
			min_x=start_pnt[i];
			min_x_index = i;
			found=1;
			continue;
		}
		if(fabs(start_pnt[i]-min_x)<eps_d) 
			continue;
		if(found==2 && start_pnt[i]>=pred_min_x) continue;
		if(start_pnt[i] < min_x)
		{
			pred_min_x=min_x;
			min_x=start_pnt[i];
			min_x_index = i;
		}
		else
		{
			pred_min_x=start_pnt[i];
		}
		found=2;
	}

	//assert(fabs(pred_min_x-min_x)>eps_d);    // for ANDROID

	SG_POINT min_p;
	SG_POINT min_p_2;
	SG_POINT min_p_3;
	min_p.x = start_pnt[min_x_index];
	min_p.y = start_pnt[min_x_index+1];
	min_p.z = 0.0;

	if (min_x_index==0)
	{
		min_p_2.x = start_pnt[2*count-2];
		min_p_2.y = start_pnt[2*count-1];
	}
	else
	{
		min_p_2.x = start_pnt[min_x_index-2];
		min_p_2.y = start_pnt[min_x_index-1];
	}
	min_p_2.z = 0.0;

	if (min_x_index==(2*count-2))
	{
		min_p_3.x = start_pnt[0];
		min_p_3.y = start_pnt[1];
	}
	else
	{
		min_p_3.x = start_pnt[min_x_index+2];
		min_p_3.y = start_pnt[min_x_index+3];
	}
	min_p_3.z = 0.0;

	if ( min_p_2.x>pred_min_x &&
		fabs(min_p_2.x-min_x)>eps_d)
	{
		sgFloat coeff = (pred_min_x-min_x)/(min_p_2.x-min_x);
		min_p_2.y = min_p.y+(min_p_2.y-min_p.y)*coeff;
		min_p_2.x = pred_min_x;
	}

	if ( min_p_3.x>pred_min_x &&
		fabs(min_p_3.x-min_x)>eps_d)
	{
		sgFloat coeff = (pred_min_x-min_x)/(min_p_3.x-min_x);
		min_p_3.y = min_p.y+(min_p_3.y-min_p.y)*coeff;
		min_p_3.x = pred_min_x;
	}

	resP.x = (min_p.x+min_p_2.x+min_p_3.x)/3;
	resP.y = (min_p.y+min_p_2.y+min_p_3.y)/3;
	resP.z = 0.0;
	
	return resP;
}



/*void       CBREPTriangulator::CorrectContourCollisions(sgFloat* start_pnt, unsigned int count)
{
	SG_POINT resP;

	sgFloat min_x = FLT_MAX;
	sgFloat pred_min_x = FLT_MAX;
	unsigned int min_x_index = 0;
	int found=0;
	for (unsigned  int j=0;j<2*(count-1);j+=2)
	 for (unsigned  int i=j+4;i<2*(count-1);i+=2)
	{
		if (fabs(start_pnt[i]-start_pnt[j])<FLT_MIN &&
			fabs(start_pnt[i+1]-start_pnt[j+1])<FLT_MIN)
		{
			sgFloat dir_to_prev[2];
			dir_to_prev[0] = start_pnt[i-2]-start_pnt[i];
			dir_to_prev[1] = start_pnt[i-1]-start_pnt[i+1];
			sgFloat vec_dist = sqrt(dir_to_prev[0]*dir_to_prev[0]+dir_to_prev[1]*dir_to_prev[1]);
			if (vec_dist>FLT_MIN)
			{
				dir_to_prev[0]/=vec_dist;
				dir_to_prev[1]/=vec_dist;
				start_pnt[i]+=dir_to_prev[0]*0.0001;
				start_pnt[i+1]+=dir_to_prev[1]*0.0001;
			}
		}
	}
}*/

bool CBREPTriangulator::EndTriangulate()
{
	m_nTr = 0;

	std::list<ONE_FACE_TRIANGLULATOR>::iterator Iter;
	for ( Iter = m_triangulators_buffer.begin( ); 
		Iter != m_triangulators_buffer.end( ); Iter++ )
	{
		CTriangulator* tmpTr = (*Iter).face_triangulator;
		unsigned int tmpTrCnt=0;
		if (tmpTr)
			tmpTr->GetTrianglesCount(tmpTrCnt);
		else
		{
			if ((*Iter).count_of_points_of_triangles_of_3_or_4_faces==3)
			{
				//assert((*Iter).points_of_triangles_of_3_or_4_faces);   // for ANDROID
				tmpTrCnt=1;
			}
			else
				if ((*Iter).count_of_points_of_triangles_of_3_or_4_faces==4)
				{
					//assert((*Iter).points_of_triangles_of_3_or_4_faces);    // for ANDROID
					tmpTrCnt=2;
				}
				//else
				//	assert(0);    // for ANDROID
		}
		m_nTr+=tmpTrCnt;
	}

	if(m_nTr)
	{
        if (triangulation_temp_buffer_type==SG_SEPARATE_BUFFERS)
        {
		   m_allVertex = (SG_POINT*)malloc(3*m_nTr*sizeof(SG_POINT));
		   m_allNormals = (SG_VECTOR*)malloc(3*m_nTr*sizeof(SG_VECTOR));
        }
        else  if (triangulation_temp_buffer_type==SG_GENERAL_BUFFER)
        {
            m_general_buffer = (sgFloat*)malloc(3 * m_nTr * 11 * sizeof(sgFloat));  // 3 vertex coords + 3 normal coords + 2 UV + 3 tangents
            m_indexes = (unsigned int*)malloc(3 * m_nTr * sizeof(unsigned int));
        }
	}
	else
		return false;

	int curIndex=0;
	D_POINT tmpA;
	D_POINT tmpB;
	D_POINT tmpC;

	for ( Iter = m_triangulators_buffer.begin( ); 
		Iter != m_triangulators_buffer.end( ); Iter++ )
	{
		CTriangulator* tmpTr = (*Iter).face_triangulator;
		unsigned int tmpTrCnt=0;
		if (tmpTr)
		{
				tmpTr->GetTrianglesCount(tmpTrCnt);
				const trFloat* normals = tmpTr->GetPointsAttributes();
				const int*     markers = tmpTr->GetPointsMarks();
				for (unsigned int i = 0; i < tmpTrCnt; i++)
				{
					int trV1;
					int trV2;
					int trV3;
					if (!tmpTr->GetTriangle(i,trV1,trV2,trV3))
						return false;
					if (!tmpTr->GetPoint(trV1,tmpA.x,tmpA.y))
						return false;
					tmpA.z = 0.0;
					if (!tmpTr->GetPoint(trV2,tmpB.x,tmpB.y))
						return false;
					tmpB.z = 0.0;
					if (!tmpTr->GetPoint(trV3,tmpC.x,tmpC.y))
						return false;
					
					if (!normals)
						return false;

					tmpC.z = 0.0;
					o_hcncrd( (*Iter).face_invert_matr, &tmpA, &tmpA );
					o_hcncrd( (*Iter).face_invert_matr, &tmpB, &tmpB );
					o_hcncrd( (*Iter).face_invert_matr, &tmpC, &tmpC );
                    if (triangulation_temp_buffer_type==SG_SEPARATE_BUFFERS)
                    {
                        m_allVertex[curIndex].x = tmpA.x;
                        m_allVertex[curIndex].y = tmpA.y;
                        m_allVertex[curIndex].z = tmpA.z;
                        m_allVertex[curIndex+1].x = tmpB.x;
                        m_allVertex[curIndex+1].y = tmpB.y;
                        m_allVertex[curIndex+1].z = tmpB.z;
                        m_allVertex[curIndex+2].x = tmpC.x;
                        m_allVertex[curIndex+2].y = tmpC.y;
                        m_allVertex[curIndex+2].z = tmpC.z;

                        if (markers[trV1]!=0)
                        {
                            m_allNormals[curIndex].x =normals[3*trV1];
                            m_allNormals[curIndex].y = normals[3*trV1+1];
                            m_allNormals[curIndex].z = normals[3*trV1+2];
                        }
                        else
                            m_allNormals[curIndex] = (*Iter).face_normal;

                        if (markers[trV2]!=0)
                        {
                            m_allNormals[curIndex+1].x = normals[3*trV2];
                            m_allNormals[curIndex+1].y = normals[3*trV2+1];
                            m_allNormals[curIndex+1].z = normals[3*trV2+2];
                        }
                        else
                            m_allNormals[curIndex+1] = (*Iter).face_normal;

                        if (markers[trV3]!=0)
                        {
                            m_allNormals[curIndex+2].x = normals[3*trV3];
                            m_allNormals[curIndex+2].y = normals[3*trV3+1];
                            m_allNormals[curIndex+2].z = normals[3*trV3+2];
                        }
                        else
                            m_allNormals[curIndex+2] = (*Iter).face_normal;
                        
                        curIndex+=3;

                    }
                    else  if (triangulation_temp_buffer_type==SG_GENERAL_BUFFER)
                    {
                        m_general_buffer[curIndex] = tmpA.x;
                        m_general_buffer[curIndex+1] = tmpA.y;
                        m_general_buffer[curIndex+2] = tmpA.z;
                        m_general_buffer[curIndex+11] = tmpB.x;
                        m_general_buffer[curIndex+11+1] = tmpB.y;
                        m_general_buffer[curIndex+11+2] = tmpB.z;
                        m_general_buffer[curIndex+22] = tmpC.x;
                        m_general_buffer[curIndex+22+1] = tmpC.y;
                        m_general_buffer[curIndex+22+2] = tmpC.z;

                        
                        if (markers[trV1]!=0)
                        {
                            m_general_buffer[curIndex+3] = normals[3*trV1];
                            m_general_buffer[curIndex+4] = normals[3*trV1+1];
                            m_general_buffer[curIndex+5] = normals[3*trV1+2];

                        }
                        else
                        {
                            m_general_buffer[curIndex+3] = (*Iter).face_normal.x;
                            m_general_buffer[curIndex+4] = (*Iter).face_normal.y;
                            m_general_buffer[curIndex+5] = (*Iter).face_normal.z;
                        }
                        
                        if (markers[trV2]!=0)
                        {
                            m_general_buffer[curIndex+14] = normals[3*trV2];
                            m_general_buffer[curIndex+15] = normals[3*trV2+1];
                            m_general_buffer[curIndex+16] = normals[3*trV2+2];
                        }
                        else
                        {
                            m_general_buffer[curIndex+14] = (*Iter).face_normal.x;
                            m_general_buffer[curIndex+15] = (*Iter).face_normal.y;
                            m_general_buffer[curIndex+16] = (*Iter).face_normal.z;
                        }
                        
                        if (markers[trV3]!=0)
                        {
                            m_general_buffer[curIndex+25] = normals[3*trV3];
                            m_general_buffer[curIndex+26] = normals[3*trV3+1];
                            m_general_buffer[curIndex+27] = normals[3*trV3+2];
                        }
                        else
                        {
                            m_general_buffer[curIndex+25] = (*Iter).face_normal.x;
                            m_general_buffer[curIndex+26] = (*Iter).face_normal.y;
                            m_general_buffer[curIndex+27] = (*Iter).face_normal.z;
                        }
                        
                        m_general_buffer[curIndex+6] = 0.0;
                        m_general_buffer[curIndex+7] = 0.0;
                        m_general_buffer[curIndex+8] = 0.0;
                        m_general_buffer[curIndex+9] = 0.0;
                        m_general_buffer[curIndex+10] = 0.0;
                        
                        m_general_buffer[curIndex+17] = 0.0;
                        m_general_buffer[curIndex+18] = 0.0;
                        m_general_buffer[curIndex+19] = 0.0;
                        m_general_buffer[curIndex+20] = 0.0;
                        m_general_buffer[curIndex+21] = 0.0;
                        
                        
                        m_general_buffer[curIndex+28] = 0.0;
                        m_general_buffer[curIndex+29] = 0.0;
                        m_general_buffer[curIndex+30] = 0.0;
                        m_general_buffer[curIndex+31] = 0.0;
                        m_general_buffer[curIndex+32] = 0.0;

                        m_indexes[(curIndex/33)*3] = (curIndex/33)*3;
                        m_indexes[(curIndex/33)*3+1] = (curIndex/33)*3+1;
                        m_indexes[(curIndex/33)*3+2] = (curIndex/33)*3+2;
                        
                        curIndex+=33;
                    }
				}
		}
		else
		{
			if ((*Iter).count_of_points_of_triangles_of_3_or_4_faces==3)
			{
				//assert((*Iter).points_of_triangles_of_3_or_4_faces);     // for ANDROID
				memcpy(&tmpA,&(*Iter).points_of_triangles_of_3_or_4_faces[0],sizeof(D_POINT));
				memcpy(&tmpB,&(*Iter).points_of_triangles_of_3_or_4_faces[1],sizeof(D_POINT));
				memcpy(&tmpC,&(*Iter).points_of_triangles_of_3_or_4_faces[2],sizeof(D_POINT));
				o_hcncrd( (*Iter).face_invert_matr, &tmpA, &tmpA );
				o_hcncrd( (*Iter).face_invert_matr, &tmpB, &tmpB );
				o_hcncrd( (*Iter).face_invert_matr, &tmpC, &tmpC );
                if (triangulation_temp_buffer_type==SG_SEPARATE_BUFFERS)
                {
                    m_allVertex[curIndex].x = tmpA.x;
                    m_allVertex[curIndex].y = tmpA.y;
                    m_allVertex[curIndex].z = tmpA.z;
                    m_allVertex[curIndex+1].x = tmpB.x;
                    m_allVertex[curIndex+1].y = tmpB.y;
                    m_allVertex[curIndex+1].z = tmpB.z;
                    m_allVertex[curIndex+2].x = tmpC.x;
                    m_allVertex[curIndex+2].y = tmpC.y;
                    m_allVertex[curIndex+2].z = tmpC.z;

                    m_allNormals[curIndex].x = (*Iter).normals_of_3_or_4_faces[0].x;
                    m_allNormals[curIndex].y = (*Iter).normals_of_3_or_4_faces[0].y;
                    m_allNormals[curIndex].z = (*Iter).normals_of_3_or_4_faces[0].z;
                    m_allNormals[curIndex+1].x = (*Iter).normals_of_3_or_4_faces[1].x;
                    m_allNormals[curIndex+1].y = (*Iter).normals_of_3_or_4_faces[1].y;
                    m_allNormals[curIndex+1].z = (*Iter).normals_of_3_or_4_faces[1].z;
                    m_allNormals[curIndex+2].x = (*Iter).normals_of_3_or_4_faces[2].x;
                    m_allNormals[curIndex+2].y = (*Iter).normals_of_3_or_4_faces[2].y;
                    m_allNormals[curIndex+2].z = (*Iter).normals_of_3_or_4_faces[2].z;
                    
                    curIndex+=3;

                }
                else  if (triangulation_temp_buffer_type==SG_GENERAL_BUFFER)
                {
                    m_general_buffer[curIndex+0] = tmpA.x;
                    m_general_buffer[curIndex+1] = tmpA.y;
                    m_general_buffer[curIndex+2] = tmpA.z;
                    m_general_buffer[curIndex+3] = (*Iter).normals_of_3_or_4_faces[0].x;
                    m_general_buffer[curIndex+4] = (*Iter).normals_of_3_or_4_faces[0].y;
                    m_general_buffer[curIndex+5] = (*Iter).normals_of_3_or_4_faces[0].z;
                    m_general_buffer[curIndex+6] = 0;
                    m_general_buffer[curIndex+7] = 0;
                    m_general_buffer[curIndex+8] = 0.0;
                    m_general_buffer[curIndex+9] = 0.0;
                    m_general_buffer[curIndex+10] = 0.0;
                    
                    m_general_buffer[curIndex+11] = tmpB.x;
                    m_general_buffer[curIndex+12] = tmpB.y;
                    m_general_buffer[curIndex+13] = tmpB.z;
                    m_general_buffer[curIndex+14] = (*Iter).normals_of_3_or_4_faces[1].x;
                    m_general_buffer[curIndex+15] = (*Iter).normals_of_3_or_4_faces[1].y;
                    m_general_buffer[curIndex+16] = (*Iter).normals_of_3_or_4_faces[1].z;
                    m_general_buffer[curIndex+17] = 0;
                    m_general_buffer[curIndex+18] = 0;
                    m_general_buffer[curIndex+19] = 0.0;
                    m_general_buffer[curIndex+20] = 0.0;
                    m_general_buffer[curIndex+21] = 0.0;
                    
                    m_general_buffer[curIndex+22] = tmpC.x;
                    m_general_buffer[curIndex+23] = tmpC.y;
                    m_general_buffer[curIndex+24] = tmpC.z;
                    m_general_buffer[curIndex+25] = (*Iter).normals_of_3_or_4_faces[2].x;
                    m_general_buffer[curIndex+26] = (*Iter).normals_of_3_or_4_faces[2].y;
                    m_general_buffer[curIndex+27] = (*Iter).normals_of_3_or_4_faces[2].z;
                    m_general_buffer[curIndex+28] = 0;
                    m_general_buffer[curIndex+29] = 0;
                    m_general_buffer[curIndex+30] = 0.0;
                    m_general_buffer[curIndex+31] = 0.0;
                    m_general_buffer[curIndex+32] = 0.0;
                    
                    m_indexes[(curIndex/33)*3] = (curIndex/33)*3;
                    m_indexes[(curIndex/33)*3+1] = (curIndex/33)*3+1;
                    m_indexes[(curIndex/33)*3+2] = (curIndex/33)*3+2;
                    
                    
                    curIndex+=33;

                }

			}
			else
				if ((*Iter).count_of_points_of_triangles_of_3_or_4_faces==4)
				{
					//assert((*Iter).points_of_triangles_of_3_or_4_faces);     // for ANDROID
                    if (triangulation_temp_buffer_type==SG_SEPARATE_BUFFERS)
                    {
                        memcpy(&tmpA,&(*Iter).points_of_triangles_of_3_or_4_faces[0],sizeof(D_POINT));
                        memcpy(&tmpB,&(*Iter).points_of_triangles_of_3_or_4_faces[1],sizeof(D_POINT));
                        memcpy(&tmpC,&(*Iter).points_of_triangles_of_3_or_4_faces[2],sizeof(D_POINT));
                        o_hcncrd( (*Iter).face_invert_matr, &tmpA, &tmpA );
                        o_hcncrd( (*Iter).face_invert_matr, &tmpB, &tmpB );
                        o_hcncrd( (*Iter).face_invert_matr, &tmpC, &tmpC );
                        m_allVertex[curIndex].x = tmpA.x;
                        m_allVertex[curIndex].y = tmpA.y;
                        m_allVertex[curIndex].z = tmpA.z;
                        m_allVertex[curIndex+1].x = tmpB.x;
                        m_allVertex[curIndex+1].y = tmpB.y;
                        m_allVertex[curIndex+1].z = tmpB.z;
                        m_allVertex[curIndex+2].x = tmpC.x;
                        m_allVertex[curIndex+2].y = tmpC.y;
                        m_allVertex[curIndex+2].z = tmpC.z;

                        m_allNormals[curIndex].x = (*Iter).normals_of_3_or_4_faces[0].x;
                        m_allNormals[curIndex].y = (*Iter).normals_of_3_or_4_faces[0].y;
                        m_allNormals[curIndex].z = (*Iter).normals_of_3_or_4_faces[0].z;
                        m_allNormals[curIndex+1].x = (*Iter).normals_of_3_or_4_faces[1].x;
                        m_allNormals[curIndex+1].y =(*Iter).normals_of_3_or_4_faces[1].y;
                        m_allNormals[curIndex+1].z = (*Iter).normals_of_3_or_4_faces[1].z;
                        m_allNormals[curIndex+2].x = (*Iter).normals_of_3_or_4_faces[2].x;
                        m_allNormals[curIndex+2].y = (*Iter).normals_of_3_or_4_faces[2].y;
                        m_allNormals[curIndex+2].z =(*Iter).normals_of_3_or_4_faces[2].z;

                        curIndex+=3;

                        memcpy(&tmpA,&(*Iter).points_of_triangles_of_3_or_4_faces[3],sizeof(D_POINT));
                        memcpy(&tmpB,&(*Iter).points_of_triangles_of_3_or_4_faces[4],sizeof(D_POINT));
                        memcpy(&tmpC,&(*Iter).points_of_triangles_of_3_or_4_faces[5],sizeof(D_POINT));
                        o_hcncrd( (*Iter).face_invert_matr, &tmpA, &tmpA );
                        o_hcncrd( (*Iter).face_invert_matr, &tmpB, &tmpB );
                        o_hcncrd( (*Iter).face_invert_matr, &tmpC, &tmpC );
                        m_allVertex[curIndex].x = tmpA.x;
                        m_allVertex[curIndex].y = tmpA.y;
                        m_allVertex[curIndex].z = tmpA.z;
                        m_allVertex[curIndex+1].x = tmpB.x;
                        m_allVertex[curIndex+1].y = tmpB.y;
                        m_allVertex[curIndex+1].z = tmpB.z;
                        m_allVertex[curIndex+2].x = tmpC.x;
                        m_allVertex[curIndex+2].y = tmpC.y;
                        m_allVertex[curIndex+2].z = tmpC.z;

                        m_allNormals[curIndex].x = (*Iter).normals_of_3_or_4_faces[3].x;
                        m_allNormals[curIndex].y = (*Iter).normals_of_3_or_4_faces[3].y;
                        m_allNormals[curIndex].z = (*Iter).normals_of_3_or_4_faces[3].z;
                        m_allNormals[curIndex+1].x = (*Iter).normals_of_3_or_4_faces[4].x;
                        m_allNormals[curIndex+1].y = (*Iter).normals_of_3_or_4_faces[4].y;
                        m_allNormals[curIndex+1].z = (*Iter).normals_of_3_or_4_faces[4].z;
                        m_allNormals[curIndex+2].x = (*Iter).normals_of_3_or_4_faces[5].x;
                        m_allNormals[curIndex+2].y = (*Iter).normals_of_3_or_4_faces[5].y;
                        m_allNormals[curIndex+2].z = (*Iter).normals_of_3_or_4_faces[5].z;

                        curIndex+=3;
                    }
                    else  if (triangulation_temp_buffer_type==SG_GENERAL_BUFFER)
                    {
                        memcpy(&tmpA,&(*Iter).points_of_triangles_of_3_or_4_faces[0],sizeof(D_POINT));
                        memcpy(&tmpB,&(*Iter).points_of_triangles_of_3_or_4_faces[1],sizeof(D_POINT));
                        memcpy(&tmpC,&(*Iter).points_of_triangles_of_3_or_4_faces[2],sizeof(D_POINT));
                        o_hcncrd( (*Iter).face_invert_matr, &tmpA, &tmpA );
                        o_hcncrd( (*Iter).face_invert_matr, &tmpB, &tmpB );
                        o_hcncrd( (*Iter).face_invert_matr, &tmpC, &tmpC );
                        m_general_buffer[curIndex+0] = tmpA.x;
                        m_general_buffer[curIndex+1] = tmpA.y;
                        m_general_buffer[curIndex+2] = tmpA.z;
                        m_general_buffer[curIndex+3] = (*Iter).normals_of_3_or_4_faces[0].x;
                        m_general_buffer[curIndex+4] = (*Iter).normals_of_3_or_4_faces[0].y;
                        m_general_buffer[curIndex+5] = (*Iter).normals_of_3_or_4_faces[0].z;
                        m_general_buffer[curIndex+6] = 0;
                        m_general_buffer[curIndex+7] = 0;
                        m_general_buffer[curIndex+8] = 0.0;
                        m_general_buffer[curIndex+9] = 0.0;
                        m_general_buffer[curIndex+10] = 0.0;
                        
                        m_general_buffer[curIndex+11] = tmpB.x;
                        m_general_buffer[curIndex+12] = tmpB.y;
                        m_general_buffer[curIndex+13] = tmpB.z;
                        m_general_buffer[curIndex+14] = (*Iter).normals_of_3_or_4_faces[1].x;
                        m_general_buffer[curIndex+15] = (*Iter).normals_of_3_or_4_faces[1].y;
                        m_general_buffer[curIndex+16] = (*Iter).normals_of_3_or_4_faces[1].z;
                        m_general_buffer[curIndex+17] = 0;
                        m_general_buffer[curIndex+18] = 0;
                        m_general_buffer[curIndex+19] = 0.0;
                        m_general_buffer[curIndex+20] = 0.0;
                        m_general_buffer[curIndex+21] = 0.0;
                        
                        m_general_buffer[curIndex+22] = tmpC.x;
                        m_general_buffer[curIndex+23] = tmpC.y;
                        m_general_buffer[curIndex+24] = tmpC.z;
                        m_general_buffer[curIndex+25] = (*Iter).normals_of_3_or_4_faces[2].x;
                        m_general_buffer[curIndex+26] = (*Iter).normals_of_3_or_4_faces[2].y;
                        m_general_buffer[curIndex+27] = (*Iter).normals_of_3_or_4_faces[2].z;
                        m_general_buffer[curIndex+28] = 0;
                        m_general_buffer[curIndex+29] = 0;
                        m_general_buffer[curIndex+30] = 0.0;
                        m_general_buffer[curIndex+31] = 0.0;
                        m_general_buffer[curIndex+32] = 0.0;
                        
                        m_indexes[(curIndex/33)*3] = (curIndex/33)*3;
                        m_indexes[(curIndex/33)*3+1] = (curIndex/33)*3+1;
                        m_indexes[(curIndex/33)*3+2] = (curIndex/33)*3+2;
                        
                        
                        curIndex+=33;
                        
                        memcpy(&tmpA,&(*Iter).points_of_triangles_of_3_or_4_faces[3],sizeof(D_POINT));
                        memcpy(&tmpB,&(*Iter).points_of_triangles_of_3_or_4_faces[4],sizeof(D_POINT));
                        memcpy(&tmpC,&(*Iter).points_of_triangles_of_3_or_4_faces[5],sizeof(D_POINT));
                        o_hcncrd( (*Iter).face_invert_matr, &tmpA, &tmpA );
                        o_hcncrd( (*Iter).face_invert_matr, &tmpB, &tmpB );
                        o_hcncrd( (*Iter).face_invert_matr, &tmpC, &tmpC );
                        m_general_buffer[curIndex+0] = tmpA.x;
                        m_general_buffer[curIndex+1] = tmpA.y;
                        m_general_buffer[curIndex+2] = tmpA.z;
                        m_general_buffer[curIndex+3] = (*Iter).normals_of_3_or_4_faces[3].x;
                        m_general_buffer[curIndex+4] = (*Iter).normals_of_3_or_4_faces[3].y;
                        m_general_buffer[curIndex+5] = (*Iter).normals_of_3_or_4_faces[3].z;
                        m_general_buffer[curIndex+6] = 0;
                        m_general_buffer[curIndex+7] = 0;
                        m_general_buffer[curIndex+8] = 0.0;
                        m_general_buffer[curIndex+9] = 0.0;
                        m_general_buffer[curIndex+10] = 0.0;
                        
                        m_general_buffer[curIndex+11] = tmpB.x;
                        m_general_buffer[curIndex+12] = tmpB.y;
                        m_general_buffer[curIndex+13] = tmpB.z;
                        m_general_buffer[curIndex+14] = (*Iter).normals_of_3_or_4_faces[4].x;
                        m_general_buffer[curIndex+15] = (*Iter).normals_of_3_or_4_faces[4].y;
                        m_general_buffer[curIndex+16] = (*Iter).normals_of_3_or_4_faces[4].z;
                        m_general_buffer[curIndex+17] = 0;
                        m_general_buffer[curIndex+18] = 0;
                        m_general_buffer[curIndex+19] = 0.0;
                        m_general_buffer[curIndex+20] = 0.0;
                        m_general_buffer[curIndex+21] = 0.0;
                        
                        m_general_buffer[curIndex+22] = tmpC.x;
                        m_general_buffer[curIndex+23] = tmpC.y;
                        m_general_buffer[curIndex+24] = tmpC.z;
                        m_general_buffer[curIndex+25] = (*Iter).normals_of_3_or_4_faces[5].x;
                        m_general_buffer[curIndex+26] = (*Iter).normals_of_3_or_4_faces[5].y;
                        m_general_buffer[curIndex+27] = (*Iter).normals_of_3_or_4_faces[5].z;
                        m_general_buffer[curIndex+28] = 0;
                        m_general_buffer[curIndex+29] = 0;
                        m_general_buffer[curIndex+30] = 0.0;
                        m_general_buffer[curIndex+31] = 0.0;
                        m_general_buffer[curIndex+32] = 0.0;
                        
                        m_indexes[(curIndex/33)*3] = (curIndex/33)*3;
                        m_indexes[(curIndex/33)*3+1] = (curIndex/33)*3+1;
                        m_indexes[(curIndex/33)*3+2] = (curIndex/33)*3+2;
                        
                        
                        curIndex+=33;

                    }
				}
				//else
				//	assert(0);    // for ANDROID

		}
	}
	return true;
}

