using Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Repository.Models;
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
        public async Task<IEnumerable<MemberModel>> GetAll()
        {
            return await _usersRepository.GetUsers();
        }

        [Authorize]
        [HttpGet("paginate")]
        public async Task<IEnumerable<MemberModel>> GetPaginate([FromQuery] PaginationRequestModel model)
        {
            return await _usersRepository.GetUsersPaginate(model);
        }

        [Authorize]
        [HttpGet("{id}")]
        public async Task<MemberModel> GetById(Guid id)
        {
            return await _usersRepository.GetUserById(id);
        }

        [Authorize]
        [HttpGet("{username}")]
        public async Task<MemberModel> GetByUsername(string username)
        {
            return await _usersRepository.GetUserByUsername(username);
        }
    }
}
