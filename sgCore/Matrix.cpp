#include "CORE//sg.h"

sgCMatrix::sgCMatrix()
{
	memset(m_matrix,0,sizeof(sgFloat)*16);
	m_matrix[0] = m_matrix[5] = m_matrix[10] = m_matrix[15] = 1.0;
	m_temp_buffer = NULL;
}

sgCMatrix::sgCMatrix(const sgFloat* mtrx)
{
	if (mtrx==NULL)
	{
		memset(m_matrix,0,sizeof(sgFloat)*16);
		m_matrix[0] = m_matrix[5] = m_matrix[10] = m_matrix[15] = 1.0;
	}
	else
		memcpy(m_matrix,mtrx,sizeof(sgFloat)*16);
	m_temp_buffer = NULL;
}

sgCMatrix::sgCMatrix(sgCMatrix& m_b)
{
	memcpy(m_matrix, m_b.m_matrix, sizeof(sgFloat)*16);
	m_temp_buffer = NULL;
	if (m_b.m_temp_buffer)
	{
		m_temp_buffer = new sgFloat[16];
		memcpy(m_temp_buffer, m_b.m_temp_buffer, sizeof(sgFloat)*16);
	}	
}

sgCMatrix::~sgCMatrix()
{
	if (m_temp_buffer)
		delete[] m_temp_buffer;
}

sgCMatrix& sgCMatrix::operator = (const sgCMatrix& m_b) 
{
	memcpy(m_matrix, m_b.m_matrix, sizeof(sgFloat)*16);
	m_temp_buffer = NULL;
	
	if (m_temp_buffer)
		delete[] m_temp_buffer;
	m_temp_buffer = NULL;
	if (m_b.m_temp_buffer)
	{
		m_temp_buffer = new sgFloat[16];
		memcpy(m_temp_buffer, m_b.m_temp_buffer, sizeof(sgFloat)*16);
	}	
	return *this;
}

bool  sgCMatrix::SetMatrix(const sgCMatrix* other_m)
{
	if (!other_m)
	{
		global_sg_error = SG_ER_BAD_ARGUMENT_NULL_POINTER;
		return false;
	}
	//assert(other_m!=NULL);  // for ANDROID
	memcpy(m_matrix, other_m->m_matrix, sizeof(sgFloat)*16);
	
	if (m_temp_buffer)
		delete[] m_temp_buffer;
	m_temp_buffer = NULL;
	if (other_m->m_temp_buffer)
	{
		m_temp_buffer = new sgFloat[16];
		memcpy(m_temp_buffer, other_m->m_temp_buffer, sizeof(sgFloat)*16);
	}
	global_sg_error = SG_ER_SUCCESS;
	return true;
}

const sgFloat*  sgCMatrix::GetData()
{
	return m_matrix;
}

const sgFloat*   sgCMatrix::GetTransparentData()
{
	if (m_temp_buffer==NULL)
		m_temp_buffer = new sgFloat[16];
	m_temp_buffer[0] = m_matrix[0];
	m_temp_buffer[5]=  m_matrix[5];
	m_temp_buffer[10] = m_matrix[10];
	m_temp_buffer[15] = m_matrix[15];

	m_temp_buffer[12] = m_matrix[3];  m_temp_buffer[3] = m_matrix[12];
	m_temp_buffer[13] = m_matrix[7];  m_temp_buffer[7] = m_matrix[13];
	m_temp_buffer[14] = m_matrix[11]; m_temp_buffer[11] = m_matrix[14];

	m_temp_buffer[4] = m_matrix[1];  m_temp_buffer[1] =  m_matrix[4];
	m_temp_buffer[8] = m_matrix[2];  m_temp_buffer[2] = m_matrix[8]; 
	 m_temp_buffer[9] = m_matrix[6];  m_temp_buffer[6] =m_matrix[9]; 

	return m_temp_buffer;
}

void  sgCMatrix::Identity()
{
	memset(m_matrix,0,sizeof(sgFloat)*16);
	m_matrix[0] = m_matrix[5] = m_matrix[10] = m_matrix[15] = 1.0;
}

