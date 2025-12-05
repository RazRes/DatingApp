using System;
using API.DTOs;
using API.Entities;
using API.Interfaces;

namespace API.Extensions;
//needs static so i don't need the constructor
public static class AppUserExtensions
{

    public static UserDto ToDto(this AppUser user , ITokenService tokenService)
    {
         return new UserDto
        {
            Id = user.Id,
            DisplayName = user.DisplayName,
            Email = user.Email,
            Token = tokenService.CreateToken(user)
        };
    }

}
