#include "../sg.h"

/*
#define MAX_STR_STL 80

static  short stl_ascii(lpBUFFER_DAT bd, lpLISTH listho, char *string,
													lpMATR m, bool solid_checking);
static  short stl_binary(lpBUFFER_DAT bd, lpLISTH listho, lpMATR m, bool solid_checking);*/

#include <vector>
#include <string>
static bool readSTL(const char* filename, std::vector<sgFloat> & V, std::vector<std::vector<long> > & F, std::vector<std::vector<double> > & N);

sgCObject*   importSTL(const char* file_name, bool  solids_checking)
{
	std::vector<sgFloat >  V;
	std::vector<std::vector<long> >  F;
	std::vector<std::vector<double> >  N;
	bool rs = readSTL(file_name, V, F, N);

	if (!rs)
	{
		STOP_PROGRESSER();
		return 0;
	}

	std::vector<SG_INDEX_TRIANGLE>  indxs;
	for (int i = 0, j = 0; i < V.size() / 9; i++)
	{
		SG_INDEX_TRIANGLE bb;
		bb.ver_indexes[0] = j++;
		bb.ver_indexes[1] = j++;
		bb.ver_indexes[2] = j++;
		indxs.push_back(bb);
	}

	F.clear();
	N.clear();

	sgCObject*  ooo = sgFileManager::ObjectFromTriangles((const SG_POINT*)(&V[0]), V.size() / 3, (const SG_INDEX_TRIANGLE*)(&indxs[0]), indxs.size());
	if (!ooo)
	{
		STOP_PROGRESSER();
	}
	return ooo;
}



//short ImportStl(lpBUFFER_DAT bd, lpLISTH listho, lpMATR m, bool solid_checking)
//{
	/*  OLD-OLD - some problems in separation ascii and bin
    char	    string[MAX_STR_STL];
	int				i;
	char			str_solid[] = "solid";

	string[0] = 0;
	load_str( bd, MAX_STR_STL, string);
    if ( (strstr(string,str_solid)) != NULL ) {
        i = stl_ascii( bd, listho, string, m, solid_checking);
    }    else {
        i = stl_binary( bd, listho, m, solid_checking);
    }
	return i;*/
    
    
    /*  OLD AND WORKING good
	char            string[MAX_STR_STL+3];
    char            str_solid[] = "solid";
    char            str_facet[] = "facet normal";
	char            afterHeaderComment[3 * MAX_STR_STL];
    
    memset(string, 0, sizeof(string));
	memset(afterHeaderComment, 0, sizeof(afterHeaderComment));

    if (!load_data(bd, MAX_STR_STL, string)) {
        //put_message(UNKNOWN_FILE, NULL, 0);
        return 0;
    }
	if (!load_data(bd, 3 * MAX_STR_STL, afterHeaderComment)) {
		//put_message(UNKNOWN_FILE, NULL, 0);
		return 0;
	}

	seek_buf(bd, 0L);
	if (strstr(afterHeaderComment, "solid") && strstr(afterHeaderComment, str_facet))
	{
		return stl_ascii(bd, listho, string, m, solid_checking);
	}
	else
	{
		seek_buf(bd, MAX_STR_STL);
		return stl_binary(bd, listho, m, solid_checking);
	}

	return 0;*/


  /*   OLD - some problems in separation ascii and bin
  
    if (!strchr(string, 0x0D) && !strchr(string, 0x0A)) {
        return stl_binary(bd, listho, m, solid_checking);
    }
    if (!seek_buf(bd, 0L) || !load_str(bd, MAX_STR_STL, string)) {
        //put_message(UNKNOWN_FILE, NULL, 0);
        return 0;
    }
    if (!strstr(string,str_solid)) {
       // put_message(UNKNOWN_FILE, NULL, 0);
        return 0;
    }
    if (!load_str(bd, MAX_STR_STL, string)) {
        //put_message(UNKNOWN_FILE, NULL, 0);
        return 0;
    }
    if (strstr(string, str_facet) != NULL) {
        return stl_ascii( bd, listho, string, m, solid_checking);
    }*/
    
//    return 0;
//}