void  sgCMatrix::Transparent()
{
	sgFloat	Tmp;

	Tmp = m_matrix[12]; m_matrix[12] = m_matrix[3];  m_matrix[3] = Tmp; 
	Tmp = m_matrix[13]; m_matrix[13] = m_matrix[7];  m_matrix[7] = Tmp; 
	Tmp = m_matrix[14]; m_matrix[14] = m_matrix[11]; m_matrix[11] = Tmp; 

	Tmp = m_matrix[4]; m_matrix[4] = m_matrix[1];  m_matrix[1] = Tmp; 
	Tmp = m_matrix[8]; m_matrix[8] = m_matrix[2];  m_matrix[2] = Tmp; 
	Tmp = m_matrix[9]; m_matrix[9] = m_matrix[6];  m_matrix[6] = Tmp;

}

bool  sgCMatrix::Inverse()
{
	return o_minv(m_matrix,m_matrix)?true:false;
}

void  sgCMatrix::Multiply(const sgCMatrix& MatrB)
{
	o_hcmult(m_matrix,const_cast<lpMATR>(MatrB.m_matrix));
}

void  sgCMatrix::Translate(const SG_VECTOR& transVector)
{
	sgCMatrix  tmpMatr;
	tmpMatr.m_matrix[3]  = transVector.x;
	tmpMatr.m_matrix[7]  = transVector.y;
	tmpMatr.m_matrix[11] = transVector.z;
	Multiply(tmpMatr);
}

void  sgCMatrix::Rotate(const SG_POINT& axePoint, const SG_VECTOR& axeDir, sgFloat alpha_radians)
{
	D_POINT axeP;
	axeP.x = axePoint.x; 
	axeP.y = axePoint.y; 
	axeP.z = axePoint.z;
	D_POINT axeDir1;
	axeDir1.x = axeDir.x; 
	axeDir1.y = axeDir.y; 
	axeDir1.z = axeDir.z;
	o_rotate_xyz(m_matrix,&axeP,&axeDir1,alpha_radians);
}


void  sgCMatrix::Scale(sgFloat scaleX, sgFloat scaleY, sgFloat scaleZ)
{
	sgFloat GFa[16];
	o_hcunit(GFa);
	GFa[0] = scaleX;
	GFa[5] = scaleY;
	GFa[10] = scaleZ;
	o_hcmult(m_matrix,GFa);
}

void  sgCMatrix::VectorToZAxe(const SG_VECTOR& vect)
{
	D_POINT vecPnt;
	vecPnt.x = vect.x;
	vecPnt.y = vect.y;
	vecPnt.z = vect.z;
	o_hcrot1(m_matrix,&vecPnt);
}

void  sgCMatrix::ApplyMatrixToVector(SG_POINT& vectBegin, SG_VECTOR& vectDir) const
{
	D_POINT bP, dV;
	memcpy(&bP,&vectBegin,sizeof(D_POINT));
	memcpy(&dV,&vectDir,sizeof(D_POINT));
	o_trans_vector(const_cast<lpMATR>(m_matrix),&bP, &dV);
	memcpy(&vectBegin,&bP,sizeof(D_POINT));
	memcpy(&vectDir,&dV,sizeof(D_POINT));
}

void  sgCMatrix::ApplyMatrixToPoint(SG_POINT& pnt) const
{
	sgFloat vx, vy, vz;

	vx = pnt.x; vy = pnt.y; vz = pnt.z;

	pnt.x = vx*m_matrix[0] + vy*m_matrix[1] + vz*m_matrix[2]  + m_matrix[3];
	pnt.y = vx*m_matrix[4] + vy*m_matrix[5] + vz*m_matrix[6]  + m_matrix[7];
	pnt.z = vx*m_matrix[8] + vy*m_matrix[9] + vz*m_matrix[10] + m_matrix[11];
}

static sgFloat getElem(const sgFloat* sourceData, int i, int j)
{
    return sourceData[i*4+j];
}
static sgFloat getLen(sgFloat sx, sgFloat sy, sgFloat sz)
{
    return  sqrt(sx*sx+sy*sy+sz*sz);
}

