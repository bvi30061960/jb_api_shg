using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using JbShapeGenerator.Data;
using JbShapeGenerator.Data;
using JbShapeGenerator.Areas.Identity.Data;

namespace JbShapeGenerator
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);
            var connectionString = builder.Configuration.GetConnectionString("JbShapeGeneratorContextConnection") ?? throw new InvalidOperationException("Connection string 'JbShapeGeneratorContextConnection' not found.");

            builder.Services.AddDbContext<JbShapeGeneratorContext>(options => options.UseSqlServer(connectionString));

            builder.Services.AddDefaultIdentity<JbShapeGeneratorUser>(options => options.SignIn.RequireConfirmedAccount = true).AddEntityFrameworkStores<JbShapeGeneratorContext>();

            //builder.Services.AddDbContext<JbShapeGeneratorContext>(options => options.UseSqlServer(connectionString));

            //builder.Services.AddDefaultIdentity<JbShapeGeneratorUser>(options => options.SignIn.RequireConfirmedAccount = true).AddEntityFrameworkStores<JbShapeGeneratorContext>();

            ////builder.Services.AddDbContext<JbShapeGeneratorContext>(options => options.UseSqlServer(connectionString));

            ////builder.Services.AddDefaultIdentity<JbShapeGeneratorUser>(options => options.SignIn.RequireConfirmedAccount = true).AddEntityFrameworkStores<JbShapeGeneratorContext>();


            builder.Services.AddSession();//27082022


            // Add services to the container.
            builder.Services.AddRazorPages();


            //builder.Services.AddScoped<ISession>();//02092024 


            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (!app.Environment.IsDevelopment())
            {
                app.UseExceptionHandler("/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            app.UseHttpsRedirection();
            app.UseStaticFiles();

            app.UseRouting();

            app.UseAuthorization();

            app.UseSession(); //22092024

            app.MapRazorPages();

            app.Run();
        }
    }
}
