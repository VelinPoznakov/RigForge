using Microsoft.EntityFrameworkCore;
using RigForge.Data;
using RigForge.GCommon.Exceptions;

namespace RigForge;

public class Program
{
    public static void Main(string[] args)
    {
        WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

        // Add services to the container.

        string? connectionString = builder
            .Configuration
            .GetConnectionString("Database")
            ?? throw new ConnectionStringNotFound("Database connection string not found");

        builder.Services.AddDbContext<AppDbContext>(options =>
            options.UseNpgsql(connectionString));

        builder.Services.AddControllers();

        builder.Services.AddOpenApi();

        WebApplication app = builder.Build();

        if (app.Environment.IsDevelopment())
        {
            app.MapOpenApi();
        }

        app.UseHttpsRedirection();

        app.UseAuthorization();

        app.MapControllers();

        app.Run();
    }
}