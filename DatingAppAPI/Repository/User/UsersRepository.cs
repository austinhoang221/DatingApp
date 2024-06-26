﻿using AutoMapper;
using Entities;
using Helper.Extensions;
using Microsoft.Data.SqlClient;
using Repository.Models;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace Repository.User
{
    public class UsersRepository : BaseRepository<AppUser>, IUsersRepository
    {
        private readonly IMapper _mapper;
        private new readonly SqlConnection _connection;
        public UsersRepository(SqlConnection connection, IMapper mapper)
        {
            _connection = connection;
            _mapper = mapper;
        }

        public async Task<MemberModel> GetUserById(Guid id)
        {
            SqlConnection connection = this._connection;
            await EstablishConnection(connection);
            var user = await this.GetById(id);
            var result = _mapper.Map<MemberModel>(user);
            return result;
        }

        public async Task<MemberModel> GetUserByEmail(string email)
        {
            SqlConnection connection = this._connection;
            await EstablishConnection(connection);
            string query = $"SELECT *, P.Id AS PhotoId FROM AppUser AU JOIN Photo P ON AU.Id = P.AppUserId WHERE Email = @Email";

            using (SqlCommand command = new SqlCommand(query, connection, _transaction))
            {
                command.Parameters.AddWithValue("@Email", email);
                MemberModel user = new MemberModel();
                using (SqlDataReader reader = command.ExecuteReader())
                {
                    if (reader.HasRows)
                    {
                        Dictionary<Guid, MemberModel> userDictionary = new Dictionary<Guid, MemberModel>();
                        while (reader.Read())
                        {                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              
                            Guid userId = reader.GetGuid(reader.GetOrdinal("Id"));
                            if (!userDictionary.TryGetValue(userId, out MemberModel userResponse))
                            {
                                user = MapResponseUser(reader);
                                userDictionary.Add(userId, userResponse);
                            }
                        }
                    }
                    else
                    {
                        throw new NonExistException($"User with name ${email}");
                    }
                }
                return user;
            }
        }

        public async Task<IEnumerable<MemberModel>> GetUsers()
        {
            SqlConnection connection = this._connection;
            await EstablishConnection(connection);
            List<MemberModel> users = new List<MemberModel>();
            try
            {
                await EstablishConnection(connection);
                string query = $"SELECT AU.Id, P.Id AS PhotoId, Email, DateOfBirth, KnownAs, Created, " +
                    $"LastActive, Gender, Introduction, " +
                    $"City, Country, Url, IsMain, PublicId " +
                    $"FROM AppUser AU JOIN Photo P ON AU.Id = P.AppUserId";

                using (SqlCommand command = new SqlCommand(query, connection, _transaction))
                {
                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        if (reader.HasRows)
                        {
                            Dictionary<Guid, MemberModel> userDictionary = new Dictionary<Guid, MemberModel>();
                            while (reader.Read())
                            {
                                Guid userId = reader.GetGuid(reader.GetOrdinal("Id"));
                                if (!userDictionary.TryGetValue(userId, out MemberModel user))
                                {
                                    user = MapResponseUser(reader);
                                    userDictionary.Add(userId, user);
                                    users.Add(user);
                                }
                                Guid photoId = reader.GetGuid(reader.GetOrdinal("PhotoId"));
                             
                                  
                            }
                        }
                    }
                }

            }

            catch (Exception e)
            {
                throw new Exception(e.Message);
            }
            finally
            {
                if (_transaction == null) await connection.CloseAsync();
            }
            return users;
        }

        public async Task<IEnumerable<MemberModel>> GetUsersPaginate(PaginationRequestModel model)
        {
            SqlConnection connection = this._connection;
            await EstablishConnection(connection);
            List<MemberModel> users = new List<MemberModel>();

            try
            {
                using (SqlCommand command = new SqlCommand("GetUsers", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    SqlParameter parameterPageSize = command.Parameters.AddWithValue("@PageSize", model.PageSize);
                    SqlParameter parameterPageNum = command.Parameters.AddWithValue("@PageNumber", model.PageNum);
                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        if (reader.HasRows)
                        {
                            Dictionary<Guid, MemberModel> userDictionary = new Dictionary<Guid, MemberModel>();
                            while (reader.Read())
                            {
                                Guid userId = reader.GetGuid(reader.GetOrdinal("Id"));
                                if (!userDictionary.TryGetValue(userId, out MemberModel user))
                                {
                                    user = MapResponseUser(reader);
                                    userDictionary.Add(userId, user);
                                    users.Add(user);
                                }
                            
                            }
                        }
                    }
                }
                return users;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }
            finally
            {
                if (_transaction == null) await connection.CloseAsync();
            }
        }

        public async Task GenerateSeedData(List<AppUser> users)
        {
            SqlConnection connection = _connection;
            await this.EstablishConnection(connection);
            bool isHaveUsers = await CheckUsersExist();
            if (!isHaveUsers)
            {
                string query = "INSERT INTO " +
                    "[AppUser] ([Id],[Email],[PasswordHash], [PasswordSalt], [Created],[LastActive],[DateOfBirth] ,[KnownAs], " +
                    "[Gender] ,[Introduction], [City] ,[Country]) " +
                    "VALUES (@Id, @Email, @PasswordHash, @PasswordSalt, @Created, @LastActive, @DateOfBirth, @KnownAs, @Gender, @Introduction, @City, @Country)";

                using SqlTransaction transaction = connection.BeginTransaction();
                try
                {
                    foreach (var user in users)
                    {
                        using (SqlCommand command = new SqlCommand(query, connection, transaction))
                        {
                            using var hmac = new HMACSHA512();

                            user.Email = user.Email;
                            user.PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes("Sieunhan221"));
                            user.PasswordSalt = hmac.Key;
                            user.Id = Guid.NewGuid();
                            command.Parameters.AddWithValue($"@Id", user.Id);
                            command.Parameters.AddWithValue($"@Email", user.Email);
                            command.Parameters.AddWithValue($"@PasswordHash", user.PasswordHash);
                            command.Parameters.AddWithValue($"@PasswordSalt", user.PasswordSalt);
                            command.Parameters.AddWithValue($"@Created", user.Created);
                            command.Parameters.AddWithValue($"@LastActive", user.LastActive);
                            command.Parameters.AddWithValue($"@DateOfBirth", user.DateOfBirth);
                            command.Parameters.AddWithValue($"@KnownAs", user.KnownAs);
                            command.Parameters.AddWithValue($"@Gender", user.Gender);
                            command.Parameters.AddWithValue($"@Introduction", user.Introduction);
                            command.Parameters.AddWithValue($"@City", user.City);
                            command.Parameters.AddWithValue($"@Country", user.Country);
                            await command.ExecuteNonQueryAsync();
                        }

                        string photoQuery = "INSERT INTO " +
                       "[Photo] VALUES (@Id, @Url, @IsMain, @PublicId, @AppUserId)";
                        using (SqlCommand command = new SqlCommand(photoQuery, connection, transaction))
                        {
                            command.Parameters.AddWithValue($"@Id", Guid.NewGuid());
                            command.Parameters.AddWithValue($"@Url", user.Photos.SingleOrDefault(item => item.IsMain)?.Url);
                            command.Parameters.AddWithValue($"@IsMain", true);
                            command.Parameters.AddWithValue($"@PublicId", "PublicId");
                            command.Parameters.AddWithValue($"@AppUserId", user.Id);
                            await command.ExecuteNonQueryAsync();
                        }
                    }
                    await transaction.CommitAsync();
                }

                catch (Exception ex)
                {
                    Console.WriteLine(ex.Message);
                    await transaction.RollbackAsync();
                    throw new Exception(ex.Message);
                }
                finally
                {
                    if (_transaction == null)
                    {
                        await connection.CloseAsync();
                    }
                }
            }
            else
            {
                return;
            }
        }

        private async Task<bool> CheckUsersExist()
        {
            SqlConnection sqlConnection = _connection;
            string query = $"SELECT TOP 1 * FROM AppUser";
            try
            {
                await EstablishConnection(sqlConnection);

                using (SqlCommand command = new SqlCommand(query, sqlConnection, _transaction))
                {
                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        return reader.Read();
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                throw new Exception(ex.Message);
            }
        }

        private MemberModel MapResponseUser(SqlDataReader reader)
        {
            MemberModel user;
            try
            {
            user = new MemberModel()
            {
                Id = reader.GetGuid(reader.GetOrdinal("Id")),
                Email = reader.IsDBNull(reader.GetOrdinal("Email")) ? string.Empty : reader.GetString(reader.GetOrdinal("Email")),
                Age = reader.IsDBNull(reader.GetOrdinal("DateOfBirth")) ? 0 : DateTimeExtension.CalculateAge(reader.GetDateTime(reader.GetOrdinal("DateOfBirth"))),
                Created = reader.IsDBNull(reader.GetOrdinal("Created")) ? DateTime.MinValue : reader.GetDateTime(reader.GetOrdinal("Created")),
                LastActive = reader.IsDBNull(reader.GetOrdinal("LastActive")) ? DateTime.MinValue : reader.GetDateTime(reader.GetOrdinal("LastActive")),
                KnownAs = reader.IsDBNull(reader.GetOrdinal("KnownAs")) ? string.Empty : reader.GetString(reader.GetOrdinal("KnownAs")),
                Gender = reader.IsDBNull(reader.GetOrdinal("Gender")) ? string.Empty : reader.GetString(reader.GetOrdinal("Gender")),
                Introduction = reader.IsDBNull(reader.GetOrdinal("Introduction")) ? string.Empty : reader.GetString(reader.GetOrdinal("Introduction")),
                City = reader.IsDBNull(reader.GetOrdinal("City")) ? string.Empty : reader.GetString(reader.GetOrdinal("City")),
                Country = reader.IsDBNull(reader.GetOrdinal("Country")) ? string.Empty : reader.GetString(reader.GetOrdinal("Country")),
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
            catch(Exception ex)
            {
                Console.WriteLine(ex.Message);
                throw new Exception(ex.Message);
            }
            return user;
        }
        public void Update(AppUser user)
        {
            throw new NotImplementedException();
        }
    }
}
