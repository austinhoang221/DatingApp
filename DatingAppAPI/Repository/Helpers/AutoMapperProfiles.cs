using AutoMapper;
using Entities;
using Repository.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Helper.Extensions
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles() {
            CreateMap<AppUser, MemberModel>();
            CreateMap<Photo, PhotoModel>();
        }
    }
}
