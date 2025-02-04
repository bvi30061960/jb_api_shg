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
using System.Net.NetworkInformation;
using System.Text.Json;
using System.Text.Json.Serialization.Metadata;
using System.Web;

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


        public void OnPost()
        ///public async Task<IActionResult> OnPost()
        {
            //return StatusCode(200);
        }


        async public Task<IActionResult> OnPostSaveModelPartsZipFile([FromForm] IFormFile file)
        {

            return await HandleModel.SaveModelPartsZipFile( Request, PageContext,file);


        }


        //-----------------------------------------------------------------------------------------------------

        async public Task<IActionResult> OnPostSaveModel()
        {
            return await HandleModel.SaveModel(Request, PageContext);
        }
        //-----------------------------------------------------------------------------------------------------

        async public Task<IActionResult> OnPostSaveModelPart()
        {
            return await HandleModel.SaveModelPart(Request, PageContext);
        }


        //=========================================================================================
        //=========================================================================================


        public void OnGet()
        {

        }

        //-----------------------------------------------------------------------------------------------------
        public async Task<IActionResult> OnGetProgressStatus()
        {
            return new OkObjectResult(ProgressStatus.ProgressValue);
        }


        //-----------------------------------------------------------------------------------------------------
        public async Task<IActionResult> OnGetCheckFileExistOnServer()
        {

            string lv_result = "false";
            string? lv_filename = "";


            try
            {
                lv_filename = Request.Query["filename"];
                lv_filename = HttpUtility.HtmlEncode(lv_filename);// 01022025 очистка ввода


                if (lv_filename != null && lv_filename != "")
                {

                    HandlePathsAndNames.Create_names_and_directories(PageContext);


                    string lv_path_and_name_file = HandlePathsAndNames.Get_full_path_with_hashed_filename(lv_filename, FileExtensions.dat, true);
                    lv_result = await CommonMethods.CheckFileExist(lv_path_and_name_file);
                }

            }
            catch (Exception ex)
            {
                return new OkObjectResult("false");
            }

            return new OkObjectResult(lv_result);

        }



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

                //15012025 HandlePathsAndNames.Clear_names_and_paths();
                HandlePathsAndNames.Create_names_and_directories(PageContext);



                //if (lv_path_filename != null && lv_path_filename != "")
                //{
                //    lv_result = await HandleModel.ReadTextFile(lv_path_filename);
                //}


                string? lv_path_model = Request.Query["pathmodel"];

                bool lv_is_initial_load = false;
                //try
                //{
                lv_is_initial_load = bool.TryParse(Request.Query["initial_load"], out lv_is_initial_load);
                //}
                //catch (Exception ex)
                //{

                //}



                typ_united_model_data lo_united_model_data = await HandleModel.ReadUnitedModelData(lv_path_model, lv_is_initial_load);


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
        public async Task<IActionResult> OnGetReadModelPartsZipFile()
        //public async Task<byte[]> OnGetReadModelPartsZipFile()
        {


            byte[] lv_result = null;

            string? lv_path_filename = "";


            try
            {

                HandlePathsAndNames.Create_names_and_directories(PageContext);

                string? lv_filename = Request.Query["filename"];
                lv_filename = HttpUtility.HtmlEncode(lv_filename);// 01022025 очистка ввода


                bool lv_is_make_order = false;


                try
                {
                    string lv_is_make_order_str = Request.Query[CommonConstants.is_make_order];
                    lv_is_make_order = bool.Parse(lv_is_make_order_str);
                }
                catch (Exception ex)
                {
                    lv_is_make_order = false;
                }

                string? lv_path_and_name_zip_file = HandlePathsAndNames.Get_full_path_with_hashed_filename(lv_filename, FileExtensions.zip, true);

                //19012025 lv_path_filename = Path.Combine(HandlePathsAndNames.av_unic_user_models_dir, lv_filename_zip);

                //19012025 lv_result = await HandleModel.ReadBinaryFile(lv_path_filename);

                if (lv_is_make_order)
                {
                    lv_result = await HandleModel.MakeAndReadOrderZipFile(lv_path_and_name_zip_file, lv_filename);
                }
                else {
                    lv_result = await HandleModel.ReadBinaryFile(lv_path_and_name_zip_file);//19012025 
                }

            }
            catch (Exception ex)
            {
                //return null;
                return new OkObjectResult("");
            }

            //return new OkObjectResult(lv_result);

            return File(lv_result, "application/zip" /*, "example.zip"*/ );
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
