using Azure;
using Azure.Core;
using Humanizer;
using JbShapeGenerator.AppCode;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.DotNet.MSIdentity.Shared;
using Newtonsoft.Json;
using NuGet.Protocol.Plugins;
using System;

using System.IO;
using System.Text.Json;
using System.Text.Json.Serialization.Metadata;

namespace JbShapeGenerator.Pages
{

    [IgnoreAntiforgeryToken] //21092024

    public class IndexModel : PageModel
    {
        private readonly ILogger<IndexModel> _logger;

        public IndexModel(ILogger<IndexModel> logger)
        {
            _logger = logger;
        }


        ////private string? _tag_prefix;
        ////public string tag_prefix
        ////{
        ////    get { return _tag_prefix; }
        ////    set { _tag_prefix = value; }

        ////}


        public void OnGet()
        {

        }

        public void OnPost()
        ///public async Task<IActionResult> OnPost()
        {
            //return StatusCode(200);
        }
        //-----------------------------------------------------------------------------------------------------

        async public Task<IActionResult> OnPostSaveModel()
        {
            return await HandleModel.SaveModel(Request, PageContext);
        }

        //-----------------------------------------------------------------------------------------------------
        public async Task<IActionResult> OnGetReadScreenshot()
        {

            string lv_result = "";

            string? lv_path_filename = "";


            try
            {


                lv_path_filename = Request.Query["pathfilename"];
                if (lv_path_filename != null && lv_path_filename != "")
                {
                    ////lv_path_model_part = Path.Combine(Environment.CurrentDirectory,
                    ////                        Path.Combine(CommonConstants.path_AppData,
                    ////                            Path.Combine(CommonConstants.path_temp_data), lv_filename));


                    //return ActionResult<File>
                    //return   (lv_path_filename); //13102024

                    //await Response.SendFileAsync(lv_path_filename);

                    lv_result = await HandleModel.ReadTextFile(lv_path_filename);
                }

            }
            catch (Exception ex)
            {
                //return Results.Empty;
                return new OkObjectResult("");
            }

            return new OkObjectResult(lv_result);

        }
        //-----------------------------------------------------------------------------------------------------
        public async Task<IActionResult> OnGetReadModelFromServer()
        {


            string lv_result = "";

            string? lv_path_filename = "";


            try
            {

                //28102024 {

                HandlePathsAndNames.Clear_names_and_paths();
                HandlePathsAndNames.Create_names_and_directories(PageContext);



                //if (lv_path_filename != null && lv_path_filename != "")
                //{
                //    lv_result = await HandleModel.ReadTextFile(lv_path_filename);
                //}


                string? lv_path_model = Request.Query["pathmodel"];
                typ_united_model_data lo_united_model_data = await HandleModel.ReadUnitedModelData(lv_path_model);


                lv_result = JsonConvert.SerializeObject(lo_united_model_data);

                //28102024 }


            }
            catch (Exception ex)
            {
                //return Results.Empty;
                return new OkObjectResult("");
            }

            return new OkObjectResult(lv_result);
        }


        //-----------------------------------------------------------------------------------------------------
        public async Task<IActionResult> OnGetReadListModels()
        {

            string lv_res_str = "";
            try
            {

                HandlePathsAndNames.Create_names_and_directories(PageContext);


                jqGridSelectListModelFiles lo_grid_list_models = new jqGridSelectListModelFiles();

                JQGridResults lv_ob_result = await lo_grid_list_models.ProcessRequest(PageContext.HttpContext);

                lv_res_str = JsonConvert.SerializeObject(lv_ob_result);

            }
            catch (Exception ex)
            {
                //// Формирование аварийного статуса задачи -1
                //ProgressMonitor.SetStatus(-1);

                //// Занесение в журнал событий
                //ao_GlobalSessionData.ao_indexModel.LogMessage(ex);

            }

            return new OkObjectResult(lv_res_str);

        }



    }
}
