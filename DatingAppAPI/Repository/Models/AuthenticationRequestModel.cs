using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository.Models
{
    public class AuthenticationRequestModel
    {
        [Required]
        public string Email { get; set; }
        [Required]
        [StringLength(20, MinimumLength = 4)]
        public string Password { get; set; }
        public string? PhotoUrl { get; set; }

    }
}
