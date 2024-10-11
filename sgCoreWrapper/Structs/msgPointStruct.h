#pragma once
#include "..\..\sgCore\sgDefs.h"

namespace sgCoreWrapper
{
	namespace Structs
	{
		public ref struct msgPointStruct
		{
		public:
			msgPointStruct()
			{
				CreateNewPoint();
			}

			msgPointStruct(long double x, long double y, long double z)
			{
				CreateNewPoint();

				this->x = x;
				this->y = y;
				this->z = z;
			}

			~msgPointStruct()
			{
				this->!msgPointStruct();
			}

			!msgPointStruct()
			{
				if (_needDelete)
				{
					delete _point;
				}
			}

			property long double x
			{
				long double get() { return _point->x; }
				void set(long double value) { _point->x = value; }
			}
			
			property long double y
			{
				long double get() { return _point->y; }
				void set(long double value) { _point->y = value; }
			}
			property long double z
			{
				long double get() { return _point->z; }
				void set(long double value) { _point->z = value; }
			}

		private:
			bool _needDelete;

			void CreateNewPoint()
			{
				_point = new SG_POINT();
				_needDelete = true;
			}
		
		internal:
			msgPointStruct(SG_POINT* point)
			{
				CreateNewPoint();

                this->x = point->x;
                this->y = point->y;
                this->z = point->z;
			}

			SG_POINT* _point;
		};

		public ref struct msgVectorStruct : public msgPointStruct
		{
			msgVectorStruct()
			{}

			msgVectorStruct(long double x, long double y, long double z) : msgPointStruct(x, y, z)
			{}

		internal:
			msgVectorStruct(SG_POINT* point) : msgPointStruct(point)
			{}
		};
	}
}