#include "sgCoreNativeLib.h"
#include "sgCore.h"
#include <vector>
#include <list>

static   std::list< std::vector<long>* >        IntArrays;
static   std::list< std::vector<SG_POINT>* >    PointArrays;
static   std::list< std::vector<sgCObject*>* >  ObjectsArray;



void        sg_core_start()
{
    sgInitKernel();
	sgC3DObject::AutoTriangulate(false, SG_DELAUNAY_TRIANGULATION, SG_SEPARATE_BUFFERS);

}
void        sg_core_stop()
{
    std::list<std::vector<long>*>::iterator it;
    for (it = IntArrays.begin(); it != IntArrays.end(); ++it){
        delete  *it;
    }
    
    std::list<std::vector<SG_POINT>*>::iterator it2;
    for (it2 = PointArrays.begin(); it2 != PointArrays.end(); ++it2){
        delete  *it2;
    }
    
    std::list<std::vector<sgCObject*>*>::iterator it3;
    for (it3 = ObjectsArray.begin(); it3 != ObjectsArray.end(); ++it3){
        delete  *it3;
    }

    sgFreeKernel(false);
}

void        sg_object_free(PTRTYPE objPtr)
{
    sgCObject*  ob = (sgCObject*)objPtr;
    sgCObject::DeleteObject(ob);
}

void        sg_object_bounds(PTRTYPE objPtr, float& minX,float& minY,float& minZ,float& maxX,float& maxY,float& maxZ)
{
    sgCObject*  ob = (sgCObject*)objPtr;
    SG_POINT minP, maxP;
    ob->GetGabarits(minP, maxP);
    minX = minP.x;
    minY = minP.y;
    minZ = minP.z;
    
    maxX = maxP.x;
    maxY = maxP.y;
    maxZ = maxP.z;

}

PTRTYPE     sg_object_box(float szX, float szY, float szZ)
{
    return (PTRTYPE)sgCreateBox(szX, szY, szZ);
}
PTRTYPE     sg_object_sphere(float rad, int uSeg, int vSeg)
{
    return (PTRTYPE)sgCreateSphere(rad, uSeg, vSeg);
}
PTRTYPE     sg_object_cylinder(float rad, float heig, int uSeg)
{
	return (PTRTYPE)sgCreateCylinder(rad, heig, uSeg);
}
PTRTYPE     sg_object_cone(float r1, float r2, float heig, int uSeg)
{
	return (PTRTYPE)sgCreateCone(r1, r2, heig, uSeg);
}
PTRTYPE     sg_object_torus(float r1, float r2, int uSeg, int vSeg)
{
	return (PTRTYPE)sgCreateTorus(r1, r2, uSeg, vSeg);
}

PTRTYPE     sg_object_custom_mesh(ARRPTR pnts, ARRPTR indxs)
{
	std::vector<SG_POINT>*  pointsA = (std::vector<SG_POINT>*)pnts;
	std::vector<long>*       indexesA = (std::vector<long>*)indxs;

	if (pointsA->size()==0 || indexesA->size()==0 || (indexesA->size() % 3) != 0)
		return NULL;

	return (PTRTYPE)sgFileManager::ObjectFromTriangles(&(pointsA->at(0)), pointsA->size(), (const SG_INDEX_TRIANGLE*)(&(indexesA->at(0))), indexesA->size()/3);

}

PTRTYPE     sg_object_line(float p1_x, float p1_y, float p1_z, float p2_x, float p2_y, float p2_z)
{
	return (PTRTYPE)sgCreateLine((sgFloat)p1_x, (sgFloat)p1_y, (sgFloat)p1_z,
		(sgFloat)p2_x, (sgFloat)p2_y, (sgFloat)p2_z);

}

