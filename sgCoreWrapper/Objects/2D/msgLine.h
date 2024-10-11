#pragma once
#include "..\..\..\sgCore\sg2D.h"
#include "Objects/2D/msg2DObject.h"
#include "Structs/2D/msgLineStruct.h"

using namespace sgCoreWrapper::Structs;

namespace sgCoreWrapper
{
	namespace Objects
	{
		public ref class msgLine : msg2DObject
		{
		public:
			static msgLine^ Create(long double pX1, long double pY1, long double pZ1, long double pX2, long double pY2, long double pZ2)
			{
				return gcnew msgLine(sgCLine::Create(pX1, pY1, pZ1, pX2, pY2, pZ2));
			}

			msgLineStruct^ GetGeometry()
			{
				return gcnew msgLineStruct((SG_LINE*)sgLine->GetGeometry());
			}

			bool virtual IsClosed() override
			{
				return sgLine->IsClosed();
			}

			bool virtual IsPlane(msgVectorStruct^ vec, long double value) override
			{
				return sgLine->IsPlane(vec->_point, &value);
			}

			bool virtual IsLinear() override
			{
				return sgLine->IsLinear();
			}

			bool virtual IsSelfIntersecting() override
			{
				return sgLine->IsSelfIntersecting();
			}
		internal:
			msgLine(sgCLine* line) : msg2DObject(line)
			{
			}
			internal:
			property sgCLine* sgLine
			{
				sgCLine* get() { return (sgCLine*)_sgCObject; }
			}
		};
	}
}