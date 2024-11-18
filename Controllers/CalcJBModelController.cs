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
using Windows.Foundation;


using System.Threading;

namespace jb_api.Controllers
{



    ////public struct gs_data_for_long_task_read_and_translate
    ////{
    ////    public string TaskID;

    ////    public FileStream source_fs;
    ////    public string file_name;
    ////    public string path_user_directory;
    ////    public string file_source_name;
    ////    public string descript_file_source;
    ////    //public System.Web.Caching.Cache Cache;
    ////    public HttpContext Current;
    ////    public bool IsFromClipboardContent;
    ////    public string path_user_file_temp;
    ////    ///public HttpSessionState CurrentSession;
    ////    public ISession CurrentSession;

    ////    public int divider; // Делитель для индикации процесса (количество исполняемых шагов)
    ////    public bool Is_shared_file; //10032023
    ////    public string text_theme; //07042023

    ////}










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

        ////[HttpGet(Name = "GetProgressValue")]
        //////public IEnumerable<CalcModel> Get()
        ////async public Task<IResult> Get()
        ////{
        ////}
        //----------------------------------------------------------------------------------

        [HttpGet(Name = "GetCalcJBModel")]
        //public IEnumerable<CalcModel> Get()
        async public Task<IResult> Get()
        {


            string lv_path_model_part = "";
            string lv_filename = "";

            switch (Request.Query["method"])
            {
                case CommonConstants.method_read_progress_value:

                    //return await new OkObjectResult(ProgressStatus.ProgressValue.ToString());
                    //return await new IResult(ProgressStatus.ProgressValue.ToString());


                    string lv_taskid_str = Request.Query["taskid"];

                    ProgressMonitor lo_progress_monitor = new ProgressMonitor(Request.HttpContext.Session, lv_taskid_str);


                    return Results.Text(lo_progress_monitor.GetStatus() );

                    break;
                case CommonConstants.method_read_model_parts:


                    lv_filename = Request.Query["filename"];

                    lv_path_model_part = Path.Combine(Environment.CurrentDirectory,
                                            Path.Combine(CommonConstants.path_AppData,
                                                Path.Combine(CommonConstants.path_temp_data), lv_filename));

                    return Results.File(lv_path_model_part); //13102024

                    break;



                case CommonConstants.method_delete_model_parts:

                    string lv_prefix_file = Request.Query["filename"];

                    lv_path_model_part = Path.Combine(Environment.CurrentDirectory,
                                            Path.Combine(CommonConstants.path_AppData, CommonConstants.path_temp_data));


                    HandlePathsAndNames.Delete_files_by_dir_and_mask(lv_path_model_part, lv_prefix_file + "_*.stl");

                    return Results.Empty;

                    break;

            }


            //return Results.File(lv_path_model_part); //13102024
            return Results.Empty;

        }



        //----------------------------------------------------------------------------------
        [HttpPost(Name = "PostCalcJBModel")]

        async public Task<IResult> PostCalcJBModel()
        {
            //return Results.StatusCode(500);


            string lv_app_path = Environment.CurrentDirectory; //Request.HttpContext.base;

            typ_model_data lo_model_data = new typ_model_data();

            string lv_path_result_file = "";


            try
            {

                // получаем данные json
                var lo_sides_data = await Request.ReadFromJsonAsync<typ_sides_data>();

                if (lo_sides_data == null)
                {
                    return Results.StatusCode(300);
                }



                switch (Request.Query["method"])
                {
                    //case CommonConstants.method_refresh_premodel:
                    case CommonConstants.method_start_refresh_premodel:

                        // Создание процесса с длинной задачей

                        
                        typ_parameters_for_refresh parameters_for_refresh = new typ_parameters_for_refresh();

                        parameters_for_refresh.session = Request.HttpContext.Session;
                        parameters_for_refresh.sides_data = lo_sides_data;

                        object[] parameters = new object[] { parameters_for_refresh };
                        ParameterizedThreadStart pts = null;
                        Thread thr = null;

                        CalcModel lo_calcmodel = new CalcModel();
                        pts = new ParameterizedThreadStart(lo_calcmodel.RefreshModel); //10092022
                        thr = new Thread(pts);
                        thr.Priority = ThreadPriority.BelowNormal;
                        thr.Start(parameters);

                        return Results.Text(CommonConstants.word_taskId + "=" + lo_sides_data.taskId.ToString());
                        break;


                        ////// предварительный вид модели с разрезающими поверхностями
                        ////lv_path_result_file = CalcModel.RefreshModel(Request.HttpContext.Session, lo_sides_data);
                        ////return Results.File(lv_path_result_file); //13102024
                        ////break;


                    case CommonConstants.method_make_model:
                        // разрезание исходного тела на детали модели

                        typ_make_model_result_data lv_data_outfiles = CalcModel.MakeModel(lo_sides_data);


                        string lv_str_result_data = JsonConvert.SerializeObject(lv_data_outfiles);


                        return Results.Text(lv_str_result_data);

                        break;

                }



            }
            catch (Exception ex)
            {
                return Results.StatusCode(500);

            }

            return Results.File(lv_path_result_file); //, contentType);//, downloadName);

        }


        //=====================================================================================


    }
}