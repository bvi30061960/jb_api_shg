
using jb_api_shg.AppCode;

namespace jb_api_shg
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.

            builder.Services.AddControllers();

            // 01092024 {
            builder.Services.AddCors(); // добавляем сервисы CORS (возможность принимать
                                        // запросы с другого домена)
                                        // 01092024 }





            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();


            //18112024 { Разрешение использование сессии

            //////builder.Services.AddDistributedMemoryCache();

            //////builder.Services.AddSession(options =>
            //////{
            //////    options.IdleTimeout = TimeSpan.FromSeconds(10);
            //////    options.Cookie.HttpOnly = true;
            //////    options.Cookie.IsEssential = true;
            //////});

            //18112024 }




            builder.Services.AddSingleton <IProgressMonitor, ProgressMonitor> ();//20112024
            //builder.Services.AddTransient<IProgressMonitor, ProgressMonitor> ();//20112024
            //builder.Services.AddSingleton <ProgressMonitor> ();//20112024



            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            ///////////app.UseSession();//18112024  Разрешение использование сессии

            //29082024 {

            // настраиваем CORS

            app.UseCors(x => x
            .AllowAnyOrigin()
            .AllowAnyMethod()
            .AllowAnyHeader());


            ////// Configure the HTTP request pipeline.
            ////if (app.Environment.IsDevelopment())
            ////{
            ////    app.UseSwagger();
            ////    app.UseSwaggerUI();
            ////}


            //29082024 }


            app.UseHttpsRedirection();

            app.UseAuthorization();


            app.MapControllers();

            app.Run();
        }
    }
}
