using Azure;
using Azure.Core;
using Entities;
using Helper.Extensions;
using Helper.Token;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Primitives;
using Repository.Models;
using System;
using System.Collections.Generic;
using System.Data.Common;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace Repository.Account
{
    public class AccountRepository : BaseRepository<AppUser>, IAccountRepository
    {
        private readonly ITokenService _tokenService;
        private new readonly SqlConnection _connection;

        public AccountRepository(SqlConnection connection, ITokenService tokenService)
        {
            _connection = connection;
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
                Created = newUser.Created,
                LastActive = newUser.LastActive,
                Token = _tokenService.CreateToken(newUser.UserName)
            };
            string query = "INSERT INTO " +
                "[AppUser] ([Id],[UserName],[PasswordHash], [PasswordSalt], [Created],[LastActive]) " +
                "VALUES (@Id, @UserName, @PasswordHash, @PasswordSalt, @Created,@LastActive)";
            try
            {
                using (SqlCommand command = new SqlCommand(query, connection, _transaction))
                {
                    command.Parameters.AddWithValue($"@Id", Guid.NewGuid());
                    command.Parameters.AddWithValue($"@UserName", newUser.UserName);
                    command.Parameters.AddWithValue($"@PasswordHash", newUser.PasswordHash);
                    command.Parameters.AddWithValue($"@PasswordSalt", newUser.PasswordSalt);
                    command.Parameters.AddWithValue($"@Created", newUser.Created);
                    command.Parameters.AddWithValue($"@LastActive", newUser.LastActive);
                    await command.ExecuteNonQueryAsync();
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
                    await connection.CloseAsync();
                }
            }
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
                    Id = user.Id,
                    UserName = user.UserName,
                    Token = _tokenService.CreateToken(user.UserName),
                    PhotoUrl = user.PhotoUrl,
                    Age = user.Age,
                    City = user.City,
                    Created = user.Created,
                    LastActive = user.LastActive,
                    KnownAs = user.KnownAs,
                    Gender = user.Gender,
                    Introduction = user.Introduction,
                };
                return newUser;
            }

            private async Task<AppUserModel?> GetByUserName(string userName)
            {
                SqlConnection sqlConnection = _connection;
                string query = $"SELECT AU.Id, P.Id AS PhotoId, UserName, DateOfBirth, KnownAs, Created, " +
                        $"LastActive, Gender, Introduction, PasswordSalt, PasswordHash, " +
                        $"City, Country, Url, IsMain, PublicId " +
                        $"FROM AppUser AU JOIN Photo P ON AU.Id = P.AppUserId " +
                        $"Where UserName = @UserName AND IsMain = 1";
                try
                {
                    await EstablishConnection(sqlConnection);

                    using (SqlCommand command = new SqlCommand(query, sqlConnection, _transaction))
                    {
                        command.Parameters.AddWithValue("@UserName", userName);

                        using (SqlDataReader reader = command.ExecuteReader())
                        {
                            if (reader.Read())
                            {
                                var user = new AppUserModel()
                                {
                                    Id = new Guid(reader["Id"].ToString()),
                                    UserName = reader["UserName"].ToString(),
                                    PasswordSalt = (byte[])(reader["PasswordSalt"]),
                                    PasswordHash = (byte[])(reader["PasswordHash"]),
                                    PhotoUrl = reader.IsDBNull(reader.GetOrdinal("Url")) ? string.Empty : reader.GetString(reader.GetOrdinal("Url")),
                                    Age = reader.IsDBNull(reader.GetOrdinal("DateOfBirth")) ? 0 : DateTimeExtension.CalculateAge(reader.GetDateTime(reader.GetOrdinal("DateOfBirth"))),
                                    Created = reader.IsDBNull(reader.GetOrdinal("Created")) ? DateTime.MinValue : reader.GetDateTime(reader.GetOrdinal("Created")),
                                    LastActive = reader.IsDBNull(reader.GetOrdinal("LastActive")) ? DateTime.MinValue : reader.GetDateTime(reader.GetOrdinal("LastActive")),
                                    KnownAs = reader.IsDBNull(reader.GetOrdinal("KnownAs")) ? string.Empty : reader.GetString(reader.GetOrdinal("KnownAs")),
                                    Gender = reader.IsDBNull(reader.GetOrdinal("Gender")) ? string.Empty : reader.GetString(reader.GetOrdinal("Gender")),
                                    Introduction = reader.IsDBNull(reader.GetOrdinal("Introduction")) ? string.Empty : reader.GetString(reader.GetOrdinal("Introduction")),
                                    Country = reader.IsDBNull(reader.GetOrdinal("Country")) ? string.Empty : reader.GetString(reader.GetOrdinal("Country")),
                                    City = reader.IsDBNull(reader.GetOrdinal("City")) ? string.Empty : reader.GetString(reader.GetOrdinal("City")),
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

            }

            
        }
    }
