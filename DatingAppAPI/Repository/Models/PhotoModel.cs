﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entities
{
    public class PhotoModel
    {
        public Guid id { get; set; }
        public string Url { get; set; }
        public bool IsMain { get; set; }
    }
}
