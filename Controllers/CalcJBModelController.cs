using Microsoft.AspNetCore.Mvc;

using sgCoreWrapper;
using System.Runtime.InteropServices;
//05102024 using TestExampleSgCore;



using Microsoft.AspNetCore.Mvc.RazorPages;
using System.Net;
using Newtonsoft.Json;
using Microsoft.Extensions.Caching.Memory;

using System.Text.Encodings.Web;
using System.Web;


using System.Text.Json;
using Microsoft.Net.Http.Headers;
using Microsoft.AspNetCore.Http;
using System.Text;
using System;
using Newtonsoft.Json.Serialization;

using jb_api_shg.AppCode;

namespace jb_api.Controllers
{
    [ApiController]
    [Route("[controller]")]

    public class CalcJBModelController : ControllerBase
    {

        private readonly ILogger<CalcJBModelController> _logger;

        public CalcJBModelController(ILogger<CalcJBModelController> logger)
        {
            _logger = logger;
        }

        //----------------------------------------------------------------------------------

        [HttpGet(Name = "GetCalcJBModel")]
        public IEnumerable<CalcModel> Get()
        {
            string lv_app_path = Environment.CurrentDirectory; //Request.HttpContext.base;

            //CalcModel.BuildModel();

            return null;
        }



        //----------------------------------------------------------------------------------
        [HttpPost(Name = "PostCalcJBModel")]

        async public Task<IResult> PostCalcJBModel()
        {
            //string lv_result = "";

            string lv_app_path = Environment.CurrentDirectory; //Request.HttpContext.base;

            typ_model_data lo_model_data = new typ_model_data();

            string lv_path_result_file = "";

            //var response = Response;
            //var request = Request;

            //if (request.Path == "/api/user")
            //{
            ////var message = "Некорректные данные";   // содержание сообщения по умолчанию


            try
            {


                // получаем данные json
                var lo_sides_data = await Request.ReadFromJsonAsync<typ_sides_data>();

                if (lo_sides_data == null) // если данные сконвертированы в Person
                {
                    return Results.StatusCode(300);
                }



                switch (Request.Query["method"])
                {
                    // верхняя сторона
                    case CommonConstants.method_refresh_premodel:
                        lv_path_result_file = CalcModel.RefreshModel(lo_sides_data);

                        return Results.File(lv_path_result_file); //13102024

                        break;

                    case CommonConstants.method_make_model:

                        typ_make_model_result_data lv_data_outfiles = CalcModel.MakeModel(lo_sides_data);


                        string lv_str_result_data = JsonConvert.SerializeObject(lv_data_outfiles);


                        return Results.Text(lv_str_result_data);//13102024

                        break;

                }



            }
            catch (Exception ex)
            {
                return Results.StatusCode(500); ;

            }

            return Results.File(lv_path_result_file); //, contentType);//, downloadName);

        }


        //=====================================================================================


    }
}