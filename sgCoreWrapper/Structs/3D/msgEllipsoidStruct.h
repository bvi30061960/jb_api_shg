#pragma once
#include "..\..\..\sgCore\sg3D.h"

namespace sgCoreWrapper
{
	namespace Structs
	{
		public ref struct msgEllipsoidStruct
		{
		public:
			property long double Radius1
			{
				long double get() { return _sgEllipsoid->Radius1; }
				void set(long double value) { _sgEllipsoid->Radius1 = value; }
			}

			property long double Radius2
			{
				long double get() { return _sgEllipsoid->Radius2; }
				void set(long double value) { _sgEllipsoid->Radius2 = value; }
			}

			property long double Radius3
			{
				long double get() { return _sgEllipsoid->Radius3; }
				void set(long double value) { _sgEllipsoid->Radius3 = value; }
			}

			property short MeridiansCount
			{
				short get() { return _sgEllipsoid->MeridiansCount; }
				void set(short value) { _sgEllipsoid->MeridiansCount = value; }
			}

			property short ParallelsCount
			{
				short get() { return _sgEllipsoid->ParallelsCount; }
				void set(short value) { _sgEllipsoid->ParallelsCount = value; }
			}
		internal:
			msgEllipsoidStruct(SG_ELLIPSOID* ellipsoid)
			{
				_sgEllipsoid = ellipsoid;
			}
			SG_ELLIPSOID* _sgEllipsoid;
		};
	}
}