PTRTYPE     sg_object_spline(ARRPTR pnts, int isClose)
{
	std::vector<SG_POINT>*  newIA = (std::vector<SG_POINT>*)pnts;
    
    if (newIA->size()==0)
        return NULL;
    
	SG_SPLINE* splDat = SG_SPLINE::Create();
	for (int i = 0; i < newIA->size(); i++)
		splDat->AddKnot(newIA->at(i), i);
	if (isClose != 0)
		splDat->Close();
	sgCSpline* splObj = sgCSpline::Create(*splDat);
	SG_SPLINE::Delete(splDat);
	return (PTRTYPE)splObj;
}

PTRTYPE     sg_object_circle_three_points(float p1_x, float p1_y, float p1_z, float p2_x, float p2_y, float p2_z, float p3_x, float p3_y, float p3_z)
{
	SG_CIRCLE cirDat;
	cirDat.FromThreePoints(SG_POINT(p1_x, p1_y, p1_z), SG_POINT(p2_x, p2_y, p2_z), SG_POINT(p3_x, p3_y, p3_z));
	return (PTRTYPE)sgCreateCircle(cirDat);
}
PTRTYPE     sg_object_circle_center_radius_normal(float c_x, float c_y, float c_z, float radius, float n_x, float n_y, float n_z)
{
	SG_CIRCLE cirDat;
	cirDat.FromCenterRadiusNormal(SG_POINT(c_x, c_y, c_z), radius, SG_POINT(n_x, n_y, n_z));
	return (PTRTYPE)sgCreateCircle(cirDat);
}
PTRTYPE     sg_object_arc_three_points(float p1_x, float p1_y, float p1_z, float p2_x, float p2_y, float p2_z, float p3_x, float p3_y, float p3_z, int invert)
{
	SG_ARC arcDat;
	arcDat.FromThreePoints(SG_POINT(p1_x, p1_y, p1_z), SG_POINT(p2_x, p2_y, p2_z), SG_POINT(p3_x, p3_y, p3_z), invert!=0);
	return (PTRTYPE)sgCreateArc(arcDat);
}
PTRTYPE     sg_object_arc_center_begin_end(float c_x, float c_y, float c_z, float b_x, float b_y, float b_z, float e_x, float e_y, float e_z, int invert)
{
	SG_ARC arcDat;
	arcDat.FromCenterBeginEnd(SG_POINT(c_x, c_y, c_z), SG_POINT(b_x, b_y, b_z), SG_POINT(e_x, e_y, e_z), invert != 0);
	return (PTRTYPE)sgCreateArc(arcDat);
}
PTRTYPE     sg_object_arc_begin_end_normal_radius(float b_x, float b_y, float b_z, float e_x, float e_y, float e_z, float n_x, float n_y, float n_z, float radius, int invert)
{
	SG_ARC arcDat;
	arcDat.FromBeginEndNormalRadius(SG_POINT(b_x, b_y, b_z), SG_POINT(e_x, e_y, e_z), SG_POINT(n_x, n_y, n_z), radius, invert != 0);
	return (PTRTYPE)sgCreateArc(arcDat);
}
PTRTYPE     sg_object_arc_center_begin_normal_angle(float c_x, float c_y, float c_z, float b_x, float b_y, float b_z, float n_x, float n_y, float n_z, float angle)
{
	SG_ARC arcDat;
	arcDat.FromCenterBeginNormalAngle(SG_POINT(c_x, c_y, c_z), SG_POINT(b_x, b_y, b_z), SG_POINT(n_x, n_y, n_z), angle);
	return (PTRTYPE)sgCreateArc(arcDat);
}
PTRTYPE     sg_object_arc_begin_end_normal_angle(float b_x, float b_y, float b_z, float e_x, float e_y, float e_z, float n_x, float n_y, float n_z, float angle)
{
	SG_ARC arcDat;
	arcDat.FromBeginEndNormalAngle(SG_POINT(b_x, b_y, b_z), SG_POINT(e_x, e_y, e_z), SG_POINT(n_x, n_y, n_z), angle);
	return (PTRTYPE)sgCreateArc(arcDat);
}

