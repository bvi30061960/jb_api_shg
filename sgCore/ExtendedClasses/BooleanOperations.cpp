#include "..//CORE//sg.h"

sgFloat getMaxCoord(const SG_POINT& pA)
{
	return max(pA.x, max(pA.y, pA.z));
}

bool   isPointsNearInSomeCoord(const SG_POINT& pA, const SG_POINT& pB)
{
	const long double _MINDIST = max(getMaxCoord(pA), getMaxCoord(pB))*0.000001;

	if (fabs(pA.x - pB.x) < _MINDIST)
		return true;

	if (fabs(pA.y - pB.y) < _MINDIST)
		return true;

	if (fabs(pA.z - pB.z) < _MINDIST)
		return true;

	return false;

}
bool   gabaritsCheck(const sgC3DObject& aOb, const sgC3DObject& bOb)
{
	SG_POINT minA, maxA, minB, maxB;

	sgC3DObject* aPtr = const_cast<sgC3DObject*>(&aOb);
	sgC3DObject* bPtr = const_cast<sgC3DObject*>(&bOb);

	aPtr->GetGabarits(minA, maxA);
	bPtr->GetGabarits(minB, maxB);

	if (isPointsNearInSomeCoord(minA, minB))
		return false;

	if (isPointsNearInSomeCoord(minA, maxB))
		return false;

	if (isPointsNearInSomeCoord(maxA, minB))
		return false;

	if (isPointsNearInSomeCoord(maxA, maxB))
		return false;

	return true;
}

sgCGroup*	sgBoolean::Intersection(const sgC3DObject& aOb,const sgC3DObject& bOb)
{
	sgCGroup*  retVal=NULL;
	
	//if (!gabaritsCheck(aOb, bOb))
	//	return NULL;
	
	LISTH resList;
	init_listh(&resList);

	hOBJ  reservObj = NULL;

	//sgFloat savingEps = eps_d;
	if (boolean_operation(GetObjectHandle(&aOb), GetObjectHandle(&bOb),INTER,&resList)!=OSTRUE)
	{
		//assert(0);
		return retVal;
	}
	//eps_d = savingEps;

	if (resList.num<1)
		return retVal;

	sgFloat  tmpValA;
	sgFloat  tmpValB;
	get_hobj_attr_value(id_SmoothNormals, GetObjectHandle(&aOb), &tmpValA);
	get_hobj_attr_value(id_SmoothNormals, GetObjectHandle(&bOb), &tmpValB);

	globalFlagForSmoothingObjects = ((tmpValA > 0.5) && (tmpValB > 0.5));

	sgCObject** objcts = (sgCObject**)malloc(sizeof(sgCObject*)*resList.num);
	hOBJ list_elem = resList.hhead;
	int i=0;
	while (list_elem) 
	{
		char* typeID = (char*)"{0000000000000-0000-0000-000000000000}";
		set_hobj_attr_value(id_TypeID, list_elem, typeID);
		objcts[i++] = ObjectFromHandle(list_elem);
		get_next_item(list_elem,&list_elem);
	}
	
	retVal = sgCGroup::CreateGroup(objcts,resList.num);

	globalFlagForSmoothingObjects = true;

	if (reservObj)
	{
		o_free(reservObj,NULL);
	}

	free(objcts);

	return retVal;
}

sgCGroup*	sgBoolean::Union(const sgC3DObject& aOb,const sgC3DObject& bOb)
{
	sgCGroup*  retVal=NULL;

	//if (!gabaritsCheck(aOb, bOb))
	//	return NULL;

	LISTH resList;
	init_listh(&resList);

	hOBJ  reservObj = NULL;

	//sgFloat savingEps = eps_d;
	if (boolean_operation(GetObjectHandle(&aOb), GetObjectHandle(&bOb),UNION,&resList)!=OSTRUE)
	{
		//assert(0);
		return retVal;
	}
	//eps_d = savingEps;

	if (resList.num<1)
		return retVal;

	sgFloat  tmpValA;
	sgFloat  tmpValB;
	get_hobj_attr_value(id_SmoothNormals, GetObjectHandle(&aOb), &tmpValA);
	get_hobj_attr_value(id_SmoothNormals, GetObjectHandle(&bOb), &tmpValB);

	globalFlagForSmoothingObjects = ((tmpValA > 0.5) && (tmpValB > 0.5));


	sgCObject** objcts = (sgCObject**)malloc(sizeof(sgCObject*)*resList.num);
	hOBJ list_elem = resList.hhead;
	int i=0;
	while (list_elem) 
	{
		char* typeID = (char*)"{0000000000000-0000-0000-000000000000}";
		set_hobj_attr_value(id_TypeID, list_elem, typeID);
		objcts[i++] = ObjectFromHandle(list_elem);
		get_next_item(list_elem,&list_elem);
	}

	retVal = sgCGroup::CreateGroup(objcts,resList.num);

	globalFlagForSmoothingObjects = true;

	if (reservObj)
	{
		o_free(reservObj,NULL);
	}

	free(objcts);

	return retVal;
}

