#pragma once
#include "..\..\..\sgCore\sg3D.h"

namespace sgCoreWrapper
{
	namespace Structs
	{
		public ref struct msgBoxStruct
		{
		public:
			property long double SizeX
			{
				long double get() { return _sgBox->SizeX; }
				void set(long double value) { _sgBox->SizeX = value; }
			}

			property long double SizeY
			{
				long double get() { return _sgBox->SizeY; }
				void set(long double value) { _sgBox->SizeY = value; }
			}

			property long double SizeZ
			{
				long double get() { return _sgBox->SizeZ; }
				void set(long double value) { _sgBox->SizeZ = value; }
			}
		internal:
			msgBoxStruct(SG_BOX* box)
			{
				_sgBox = box;
			}
			SG_BOX* _sgBox;
		};
	}
}