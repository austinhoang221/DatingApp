using Microsoft.AspNetCore.Mvc;
using Entities;
using System.Security.Cryptography;
using System.Text;
using Repository.Account;
using Microsoft.AspNetCore.Authorization;
using Repository.Models;

namespace DatingAppAPI.Controllers
{
    public class AccountController : BaseApiController
    {
        private readonly IAccountRepository _accountRepository;
        public AccountController(IAccountRepository accountRepository)
        {
            _accountRepository = accountRepository;
        }
        [AllowAnonymous]
        [HttpPost("register")]
        public async Task<ActionResult<AuthenticationResponseModel>> Register(AuthenticationRequestModel model)
        {
            var result = await _accountRepository.Register(model);
            if (result == null) return BadRequest("User existed");
            return result;
        }

        [AllowAnonymous]
        [HttpPost("register-oauth")]
        public async Task<ActionResult<AuthenticationResponseModel>> RegisterByOAuth(AuthenticationRequestModel model)
        {
            var result = await _accountRepository.RegisterByOAuth(model);
            return result;
        }
        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<ActionResult<AuthenticationResponseModel>> Login(AuthenticationRequestModel model)
        {
            var result = await _accountRepository.Login(model);
            if (result == null) return BadRequest("User not exist");
            return result;
        }

    }
}
