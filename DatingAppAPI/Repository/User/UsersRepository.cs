using Entities;
using Microsoft.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository.User
{
    public class UsersRepository : BaseRepository<AppUser>, IUsersRepository
    {
        private readonly SqlConnection _connection;

        public UsersRepository(SqlConnection connection)
        {
            _connection = connection;
        }

        public async Task<IEnumerable<AppUser>> GetUsers()
        {
            SqlConnection connection = this._connection;
            await EstablishConnection(connection);
            return await this.GetAll();
        }
    }
}
