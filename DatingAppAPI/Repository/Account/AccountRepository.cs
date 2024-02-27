using Entities;
using Helper.Token;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Primitives;
using Repository.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace Repository.Account
{
    public class AccountRepository : BaseRepository<AppUser>, IAccountRepository
    {
        private readonly SqlConnection _connection;
        private readonly ITokenService _tokenService;

        public AccountRepository(SqlConnection connection, ITokenService tokenService)
        {
            this._connection = connection;
            _tokenService = tokenService;
        }

        public async Task<AuthenticationResponseModel?> Register(AuthenticationRequestModel model)
        {
            SqlConnection connection = _connection;
            await this.EstablishConnection(connection);
            var user = await GetByUserName(model.UserName);

            if (user != null) throw new Exception("User existed");
                using var hmac = new HMACSHA512();
                var newUser = new AppUser()
                {
                    Id = Guid.NewGuid(),
                    UserName = model.UserName,
                    PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(model.Password)),
                    PasswordSalt = hmac.Key,
                    Created = DateTime.UtcNow,
                    LastActive = DateTime.UtcNow,

                };
            var responseUser = new AuthenticationResponseModel()
            {
                UserName = newUser.UserName,
                Token = _tokenService.CreateToken(newUser)
            };
            await this.Insert(newUser);
            return responseUser;
        }

        public async Task<AuthenticationResponseModel?> Login(AuthenticationRequestModel model)
        {
            SqlConnection connection = _connection;
            await this.EstablishConnection(connection);

            var user = await GetByUserName(model.UserName);
            if (user == null) return null;

            using var hmac = new HMACSHA512(user.PasswordSalt);

            var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(model.Password));

            for (int i = 0; i < computedHash.Length; i++)
            {
                if (computedHash[i] != user.PasswordHash[i]) throw new Exception("Password incorrect");
            }

            var newUser = new AuthenticationResponseModel()
            {
                UserName = user.UserName,
                Token = _tokenService.CreateToken(user)
            };
            return newUser;
        }

        private async Task<AppUser?> GetByUserName(string userName)
        {
            SqlConnection sqlConnection = _connection;
            string query = $"SELECT * FROM AppUser WHERE UserName = '{userName}'";
            try
            {
                await EstablishConnection(sqlConnection);

                using (SqlCommand command = new SqlCommand(query, sqlConnection, _transaction))
                {
                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            var user = new AppUser()
                            {
                                Id = new Guid(reader["Id"].ToString()),
                                UserName = reader["UserName"].ToString(),
                                PasswordSalt = (byte[])(reader["PasswordSalt"]),
                                PasswordHash = (byte[])(reader["PasswordHash"]),
                            };
                            return user;
                        }
                        else
                        {
                            return null;
                        }

                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                throw new Exception(ex.Message);
            }
            finally
            {
                if (_transaction == null)
                {
                    await sqlConnection.CloseAsync();
                }
            }
        }
    }
}
