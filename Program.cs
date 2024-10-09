
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

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }



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
