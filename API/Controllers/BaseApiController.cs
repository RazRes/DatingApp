using API.Helpers;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ServiceFilter(typeof(UserActivity))]
    [Route("api/[controller]")]
    [ApiController]
    public class BaseApiController : ControllerBase
    {
    }
}
