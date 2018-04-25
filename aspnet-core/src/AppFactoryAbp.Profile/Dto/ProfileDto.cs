using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using AppFactoryAbp.Authorization.Users;
using System;
using System.Collections.Generic;
using System.Text;

namespace AppFactoryAbp.Profile.Dto
{
    [AutoMap(typeof(User))]
    public class ProfileDto : EntityDto<long>
    {
        public string UserName { get; set; }
        public string Name { get; set; }
        public string Surname { get; set; }
        public string EmailAddress { get; set; }
        public string Password { get; set; }
    }
}