static bool readSTL(  const char* filename,  std::vector<sgFloat> & V,  std::vector<std::vector<long> > & F,  std::vector<std::vector<double> > & N)
{
	PROGRESS(2, "Open file");
	FILE * stl_file = fopen(filename, "rb");
	if (NULL == stl_file)
	{
		//fprintf(stderr, "IOError: %s could not be opened...\n",filename);
		return false;
	}

	V.clear();
	F.clear();
	N.clear();

	PROGRESS(10, "Read STL header");

	// Specifically 80 character header
	char header[80];
	char solid[80];
	bool is_ascii = true;
	if (fread(header, 1, 80, stl_file) != 80)
	{
		//cerr << "IOError: too short (1)." << endl;
		goto close_false;
	}
	sscanf(header, "%s", solid);
	if (std::string("solid") != solid)
	{
		// definitely **not** ascii 
		is_ascii = false;
	}
	else
	{
		// might still be binary
		char buf[4];
		if (fread(buf, 1, 4, stl_file) != 4)
		{
			//cerr << "IOError: too short (3)." << endl;
			goto close_false;
		}
		size_t num_faces = *reinterpret_cast<unsigned int*>(buf);
		fseek(stl_file, 0, SEEK_END);
		int file_size = ftell(stl_file);
		if (file_size == 80 + 4 + (4 * 12 + 2) * num_faces)
		{
			is_ascii = false;
		}
		else
		{
			is_ascii = true;
		}
	}

	PROGRESS(50, "Read geometry");

	if (is_ascii)
	{
		// Rewind to end of header
		//stl_file = fopen(filename.c_str(),"r");
		//stl_file = freopen(NULL,"r",stl_file);
		fseek(stl_file, 0, SEEK_SET);
		if (NULL == stl_file)
		{
			//fprintf(stderr, "IOError: stl file could not be reopened as ascii ...\n");
			return false;
		}
		// Read 80 header
		// Eat file name
#define IGL_LINE_MAX 2048

		char name[IGL_LINE_MAX];
		if (NULL == fgets(name, IGL_LINE_MAX, stl_file))
		{
			//cerr << "IOError: ascii too short (2)." << endl;
			goto close_false;
		}
		// ascii
		while (true)
		{
			int ret;
			char facet[IGL_LINE_MAX], normal[IGL_LINE_MAX];
			std::vector<double > n(3);
			double nd[3];
			ret = fscanf(stl_file, "%s %s %lg %lg %lg", facet, normal, nd, nd + 1, nd + 2);
			if (std::string("endsolid") == facet)
			{
				break;
			}
			if (ret != 5 ||
				!(std::string("facet") == facet ||
					std::string("faced") == facet) ||
				std::string("normal") != normal)
			{
				//cout << "facet: " << facet << endl;
				//cout << "normal: " << normal << endl;
				//cerr << "IOError: bad format (1)." << endl;
				goto close_false;
			}
			// copy casts to Type
			n[0] = nd[0]; n[1] = nd[1]; n[2] = nd[2];
			//RA	//	N.push_back(n);
			char outer[IGL_LINE_MAX], loop[IGL_LINE_MAX];
			ret = fscanf(stl_file, "%s %s", outer, loop);
			if (ret != 2 || std::string("outer") != outer || std::string("loop") != loop)
			{
				//cerr << "IOError: bad format (2)." << endl;
				goto close_false;
			}
			//RA	//	std::vector<long> f;
			while (true)
			{
				char word[IGL_LINE_MAX];
				int ret = fscanf(stl_file, "%s", word);
				if (ret == 1 && std::string("endloop") == word)
				{
					break;
				}
				else if (ret == 1 && std::string("vertex") == word)
				{
					//RA	//	        std::vector<double> v(3);
					double vd[3];
					int ret = fscanf(stl_file, "%lg %lg %lg", vd, vd + 1, vd + 2);
					if (ret != 3)
					{
						//cerr << "IOError: bad format (3)." << endl;
						goto close_false;
					}
					//RA	//			f.push_back(V.size());
					// copy casts to Type
					//RA	//	        v[0] = vd[0]; v[1] = vd[1]; v[2] = vd[2];
					//RA	//	        V.push_back(v);
					V.push_back(vd[0]);
					V.push_back(vd[1]);
					V.push_back(vd[2]);

				}
				else
				{
					//cerr << "IOError: bad format (4)." << endl;
					goto close_false;
				}
			}
			//RA	//	F.push_back(f);
			char endfacet[IGL_LINE_MAX];
			ret = fscanf(stl_file, "%s", endfacet);
			if (ret != 1 || std::string("endfacet") != endfacet)
			{
				//cerr << "IOError: bad format (5)." << endl;
				goto close_false;
			}
		}
		// read endfacet
		goto close_true;
	}
	else
	{
		// Binary
		//stl_file = freopen(NULL,"rb",stl_file);
		fseek(stl_file, 0, SEEK_SET);
		// Read 80 header
		char header[80];
		if (fread(header, sizeof(char), 80, stl_file) != 80)
		{
			//cerr << "IOError: bad format (6)." << endl;
			goto close_false;
		}
		// Read number of triangles
		unsigned int num_tri;
		if (fread(&num_tri, sizeof(unsigned int), 1, stl_file) != 1)
		{
			//cerr << "IOError: bad format (7)." << endl;
			goto close_false;
		}
		V.resize(num_tri * 3 * 3/*, std::vector<double >(3, 0)*/);
		//N.resize(num_tri, std::vector<double >(3, 0));
		//F.resize(num_tri, std::vector<long >(3, 0));
		for (int t = 0; t < (int)num_tri; t++)
		{
			// Read normal
			float n[3];
			if (fread(n, sizeof(float), 3, stl_file) != 3)
			{
				//cerr << "IOError: bad format (8)." << endl;
				goto close_false;
			}
			// Read each vertex
			for (int c = 0; c < 3; c++)
			{
				//F[t][c] = 3 * t + c;
				//N[t][c] = n[c];
				float v[3];
				if (fread(v, sizeof(float), 3, stl_file) != 3)
				{
					//cerr << "IOError: bad format (9)." << endl;
					goto close_false;
				}
				/*V[3 * t + c][0] = v[0];
				V[3 * t + c][1] = v[1];
				V[3 * t + c][2] = v[2];*/

				V[9 * t + 3 * c + 0] = v[0];
				V[9 * t + 3 * c + 1] = v[1];
				V[9 * t + 3 * c + 2] = v[2];
			}
			// Read attribute size
			unsigned short att_count;
			if (fread(&att_count, sizeof(unsigned short), 1, stl_file) != 1)
			{
				//cerr << "IOError: bad format (10)." << endl;
				goto close_false;
			}
		}
		goto close_true;
	}
close_false:
    PROGRESS(100, "error");
	fclose(stl_file);
	return false;
close_true:
	PROGRESS(100, "Success read file!");
	fclose(stl_file);
	return true;
}