PTRTYPE     sg_object_path(ARRPTR subObjects)
{
    std::vector<sgCObject*>*  newIA = (std::vector<sgCObject*>*)subObjects;
    if (newIA->size()==0)
        return NULL;
    return (PTRTYPE)sgCContour::CreateContour(&(newIA->at(0)),(int)newIA->size());
}



void        sg_object_move(PTRTYPE objPtr, float vecX, float vecY, float vecZ)
{
    sgCObject*  ob = (sgCObject*)objPtr;
    SG_VECTOR   trV(vecX,  vecY,  vecZ);
    ob->InitTempMatrix()->Translate(trV);
    ob->ApplyTempMatrix();
    ob->DestroyTempMatrix();
}

void        sg_object_rotate(PTRTYPE objPtr, float pX, float pY, float pZ, float vecX, float vecY, float vecZ, float angleRad)
{
	sgCObject*  ob = (sgCObject*)objPtr;
	SG_POINT    pp(pX, pY, pZ);
	SG_VECTOR   trV(vecX, vecY, vecZ);
	ob->InitTempMatrix()->Rotate(pp, trV, angleRad);
	ob->ApplyTempMatrix();
	ob->DestroyTempMatrix();
}

void        sg_object_scale(PTRTYPE objPtr, float scX, float scY, float scZ)
{
	sgCObject*  ob = (sgCObject*)objPtr;
	ob->InitTempMatrix()->Scale(scX, scY, scZ);
	ob->ApplyTempMatrix();
	ob->DestroyTempMatrix();
}

void        sg_object_transform(PTRTYPE objPtr, float* matr)
{
    sgCObject*  ob = (sgCObject*)objPtr;
    sgFloat*  dat = (sgFloat*)malloc(sizeof(sgFloat)*16);
    for (int i=0;i<16;i++)
        dat[i] = (sgFloat)matr[i];
    sgCMatrix matrSG(dat);
    ob->InitTempMatrix()->SetMatrix(&matrSG);
    ob->ApplyTempMatrix();
    ob->DestroyTempMatrix();
}


PTRTYPE     sg_bool_sub(PTRTYPE objAPtr, PTRTYPE objBPtr)
{
    return sgBoolean::Sub((const sgC3DObject&)(*((sgCObject*)objAPtr)), (const sgC3DObject&)(*((sgCObject*)objBPtr)));
}

PTRTYPE     sg_bool_union(PTRTYPE objAPtr, PTRTYPE objBPtr)
{
	return sgBoolean::Union((const sgC3DObject&)(*((sgCObject*)objAPtr)), (const sgC3DObject&)(*((sgCObject*)objBPtr)));
}

PTRTYPE     sg_bool_intersect(PTRTYPE objAPtr, PTRTYPE objBPtr)
{
	return sgBoolean::Intersection((const sgC3DObject&)(*((sgCObject*)objAPtr)), (const sgC3DObject&)(*((sgCObject*)objBPtr)));
}