sgCGroup* sgBoolean::Sub(const sgC3DObject& aOb,const sgC3DObject& bOb)
{
	sgCGroup*  retVal=NULL;

	//if (!gabaritsCheck(aOb, bOb))
	//	return NULL;

	LISTH resList;
	init_listh(&resList);

	hOBJ  reservObj = NULL;

	//sgFloat savingEps = eps_d;
	if (boolean_operation(GetObjectHandle(&aOb), GetObjectHandle(&bOb),SUB,&resList)!=OSTRUE)
	{
		//assert(0);
		return retVal;
	}
	//eps_d = savingEps;

	if (resList.num<1)
		return retVal;


	sgFloat  tmpValA;
	//sgFloat  tmpValB;
	get_hobj_attr_value(id_SmoothNormals, GetObjectHandle(&aOb), &tmpValA);
	//get_hobj_attr_value(id_SmoothNormals, GetObjectHandle(&bOb), &tmpValB);

	globalFlagForSmoothingObjects = ((tmpValA > 0.5) /*&& (tmpValB > 0.5)*/);

	sgCObject** objcts = (sgCObject**)malloc(sizeof(sgCObject*)*resList.num);
	hOBJ list_elem = resList.hhead;
	int i=0;
	while (list_elem) 
	{
		char* typeID = (char*)"{0000000000000-0000-0000-000000000000}";
		set_hobj_attr_value(id_TypeID, list_elem, typeID);
		objcts[i++] = ObjectFromHandle(list_elem);
		get_next_item(list_elem,&list_elem);
	}

	retVal = sgCGroup::CreateGroup(objcts,resList.num);

	globalFlagForSmoothingObjects = true;


	if (reservObj)
	{
		o_free(reservObj,NULL);
	}
	free(objcts);

	return retVal;
}

sgCGroup*	sgBoolean::IntersectionContour(const sgC3DObject& aOb,const sgC3DObject& bOb)
{
	sgCGroup*  retVal=NULL;

	//if (!gabaritsCheck(aOb, bOb))
	//	return NULL;

	LISTH resList;
	init_listh(&resList);

	hOBJ  reservObj = NULL;

	//sgFloat savingEps = eps_d;
	if (boolean_operation(GetObjectHandle(&aOb), GetObjectHandle(&bOb),LINE_INTER,&resList)!=OSTRUE)
	{
		//assert(0);
		return retVal;
	}
	//eps_d = savingEps;

	if (resList.num<1)
		return retVal;

	sgCObject** objcts = (sgCObject**)malloc(sizeof(sgCObject*)*resList.num);
	hOBJ list_elem = resList.hhead;
	int i=0;
	while (list_elem) 
	{
		char* typeID = (char*)"{0000000000000-0000-0000-000000000000}";
		set_hobj_attr_value(id_TypeID, list_elem, typeID);
		objcts[i++] = ObjectFromHandle(list_elem);
		get_next_item(list_elem,&list_elem);
	}

	retVal = sgCGroup::CreateGroup(objcts,resList.num);

	if (reservObj)
	{
		o_free(reservObj,NULL);
	}
	free(objcts);

	return retVal;
}

sgCGroup*	sgBoolean::Section(const sgC3DObject& obj, const SG_VECTOR& planeNormal, 
							   sgFloat planeD)
{
	sgCGroup*  retVal=NULL;

	LISTH resList;
	init_listh(&resList);

	D_PLANE   plane;
	memcpy(&plane.v, &planeNormal, sizeof(SG_VECTOR));
	plane.d = planeD;

	LISTH  obj_list;
	
	init_listh(&obj_list);

	attach_item_tail_z(SEL_LIST, &obj_list, GetObjectHandle(&obj));
		
	if (!cut(&obj_list, SEL_LIST, &plane, &resList))
	{
		//assert(0);
		return retVal;
	}

	detach_item_z(SEL_LIST, &obj_list, GetObjectHandle(&obj));
	init_listh(&obj_list);

	if (resList.num<1)
		return retVal;

	sgCObject** objcts = (sgCObject**)malloc(sizeof(sgCObject*)*resList.num);
	hOBJ list_elem = resList.hhead;
	int i=0;
	while (list_elem) 
	{
		char* typeID = (char*)"{0000000000000-0000-0000-000000000000}";
		set_hobj_attr_value(id_TypeID, list_elem, typeID);
		objcts[i++] = ObjectFromHandle(list_elem);
		get_next_item(list_elem,&list_elem);
	}

	retVal = sgCGroup::CreateGroup(objcts,resList.num);

	free(objcts);
		
	return retVal;
}

/*

#include "gpc/sgPolyBool.h"

sgCore_API      sgCContour*	sgBoolean::Intersection2D(const sgC2DObject& aOb, const sgC2DObject& bOb)
{
	sgCContour*   resCont = NULL;

	SG_POINT aNorm;
	sgFloat  aD;
	if (aOb.IsLinear() || !aOb.IsPlane(&aNorm, &aD) || aOb.IsSelfIntersecting())
		return NULL;

	return NULL;

}
sgCore_API      sgCContour*	sgBoolean::Union2D(const sgC2DObject& aOb, const sgC2DObject& bOb)
{
	return NULL;

}
sgCore_API      sgCContour*	sgBoolean::Sub2D(const sgC2DObject& aOb, const sgC2DObject& bOb)
{
	return NULL;

}
*/
