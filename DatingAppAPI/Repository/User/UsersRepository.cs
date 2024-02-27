using AutoMapper;
using Entities;
using Helper.Extensions;
using Microsoft.Data.SqlClient;
using Repository.Models;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository.User
{
    public class UsersRepository : BaseRepository<AppUser>, IUsersRepository
    {
        private readonly SqlConnection _connection;
        private readonly IMapper _mapper;

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

        public async Task<MemberModel> GetUserByUsername(string name)
        {
            SqlConnection connection = this._connection;
            await EstablishConnection(connection);
            string query = $"SELECT * FROM AppUser WHERE UserName = @UserName";

            using (SqlCommand command = new SqlCommand(query, connection, _transaction))
            {
                command.Parameters.AddWithValue("@UserName", name);
                var user = new AppUser();
                using (SqlDataReader reader = command.ExecuteReader())
                {
                    if (reader.Read())
                    {
                        while (reader.Read())
                        {
                            foreach (var prop in typeof(AppUser).GetProperties())
                            {
                                if (!reader.IsDBNull(reader.GetOrdinal(prop.Name)))
                                {
                                    prop.SetValue(user, reader[prop.Name]);
                                }
                            }
                        }
                    }
                    else
                    {
                        throw new NonExistException($"User with name ${name}");
                    }
                }
                var result = _mapper.Map<MemberModel>(user);
                return result;
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
                string query = $"SELECT AU.Id, P.Id AS PhotoId, UserName, DateOfBirth, KnownAs, Created, " +
                    $"LastActive, Gender, Introduction, LookingFor, " +
                    $"Interests, City, Country, Url, IsMain, PublicId " +
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
                                    user = new MemberModel()
                                    {
                                        Id = reader.GetGuid(reader.GetOrdinal("Id")),
                                        UserName = reader.IsDBNull(reader.GetOrdinal("UserName")) ? string.Empty : reader.GetString(reader.GetOrdinal("UserName")),
                                        Age = reader.IsDBNull(reader.GetOrdinal("DateOfBirth")) ? 0 : DateTimeExtension.CalculateAge(reader.GetDateTime(reader.GetOrdinal("DateOfBirth"))),
                                        Created = reader.IsDBNull(reader.GetOrdinal("Created")) ? DateTime.MinValue : reader.GetDateTime(reader.GetOrdinal("Created")),
                                        LastActive = reader.IsDBNull(reader.GetOrdinal("LastActive")) ? DateTime.MinValue : reader.GetDateTime(reader.GetOrdinal("LastActive")),
                                        KnownAs = reader.IsDBNull(reader.GetOrdinal("KnownAs")) ? string.Empty : reader.GetString(reader.GetOrdinal("KnownAs")),
                                        Gender = reader.IsDBNull(reader.GetOrdinal("Gender")) ? string.Empty : reader.GetString(reader.GetOrdinal("Gender")),
                                        Introduction = reader.IsDBNull(reader.GetOrdinal("Introduction")) ? string.Empty : reader.GetString(reader.GetOrdinal("Introduction")),
                                        LookingFor = reader.IsDBNull(reader.GetOrdinal("LookingFor")) ? string.Empty : reader.GetString(reader.GetOrdinal("LookingFor")),
                                        Interests = reader.IsDBNull(reader.GetOrdinal("Interests")) ? string.Empty : reader.GetString(reader.GetOrdinal("Interests")),
                                        City = reader.IsDBNull(reader.GetOrdinal("City")) ? string.Empty : reader.GetString(reader.GetOrdinal("City")),
                                        Photos = new List<Photo>()
                                    };
                                    bool isMain = reader.GetBoolean(reader.GetOrdinal("IsMain"));
                                    if (isMain)
                                    {
                                        user.PhotoUrl = reader.GetString(reader.GetOrdinal("Url"));
                                    }
                                    userDictionary.Add(userId, user);
                                    users.Add(user);
                                }
                                Guid photoId = reader.GetGuid(reader.GetOrdinal("PhotoId"));
                             
                                    user.Photos.Add(new Photo()
                                    {
                                        Id = reader.GetGuid(reader.GetOrdinal("PhotoId")),
                                        Url = reader.GetString(reader.GetOrdinal("Url")),
                                        IsMain = reader.GetBoolean(reader.GetOrdinal("IsMain")),
                                        PublicId = reader.IsDBNull(reader.GetOrdinal("PublicId")) ? string.Empty : reader.GetString(reader.GetOrdinal("PublicId")),
                                    });
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

        public void Update(AppUser user)
        {
            throw new NotImplementedException();
        }
    }
}
