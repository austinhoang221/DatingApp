using Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Repository.User;

namespace DatingAppAPI.Controllers
{

    public class UsersController : BaseApiController
    {
        private readonly IUsersRepository _usersRepository;
        public UsersController(IUsersRepository usersRepository)
        {
            _usersRepository = usersRepository;
        }

        [Authorize]
        [HttpGet()]
        public async Task<IEnumerable<AppUser>> GetAll()
        {
            return await _usersRepository.GetUsers();
        }
    }
}
