using Entities;
using Repository.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository.User
{
    public interface IUsersRepository
    {
        void Update(AppUser user);
        Task<IEnumerable<MemberModel>> GetUsers();
        Task<MemberModel> GetUserById(Guid id);
        Task<MemberModel> GetUserByUsername(string name);
    }
}
