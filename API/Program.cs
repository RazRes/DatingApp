using API.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddDbContext<AppDbContext>(opt =>
{
   opt.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")); 
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("DevCorsPolicy", builder =>
    {
        builder
            .AllowAnyHeader()
            .AllowAnyMethod()
            // Allow localhost on any port and both http/https
            .SetIsOriginAllowed(origin => new Uri(origin).Host == "localhost");
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseCors("DevCorsPolicy");
app.MapControllers();

app.Run();
