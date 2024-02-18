using Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository.User
{
    public interface IUsersRepository
    {
       Task<IEnumerable<AppUser>> GetUsers();
    }
}
