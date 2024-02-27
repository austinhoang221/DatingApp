using Helper.Extensions;
using Helper.Token;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.DependencyInjection;
using Repository.Account;
using Repository.User;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DatingAppAPI.Extensions
{
    public static class ApplicationExtensionService
    {
        public static IServiceCollection AddApplicationService(this IServiceCollection services, IConfiguration config)
        {
            services.AddTransient<SqlConnection>(x => new
SqlConnection(config.GetConnectionString("AdoNetData")));
            services.AddAutoMapper(typeof(AutoMapperProfiles).Assembly);
            services.AddScoped<IAccountRepository, AccountRepository>();
            services.AddScoped<IUsersRepository, UsersRepository>();
            services.AddScoped<ITokenService, TokenService>();
            return services;
        }
    }
}
