﻿using Entities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository.Models
{

    public class AuthenticationResponseModel : MemberModel
    {
        public string Token { get; set; }
    }
}