/*
static  short stl_ascii(lpBUFFER_DAT bd, lpLISTH listho, char *string,
													lpMATR m, bool solid_checking)
{
	short			i,j, num, pass;
	char			str_loop[] 	 = "outer loop";
	char			str_vertex[] = "vertex";
	char			*p;
	NPTRP			trp;
	TRI_BIAND	trb;
	D_POINT		pp, min, max;
	MATR			matr, matri;
	hOBJ			hobj;
	long			pointer;

	pass = 1;
	pointer = bd->p_beg+bd->cur_buf;
	min.x = min.y = min.z =  1.e35;
	max.x = max.y = max.z = -1.e35;
//	num_proc = start_grad(GetIDS(IDS_SG178), bd->len_file);
	while ( (i=load_str( bd, MAX_STR_STL, string)) != 0) {
//		step_grad (num_proc , bd->p_beg+bd->cur_buf);
		if ( i == 1 ) continue;
		if ( (p = strstr(string,str_loop)) == NULL) continue;
		for ( j=0; j<3; j++ ) {
once:
			if ( !(i=load_str( bd, MAX_STR_STL, string))) goto err;
			if ( i == 1 ) goto once;
			if ( (p = strstr(string,str_vertex)) == NULL) goto err;
			p += sizeof(str_vertex);
			num = 3;
			if ( !get_nums_from_string(p, (sgFloat*)&pp, &num) ) goto err;
			if ( num != 3 ) goto err;
			modify_limits_by_point(&pp, &min, &max);
		}
	}
//	end_grad  (num_proc , bd->p_beg+bd->cur_buf);
	pp.x = - (min.x + max.x) / 2;
	pp.y = - (min.y + max.y) / 2;
	pp.z = - (min.z + max.z) / 2;
	o_hcunit(matr);
	o_tdtran(matr, &pp);
	o_minv(matr, matri);
	o_hcmult(matr, m);

	pass = 2;
	if ( !seek_buf( bd, pointer) ) return 0;
//	num_proc = start_grad(GetIDS(IDS_SG178), bd->len_file);
//	num_proc = start_grad("", bd->len_file);
	if ( !begin_tri_biand(&trb) ) return 0;
	trp.constr = 0;
	while ( (i=load_str( bd, MAX_STR_STL, string)) != 0) {
//    step_grad (num_proc , bd->p_beg+bd->cur_buf);
		if ( i == 1 ) continue;
		if ( (p = strstr(string,str_loop)) == NULL) continue;
		for ( j=0; j<3; j++ ) {
once2:
			if ( !(i=load_str( bd, MAX_STR_STL, string))) goto err;
			if ( i == 1 ) goto once2;
			if ( (p = strstr(string,str_vertex)) == NULL) goto err;
			p += sizeof(str_vertex);
			num = 3;
			if ( !get_nums_from_string(p, (sgFloat*)&trp.v[j], &num) ) goto err;
			o_hcncrd(matr,&trp.v[j],&trp.v[j]);
			if ( num != 3 ) goto err;
		}
		if ( !put_tri(&trb, &trp, solid_checking)) {
			a_handler_err(AE_ERR_DATA);
			goto err1;
		}
	}
	num = (short)listho->num;
	if ( !end_tri_biand(&trb, listho) )	i = 0;
	else {
		i = (short)listho->num - num;
		hobj = listho->htail;
		for (j = 0; j < i; j++) {
			o_trans(hobj, matri);
			get_prev_item(hobj, &hobj);
		}
	}
end:
//	end_grad  (num_proc , bd->p_beg+bd->cur_buf);
	return i;
err:
	a_handler_err(AE_BAD_STRING,bd->cur_line);
err1:
	if (pass == 2) end_tri_biand(&trb, listho);
	i = 0;
	goto end;
}

static  short stl_binary(lpBUFFER_DAT bd, lpLISTH listho, lpMATR m, bool solid_checking)
{
	int				i, j, num, pass;
	NPTRP			trp;
	TRI_BIAND	trb;
	float			ver[3];
	D_POINT		p, min, max;
	int				number;
	MATR			matr, matri;
	hOBJ			hobj;

	pass = 1;
//	num_proc = start_grad(GetIDS(IDS_SG179), bd->len_file);
	min.x = min.y = min.z =  1.e35;
	max.x = max.y = max.z = -1.e35;
	if ( !seek_buf( bd, 80L) ) return 0;
	if ( load_data( bd, 4, &number) != 4 ) goto err;
	while ( 1 ) {
//		step_grad (num_proc , bd->p_beg+bd->cur_buf);
		if ( load_data( bd, 12, ver) != 12 ) break; // goto err;
		for ( j=0; j<3; j++ ) {
			if ( load_data( bd, 12, ver) != 12 ) goto err;
			p.x = ver[0];	p.y = ver[1];	p.z = ver[2];
			modify_limits_by_point(&p, &min, &max);
		}
		if ( load_data( bd, 2, NULL) != 2 ) break; // goto err;
	}
//	end_grad  (num_proc , bd->p_beg+bd->cur_buf);
	p.x = - (min.x + max.x) / 2;
	p.y = - (min.y + max.y) / 2;
	p.z = - (min.z + max.z) / 2;
	o_hcunit(matr);
	o_tdtran(matr, &p);
	o_minv(matr, matri);
	o_hcmult(matr, m);

	pass = 2;
//	num_proc = start_grad(GetIDS(IDS_SG179), bd->len_file);
//	num_proc = start_grad("", bd->len_file);
	if ( !seek_buf( bd, 80L) ) return 0;
	if ( load_data( bd, 4, &number) != 4 ) goto err;

	if ( !begin_tri_biand(&trb) ) return 0;
	trp.constr = 0;
	while ( 1 ) {
		if ( load_data( bd, 12, ver) != 12 ) break; // goto err;
		for ( j=0; j<3; j++ ) {
			if ( load_data( bd, 12, ver) != 12 ) goto err;
			trp.v[j].x = ver[0];	trp.v[j].y = ver[1];	trp.v[j].z = ver[2];
			o_hcncrd(matr,&trp.v[j],&trp.v[j]);
		}
		if ( load_data( bd, 2, NULL) != 2 ) break; // goto err;

		if ( !put_tri(&trb, &trp, solid_checking)) {
			a_handler_err(AE_ERR_DATA);
			goto err1;
		}
	}
	num = (short)listho->num;
	if ( !end_tri_biand(&trb, listho) )	i = 0;
	else {
		i = (short)listho->num - num;
		hobj = listho->htail;
		for (j = 0; j < i; j++) {
			o_trans(hobj, matri);
			get_prev_item(hobj, &hobj);
		}
	}
end:
//	end_grad  (num_proc , bd->p_beg+bd->cur_buf);
	return i;
err:
	a_handler_err(AE_BAD_FILE);
err1:
	if (pass == 2) end_tri_biand(&trb, listho);
	i = 0;
	goto end;
}
*/