PTRTYPE     sg_kinematic_rotation(PTRTYPE profileObj, float p1_x, float p1_y, float p1_z, float p2_x, float p2_y, float p2_z, float angl_degree, int isClose, int segm)
{
	sgC2DObject* obj2D = (sgC2DObject*)profileObj;
	return (PTRTYPE)sgKinematic::Rotation((const sgC2DObject&)(*obj2D), SG_POINT(p1_x, p1_y, p1_z), SG_POINT(p2_x, p2_y, p2_z), angl_degree, isClose != 0,segm);
}
PTRTYPE     sg_kinematic_extrude(PTRTYPE profileObj, ARRPTR holesArr, float v_x, float v_y, float v_z, int isClose)
{
	sgC2DObject* obj2D = (sgC2DObject*)profileObj;
	std::vector<sgCObject*>*  newIA = (std::vector<sgCObject*>*)holesArr;

	return (PTRTYPE)sgKinematic::Extrude((const sgC2DObject&)(*obj2D), (holesArr==NULL || newIA->size()==0)?NULL:((const sgC2DObject **)(&(newIA->at(0)))), (holesArr == NULL) ? 0 : ((int)newIA->size()),
		SG_POINT(v_x, v_y, v_z), isClose != 0);
}
PTRTYPE     sg_kinematic_spiral(PTRTYPE profileObj, ARRPTR holesArr, float p1_x, float p1_y, float p1_z, float p2_x, float p2_y, float p2_z, float screw_step, float screw_h, int  segm, int isClose)
{
	sgC2DObject* obj2D = (sgC2DObject*)profileObj;
	std::vector<sgCObject*>*  newIA = (std::vector<sgCObject*>*)holesArr;

	return (PTRTYPE)sgKinematic::Spiral((const sgC2DObject&)(*obj2D), (holesArr == NULL || newIA->size()==0) ? NULL : ((const sgC2DObject **)(&(newIA->at(0)))), (holesArr == NULL) ? 0 : ((int)newIA->size()),
		SG_POINT(p1_x, p1_y, p1_z), SG_POINT(p2_x, p2_y, p2_z), screw_step, screw_h, segm, isClose != 0);
}
PTRTYPE     sg_kinematic_pipe(PTRTYPE profileObj, ARRPTR holesArr, PTRTYPE guideObj, float p1_x, float p1_y, float p1_z, float angle_around_point, int isClose)
{
	sgC2DObject* obj2D = (sgC2DObject*)profileObj;
	sgC2DObject* obj2DGuide = (sgC2DObject*)guideObj;

	std::vector<sgCObject*>*  newIA = (std::vector<sgCObject*>*)holesArr;

	bool isC = isClose != 0;
	return (PTRTYPE)sgKinematic::Pipe((const sgC2DObject&)(*obj2D), (holesArr == NULL || newIA->size()==0) ? NULL : ((const sgC2DObject **)(&(newIA->at(0)))), (holesArr == NULL) ? 0 : ((int)newIA->size()),
		(const sgC2DObject&)(*obj2DGuide), SG_POINT(p1_x, p1_y, p1_z), angle_around_point, isC);
}

PTRTYPE     sg_surfaces_face(PTRTYPE outCont, ARRPTR holesArr)
{
	sgC2DObject* obj2D = (sgC2DObject*)outCont;

	std::vector<sgC2DObject*>*  newIA = (std::vector<sgC2DObject*>*)holesArr;

	return (PTRTYPE)sgSurfaces::Face((const sgC2DObject&)(*obj2D), (holesArr == NULL || newIA->size()==0) ? NULL : ((const sgC2DObject **)(&(newIA->at(0)))), (holesArr == NULL) ? 0 : ((int)newIA->size()));
}
PTRTYPE     sg_surfaces_coons(PTRTYPE side1, PTRTYPE side2, PTRTYPE side3, PTRTYPE side4, int  segm1, int  segm2, int  segm3, int  segm4)
{
	sgC2DObject* obj1 = (sgC2DObject*)side1;
	sgC2DObject* obj2 = (sgC2DObject*)side2;
	sgC2DObject* obj3 = (sgC2DObject*)side3;
	sgC2DObject* obj4 = (sgC2DObject*)side4;

	return (PTRTYPE)sgSurfaces::Coons((const sgC2DObject&)(*obj1), (const sgC2DObject&)(*obj2), (const sgC2DObject&)(*obj3), obj4,
		segm1, segm2, segm3, segm4);
}
PTRTYPE     sg_surfaces_mesh(int dim1, int dim2, ARRPTR pntsArr)
{
	std::vector<SG_POINT>*  newIA = (std::vector<SG_POINT>*)pntsArr;
    
    if (newIA->size()==0)
        return NULL;

	return (PTRTYPE)sgSurfaces::Mesh(dim1, dim2, &(newIA->at(0)));

}
PTRTYPE     sg_surfaces_sew(ARRPTR objsArr)
{
	std::vector<sgCObject*>*  newIA = (std::vector<sgCObject*>*)objsArr;
    
    if (newIA->size()==0)
        return NULL;

	return (PTRTYPE)sgSurfaces::SewSurfaces((const sgC3DObject**)(&(newIA->at(0))), (int)newIA->size());

}
PTRTYPE     sg_surfaces_linear(PTRTYPE side1, PTRTYPE side2, float firstparam, int isClose)
{
	sgC2DObject* obj1 = (sgC2DObject*)side1;
	sgC2DObject* obj2 = (sgC2DObject*)side2;
	
	return (PTRTYPE)sgSurfaces::LinearSurfaceFromSections((const sgC2DObject&)(*obj1), (const sgC2DObject&)(*obj2), firstparam, isClose != 0);
}





