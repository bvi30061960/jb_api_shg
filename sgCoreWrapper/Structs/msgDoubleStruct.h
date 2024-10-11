#pragma once

namespace sgCoreWrapper
{
	namespace Structs
	{
		public ref struct msgDoubleStruct
		{
			property long double value
			{
				long double get() { return *_value; }
				void set(long double value) { *_value = value; }
			}
		internal:
			msgDoubleStruct(long double* value)
			{
				_value = value;
			}
		private:
			long double* _value;
		};
	}
}