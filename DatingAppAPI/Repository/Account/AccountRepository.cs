using Azure;
using Azure.Core;
using Entities;
using Helper.Errors;
using Helper.Extensions;
using Helper.Token;
using Microsoft.AspNetCore.Http;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Primitives;
using Repository.Models;
using System;
using System.Collections.Generic;
using System.Data.Common;
using System.Linq;
using System.Net;
using System.Reflection;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using System.Transactions;

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
            var user = await GetByEmail(model.Email);

            if (user != null) throw new Exception("User existed");

            return await CreateUser(model, connection);
        }

        public async Task<AuthenticationResponseModel?> RegisterByOAuth(OAuthUserRequestModel model)
        {
            SqlConnection connection = _connection;
            await this.EstablishConnection(connection);
            var user = await GetByEmail(model.Email);

            if (user != null) return await Login(model);

            return await CreateUser(model, connection);
        }

        private async Task<AuthenticationResponseModel> CreateUser(AuthenticationRequestModel model, SqlConnection connection)
        {

            using var hmac = new HMACSHA512();
            var newUser = new AppUser()
            {
                Id = Guid.NewGuid(),
                Email = model.Email,
                KnownAs = model.KnownAs,
                PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(model.Password)),
                PasswordSalt = hmac.Key,
                Created = DateTime.UtcNow,
                LastActive = DateTime.UtcNow,
            };

            var responseUser = new AuthenticationResponseModel()
            {
                Email = newUser.Email,
                Created = newUser.Created,
                LastActive = newUser.LastActive,
                Token = _tokenService.CreateToken(newUser.Email)
            };
            string query = "INSERT INTO " +
                "[AppUser] ([Id],[Email],[PasswordHash], [PasswordSalt], [KnownAs], [Created],[LastActive]) " +
                "VALUES (@Id, @Email, @PasswordHash, @PasswordSalt, @KnownAs, @Created,@LastActive)";
            try
            {
                using SqlTransaction transaction = connection.BeginTransaction();
                Guid newUserId = Guid.NewGuid();
                using (SqlCommand command = new SqlCommand(query, connection, transaction))
                {
                    command.Parameters.AddWithValue($"@Id", newUserId);
                    command.Parameters.AddWithValue($"@Email", newUser.Email);
                    command.Parameters.AddWithValue($"@KnownAs", newUser.KnownAs);
                    command.Parameters.AddWithValue($"@PasswordHash", newUser.PasswordHash);
                    command.Parameters.AddWithValue($"@PasswordSalt", newUser.PasswordSalt);
                    command.Parameters.AddWithValue($"@Created", newUser.Created);
                    command.Parameters.AddWithValue($"@LastActive", newUser.LastActive);
                    await command.ExecuteNonQueryAsync();
                }

                if (model.PhotoUrl != null)
                {
                    string photoQuery = "INSERT INTO " +
                       "[Photo] VALUES (@Id, @Url, @IsMain, @PublicId, @AppUserId)";
                    using (SqlCommand command = new SqlCommand(photoQuery, connection, transaction))
                    {
                        command.Parameters.AddWithValue($"@Id", Guid.NewGuid());
                        command.Parameters.AddWithValue($"@Url", model.PhotoUrl);
                        command.Parameters.AddWithValue($"@IsMain", true);
                        command.Parameters.AddWithValue($"@PublicId", "PublicId");
                        command.Parameters.AddWithValue($"@AppUserId", newUserId);
                        await command.ExecuteNonQueryAsync();
                    }
                }
                await transaction.CommitAsync();

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

            var user = await GetByEmail(model.Email);
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
                Email = user.Email,
                Token = _tokenService.CreateToken(user.Email),
                PhotoUrl = user.PhotoUrl,
                Age = user.Age,
                City = user.City,
                Created = user.Created,
                LastActive = user.LastActive,
                KnownAs = user.KnownAs,
                Gender = user.Gender,
                Introduction = user.Introduction,
                Photos = user.Photos,
            };
            return newUser;
        }

        private async Task<AppUserModel?> GetByEmail(string email)
        {
            SqlConnection sqlConnection = _connection;
            string query = $"SELECT AU.Id, P.Id AS PhotoId, Email, DateOfBirth, KnownAs, Created, " +
                    $"LastActive, Gender, Introduction, PasswordSalt, PasswordHash, " +
                    $"City, Country, Url, IsMain, PublicId " +
                    $"FROM AppUser AU JOIN Photo P ON AU.Id = P.AppUserId " +
                    $"Where Email = @Email";
            try
            {
                await EstablishConnection(sqlConnection);

                using (SqlCommand command = new SqlCommand(query, sqlConnection, _transaction))
                {
                    command.Parameters.AddWithValue("@Email", email);

                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        if (reader.HasRows)
                        {
                            var user = new AppUserModel();
                            while (reader.Read())
                            {
                                user = new AppUserModel()
                                {
                                    Id = new Guid(reader["Id"].ToString()),
                                    Email = reader["Email"].ToString(),
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
                                    Photos = new List<Photo>()
                                };
                                bool isMain = reader.GetBoolean(reader.GetOrdinal("IsMain"));
                                if (isMain)
                                {
                                    user.PhotoUrl = reader.GetString(reader.GetOrdinal("Url"));
                                }
                                user.Photos.Add(new Photo()
                                {
                                    Id = reader.GetGuid(reader.GetOrdinal("PhotoId")),
                                    Url = reader.GetString(reader.GetOrdinal("Url")),
                                    IsMain = reader.GetBoolean(reader.GetOrdinal("IsMain")),
                                    PublicId = reader.IsDBNull(reader.GetOrdinal("PublicId")) ? string.Empty : reader.GetString(reader.GetOrdinal("PublicId")),
                                });
                            }
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