int        sg_object_type(PTRTYPE objPtr)
{
	sgCObject* obj = (sgCObject*)objPtr;
	return (int)obj->GetType();
}

int        sg_group_child_count(PTRTYPE objPtr)
{
	sgCObject* obj = (sgCObject*)objPtr;
	if (obj->GetType() != SG_OT_GROUP)
		return 0;

	sgCGroup* objGr = (sgCGroup*)obj;

	return objGr->GetChildrenList()->GetCount();
}

PTRTYPE  sg_group_child(PTRTYPE objPtr, int chIndex)
{
	sgCObject* obj = (sgCObject*)objPtr;
	if (obj->GetType() != SG_OT_GROUP)
		return 0;

	sgCGroup* objGr = (sgCGroup*)obj;
	sgCObject* curCh = objGr->GetChildrenList()->GetHead();

	int cc = 0;
	while (cc < chIndex)
	{
		curCh = objGr->GetChildrenList()->GetNext(curCh);
		cc++;
	}
	return (PTRTYPE)curCh;
}

void    sg_group_break(PTRTYPE objPtr)
{
	sgCObject* obj = (sgCObject*)objPtr;
	if (obj->GetType() != SG_OT_GROUP)
		return;

	sgCGroup* objGr = (sgCGroup*)obj;

	int ChCnt = objGr->GetChildrenList()->GetCount();

	sgCObject**  allChilds = (sgCObject**)malloc(ChCnt*sizeof(sgCObject*));
	objGr->BreakGroup(allChilds);

	free(allChilds);

}



int        sg_mesh_triangles_count(PTRTYPE objPtr)
{
	sgCObject* obj = (sgCObject*)objPtr;
	if (obj->GetType() != SG_OT_3D)
		return 0;

	sgC3DObject* obj3D = (sgC3DObject*)obj;

	const SG_ALL_TRIANGLES* allTr = obj3D->GetTriangles();

	if (!allTr)
	{
		obj3D->Triangulate(SG_DELAUNAY_TRIANGULATION, SG_SEPARATE_BUFFERS);
		allTr = obj3D->GetTriangles();
	}

	if (!allTr)
		return 0;

	return allTr->nTr;
}

FLOATPTR   sg_mesh_matrix(PTRTYPE objPtr)
{
	sgCObject* obj = (sgCObject*)objPtr;
	if (obj->GetType() != SG_OT_3D)
		return 0;

	sgC3DObject* obj3D = (sgC3DObject*)obj;

	return (FLOATPTR)(obj3D->GetWorldMatrixData());
}

FLOATPTR    sg_mesh_v(PTRTYPE objPtr)
{
	sgCObject* obj = (sgCObject*)objPtr;
	if (obj->GetType() != SG_OT_3D)
		return 0;

	sgC3DObject* obj3D = (sgC3DObject*)obj;

	const SG_ALL_TRIANGLES* allTr = obj3D->GetTriangles();

	if (!allTr)
	{
		obj3D->Triangulate(SG_DELAUNAY_TRIANGULATION, SG_SEPARATE_BUFFERS);
		allTr = obj3D->GetTriangles();
	}

	if (!allTr)
		return 0;

	return (FLOATPTR)(allTr->allVertex);
}

