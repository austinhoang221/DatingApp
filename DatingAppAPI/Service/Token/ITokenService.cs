﻿using Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Helper.Token
{
    public interface ITokenService
    {
        string CreateToken(string Email);
    }
}
