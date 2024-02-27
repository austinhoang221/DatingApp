using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository
{
    public class NonExistException : Exception
    {
        public NonExistException(string name) : base($"The {name} is not found") { }
    }
}
