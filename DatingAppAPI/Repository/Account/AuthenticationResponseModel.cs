﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository.Account
{

    public class AuthenticationResponseModel
    {
        [Required]
        public string UserName { get; set; }
        [Required]

        public string Token { get; set; }
    }
}