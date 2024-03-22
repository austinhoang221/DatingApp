using Entities;
using Repository.User;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace Repository.Models
{
    public static class Seed
    {
        public static async Task SeedUsers(IUsersRepository userRepository)
        {
            var userData = await System.IO.File.ReadAllTextAsync("C:\\DatingApp\\DatingAppAPI\\Repository\\Helpers\\UserSeedData.json");

            var users = JsonSerializer.Deserialize<List<AppUser>>(userData);

            await userRepository.GenerateSeedData(users);
        }
    }
}
