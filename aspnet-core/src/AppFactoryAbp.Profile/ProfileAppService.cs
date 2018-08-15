﻿using Abp.Application.Services;
using Abp.Domain.Repositories;
using Abp.Runtime.Session;
using AppFactoryAbp.Authorization.Users;
using AppFactoryAbp.Profile.Dto;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace AppFactoryAbp.Profile
{
    public class ProfileAppService : AsyncCrudAppService<User, ProfileDto, long>
    {
        private readonly UserManager userManager;
        private readonly IRepository<User, long> userRepository;
        private readonly IPasswordHasher<User> passwordHasher;
        
        public ProfileAppService(IRepository<User, long> userRepository, UserManager userManager, IPasswordHasher<User> passwordHasher) : base(userRepository)
        {
            this.userManager = userManager;
            this.userRepository = userRepository;
            this.passwordHasher = passwordHasher;
        }

        public async Task<string> GetCurrentUserPassword()
        {
            var id = AbpSession.GetUserId();
            var user = await userRepository.GetAll()
                                           .Where(record => record.Id == id)
                                           .FirstOrDefaultAsync();

            return user.Password;
        }

        public async Task<ProfileDto> UpdateCurrentUser(ProfileDto input)
        {
            var user = await userManager.GetUserByIdAsync(input.Id);

            MapToEntity(input, user);

            return await Get(input);
        }

        public string HashPassword(int userId, string newPassword)
        {
            var user = userRepository.Get(userId);
            var hash = passwordHasher.HashPassword(user, newPassword);
            return hash;
        }

        public bool CheckPassword(int userId, string hashedPassword, string providedPassword)
        {
            var user = userRepository.Get(userId);

            var result = userManager
                .PasswordHasher
                .VerifyHashedPassword(user, hashedPassword, providedPassword);

            if (result == PasswordVerificationResult.Success)
            {
                return true;
            }
            else
            {
                return false;
            }
        }
}
}