using Microsoft.Data.SqlClient;
using Models.Helpers;
using System;
using System.Collections.Generic;
using System.Data.Common;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using System.Transactions;

namespace Repository
{
    public class BaseRepository<T>
    {
        protected SqlConnection _connection { get; set; }
        public SqlTransaction _transaction { get; set; }

        protected async Task EstablishConnection(SqlConnection connection)
        {
            _connection = connection;
            try
            {
                if (connection.State == System.Data.ConnectionState.Open) return;
                else await _connection.OpenAsync();
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<IEnumerable<T>> GetAll()
        {
            List<T> entities = new List<T>();
            SqlConnection connection = _connection;
            try
            {
                await EstablishConnection(connection);
                string query = $"SELECT * FROM [{typeof(T).Name}]";
                using (SqlCommand command = new SqlCommand(query, connection, _transaction))
                {
                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        if (reader.HasRows)
                        {
                            while (reader.Read())
                            {
                                T entity = Activator.CreateInstance<T>();
                                foreach (var prop in typeof(T).GetProperties())
                                {
                                    if (!reader.IsDBNull(reader.GetOrdinal(prop.Name)))
                                    {
                                        prop.SetValue(entity, reader[prop.Name]);
                                    }
                                }
                                entities.Add(entity);
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
            return entities;
        }

        public async Task<T> Insert(T entity)
        {
            SqlConnection connection = _connection;
            await EstablishConnection(connection);

            try
            {
                string tableName = GetTableName();
                string columns = string.Join(",", typeof(T).GetProperties().Select(p => p.Name));
                string parameters = string.Join(",", typeof(T).GetProperties().Select(p => $"@{p.Name}"));
                string query = $"INSERT INTO [{tableName}] ({columns}) VALUES ({parameters})";

                using (SqlCommand command = new SqlCommand(query, connection, _transaction))
                {
                    foreach (var prop in typeof(T).GetProperties())
                    {
                        command.Parameters.AddWithValue($"@{prop.Name}", prop.GetValue(entity));
                    }
                    await command.ExecuteNonQueryAsync();
                }
                return entity;
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
        }

        private string GetTableName()
        {
            Type entityType = typeof(T);
            var tableNameAttribute = entityType.GetCustomAttribute<TableNameAttribute>();

            if (tableNameAttribute != null)
            {
                return tableNameAttribute.TableName;
            }

            // If the attribute is not present, use the type name as a fallback
            return entityType.Name;
        }
    }
}
