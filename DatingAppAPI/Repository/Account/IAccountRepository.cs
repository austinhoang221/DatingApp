using Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository.Account
{
    public interface IAccountRepository
    {
        Task<AuthenticationResponseModel?> Register(AuthenticationRequestModel model);
        Task<AuthenticationResponseModel?> Login(AuthenticationRequestModel model);
    }
}
