using System;
using API.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class AppDbContext(DbContextOptions options) : DbContext(options)
{
    //this will be the table name: Users
    public DbSet<AppUser> Users { get; set; }
}