void  sgCMatrix::Decompose(SG_VECTOR& translation, SG_VECTOR& rotation, SG_VECTOR& scale)
{
    const sgFloat* source = GetData();
    // extract translation
    translation.x = getElem(source, 3, 0);
    translation.y = getElem(source, 3, 1);
    translation.z = getElem(source, 3, 2);
    
    // extract scale
    scale.x = getLen(getElem(source, 0, 0), getElem(source, 0, 1), getElem(source, 0, 2));
    scale.y = getLen(getElem(source, 1, 0), getElem(source, 1, 1), getElem(source, 1, 2));
    scale.z = getLen(getElem(source, 2, 0), getElem(source, 2, 1), getElem(source, 2, 2));
    
    sgFloat  rotW = 0.0f;
    // extract rotation
    if ((1.0f + getElem(source, 0, 0) + getElem(source, 1, 1) + getElem(source, 2, 2)) > 0.00001)
    {
        rotW =  sqrt(1.0f + getElem(source, 0, 0) / scale.x + getElem(source, 1, 1) / scale.y + getElem(source, 2, 2) / scale.z) / 2.0f;
        rotation.x = -(getElem(source, 2, 1) / scale.z - getElem(source, 1, 2) / scale.y) / (4.0f * rotW);
        rotation.y = -(getElem(source, 0, 2) / scale.x - getElem(source, 2, 0) / scale.z) / (4.0f * rotW);
        rotation.z = -(getElem(source, 1, 0) / scale.y - getElem(source, 0, 1) / scale.x) / (4.0f * rotW);
    }
    else if (getElem(source, 0, 0) > getElem(source, 1, 1) && getElem(source, 0, 0) > getElem(source, 2, 2))
    {
        rotation.x = -sqrt(1.0f + getElem(source,0, 0) / scale.x - getElem(source, 1, 1) / scale.y - getElem(source,2, 2) / scale.z) / 2.0f;
        rotation.y = -(getElem(source,0, 1) / scale.x + getElem(source,1, 0) / scale.y) / (4.0f * rotation.x);
        rotation.z = -(getElem(source,0, 2) / scale.x + getElem(source,2, 0) / scale.z) / (4.0f * rotation.x);
        rotW = (getElem(source,2, 1) / scale.z - getElem(source,1, 2) / scale.y) / (4.0f * rotation.x);
    }
    else if (getElem(source, 1, 1) > getElem(source, 2, 2))
    {
        rotation.y = -sqrt(1.0f + getElem(source, 1, 1) / scale.y - getElem(source, 0, 0) / scale.x - getElem(source, 2, 2) / scale.z) / 2.0f;
        rotation.x = -(getElem(source, 0, 1) / scale.x + getElem(source, 1, 0) / scale.y) / (4.0f * rotation.y);
        rotation.z = -(getElem(source, 1, 2) / scale.y + getElem(source, 2, 1) / scale.z) / (4.0f * rotation.y);
        rotW = (getElem(source, 0, 2) / scale.x - getElem(source, 2, 0) / scale.z) / (4.0f * rotation.y);
    }
    else
    {
        rotation.z = -sqrt(1.0f + getElem(source, 2, 2) / scale.z - getElem(source,0, 0) / scale.x - getElem(source, 1, 1) / scale.y) / 2.0f;
        rotation.x = -(getElem(source, 0, 2) / scale.x + getElem(source, 2, 0) / scale.z) / (4.0f * rotation.z);
        rotation.y = -(getElem(source, 1, 2) / scale.y + getElem(source, 2, 1) / scale.z) / (4.0f * rotation.z);
        rotW = (getElem(source, 1, 0) / scale.y - getElem(source, 0, 1) / scale.x) / (4.0f * rotation.z);
    }
    
    sgFloat qLen = sqrt(rotation.x*rotation.x+rotation.y*rotation.y+rotation.z*rotation.z+rotW*rotW);
    rotation.x /= qLen;
    rotation.y /= qLen;
    rotation.z /= qLen;
    
    SG_VECTOR tmpAngl;
    
    tmpAngl.x = atan2(2.0*(rotation.x*rotW+rotation.y*rotation.z) , 1.0 - 2.0*(rotation.x*rotation.x + rotation.y*rotation.y));
    tmpAngl.y = asin( 2.0*(rotW*rotation.y - rotation.z*rotation.x));
    tmpAngl.z = atan2(2.0*(rotation.z*rotW+rotation.y*rotation.x) , 1.0 - 2.0*(rotation.y*rotation.y +rotation.z*rotation.z));
    
    rotation.x = tmpAngl.x*180.0/M_PI;
    rotation.y = tmpAngl.y*180.0/M_PI;
    rotation.z = tmpAngl.z*180.0/M_PI;
}

