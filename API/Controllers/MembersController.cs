using API.Data;
using API.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{

    public class MembersController(AppDbContext context) : BaseApiController
    {
        [HttpGet]
        //allows to return http responses as 200,400 etc..
        public async Task<ActionResult<IReadOnlyList<AppUser>>> GetMembers()
        {
            var members = await context.Users.ToListAsync();
            return members;
        }

        // [Anonimous] if want to not check is logged
        [Authorize]
        [HttpGet("{id}")]
        public async Task<ActionResult<AppUser>> GetMember(string id)
        {
            var member = await context.Users.FindAsync(id);
            if (member == null)
            {
                return NotFound();
            }
            return member;
        }
    }
}
