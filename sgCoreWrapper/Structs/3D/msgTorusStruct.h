#pragma once
#include "..\..\..\sgCore\sg3D.h"

namespace sgCoreWrapper
{
	namespace Structs
	{
		public ref struct msgTorusStruct
		{
		public:
			property long double Radius1
			{
				long double get() { return _sgTorus->Radius1; }
				void set(long double value) { _sgTorus->Radius1 = value; }
			}

			property long double Radius2
			{
				long double get() { return _sgTorus->Radius2; }
				void set(long double value) { _sgTorus->Radius2 = value; }
			}

			property short MeridiansCount1
			{
				short get() { return _sgTorus->MeridiansCount1; }
				void set(short value) { _sgTorus->MeridiansCount1 = value; }
			}

			property short MeridiansCount2
			{
				short get() { return _sgTorus->MeridiansCount2; }
				void set(short value) { _sgTorus->MeridiansCount2 = value; }
			}
		internal:
			msgTorusStruct(SG_TORUS* torus)
			{
				_sgTorus = torus;
			}
			SG_TORUS* _sgTorus;
		};
	}
}