FLOATPTR    sg_mesh_n(PTRTYPE objPtr)
{
	sgCObject* obj = (sgCObject*)objPtr;
	if (obj->GetType() != SG_OT_3D)
		return 0;

	sgC3DObject* obj3D = (sgC3DObject*)obj;

	const SG_ALL_TRIANGLES* allTr = obj3D->GetTriangles();

	if (!allTr)
	{
		obj3D->Triangulate(SG_DELAUNAY_TRIANGULATION, SG_SEPARATE_BUFFERS);
		allTr = obj3D->GetTriangles();
	}

	if (!allTr)
		return 0;

	return (FLOATPTR)(allTr->allNormals);
}

FLOATPTR    sg_mesh_uv(PTRTYPE objPtr)
{
	sgCObject* obj = (sgCObject*)objPtr;
	if (obj->GetType() != SG_OT_3D)
		return 0;

	sgC3DObject* obj3D = (sgC3DObject*)obj;

	const SG_ALL_TRIANGLES* allTr = obj3D->GetTriangles();

	if (!allTr)
	{
		obj3D->Triangulate(SG_DELAUNAY_TRIANGULATION, SG_SEPARATE_BUFFERS);
		allTr = obj3D->GetTriangles();
	}

	if (!allTr)
		return 0;

	if (!allTr->allUV)
	{
		SG_MATERIAL sgMat;
		sgMat.MaterialIndex = 0;
		obj3D->SetMaterial(sgMat);

		allTr = obj3D->GetTriangles();
	}

	return (FLOATPTR)(allTr->allUV);
}




ARRPTR     sg_array_create_int()
{
	std::vector<long>*  newIA = new std::vector<long>();
	IntArrays.push_back(newIA);
	return (ARRPTR)newIA;
}
void       sg_array_add_int(ARRPTR arrp, int val)
{
	std::vector<long>*  newIA = (std::vector<long>*)arrp;
	newIA->push_back(val);
}
void       sg_array_free_int(ARRPTR arrp)
{
	std::vector<long>*  newIA = (std::vector<long>*)arrp;
	IntArrays.remove(newIA);
	delete newIA;
}

ARRPTR     sg_array_create_points()
{
	std::vector<SG_POINT>*  newIA = new std::vector<SG_POINT>();
	PointArrays.push_back(newIA);
	return (ARRPTR)newIA;
}
void       sg_array_add_point(ARRPTR arrp, float pX, float pY, float pZ)
{
	std::vector<SG_POINT>*  newIA = (std::vector<SG_POINT>*)arrp;
	newIA->push_back(SG_POINT((sgFloat)pX, (sgFloat)pY, (sgFloat)pZ));
}
void       sg_array_free_points(ARRPTR arrp)
{
	std::vector<SG_POINT>*  newIA = (std::vector<SG_POINT>*)arrp;
	PointArrays.remove(newIA);
	delete newIA;
}

ARRPTR     sg_array_create_objects()
{
	std::vector<sgCObject*>*  newIA = new std::vector<sgCObject*>();
	ObjectsArray.push_back(newIA);
	return (ARRPTR)newIA;
}
void       sg_array_add_object(ARRPTR arrp, PTRTYPE objP)
{
	std::vector<sgCObject*>*  newIA = (std::vector<sgCObject*>*)arrp;
	newIA->push_back((sgCObject*)objP);
}
void       sg_array_free_objects(ARRPTR arrp)
{
	std::vector<sgCObject*>*  newIA = (std::vector<sgCObject*>*)arrp;
	ObjectsArray.remove(newIA);
	delete newIA;
}
